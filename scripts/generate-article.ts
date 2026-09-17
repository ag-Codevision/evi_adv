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

Sua tarefa é redigir um artigo jurídico de alto nível técnico, com tom sóbrio, pragmático, elegante e fundamentado na jurisprudência brasileira (especialmente STJ e Tribunais Estaduais).

DIRETRIZES FUNDAMENTAIS:
1. Jamais use frases vazias, chavões ou introduções genéricas ("Nos dias de hoje...", "É sabido que...").
2. Escreva em Português do Brasil com precisão terminológica impecável.
3. Estruture o texto em HTML semântico limpo: use tags <h2>, <h3>, <p>, <ul>/<li> e <blockquote>. Não inclua tags <html>, <head> ou <body>.
4. Foque em soluções práticas para diretores financeiros (CFOs), produtores rurais, acionistas e empresários.
5. Ao final, inclua uma conclusão estratégica ressaltando a importância da análise individualizada do caso concreto.
6. O texto deve ter entre 900 e 1500 palavras de densidade técnica real.`;

  const userPrompt = `Redija um artigo jurídico aprofundado com o seguinte escopo:
Título Proposto: "${topic.title}"
Área/Eixo: "${topic.categoryName}"
Público-Alvo: ${topic.targetAudience}
Palavras-chave a incorporar: ${topic.keywords.join(', ')}
Resumo/Ponto de partida: "${topic.excerpt}"

Entregue a resposta no formato JSON com a seguinte estrutura:
{
  "title": "Título final refinado",
  "slug": "slug-url-amigavel-sem-acentos",
  "excerpt": "Resumo executivo de 2 a 3 frases persuasivas e técnicas",
  "content": "Conteúdo HTML completo do artigo",
  "reading_time": 6,
  "seo_title": "Título otimizado para SEO até 60 caracteres",
  "seo_description": "Meta description persuasiva até 155 caracteres"
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
