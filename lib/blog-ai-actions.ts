'use server';

import { createClient } from './supabase/server';
import { revalidatePath } from 'next/cache';
import { fetchTopicImages } from './image-provider.mjs';

export interface BlogAiConfig {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'custom';
  daysOfWeek: number[]; // 0 = Domingo, 1 = Segunda, 2 = Terça, 3 = Quarta, 4 = Quinta, 5 = Sexta, 6 = Sábado
  publishHour: number; // 0 a 23 (horário de Brasília)
  articlesPerCycle: number;
  categories: Array<{ slug: string; name: string; targetAudience?: string; keywords?: string[] }>;
  customThemes: string[];
  lastRun?: string;
  nextRun?: string;
}

const DEFAULT_AI_CONFIG: BlogAiConfig = {
  enabled: true,
  frequency: 'weekly',
  daysOfWeek: [1, 4], // Segundas e Quintas
  publishHour: 19, // 19h
  articlesPerCycle: 1,
  categories: [
    {
      slug: 'recuperacao-judicial',
      name: 'Recuperação Judicial & Falências',
      targetAudience: 'Diretores financeiros, controllers e empresários em momento de reestruturação',
      keywords: ['recuperação judicial', 'trava bancária', 'DIP financing', 'créditos extraconcursais', 'reestruturação de dívidas'],
    },
    {
      slug: 'agronegocio',
      name: 'Agronegócio & Crédito Rural',
      targetAudience: 'Produtores rurais, cooperativas agrícolas e tradings do agro',
      keywords: ['crédito rural', 'alongamento de dívida', 'CPR financeira', 'recuperação judicial agro', 'frustração de safra'],
    },
    {
      slug: 'societario',
      name: 'Direito Societário & Contratos',
      targetAudience: 'Sócios, acionistas e empresas familiares em sucessão e governança',
      keywords: ['acordo de sócios', 'dissolução parcial', 'apuração de haveres', 'governança corporativa', 'holding familiar'],
    },
    {
      slug: 'tributario',
      name: 'Direito Tributário & Planejamento Fiscal',
      targetAudience: 'CFOs, departamentos fiscais e diretores de planejamento estratégico',
      keywords: ['reforma tributária', 'recuperação de créditos fiscais', 'teses tributárias', 'planejamento fiscal'],
    },
    {
      slug: 'direito-medico',
      name: 'Direito Médico & Hospitalar',
      targetAudience: 'Médicos, clínicas de especialidades e gestores hospitalares',
      keywords: ['defesa médica', 'responsabilidade civil médica', 'compliance hospitalar', 'termo de consentimento'],
    },
  ],
  customThemes: [
    'Impactos da transição da Reforma Tributária na margem de lucro das empresas do comércio e serviços',
    'Como evitar a penhora de faturamento em execuções fiscais agressivas',
    'Segurança jurídica e validade da assinatura digital em títulos executivos extrajudiciais e contratos rurais',
    'A essencialidade dos bens de capital na recuperação judicial: jurisprudência dominante do STJ',
  ],
};

/**
 * Obtém as configurações atuais do Assistente de IA do Blog.
 */
export async function getBlogAiConfig(): Promise<BlogAiConfig> {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from('site_contents')
      .select('content_value')
      .eq('page', 'blog_ai_config')
      .eq('section', 'engine')
      .eq('field_key', 'settings')
      .single();

    if (data && data.content_value) {
      return { ...DEFAULT_AI_CONFIG, ...JSON.parse(data.content_value) };
    }
  } catch (err) {
    console.error('Erro ao buscar configuração de IA:', err);
  }
  return DEFAULT_AI_CONFIG;
}

/**
 * Salva as configurações do Assistente de IA do Blog no banco de dados.
 */
export async function saveBlogAiConfig(config: BlogAiConfig): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Acesso negado. Apenas administradores autenticados podem alterar as configurações.' };
    }

    const { error: upsertError } = await supabase
      .from('site_contents')
      .upsert(
        {
          page: 'blog_ai_config',
          section: 'engine',
          field_key: 'settings',
          content_type: 'list',
          content_value: JSON.stringify(config),
          metadata: {
            enabled: config.enabled,
            daysOfWeek: config.daysOfWeek,
            publishHour: config.publishHour,
            updated_by: user.email,
          },
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'page,section,field_key' }
      );

    if (upsertError) {
      return { success: false, error: upsertError.message };
    }

    revalidatePath('/blog');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Erro inesperado ao salvar configurações de IA.' };
  }
}

/**
 * Parser resiliente para JSONs gerados por modelos de inteligência artificial
 */
function parseJsonFromAi(raw: string): any {
  if (!raw) throw new Error('Conteúdo vazio retornado pela IA');

  let cleaned = raw.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '');
  }

  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error('Nenhum objeto JSON delimitado por { } foi encontrado na resposta da IA.');
  }

  const jsonStr = match[0];

  // Tentativa 1: Parse direto padrão
  try {
    return JSON.parse(jsonStr);
  } catch (e1) {
    // Tentativa 2: Sanitização de quebras de linha e caracteres de controle literais dentro de strings
    try {
      const sanitized = jsonStr.replace(/"((?:[^"\\]|\\.)*)"/gs, (_, strContent) => {
        const fixed = strContent
          .replace(/\r\n/g, '\\n')
          .replace(/\n/g, '\\n')
          .replace(/\r/g, '\\n')
          .replace(/\t/g, '\\t');
        return `"${fixed}"`;
      });
      return JSON.parse(sanitized);
    } catch (e2) {
      // Tentativa 3: Extração individual de campos por Regex caso o JSON esteja truncado
      const getField = (field: string) => {
        const fieldRegex = new RegExp(`"${field}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"`, 's');
        const m = jsonStr.match(fieldRegex);
        if (m) {
          return m[1]
            .replace(/\\n/g, '\n')
            .replace(/\\"/g, '"')
            .replace(/\\\\/g, '\\');
        }
        const looseRegex = new RegExp(`"${field}"\\s*:\\s*"([\\s\\S]*?)(?="\\s*,\\s*"|"[\\s\\S]*?\\}\\s*$)`, 's');
        const m2 = jsonStr.match(looseRegex);
        return m2 ? m2[1] : '';
      };

      const title = getField('title');
      const slug = getField('slug');
      const excerpt = getField('excerpt');
      const content = getField('content');
      const reading_time = parseInt((jsonStr.match(/"reading_time"\s*:\s*(\d+)/) || [])[1] || '6', 10);
      const seo_title = getField('seo_title');
      const seo_description = getField('seo_description');

      if (title && content) {
        return {
          title,
          slug:
            slug ||
            title
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/[^\w\s-]/g, '')
              .trim()
              .replace(/\s+/g, '-'),
          excerpt: excerpt || title,
          content,
          reading_time,
          seo_title: seo_title || title.slice(0, 60),
          seo_description: seo_description || excerpt?.slice(0, 155) || title.slice(0, 155),
        };
      }
      throw e2;
    }
  }
}

/**
 * Dispara manualmente a criação e publicação imediata de um artigo com o assistente de IA.
 */
export async function generateArticleNow(targetCategorySlug?: string, customThemePrompt?: string): Promise<{
  success: boolean;
  error?: string;
  article?: any;
  modelUsed?: string;
}> {
  try {
    const supabase = createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Acesso negado. Apenas administradores autenticados podem gerar artigos.' };
    }

    const config = await getBlogAiConfig();
    const nvidiaKey = process.env.NVIDIA_API_KEY;

    if (!nvidiaKey) {
      return { success: false, error: 'NVIDIA_API_KEY não configurada no servidor.' };
    }

    // 1. Define categoria e tema
    const selectedCategory =
      config.categories.find((c) => c.slug === targetCategorySlug) ||
      config.categories[Math.floor(Math.random() * config.categories.length)] ||
      DEFAULT_AI_CONFIG.categories[0];

    const chosenTheme =
      customThemePrompt?.trim() ||
      (config.customThemes.length > 0
        ? config.customThemes[Math.floor(Math.random() * config.customThemes.length)]
        : `Teses jurídicas e soluções estratégicas em ${selectedCategory.name}`);

    // 2. Prompt com a Persona do Dr. Eduardo Veríssimo Inocente
    const systemPrompt = `Você é o Dr. Eduardo Veríssimo Inocente, advogado sócio-fundador da EVI Sociedade de Advogados (OAB/SP 200.334), com mais de 25 anos de atuação de vanguarda no Direito Empresarial brasileiro, referência nacional em Recuperação Judicial, Agronegócio e Contencioso Estratégico.

Sua missão é redigir um artigo jurídico aprofundado, moderno, pragmático e fundamentado na legislação e jurisprudência (especialmente STJ e Tribunais Estaduais).

DIRETRIZES:
1. Jamais use clichês ou introduções genéricas ("Nos dias de hoje...", "É de suma importância...").
2. Escreva em Português do Brasil de forma elegante e técnica.
3. Estruture em HTML semântico com subtítulos <h2>, parágrafos <p>, listas <ul>/<li> e citações/destaques <blockquote>. Não inclua <html> ou <body>.
4. Foque em soluções preventivas e estratégias para empresários, produtores rurais, CFOs e acionistas.
5. Conclua sempre ressaltando o valor da análise jurídica individualizada com a banca de advogados.`;

    const userPrompt = `Crie um artigo completo com base na seguinte diretriz:
Tema/Pauta: "${chosenTheme}"
Área/Eixo: "${selectedCategory.name}"
Público-alvo: "${selectedCategory.targetAudience || 'Empresários e Diretores'}"
Palavras-chave: ${(selectedCategory.keywords || []).join(', ')}

Retorne a resposta EXCLUSIVAMENTE em formato JSON puro, sem blocos markdown:
{
  "title": "Título expressivo, elegante e com apelo técnico para decisores",
  "slug": "slug-url-amigavel-sem-acentos-nem-caracteres-especiais",
  "excerpt": "Resumo executivo em 2 a 3 frases técnicas e persuasivas",
  "content": "Conteúdo HTML do artigo com subtítulos h2 e parágrafos estruturados",
  "reading_time": 6,
  "seo_title": "Título SEO até 60 caracteres",
  "seo_description": "Meta description persuasiva até 155 caracteres"
}`;

    // Fila inteligente de modelos com fallback automático
    const configuredModel = process.env.NVIDIA_MODEL || 'meta/llama-3.2-11b-vision-instruct';
    const modelCandidates = [
      configuredModel,
      'meta/llama-3.2-11b-vision-instruct',
      'google/diffusiongemma-26b-a4b-it',
      'meta/llama-3.2-90b-vision-instruct',
    ].filter(Boolean);

    const uniqueModels = [...new Set(modelCandidates)];
    let generated: any = null;
    let successfulModel = '';
    const failureLog: string[] = [];

    console.log(`[Blog IA] Iniciando geração. Fila de modelos: ${uniqueModels.join(' -> ')}`);

    for (let i = 0; i < uniqueModels.length; i++) {
      const currentModel = uniqueModels[i];
      const modelStartTime = Date.now();
      console.log(`[Blog IA] [${i + 1}/${uniqueModels.length}] Tentando modelo: ${currentModel}...`);

      const controller = new AbortController();
      // Timeout de 40s por modelo para não deixar travar
      const timeoutId = setTimeout(() => controller.abort(), 40000);

      try {
        const res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${nvidiaKey}`,
          },
          body: JSON.stringify({
            model: currentModel,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            temperature: 0.35,
            max_tokens: 3500,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          const errText = await res.text().catch(() => '');
          throw new Error(`HTTP ${res.status}: ${errText.slice(0, 150)}`);
        }

        const aiData = await res.json();
        const rawContent = aiData.choices?.[0]?.message?.content || '';

        if (!rawContent) {
          throw new Error('Resposta vazia da API');
        }

        generated = parseJsonFromAi(rawContent);

        if (!generated || !generated.title || !generated.content) {
          throw new Error('JSON retornado não contém os campos title e content');
        }

        successfulModel = currentModel;
        console.log(
          `[Blog IA] Sucesso com o modelo "${currentModel}" em ${Date.now() - modelStartTime}ms. Título: "${generated.title}"`
        );
        break; // Sucesso obtido! Sai da fila e prossegue para as imagens e banco
      } catch (modelErr: any) {
        clearTimeout(timeoutId);
        const errMsg = modelErr?.name === 'AbortError' ? 'Timeout de 40s excedido' : modelErr?.message || 'Erro desconhecido';
        console.warn(`[Blog IA] Modelo "${currentModel}" falhou (${errMsg}).`);
        failureLog.push(`${currentModel}: ${errMsg}`);
      }
    }

    if (!generated) {
      return {
        success: false,
        error: `Não foi possível gerar o artigo com os modelos disponíveis na fila. Detalhes: ${failureLog.join(' | ')}`,
      };
    }

    // 3. Busca imagens temáticas (Capa + 2 de corpo) no Unsplash
    console.log('[Blog IA] Selecionando fotos temáticas de alta resolução no Unsplash...');
    const images = await fetchTopicImages(selectedCategory.slug, selectedCategory.keywords || []);

    // 4. Injeta as 2 imagens no corpo do artigo de forma elegante
    const fig1 = `
<figure class="my-8 rounded-2xl overflow-hidden border border-slate-700/60 bg-slate-900/60 shadow-lg">
  <img src="${images.body1.url}" alt="${images.body1.caption}" class="w-full h-auto max-h-[500px] object-cover" loading="lazy" />
  <figcaption class="px-4 py-2.5 text-xs text-sky-400 bg-slate-900/90 border-t border-slate-800 italic text-center">
    📌 ${images.body1.caption}
  </figcaption>
</figure>
`;

    const fig2 = `
<figure class="my-8 rounded-2xl overflow-hidden border border-slate-700/60 bg-slate-900/60 shadow-lg">
  <img src="${images.body2.url}" alt="${images.body2.caption}" class="w-full h-auto max-h-[500px] object-cover" loading="lazy" />
  <figcaption class="px-4 py-2.5 text-xs text-sky-400 bg-slate-900/90 border-t border-slate-800 italic text-center">
    📌 ${images.body2.caption}
  </figcaption>
</figure>
`;

    let enrichedContent = generated.content;
    const parts = enrichedContent.split(/(<h2[^>]*>)/gi);
    if (parts.length >= 5) {
      parts[2] = parts[2] + '\n' + fig1;
      const targetIdx = parts.length > 6 ? 4 : parts.length - 1;
      parts[targetIdx] = parts[targetIdx] + '\n' + fig2;
      enrichedContent = parts.join('');
    } else {
      enrichedContent = enrichedContent + '\n' + fig1 + '\n' + fig2;
    }

    // 5. Localiza autor Dr. Eduardo e categoria no Supabase
    const { data: author } = await supabase
      .from('authors')
      .select('id')
      .eq('is_director', true)
      .single();

    const { data: dbCat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', selectedCategory.slug)
      .single();

    // 6. Insere no Supabase
    const { data: post, error: insertError } = await supabase
      .from('posts')
      .insert({
        title: generated.title,
        slug: `${generated.slug}-${Date.now().toString(36).slice(-4)}`,
        excerpt: generated.excerpt,
        content: enrichedContent,
        category_id: dbCat?.id || null,
        author_id: author?.id || null,
        cover_image: images.cover,
        reading_time: generated.reading_time || 6,
        seo_title: generated.seo_title,
        seo_description: generated.seo_description,
        is_featured: true,
        published_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      return { success: false, error: insertError.message };
    }

    // Atualiza data de última execução na config
    await saveBlogAiConfig({
      ...config,
      lastRun: new Date().toISOString(),
    });

    revalidatePath('/blog');
    revalidatePath('/');

    return {
      success: true,
      article: post,
      modelUsed: successfulModel,
    };
  } catch (err: any) {
    console.error('Erro na automação do artigo:', err);
    return { success: false, error: err.message || 'Erro inesperado na geração.' };
  }
}
