import { fetchTopicImages } from '../lib/image-provider.mjs';

async function testVariety() {
  console.log('--- Iniciando Teste de Variedade Contínua de Imagens (Agronegócio) ---');
  const seenCovers = [];

  const scenarios = [
    {
      categorySlug: 'agronegocio',
      keywords: ['crédito rural', 'alongamento de dívida'],
      theme: 'Alongamento de dívidas bancárias do produtor rural',
      title: 'Estratégias para Alongamento de Dívidas no Agro',
    },
    {
      categorySlug: 'agronegocio',
      keywords: ['CPR financeira', 'títulos do agro'],
      theme: 'Emissão e segurança jurídica da CPR Financeira',
      title: 'A Segurança Jurídica da CPR no Financiamento da Safra',
    },
    {
      categorySlug: 'agronegocio',
      keywords: ['recuperação judicial agro', 'frustração de safra'],
      theme: 'Recuperação judicial do produtor rural pessoa física',
      title: 'A Nova Fase da Recuperação Judicial do Produtor Rural',
    },
    {
      categorySlug: 'agronegocio',
      keywords: ['insumos agrícolas', 'essencialidade de maquinário'],
      theme: 'Blindagem de maquinários e bens de capital na lavoura',
      title: 'A Essencialidade dos Maquinários Agrícolas nas Execuções',
    },
  ];

  for (let i = 0; i < scenarios.length; i++) {
    const s = scenarios[i];
    console.log(`\n[Teste ${i + 1}/${scenarios.length}] Tema: "${s.title}"`);
    console.log(`Excluindo ${seenCovers.length} capa(s) anteriores...`);

    const result = await fetchTopicImages({
      ...s,
      excludeUrls: seenCovers,
    });

    console.log(`-> Capa selecionada: ${result.cover.slice(0, 80)}...`);
    console.log(`-> Imagem Corpo 1:   ${result.body1.url.slice(0, 80)}...`);
    console.log(`-> Imagem Corpo 2:   ${result.body2.url.slice(0, 80)}...`);

    if (seenCovers.includes(result.cover)) {
      console.error(`❌ FALHA: A capa foi repetida! URL: ${result.cover}`);
      process.exit(1);
    } else {
      console.log('✔ SUCESSO: Capa inédita e diferente das anteriores!');
    }

    seenCovers.push(result.cover);
  }

  console.log('\n=============================================');
  console.log(`✔ TOTAL DE CAPAS TESTADAS: ${seenCovers.length}`);
  console.log(`✔ TODAS AS ${seenCovers.length} CAPAS SÃO 100% DISTINTAS E INÉDITAS!`);
  console.log('=============================================');
}

testVariety().catch((e) => {
  console.error('Erro no teste de variedade:', e);
  process.exit(1);
});
