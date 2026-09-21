import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import { fetchTopicImages } from '../lib/image-provider.mjs';

// 1. Carrega variáveis de ambiente do .env
const envContent = fs.readFileSync('.env', 'utf-8');
for (const line of envContent.split(/\r?\n/)) {
  const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (m) process.env[m[1]] = m[2];
}

async function runE2ETest() {
  console.log('========================================================');
  console.log('INICIANDO TESTE PONTA A PONTA DE GERAÇÃO EDITORIAL DE IA');
  console.log('========================================================');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const nvidiaKey = process.env.NVIDIA_API_KEY;
  const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;

  console.log('✓ Supabase URL:', supabaseUrl ? 'OK' : 'FALTANDO');
  console.log('✓ NVIDIA Key presente:', !!nvidiaKey);
  console.log('✓ Unsplash Key presente:', !!unsplashKey);

  // Teste de imagens no Unsplash
  console.log('\n[1/3] Testando busca de imagens de alta resolução no Unsplash...');
  const t0Unsplash = Date.now();
  const images = await fetchTopicImages('agronegocio', ['crédito rural', 'frustração de safra']);
  console.log(`✓ Imagens obtidas em ${Date.now() - t0Unsplash}ms:`);
  console.log('  - Capa:', images.cover?.slice(0, 70) + '...');
  console.log('  - Imagem 1:', images.body1.url?.slice(0, 70) + '... (Legenda:', images.body1.caption, ')');
  console.log('  - Imagem 2:', images.body2.url?.slice(0, 70) + '... (Legenda:', images.body2.caption, ')');

  // Teste de geração textual com a fila de modelos
  console.log('\n[2/3] Testando IA com fila de modelos resiliente...');
  const systemPrompt = `Você é o Dr. Eduardo Veríssimo Inocente, advogado sócio-fundador da EVI Sociedade de Advogados (OAB/SP 200.334), com mais de 25 anos de atuação de vanguarda no Direito Empresarial brasileiro, referência nacional em Recuperação Judicial, Agronegócio e Contencioso Estratégico.
Sua missão é redigir um artigo jurídico aprofundado, moderno e técnico. Estruture em HTML semântico com subtítulos <h2> e parágrafos <p>.`;

  const userPrompt = `Crie um artigo completo com base na seguinte diretriz:
Tema/Pauta: "Alongamento de Dívidas Rurais e Mitigação de Riscos de Execução na Frustração de Safra"
Área/Eixo: "Agronegócio & Crédito Rural"
Público-alvo: "Produtores rurais e cooperativas"
Palavras-chave: crédito rural, alongamento, CPR, frustração de safra

Retorne EXCLUSIVAMENTE em formato JSON puro:
{
  "title": "Título técnico e expressivo",
  "slug": "alongamento-dividas-rurais-mitigacao-riscos",
  "excerpt": "Resumo executivo de 2 a 3 frases técnicas",
  "content": "Conteúdo HTML com subtítulos <h2> e parágrafos <p>",
  "reading_time": 6,
  "seo_title": "Alongamento de Dívidas Rurais | EVI Advogados",
  "seo_description": "Estratégias jurídicas para alongamento de crédito rural em perdas de safra."
}`;

  const modelCandidates = [
    process.env.NVIDIA_MODEL || 'meta/llama-3.2-11b-vision-instruct',
    'meta/llama-3.2-11b-vision-instruct',
    'google/diffusiongemma-26b-a4b-it',
  ];
  const uniqueModels = [...new Set(modelCandidates)];

  let generated = null;
  let modelUsed = '';
  const t0AI = Date.now();

  for (const model of uniqueModels) {
    console.log(`  -> Tentando modelo da fila: ${model}...`);
    const c = new AbortController();
    const timer = setTimeout(() => c.abort(), 45000);
    try {
      const res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + nvidiaKey,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.35,
          max_tokens: 3000,
        }),
        signal: c.signal,
      });
      clearTimeout(timer);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      const raw = data.choices?.[0]?.message?.content || '';

      // Parser resiliente
      const sanitized = raw.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();
      const match = sanitized.match(/\{[\s\S]*\}/);
      if (!match) throw new Error('Objeto JSON não encontrado');

      // Sanitiza quebras de linha dentro de strings literais
      const cleaned = match[0].replace(/"((?:[^"\\]|\\.)*)"/gs, (_, s) => {
        return `"${s.replace(/\r?\n/g, '\\n').replace(/\t/g, '\\t')}"`;
      });

      generated = JSON.parse(cleaned);
      modelUsed = model;
      console.log(`  ✓ SUCESSO com o modelo ${model} em ${Date.now() - t0AI}ms!`);
      break;
    } catch (e) {
      clearTimeout(timer);
      console.warn(`  ✗ Modelo ${model} falhou: ${e.message}. Acionando próximo...`);
    }
  }

  if (!generated) {
    throw new Error('Falha em todos os modelos da fila!');
  }

  console.log('\nArtigo gerado com sucesso:');
  console.log('  Título:', generated.title);
  console.log('  Slug base:', generated.slug);
  console.log('  Tamanho HTML gerado:', generated.content.length, 'caracteres');

  // Diagramação com figuras do Unsplash
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

  let enriched = generated.content;
  const parts = enriched.split(/(<h2[^>]*>)/gi);
  if (parts.length >= 5) {
    parts[2] = parts[2] + '\n' + fig1;
    const targetIdx = parts.length > 6 ? 4 : parts.length - 1;
    parts[targetIdx] = parts[targetIdx] + '\n' + fig2;
    enriched = parts.join('');
  } else {
    enriched = enriched + '\n' + fig1 + '\n' + fig2;
  }

  // Persistência no Supabase
  console.log('\n[3/3] Gravando artigo na base de dados Supabase...');
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: author } = await supabase.from('authors').select('id, name').eq('is_director', true).single();
  console.log('  ✓ Autor:', author.name, `(${author.id})`);

  const { data: category } = await supabase.from('categories').select('id, name').eq('slug', 'agronegocio').single();
  console.log('  ✓ Categoria:', category.name, `(${category.id})`);

  const uniqueSlug = `${generated.slug}-${Date.now().toString(36).slice(-4)}`;

  const { data: post, error: insertErr } = await supabase
    .from('posts')
    .insert({
      title: generated.title,
      slug: uniqueSlug,
      excerpt: generated.excerpt,
      content: enriched,
      category_id: category?.id || null,
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

  if (insertErr) {
    console.error('✗ Erro ao gravar no Supabase:', insertErr);
    process.exit(1);
  }

  console.log('\n🎉 ARTIGO PUBLICADO COM SUCESSO NO BANCO DE DADOS!');
  console.log('  - Post ID:', post.id);
  console.log('  - Título:', post.title);
  console.log('  - Slug URL:', `/blog/${post.slug}`);
  console.log('  - Foto de Capa (Unsplash):', post.cover_image);
  console.log('  - Data de Publicação:', post.published_at);
  console.log('  - Modelo utilizado da Fila:', modelUsed);
  console.log('========================================================\n');
}

runE2ETest().catch((err) => {
  console.error('ERRO FATAL NO TESTE E2E:', err);
  process.exit(1);
});
