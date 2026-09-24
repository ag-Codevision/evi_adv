'use server';

import { createClient } from './supabase/server';
import { getDirectSupabase } from './supabase/direct';
import { revalidatePath } from 'next/cache';
import { fetchTopicImages } from './image-provider';

export interface BlogAiConfig {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'custom';
  daysOfWeek: number[]; // 0 = Domingo, 1 = Segunda, 2 = Terça, 3 = Quarta, 4 = Quinta, 5 = Sexta, 6 = Sábado
  publishHour: number; // 0 a 23 (horário de Brasília) - retrocompatibilidade
  publishHours?: number[]; // Lista de horários de disparo diário (ex: [9, 19] para 2 artigos/dia)
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
  publishHours: [19],
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
    const supabase = getDirectSupabase(true);
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
 * Atualiza especificamente a data de última execução da IA (sem exigir autenticação por cookie).
 */
export async function updateBlogAiLastRun(lastRunIso: string): Promise<void> {
  try {
    const supabase = getDirectSupabase(true);
    const config = await getBlogAiConfig();
    const updated = { ...config, lastRun: lastRunIso };

    await supabase
      .from('site_contents')
      .upsert(
        {
          page: 'blog_ai_config',
          section: 'engine',
          field_key: 'settings',
          content_type: 'list',
          content_value: JSON.stringify(updated),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'page,section,field_key' }
      );
  } catch (err) {
    console.error('Erro ao atualizar lastRun do blog:', err);
  }
}

/**
 * Salva as configurações do Assistente de IA do Blog no banco de dados (pelo painel admin).
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

    const normalizedPublishHours =
      config.publishHours && config.publishHours.length > 0
        ? config.publishHours.slice(0, config.articlesPerCycle || 1)
        : [config.publishHour || 19];

    const updatedConfig: BlogAiConfig = {
      ...config,
      publishHour: normalizedPublishHours[0],
      publishHours: normalizedPublishHours,
    };

    const { error: upsertError } = await supabase
      .from('site_contents')
      .upsert(
        {
          page: 'blog_ai_config',
          section: 'engine',
          field_key: 'settings',
          content_type: 'list',
          content_value: JSON.stringify(updatedConfig),
          metadata: {
            enabled: updatedConfig.enabled,
            daysOfWeek: updatedConfig.daysOfWeek,
            publishHour: updatedConfig.publishHour,
            publishHours: updatedConfig.publishHours,
            articlesPerCycle: updatedConfig.articlesPerCycle,
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
      const sanitized = jsonStr.replace(/"((?:[^"\\]|\\[\s\S])*)"/g, (_, strContent) => {
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
        const fieldRegex = new RegExp(`"${field}"\\s*:\\s*"((?:[^"\\\\]|\\\\[\\s\\S])*)"`);
        const m = jsonStr.match(fieldRegex);
        if (m) {
          return m[1]
            .replace(/\\n/g, '\n')
            .replace(/\\"/g, '"')
            .replace(/\\\\/g, '\\');
        }
        const looseRegex = new RegExp(`"${field}"\\s*:\\s*"([\\s\\S]*?)(?="\\s*,\\s*"|"[\\s\\S]*?\\}\\s*$)`);
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
 * Executa o ciclo editorial completo de IA (utilizável tanto por Cron Jobs na nuvem quanto por disparo manual).
 * Não depende de sessões ativas no navegador do usuário.
 */
export async function runBlogAiCycle(options?: {
  targetCategorySlug?: string;
  customThemePrompt?: string;
  isCron?: boolean;
}): Promise<{
  success: boolean;
  error?: string;
  article?: any;
  modelUsed?: string;
}> {
  try {
    const supabase = getDirectSupabase(true);
    const config = await getBlogAiConfig();
    const nvidiaKey = process.env.NVIDIA_API_KEY;

    if (!nvidiaKey) {
      return { success: false, error: 'NVIDIA_API_KEY não configurada no servidor.' };
    }

    // 1. Define categoria e tema dinamicamente
    const requested = options?.targetCategorySlug?.trim();
    let selectedCategory: { slug: string; name: string; targetAudience?: string; keywords?: string[] } | undefined;

    if (requested) {
      // 1.1 Procura nas categorias configuradas (por slug ou por nome)
      selectedCategory = config.categories.find(
        (c) => c.slug === requested || c.name.toLowerCase() === requested.toLowerCase()
      );

      // 1.2 Procura nos temas do Mini Cérebro
      if (!selectedCategory) {
        const foundTheme = config.customThemes?.find(
          (t) =>
            t.toLowerCase() === requested.toLowerCase() ||
            t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-') === requested
        );

        const name = foundTheme || requested;
        const slug = name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^\w\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-');

        selectedCategory = {
          name,
          slug,
          targetAudience: 'Empresários, diretores e tomadores de decisão em busca de estratégias e segurança jurídica',
          keywords: [name, 'direito', 'legislação', 'assessoria jurídica'],
        };
      }
    }

    if (!selectedCategory) {
      selectedCategory =
        config.categories[Math.floor(Math.random() * config.categories.length)] ||
        DEFAULT_AI_CONFIG.categories[0];
    }

    // 1.3 Define o tema
    let chosenTheme = options?.customThemePrompt?.trim();
    if (!chosenTheme) {
      // Se a categoria selecionada veio de um tema do mini cérebro, usa o próprio tema como foco
      const isThemeName = config.customThemes?.some((t) => t.toLowerCase() === selectedCategory!.name.toLowerCase());
      if (isThemeName) {
        chosenTheme = selectedCategory!.name;
      } else if (config.customThemes && config.customThemes.length > 0) {
        chosenTheme = config.customThemes[Math.floor(Math.random() * config.customThemes.length)];
      } else {
        chosenTheme = `Teses jurídicas e soluções estratégicas em ${selectedCategory!.name}`;
      }
    }

    // 2. Prompt de Alta Performance com a Persona do Dr. Eduardo Veríssimo Inocente e Diretrizes de SEO Nota 100
    const systemPrompt = `Você é o Dr. Eduardo Veríssimo Inocente, advogado sócio-fundador da EVI Sociedade de Advogados (OAB/SP 200.334), com mais de 25 anos de atuação de vanguarda no Direito Empresarial brasileiro, referência nacional em Recuperação Judicial, Agronegócio e Contencioso Estratégico.

Sua missão é produzir um artigo jurídico de excelência, elegância técnica e NOTA 100 DE SEO no Google (critérios rigorosos do Google E-E-A-T: Experiência, Especialidade, Autoridade e Confiabilidade).

DIRETRIZES DE REDAÇÃO E ARQUITETURA DE CONTEÚDO (NOTA 100 SEO):
1. INTRODUÇÃO COM RESPOSTA DIRETA (FEATURED SNIPPET / POSIÇÃO ZERO):
   Nos primeiros 2 parágrafos, forneça uma definição direta, prática e conclusiva sobre a pauta em 45 a 60 palavras, permitindo que o Google selecione o trecho como Resposta Rápida (Posição Zero). Jamais use clichês como "Nos dias de hoje...", "É sabido que...".
2. HIERARQUIA SEMÂNTICA IMPECÁVEL:
   - Use subtítulos <h2> estratégicos contendo a palavra-chave e variações semânticas de busca real de empresários e diretores.
   - Use <h3> para subdividir pontos técnicos e práticos.
   - Use parágrafos claros (<p>), listas estruturadas (<ul> e <li>) para facilitar a leitura rápida (escaneabilidade) e citações/destaques (<blockquote>).
3. FUNDAMENTAÇÃO JURÍDICA E AUTORIDADE (E-E-A-T):
   - Cite expressamente dispositivos de lei (ex: Lei 11.101/2005, Código Civil, Código de Processo Civil, Lei do Agro, resoluções aplicáveis) e entendimento dominante do Superior Tribunal de Justiça (STJ).
4. LINKAGEM INTERNA ESTRATÉGICA (INTERNAL LINKING):
   Insira naturalmente ao longo do texto de 2 a 3 links internos para o ecossistema do escritório utilizando tags âncora exatamente com estas rotas:
   - Para matérias temáticas afins: <a href="/areas-de-atuacao" class="text-sky-600 font-semibold hover:underline">nossas áreas de atuação jurídica</a>.
   - Para menção ao corpo técnico ou ao sócio: <a href="/eduardo-verissimo" class="text-sky-600 font-semibold hover:underline">Dr. Eduardo Veríssimo Inocente e equipe especializada</a>.
   - Para orientação no caso concreto e contato: <a href="/contato" class="text-sky-600 font-semibold hover:underline">agende uma consulta técnica com nossa banca</a>.
5. SEÇÃO DE PERGUNTAS FREQUENTES (FAQ) OBRIGATÓRIA NO FINAL:
   - Ao final do artigo, crie uma seção <h2>Perguntas Frequentes (FAQ)</h2> contendo exatamente de 3 a 4 perguntas formuladas no estilo de busca do Google ("Como funciona...", "Qual o prazo...", "Quem tem direito..."), seguidas de respostas objetivas e jurídicas de 2 a 3 frases em tags <p>.
6. EXTENSÃO E DENSIDADE:
   - Produza um artigo denso e substancial, com 900 a 1600 palavras de alto valor jurídico real. Não inclua tags <html> ou <body>.`;

    const userPrompt = `Produza o artigo completo com base na seguinte diretriz estratégica:
Tema/Pauta: "${chosenTheme}"
Área/Eixo: "${selectedCategory.name}"
Público-alvo: "${selectedCategory.targetAudience || 'Empresários, CFOs e Produtores Rurais'}"
Palavras-chave primária e secundárias: ${(selectedCategory.keywords || []).join(', ')}

Retorne a resposta EXCLUSIVAMENTE em formato JSON puro, sem blocos markdown:
{
  "title": "Título com alto CTR (55-68 chars), atraente e focado na dúvida do decisor",
  "slug": "slug-url-amigavel-com-palavras-chave-separadas-por-hifen",
  "focus_keyword": "Palavra-chave principal de busca do artigo",
  "excerpt": "Resumo executivo persuasivo em 2 a 3 frases densas (120-150 caracteres)",
  "content": "Conteúdo HTML completo do artigo com <h2>, <h3>, <p>, <ul>, <blockquote>, links internos (<a href=...>) e a seção final <h2>Perguntas Frequentes (FAQ)</h2>",
  "reading_time": 6,
  "seo_title": "Título SEO entre 50 e 60 caracteres com a palavra-chave no início",
  "seo_description": "Meta description persuasiva entre 135 e 155 caracteres com verbo de ação e gatilho de busca"
}`;

    // Fila inteligente de modelos com fallback automático
    const configuredModel = process.env.NVIDIA_MODEL || 'meta/llama-3.2-11b-vision-instruct';
    const modelCandidates = [
      configuredModel,
      'meta/llama-3.2-11b-vision-instruct',
      'google/diffusiongemma-26b-a4b-it',
      'meta/llama-3.2-90b-vision-instruct',
    ].filter(Boolean);

    const uniqueModels = modelCandidates.filter((item, pos, self) => self.indexOf(item) === pos);
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

    // 3. Consulta capas recentes no Supabase para garantir variedade contínua e anti-repetição
    console.log('[Blog IA] Selecionando fotos temáticas de alta resolução com verificação anti-repetição...');
    let recentCoverUrls: string[] = [];
    try {
      const { data: recentPosts } = await supabase
        .from('posts')
        .select('cover_image')
        .order('published_at', { ascending: false })
        .limit(15);
      if (recentPosts) {
        recentCoverUrls = recentPosts.map((p) => p.cover_image).filter(Boolean);
      }
    } catch (dbErr) {
      console.warn('[Blog IA] Não foi possível consultar histórico de capas:', dbErr);
    }

    const images = await fetchTopicImages({
      categorySlug: selectedCategory.slug,
      keywords: selectedCategory.keywords || [],
      theme: chosenTheme,
      title: generated.title,
      excludeUrls: recentCoverUrls,
    });

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

    let { data: dbCat } = await supabase
      .from('categories')
      .select('id, name')
      .eq('slug', selectedCategory.slug)
      .single();

    if (!dbCat && selectedCategory.name) {
      const { data: dbCatByName } = await supabase
        .from('categories')
        .select('id, name')
        .ilike('name', selectedCategory.name)
        .single();
      dbCat = dbCatByName;
    }

    if (!dbCat && selectedCategory.name) {
      const { data: newCat } = await supabase
        .from('categories')
        .insert({
          name: selectedCategory.name,
          slug: selectedCategory.slug,
          description: `Artigos e teses jurídicas estratégicas sobre ${selectedCategory.name}.`,
        })
        .select('id, name')
        .single();
      dbCat = newCat;
    }

    // 6. Insere no Supabase
    const nowIso = new Date().toISOString();
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
        published_at: nowIso,
      })
      .select()
      .single();

    if (insertError) {
      return { success: false, error: insertError.message };
    }

    // 7. Atualiza data de última execução na configuração
    await updateBlogAiLastRun(nowIso);

    revalidatePath('/blog');
    revalidatePath('/');

    return {
      success: true,
      article: post,
      modelUsed: successfulModel,
    };
  } catch (err: any) {
    console.error('Erro no ciclo de automação do artigo:', err);
    return { success: false, error: err.message || 'Erro inesperado na geração.' };
  }
}

/**
 * Dispara manualmente a criação e publicação imediata de um artigo com o assistente de IA.
 * Requer autenticação do administrador no painel.
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
      return { success: false, error: 'Acesso negado. Apenas administradores autenticados podem gerar artigos manualmente.' };
    }

    return await runBlogAiCycle({
      targetCategorySlug,
      customThemePrompt,
      isCron: false,
    });
  } catch (err: any) {
    console.error('Erro na ação manual de geração:', err);
    return { success: false, error: err.message || 'Erro inesperado na geração manual.' };
  }
}
