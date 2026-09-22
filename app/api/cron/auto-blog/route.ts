import { NextRequest, NextResponse } from 'next/server';
import { getBlogAiConfig, runBlogAiCycle } from '@/lib/blog-ai-actions';
import { getDirectSupabase } from '@/lib/supabase/direct';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Suporte a processamento resiliente de IA

const DIAS_SEMANA = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

/**
 * Endpoint de Cron Job para execução autônoma do Robô Editorial de IA.
 * Acionado periodicamente pela Vercel Cron ou GitHub Actions.
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

      // Cálculo no fuso horário oficial de Brasília
      const now = new Date();
      const brasiliaDateStr = now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' });
      const brasiliaDate = new Date(brasiliaDateStr);
      const currentDayOfWeek = brasiliaDate.getDay(); // 0 a 6
      const currentHour = brasiliaDate.getHours(); // 0 a 23
      const todayDateBrasilia = brasiliaDate.toISOString().slice(0, 10);

      // Checa dia da semana configurado
      if (!config.daysOfWeek.includes(currentDayOfWeek)) {
        return NextResponse.json({
          status: 'skipped',
          reason: `Hoje (${DIAS_SEMANA[currentDayOfWeek]}) não é um dia configurado para publicação.`,
          currentDay: DIAS_SEMANA[currentDayOfWeek],
          configuredDays: config.daysOfWeek.map((d) => DIAS_SEMANA[d]),
        });
      }

      // Checa horário configurado (ex: 18h)
      if (currentHour < config.publishHour) {
        return NextResponse.json({
          status: 'skipped',
          reason: `Ainda não atingiu o horário agendado de publicação (${config.publishHour}:00). Horário atual em Brasília: ${currentHour}:00.`,
          publishHour: config.publishHour,
          currentHour,
        });
      }

      // Checa se já houve publicação bem-sucedida hoje no banco de dados
      const directSupabase = getDirectSupabase(true);
      const { data: postsToday } = await directSupabase
        .from('posts')
        .select('id, title, published_at')
        .gte('published_at', `${todayDateBrasilia}T00:00:00.000Z`)
        .order('published_at', { ascending: false });

      const targetCount = config.articlesPerCycle || 1;
      if (postsToday && postsToday.length >= targetCount) {
        return NextResponse.json({
          status: 'already_run_today',
          message: `O assistente de IA já possui ${postsToday.length} artigo(s) publicado(s) para o dia de hoje (${todayDateBrasilia}).`,
          lastArticle: postsToday[0],
        });
      }
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
      message: 'Artigo jurídico gerado e publicado com sucesso pelo Cron Job.',
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
