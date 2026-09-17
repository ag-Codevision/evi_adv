import { INITIAL_EDITORIAL_TOPICS } from '../lib/blog-topics.mjs';
import { fetchTopicImages } from '../lib/image-provider.mjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseSecret = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
const nvidiaKey = process.env.NVIDIA_API_KEY;
const nvidiaModel = process.env.NVIDIA_MODEL || 'meta/llama-3.2-90b-vision-instruct';

console.log('--- INICIANDO MOTOR EDITORIAL IA (EVI ADVOGADOS) ---');

function injectBodyImages(htmlContent, body1, body2) {
  const fig1 = `
<figure class="my-10 rounded-2xl overflow-hidden border border-[#2a2d33] bg-[#1a1c20] shadow-xl">
  <img src="${body1.url}" alt="${body1.caption}" class="w-full h-auto max-h-[520px] object-cover" loading="lazy" />
  <figcaption class="px-4 py-3 text-xs tracking-wide text-[#d4af37] bg-[#0c0d0e]/90 border-t border-[#2a2d33]/60 italic">
    📌 ${body1.caption}
  </figcaption>
</figure>
`;

  const fig2 = `
<figure class="my-10 rounded-2xl overflow-hidden border border-[#2a2d33] bg-[#1a1c20] shadow-xl">
  <img src="${body2.url}" alt="${body2.caption}" class="w-full h-auto max-h-[520px] object-cover" loading="lazy" />
  <figcaption class="px-4 py-3 text-xs tracking-wide text-[#d4af37] bg-[#0c0d0e]/90 border-t border-[#2a2d33]/60 italic">
    📌 ${body2.caption}
  </figcaption>
</figure>
`;

  // Divide o conteúdo procurando ocorrências de <h2> para distribuir harmonicamente
  const parts = htmlContent.split(/(<h2[^>]*>)/gi);

  if (parts.length >= 5) {
    // Temos ao menos 2 tags h2 (parts[0], h2_1, content_1, h2_2, content_2...)
    // Injeta a primeira imagem após a primeira seção h2
    parts[2] = parts[2] + '\n' + fig1;
    // Injeta a segunda imagem mais à frente
    const targetIdx = parts.length > 6 ? 4 : parts.length - 1;
    parts[targetIdx] = parts[targetIdx] + '\n' + fig2;
    return parts.join('');
  }

  // Fallback se não tiver tags h2 suficientes: divide por parágrafos
  const paragraphs = htmlContent.split('</p>');
  if (paragraphs.length >= 4) {
    const p1 = Math.floor(paragraphs.length / 3);
    const p2 = Math.floor((paragraphs.length * 2) / 3);
    paragraphs[p1] = paragraphs[p1] + '</p>\n' + fig1;
    paragraphs[p2] = paragraphs[p2] + '</p>\n' + fig2;
    return paragraphs.join('</p>');
  }

  // Caso seja um bloco simples
  return htmlContent + '\n' + fig1 + '\n' + fig2;
}

async function generateLegalArticle(topic) {
  const systemPrompt = `Você é o Dr. Eduardo Veríssimo Inocente, advogado sócio-fundador da EVI Sociedade de Advogados (OAB/SP 200.334), com mais de 25 anos de atuação de vanguarda no Direito Empresarial brasileiro, referência em Recuperação Judicial, Agronegócio e Contencioso Estratégico.

Sua tarefa é redigir um artigo jurídico de alto nível técnico, com tom sóbrio, pragmático, elegante e fundamentado na jurisprudência brasileira (especialmente STJ e Tribunais Estaduais).

DIRETRIZES FUNDAMENTAIS:
1. Jamais use frases vazias, chavões ou introduções genéricas ("Nos dias de hoje...", "É sabido que...").
2. Escreva em Português do Brasil com precisão terminológica impecável.
3. Estruture o texto em HTML semântico limpo: use tags <h2>, <h3>, <p>, <ul>/<li> e <blockquote>. Não inclua tags <html>, <head> ou <body>.
4. Foque em soluções práticas para diretores financeiros (CFOs), produtores rurais, acionistas e empresários.
5. Ao final, inclua uma conclusão estratégica ressaltando a importância da análise individualizada do caso concreto.
6. O texto deve ter densidade técnica real.`;

  const userPrompt = `Redija um artigo jurídico aprofundado com o seguinte escopo:
Título Proposto: "${topic.title}"
Área/Eixo: "${topic.categoryName}"
Público-Alvo: ${topic.targetAudience}
Palavras-chave a incorporar: ${topic.keywords.join(', ')}
Resumo/Ponto de partida: "${topic.excerpt}"

Entregue a resposta no formato JSON estrito com a seguinte estrutura (sem markdown codeblocks):
{
  "title": "Título final refinado",
  "slug": "slug-url-amigavel-sem-acentos",
  "excerpt": "Resumo executivo de 2 a 3 frases persuasivas e técnicas",
  "content": "Conteúdo HTML completo do artigo",
  "reading_time": 6,
  "seo_title": "Título otimizado para SEO até 60 caracteres",
  "seo_description": "Meta description persuasiva até 155 caracteres"
}`;

  const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${nvidiaKey}`,
    },
    body: JSON.stringify({
      model: nvidiaModel,
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

  // Extrai o bloco JSON
  const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Falha ao interpretar resposta JSON da NVIDIA API: ' + rawContent);
  }

  return JSON.parse(jsonMatch[0]);
}

async function run() {
  if (!supabaseUrl || !supabaseSecret) {
    throw new Error('Supabase credentials não configuradas.');
  }

  // 1. Busca autor Dr. Eduardo
  console.log('Buscando autor Dr. Eduardo no Supabase...');
  const authorRes = await fetch(`${supabaseUrl}/rest/v1/authors?is_director=eq.true&limit=1`, {
    headers: {
      apikey: supabaseSecret,
      Authorization: `Bearer ${supabaseSecret}`,
    },
  });
  const authors = await authorRes.json();
  const author = authors[0];
  console.log('Autor localizado:', author?.name, `(ID: ${author?.id})`);

  // Permite selecionar tópico via argumento de linha de comando: node scripts/generate-article.mjs 1
  const topicIndex = parseInt(process.argv[2] || '0', 10);
  const selectedTopic = INITIAL_EDITORIAL_TOPICS[topicIndex] || INITIAL_EDITORIAL_TOPICS[0];
  console.log(`Pauta selecionada [${topicIndex}]: "${selectedTopic.title}"`);
  console.log(`Gerando artigo via NVIDIA NIM (${nvidiaModel})...`);

  const article = await generateLegalArticle(selectedTopic);
  console.log(`Artigo gerado: "${article.title}" (Slug: ${article.slug})`);

  // 3. Obtém imagens de alta resolução do banco de imagens (Capa + 2 de corpo)
  console.log('Obtendo imagens temáticas de alta resolução (Capa + 2 de corpo)...');
  const images = await fetchTopicImages(selectedTopic.categorySlug, selectedTopic.keywords);
  console.log('Capa selecionada:', images.cover);
  console.log('Imagem de corpo 1:', images.body1.url);
  console.log('Imagem de corpo 2:', images.body2.url);

  // Injeta as 2 imagens no HTML do artigo
  const enrichedContent = injectBodyImages(article.content, images.body1, images.body2);

  // 4. Busca categoria no Supabase
  const catRes = await fetch(`${supabaseUrl}/rest/v1/categories?slug=eq.${selectedTopic.categorySlug}&limit=1`, {
    headers: {
      apikey: supabaseSecret,
      Authorization: `Bearer ${supabaseSecret}`,
    },
  });
  const cats = await catRes.json();
  const category = cats[0];

  // 5. Grava ou atualiza na tabela posts via Upsert
  console.log('Salvando artigo na tabela posts do Supabase (Upsert)...');
  const postPayload = {
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: enrichedContent,
    category_id: category?.id || null,
    author_id: author?.id || null,
    cover_image: images.cover,
    reading_time: article.reading_time || 6,
    seo_title: article.seo_title,
    seo_description: article.seo_description,
    is_featured: true,
  };

  const insertRes = await fetch(`${supabaseUrl}/rest/v1/posts?on_conflict=slug`, {
    method: 'POST',
    headers: {
      apikey: supabaseSecret,
      Authorization: `Bearer ${supabaseSecret}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=representation',
    },
    body: JSON.stringify(postPayload),
  });

  if (!insertRes.ok) {
    const err = await insertRes.text();
    throw new Error(`Erro ao inserir post no Supabase: ${err}`);
  }

  const createdPost = await insertRes.json();
  console.log('\n>>> SUCESSO! Artigo publicado no Supabase com capa e 2 imagens no corpo! <<<');
  console.log('ID:', createdPost[0]?.id);
  console.log('Título:', createdPost[0]?.title);
  console.log('Slug:', createdPost[0]?.slug);
  console.log('Capa (Card + Banner Interno):', createdPost[0]?.cover_image);
}

run().catch((e) => {
  console.error('Erro:', e.message);
  process.exit(1);
});
