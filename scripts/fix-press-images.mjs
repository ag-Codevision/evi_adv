import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

function loadEnv() {
  const content = fs.readFileSync('.env', 'utf8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx > -1) {
      env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
    }
  }
  return env;
}

// 1. Mapeamento de imagens para lib/press-data.ts
const imageMapping = {
  'participacao-do-dr-eduardo-verissimo-inocente-no-programa-tarde-top': {
    featured: '/img/imprensa/nani-venancio.jpg',
    body: []
  },
  'destaque-publicado-pela-international-business-magazine': {
    featured: '/img/imprensa/ib-magazine.png',
    body: []
  },
  'certificado-ibi': {
    featured: '/img/imprensa/certificado-ibi.jpg',
    body: []
  },
  'entrevista-dr-eduardo-empresarios-de-sucesso': {
    featured: '/img/imprensa/band-news.png',
    body: []
  },
  'premio-quality-justica': {
    featured: '/img/imprensa/premio-quality.jpg',
    body: []
  },
  'materia-sobre-a-evi-no-ib-magazine-international': {
    featured: '/img/imprensa/ib-magazine.png',
    body: []
  },
  'entrevista-do-dr-eduardo-verissimo-inocente-para-alexandre-motta-do-programa-conversa-legal-bcc-international-television': {
    featured: '/img/imprensa/conversa-legal.png',
    body: []
  },
  'participacao-do-dr-eduardo-no-programa-da-nani-venancio': {
    featured: '/img/imprensa/Entrevistas-03-720x480.jpg',
    body: []
  },
  'dr-eduardo-verissimo-inocente-homenageado-trofeu-personalidade-abc-2018': {
    featured: '/img/imprensa/trofeu-abc.jpg',
    body: []
  },
  'entrevista-jornal-do-sbt-sp-explosao-em-academia-afeta-casas-vizinhas': {
    featured: '/img/imprensa/sbt-entrevista.jpg',
    body: []
  },
  'vejam-o-que-as-pessoas-falam-da-e-v-i-advogado': {
    featured: '/img/imprensa/depoimentos_evi.jpg',
    body: []
  },
  'e-v-i-no-programa-estilo-empresarial': {
    featured: '/img/imprensa/WhatsApp-Image-2018-06-06-at-11.44.36-1044x480.jpeg',
    body: []
  },
  'diario-do-grande-abc-demolicao-preocupa-vizinhos-de-academia': {
    featured: '/img/imprensa/reportagens-Tem-960x480.jpg',
    body: ['/img/imprensa/reportagens-Tem.jpg']
  },
  'dr-eduardo-palestra-sobre-lei-de-alimentos-gravidicos': {
    featured: '/img/imprensa/alimentos_gravidicos.jpg',
    body: []
  },
  'um-ano-apos-tragedia-academia-em-s-bernardo-vira-deposito-de-entulho': {
    featured: '/img/imprensa/img01.jpg',
    body: []
  },
  'revista-expressao-ano-11-edicao-132-pag-56': {
    featured: '/img/imprensa/simposio_expressao.jpg',
    body: ['/img/imprensa/simposio_expressao.jpg']
  },
  'reporter-diario-moradores-vitimas-de-explosao-em-academia-temem-desabamentos': {
    featured: '/img/imprensa/post_evi.jpg',
    body: []
  },
  'entrevista-eduardo-verissimo-inocente-festa-15-anos-e-v-i-sociedade-de-advogados': {
    featured: '/img/imprensa/WhatsApp-Image-2018-06-06-at-12.11.04-1080x480.jpeg',
    body: []
  },
  'apos-um-ano-de-explosao-de-academia-moradores-ainda-esperam-o-pagamento-dos-prejuizos': {
    featured: '/img/imprensa/img02.jpg',
    body: []
  },
  'festa-de-15-anos-e-v-i-sociedade-de-advogados': {
    featured: '/img/imprensa/evi3-1130x480.jpg',
    body: []
  },
  'social-do-diario-escritorio-comemora-historia-entre-parceiros': {
    featured: '/img/imprensa/evi_15anos_dabc.jpg',
    body: []
  },
  'marcas-permanecem-em-vitimas-de-explosao-de-academia-na-pauliceia': {
    featured: '/img/imprensa/201751983534-1.jpg',
    body: []
  },
  'jornal-diario-do-grande-abc': {
    featured: '/img/imprensa/unnamed-900x480.jpg',
    body: []
  }
};

async function updateSupabase() {
  console.log('🔄 Verificando e atualizando matérias no Supabase...');
  const env = loadEnv();
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  const { data, error } = await supabase
    .from('site_contents')
    .select('*')
    .eq('page', 'imprensa')
    .eq('section', 'custom_articles');

  if (error) {
    console.error('Erro ao buscar custom_articles no Supabase:', error);
    return;
  }

  for (const row of data || []) {
    try {
      const parsed = JSON.parse(row.content_value);
      let updated = false;

      if (parsed.featuredImage && parsed.featuredImage.includes('wp-content')) {
        const match = imageMapping[parsed.slug];
        if (match) {
          console.log(`Atualizando featuredImage do Supabase para ${parsed.slug}: ${match.featured}`);
          parsed.featuredImage = match.featured;
          updated = true;
        }
      }

      if (Array.isArray(parsed.bodyImages) && parsed.bodyImages.some(img => img.includes('wp-content'))) {
        const match = imageMapping[parsed.slug];
        if (match && match.body) {
          console.log(`Atualizando bodyImages do Supabase para ${parsed.slug}`);
          parsed.bodyImages = match.body;
          updated = true;
        }
      }

      if (updated) {
        const { error: updateErr } = await supabase
          .from('site_contents')
          .update({ content_value: JSON.stringify(parsed) })
          .eq('id', row.id);

        if (updateErr) {
          console.error(`Erro ao atualizar linha ${row.id}:`, updateErr);
        } else {
          console.log(`✅ Registro ${row.field_key} atualizado no Supabase!`);
        }
      }
    } catch (e) {
      console.error(`Erro ao processar row ${row.id}:`, e);
    }
  }

  // Verifica imprensa_detail
  const { data: detailData } = await supabase
    .from('site_contents')
    .select('*')
    .eq('page', 'imprensa_detail');

  for (const row of detailData || []) {
    if (row.content_value && row.content_value.includes('wp-content')) {
      const match = imageMapping[row.section];
      if (match && row.field_key === 'featured_image') {
        await supabase
          .from('site_contents')
          .update({ content_value: match.featured })
          .eq('id', row.id);
        console.log(`✅ imprensa_detail override atualizado para ${row.section}`);
      }
    }
  }
}

function updatePressDataTs() {
  console.log('🔄 Atualizando lib/press-data.ts...');
  const filePath = path.resolve('lib/press-data.ts');
  let content = fs.readFileSync(filePath, 'utf8');

  for (const [slug, item] of Object.entries(imageMapping)) {
    // Regex para substituir featuredImage do slug correspondente
    // Encontra o bloco do slug
    const slugIndex = content.indexOf(`"slug": "${slug}"`);
    if (slugIndex !== -1) {
      const nextSlugIndex = content.indexOf(`"slug":`, slugIndex + 20);
      const endIndex = nextSlugIndex !== -1 ? nextSlugIndex : content.length;
      let block = content.slice(slugIndex, endIndex);

      // Substitui featuredImage
      block = block.replace(
        /"featuredImage":\s*"https?:\/\/[^"]+"/,
        `"featuredImage": "${item.featured}"`
      );

      // Substitui bodyImages se houver
      if (item.body && item.body.length > 0) {
        const bodyImgsJson = JSON.stringify(item.body);
        block = block.replace(
          /"bodyImages":\s*\[[^\]]*\]/,
          `"bodyImages": ${bodyImgsJson}`
        );
      }

      content = content.slice(0, slugIndex) + block + content.slice(endIndex);
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ lib/press-data.ts atualizado com sucesso!');
}

async function main() {
  updatePressDataTs();
  await updateSupabase();
  console.log('🎉 Todas as imagens de imprensa foram corrigidas!');
}

main();
