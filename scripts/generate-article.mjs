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

  const parts = htmlContent.split(/(<h2[^>]*>)/gi);
  if (parts.length >= 5) {
    parts[2] = parts[2] + '\n' + fig1;
    const targetIdx = parts.length > 6 ? 4 : parts.length - 1;
    parts[targetIdx] = parts[targetIdx] + '\n' + fig2;
    return parts.join('');
  }

  const paragraphs = htmlContent.split('</p>');
  if (paragraphs.length >= 4) {
    const p1 = Math.floor(paragraphs.length / 3);
    const p2 = Math.floor((paragraphs.length * 2) / 3);
    paragraphs[p1] = paragraphs[p1] + '</p>\n' + fig1;
    paragraphs[p2] = paragraphs[p2] + '</p>\n' + fig2;
    return paragraphs.join('</p>');
  }

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
Título Proposto ou Diretriz: "${topic.title}"
Área/Eixo: "${topic.categoryName || topic.categorySlug}"
Público-Alvo: ${topic.targetAudience || 'Empresários e Diretores'}
Palavras-chave a incorporar: ${(topic.keywords || []).join(', ')}
Resumo/Ponto de partida: "${topic.excerpt || topic.title}"

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

  // 1. Busca configurações ativas do robô no Supabase
  console.log('Consultando configurações ativas de automação no Supabase...');
  let aiConfig = null;
  try {
    const cfgRes = await fetch(
      `${supabaseUrl}/rest/v1/site_contents?page=eq.blog_ai_config&section=eq.engine&field_key=eq.settings&limit=1`,
      {
        headers: {
          apikey: supabaseSecret,
          Authorization: `Bearer ${supabaseSecret}`,
        },
      }
    );
    const cfgData = await cfgRes.json();
    if (cfgData && cfgData[0]?.content_value) {
      aiConfig = JSON.parse(cfgData[0].content_value);
    }
  } catch (e) {
    console.warn('Configurações não encontradas, usando padrão.');
  }

  // Se for execução agendada e não foi passado flag de força via terminal:
  const isForced = process.argv.includes('--force');
  if (aiConfig && !isForced) {
    if (!aiConfig.enabled) {
      console.log('Automação do Robô Editorial está desativada no painel. Encerrando execução.');
      return;
    }

    // Valida dia da semana e horário (Brasília UTC-3)
    const nowUtc = new Date();
    // Horário de Brasília = UTC - 3
    const brDate = new Date(nowUtc.getTime() - 3 * 3600 * 1000);
    const dayOfWeek = brDate.getUTCDay(); // 0 a 6
    const hour = brDate.getUTCHours();

    console.log(`Checagem de agendamento: Hoje é dia ${dayOfWeek}, horário de Brasília: ${hour}h`);
    console.log(`Configuração: Dias [${aiConfig.daysOfWeek.join(', ')}], Horário alvo: ${aiConfig.publishHour}h`);

    if (!aiConfig.daysOfWeek.includes(dayOfWeek)) {
      console.log(`Hoje (${dayOfWeek}) não é um dia programado para publicação. Aguardando próximo ciclo.`);
      return;
    }

    if (hour !== aiConfig.publishHour) {
      console.log(`Horário atual (${hour}h) não corresponde ao horário agendado (${aiConfig.publishHour}h).`);
      return;
    }
  }

  // 2. Busca autor Dr. Eduardo
  const authorRes = await fetch(`${supabaseUrl}/rest/v1/authors?is_director=eq.true&limit=1`, {
    headers: {
      apikey: supabaseSecret,
      Authorization: `Bearer ${supabaseSecret}`,
    },
  });
  const authors = await authorRes.json();
  const author = authors[0];
  console.log('Autor localizado:', author?.name, `(ID: ${author?.id})`);

  // 3. Seleciona pauta (prioriza sugestões do "mini cérebro" configurado no painel)
  let selectedTopic = null;

  if (aiConfig && aiConfig.customThemes && aiConfig.customThemes.length > 0) {
    // Sorteia um tema do mini cérebro
    const randomTheme = aiConfig.customThemes[Math.floor(Math.random() * aiConfig.customThemes.length)];
    const randomCat = aiConfig.categories[Math.floor(Math.random() * aiConfig.categories.length)] || {
      slug: 'recuperacao-judicial',
      name: 'Recuperação Judicial & Falências',
      keywords: ['empresarial', 'estratégico'],
    };

    selectedTopic = {
      title: randomTheme,
      categorySlug: randomCat.slug,
      categoryName: randomCat.name,
      keywords: randomCat.keywords || ['Direito Empresarial', 'EVI Advogados'],
      targetAudience: randomCat.targetAudience || 'Empresários e CFOs',
      excerpt: randomTheme,
    };
    console.log(`Pauta selecionada do mini cérebro: "${selectedTopic.title}"`);
  } else {
    const topicIndex = parseInt(process.argv[2] || '0', 10);
    selectedTopic = INITIAL_EDITORIAL_TOPICS[topicIndex] || INITIAL_EDITORIAL_TOPICS[0];
    console.log(`Pauta selecionada do catálogo inicial: "${selectedTopic.title}"`);
  }

  console.log(`Gerando artigo via NVIDIA NIM (${nvidiaModel})...`);
  const article = await generateLegalArticle(selectedTopic);
  console.log(`Artigo gerado: "${article.title}" (Slug: ${article.slug})`);

  // 4. Obtém imagens temáticas de alta resolução (Capa + 2 de corpo)
  console.log('Obtendo imagens temáticas de alta resolução (Capa + 2 de corpo)...');
  const images = await fetchTopicImages(selectedTopic.categorySlug, selectedTopic.keywords);
  console.log('Capa selecionada:', images.cover);
  console.log('Imagem de corpo 1:', images.body1.url);
  console.log('Imagem de corpo 2:', images.body2.url);

  // Injeta as 2 imagens no HTML do artigo
  const enrichedContent = injectBodyImages(article.content, images.body1, images.body2);

  // 5. Busca categoria no Supabase
  const catRes = await fetch(`${supabaseUrl}/rest/v1/categories?slug=eq.${selectedTopic.categorySlug}&limit=1`, {
    headers: {
      apikey: supabaseSecret,
      Authorization: `Bearer ${supabaseSecret}`,
    },
  });
  const cats = await catRes.json();
  const category = cats[0];

  // 6. Grava ou atualiza na tabela posts via Upsert
  const uniqueSlug = `${article.slug}-${Date.now().toString(36).slice(-4)}`;
  console.log('Salvando artigo na tabela posts do Supabase...');
  const postPayload = {
    title: article.title,
    slug: uniqueSlug,
    excerpt: article.excerpt,
    content: enrichedContent,
    category_id: category?.id || null,
    author_id: author?.id || null,
    cover_image: images.cover,
    reading_time: article.reading_time || 6,
    seo_title: article.seo_title,
    seo_description: article.seo_description,
    is_featured: true,
    published_at: new Date().toISOString(),
  };

  const insertRes = await fetch(`${supabaseUrl}/rest/v1/posts`, {
    method: 'POST',
    headers: {
      apikey: supabaseSecret,
      Authorization: `Bearer ${supabaseSecret}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
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
}

run().catch((e) => {
  console.error('Erro:', e.message);
  process.exit(1);
});
