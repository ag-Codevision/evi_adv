import { NextRequest, NextResponse } from 'next/server';
import { getBlogAiConfig, runBlogAiCycle } from '@/lib/blog-ai-actions';
import { getDirectSupabase } from '@/lib/supabase/direct';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Suporte a processamento resiliente de IA

const DIAS_SEMANA = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

/**
 * Endpoint de Cron Job para execução autônoma do Robô Editorial de IA.
 * Acionado periodicamente a cada 30 minutos pelo GitHub Actions (ou Vercel Cron).
 */
export async function GET(req: NextRequest) {
  return handleCronExecution(req);
}

export async function POST(req: NextRequest) {
  return handleCronExecution(req);
}

async function handleCronExecution(req: NextRequest) {
  const startTime = Date.now();
  const url = new URL(req.url);
  const isForce = url.searchParams.get('force') === 'true';
  const queryKey = url.searchParams.get('key');
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  // 1. Verificação de Segurança (Token de Autorização)
  if (cronSecret) {
    const isAuthorized =
      authHeader === `Bearer ${cronSecret}` ||
      queryKey === cronSecret;

    if (!isAuthorized) {
      console.warn('[Cron Auto-Blog] Tentativa não autorizada de disparo.');
      return NextResponse.json(
        {
          error: 'Acesso não autorizado. Chave de autenticação inválida ou ausente.',
        },
        { status: 401 }
      );
    }
  }

  try {
    const config = await getBlogAiConfig();

    // 2. Se não for disparo forçado, validar ativação e calendário de Brasília (UTC-3)
    if (!isForce) {
      if (!config.enabled) {
        return NextResponse.json({
          status: 'skipped',
          message: 'Automação editorial de IA está desativada no painel administrativo.',
        });
      }

      // Extração rigorosa de data e hora no fuso horário oficial de Brasília (America/Sao_Paulo)
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Sao_Paulo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

      const parts = formatter.formatToParts(now);
      const partMap: Record<string, string> = {};
      for (const p of parts) {
        partMap[p.type] = p.value;
      }

      const currentYear = partMap.year;
      const currentMonth = partMap.month;
      const currentDay = partMap.day;
      const currentHour = parseInt(partMap.hour, 10);
      const currentMinute = parseInt(partMap.minute, 10);
      const todayDateBrasilia = `${currentYear}-${currentMonth}-${currentDay}`;

      // Início e Fim do dia civil em Brasília (00:00:00 a 23:59:59.999 BRT) convertidos para UTC
      const startOfDayBrasiliaUTC = new Date(`${todayDateBrasilia}T00:00:00-03:00`).toISOString();
      const endOfDayBrasiliaUTC = new Date(`${todayDateBrasilia}T23:59:59.999-03:00`).toISOString();

      // Dia da semana de Brasília (0 = Domingo, 1 = Segunda, ..., 6 = Sábado)
      const currentDayOfWeek = new Date(`${todayDateBrasilia}T12:00:00-03:00`).getDay();

      // Checa se hoje é um dia da semana configurado para publicação
      if (!config.daysOfWeek.includes(currentDayOfWeek)) {
        return NextResponse.json({
          status: 'skipped',
          reason: `Hoje (${DIAS_SEMANA[currentDayOfWeek]}) não é um dia configurado para publicação.`,
          currentDay: DIAS_SEMANA[currentDayOfWeek],
          configuredDays: config.daysOfWeek.map((d) => DIAS_SEMANA[d]),
          brasiliaTime: `${todayDateBrasilia} ${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`,
        });
      }

      // Checa se o horário agendado já foi alcançado
      // Se ainda não atingiu o horário agendado de hoje (ex: agendado para 17h e ainda são 16h30):
      if (currentHour < config.publishHour) {
        return NextResponse.json({
          status: 'skipped',
          reason: `Ainda não atingiu o horário agendado de publicação (${config.publishHour}:00). Horário atual em Brasília: ${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}.`,
          publishHour: config.publishHour,
          currentHour,
          currentMinute,
        });
      }

      // Checagem de Reconciliação no Banco de Dados:
      // Se o horário agendado já atingiu ou já passou (ex: agendado para 17:00 e o robô acordou às 17:30, 18:00 ou mais tarde),
      // consultamos quantos artigos já foram publicados HOJE na tabela 'posts' do Supabase.
      const directSupabase = getDirectSupabase(true);
      const { data: postsToday, error: queryError } = await directSupabase
        .from('posts')
        .select('id, title, published_at')
        .gte('published_at', startOfDayBrasiliaUTC)
        .lte('published_at', endOfDayBrasiliaUTC)
        .order('published_at', { ascending: false });

      if (queryError) {
        console.error('[Cron Auto-Blog] Erro ao consultar posts do dia:', queryError);
      }

      const targetCount = config.articlesPerCycle || 1;
      const countToday = postsToday ? postsToday.length : 0;

      // Se a quantidade de posts hoje já atingiu ou superou a meta diária:
      if (countToday >= targetCount) {
        return NextResponse.json({
          status: 'already_run_today',
          message: `A cota diária de hoje (${todayDateBrasilia}) já foi cumprida com ${countToday} artigo(s) publicado(s). Meta do agendamento: ${targetCount} artigo(s).`,
          lastArticle: postsToday ? postsToday[0] : null,
          totalToday: countToday,
          targetCount,
          brasiliaTime: `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`,
        });
      }

      // Se o horário agendado já passou e a quantidade de posts hoje é MENOR que a meta:
      console.log(`[Cron Auto-Blog] Horário agendado (${config.publishHour}:00) atingido/passado. Posts existentes hoje: ${countToday}/${targetCount}. Disparando criação autônoma de artigo pendente...`);
    }

    console.log(`[Cron Auto-Blog] Disparando ciclo editorial com IA (force=${isForce})...`);

    // 3. Execução do ciclo de geração do artigo
    const result = await runBlogAiCycle({ isCron: true });

    if (!result.success) {
      console.error('[Cron Auto-Blog] Falha na geração do artigo:', result.error);
      return NextResponse.json(
        {
          status: 'error',
          message: result.error || 'Erro na geração de conteúdo com IA.',
        },
        { status: 500 }
      );
    }

    const durationSeconds = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`[Cron Auto-Blog] Artigo "${result.article?.title}" publicado com sucesso em ${durationSeconds}s.`);

    return NextResponse.json({
      status: 'published',
      message: 'Artigo jurídico gerado e publicado com sucesso pelo Robô Editorial.',
      duration: `${durationSeconds}s`,
      modelUsed: result.modelUsed,
      article: {
        id: result.article?.id,
        title: result.article?.title,
        slug: result.article?.slug,
        published_at: result.article?.published_at,
      },
    });
  } catch (err: any) {
    console.error('[Cron Auto-Blog] Exceção crítica durante a execução do cron:', err);
    return NextResponse.json(
      {
        status: 'error',
        error: err.message || 'Erro inesperado no servidor durante a execução do cron.',
      },
      { status: 500 }
    );
  }
}
