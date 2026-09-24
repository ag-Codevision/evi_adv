/**
 * Motor Editorial de IA - EVI Sociedade de Advogados
 * Integração: NVIDIA NIM API + Supabase PostgreSQL
 * Persona: Dr. Eduardo Veríssimo Inocente (25+ anos de advocacia empresarial de vanguarda)
 */

import { createClient } from '@supabase/supabase-js';
import { INITIAL_EDITORIAL_TOPICS, TopicBlueprint } from '../lib/blog-topics';

function getServiceSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    throw new Error('Supabase Service Role credentials not configured');
  }
  return createClient(supabaseUrl, serviceKey);
}

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;
const NVIDIA_MODEL = process.env.NVIDIA_MODEL || 'meta/llama-3.3-70b-instruct';
const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';

async function generateLegalArticle(topic: TopicBlueprint) {
  if (!NVIDIA_API_KEY) {
    throw new Error('NVIDIA_API_KEY não configurada no ambiente.');
  }

  const systemPrompt = `Você é o Dr. Eduardo Veríssimo Inocente, advogado sócio-fundador da EVI Sociedade de Advogados (OAB/SP 200.334), com mais de 25 anos de atuação de vanguarda no Direito Empresarial brasileiro, referência em Recuperação Judicial, Agronegócio e Contencioso Estratégico.

Sua tarefa é redigir um artigo jurídico de altíssimo nível técnico com NOTA 100 DE SEO no Google e autoridade máxima (critérios Google E-E-A-T).

DIRETRIZES DE ARQUITETURA E SEO NOTA 100:
1. RESPOSTA DIRETA NO INÍCIO (FEATURED SNIPPET): Nos primeiros 2 parágrafos, responda diretamente à dúvida central do tema em 45-60 palavras para qualificação na Posição Zero do Google.
2. HIERARQUIA SEMÂNTICA: Use subtítulos <h2> estratégicos com termos de busca e <h3> para aspectos operacionais. Use listas <ul>/<li> e citações <blockquote>.
3. EMBASAMENTO: Cite artigos de lei pertinentes (Lei 11.101/2005, Código Civil, etc.) e teses consolidadas do STJ.
4. LINKAGEM INTERNA: Insira links internos naturais: <a href="/areas-de-atuacao" class="text-sky-600 font-semibold hover:underline">áreas de atuação do escritório</a>, <a href="/eduardo-verissimo" class="text-sky-600 font-semibold hover:underline">Dr. Eduardo Veríssimo Inocente</a> e <a href="/contato" class="text-sky-600 font-semibold hover:underline">consulta jurídica especializada</a>.
5. PERGUNTAS FREQUENTES (FAQ): Adicione ao final uma seção <h2>Perguntas Frequentes (FAQ)</h2> com 3 a 4 perguntas e respostas detalhadas.
6. EXTENSÃO: Entre 900 e 1500 palavras em HTML limpo, sem tags <html> ou <body>.`;

  const userPrompt = `Redija o artigo com foco em máxima indexação e autoridade:
Título Proposto: "${topic.title}"
Área/Eixo: "${topic.categoryName}"
Público-Alvo: ${topic.targetAudience}
Palavras-chave a incorporar: ${topic.keywords.join(', ')}
Resumo/Ponto de partida: "${topic.excerpt}"

Entregue a resposta no formato JSON com a seguinte estrutura:
{
  "title": "Título final refinado com alto CTR (55-68 chars)",
  "slug": "slug-url-amigavel-sem-acentos-separado-por-hifens",
  "focus_keyword": "Palavra-chave principal de busca",
  "excerpt": "Resumo executivo de 2 a 3 frases persuasivas e técnicas (120-150 chars)",
  "content": "Conteúdo HTML completo do artigo com <h2>, <h3>, <p>, <ul>, <blockquote>, links internos e a seção <h2>Perguntas Frequentes (FAQ)</h2>",
  "reading_time": 6,
  "seo_title": "Título otimizado para SEO entre 50 e 60 caracteres com palavra-chave no início",
  "seo_description": "Meta description persuasiva entre 135 e 155 caracteres com verbo de ação"
}`;

  const response = await fetch(NVIDIA_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${NVIDIA_API_KEY}`,
    },
    body: JSON.stringify({
      model: NVIDIA_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.35,
      max_tokens: 3500,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro na chamada da NVIDIA API: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const rawContent = data.choices[0]?.message?.content;

  // Extrai o JSON retornado pelo modelo
  const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Falha ao interpretar resposta JSON da NVIDIA API.');
  }

  return JSON.parse(jsonMatch[0]);
}

async function runAutomation() {
  console.log('--- Iniciando Motor Editorial IA (EVI Advogados) ---');
  const supabase = getServiceSupabase();

  // 1. Busca categoria e autor Dr. Eduardo
  const { data: author } = await supabase
    .from('authors')
    .select('id')
    .eq('is_director', true)
    .single();

  // 2. Verifica se há itens pendentes na editorial_queue
  const { data: queuedItem } = await supabase
    .from('editorial_queue')
    .select('*')
    .eq('status', 'pending')
    .order('scheduled_for', { ascending: true })
    .limit(1)
    .single();

  let selectedTopic: TopicBlueprint;

  if (queuedItem) {
    selectedTopic = {
      title: queuedItem.topic,
      categorySlug: queuedItem.target_category_slug,
      categoryName: queuedItem.target_category_slug,
      excerpt: queuedItem.topic,
      keywords: queuedItem.keywords || [],
      targetAudience: queuedItem.target_audience || 'Empresários e Diretores',
    };
  } else {
    // Escolhe aleatoriamente uma pauta do catálogo
    const randomIdx = Math.floor(Math.random() * INITIAL_EDITORIAL_TOPICS.length);
    selectedTopic = INITIAL_EDITORIAL_TOPICS[randomIdx];
  }

  console.log(`Pauta selecionada: "${selectedTopic.title}"`);
  console.log('Chamando NVIDIA NIM para redação especializada...');

  const generatedArticle = await generateLegalArticle(selectedTopic);

  // 3. Resolve a categoria no Supabase
  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', selectedTopic.categorySlug)
    .single();

  // 4. Insere o artigo na tabela posts
  const { data: post, error: postError } = await supabase
    .from('posts')
    .insert({
      title: generatedArticle.title,
      slug: generatedArticle.slug,
      excerpt: generatedArticle.excerpt,
      content: generatedArticle.content,
      category_id: category?.id || null,
      author_id: author?.id || null,
      cover_image: '/assets/banner_color.webp',
      reading_time: generatedArticle.reading_time || 5,
      seo_title: generatedArticle.seo_title,
      seo_description: generatedArticle.seo_description,
      published_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (postError) {
    throw new Error(`Erro ao salvar artigo no Supabase: ${postError.message}`);
  }

  // 5. Se o item estava na fila editorial, atualiza o status
  if (queuedItem) {
    await supabase
      .from('editorial_queue')
      .update({
        status: 'published',
        generated_post_id: post.id,
      })
      .eq('id', queuedItem.id);
  }

  console.log(`Artigo publicado com sucesso no Supabase! ID: ${post.id}`);
  console.log(`URL do post: /blog/${post.slug}`);
}

// Execução principal
runAutomation().catch((err) => {
  console.error('Erro na execução do motor editorial:', err);
  process.exit(1);
});
