/**
 * Provedor Inteligente de Imagens com Variedade Dinâmica para Artigos Jurídicos
 * Integração: Unsplash API Dinâmica + Anti-Repetição + Acervo Curado Expandido
 */

// Embaralha array com o algoritmo de Fisher-Yates
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Conjuntos semânticos variados em inglês para busca no Unsplash
const SEARCH_QUERY_POOLS = {
  agronegocio: [
    'modern agriculture tractor field',
    'grain silo harvest agribusiness',
    'soybean field plantation farming',
    'drone smart farm agriculture',
    'cattle ranch livestock agribusiness',
    'coffee plantation crops agriculture',
    'agricultural machinery harvester sunset',
    'agronomist inspecting field crops',
    'rural landscape farming aerial view',
    'farm contract agriculture business',
    'green field crops agribusiness sunny',
  ],
  recuperacao: [
    'corporate finance negotiation business',
    'corporate office skyscraper architecture',
    'business audit financial review documents',
    'executives conference room meeting boardroom',
    'corporate restructuring business crisis finance',
    'handshake business agreement corporate',
    'modern financial district city architecture',
    'business analytics strategic planning',
    'boardroom executives legal meeting',
  ],
  societario: [
    'corporate boardroom executive meeting',
    'business partners contract handshake',
    'corporate governance board meeting',
    'executive discussion office boardroom',
    'merger acquisition business deal agreement',
    'business contract signing fountain pen',
    'corporate executives legal strategy',
    'company partners meeting office',
  ],
  tributario: [
    'tax financial audit documents calculator',
    'corporate tax accounting financial documents',
    'business finance spreadsheet analysis',
    'financial audit corporate review balance',
    'revenue documents financial planning tax',
    'corporate fiscal planning business office',
  ],
  imobiliario: [
    'commercial real estate building modern architecture',
    'architectural skyscraper city urban glass',
    'construction site building project contract',
    'modern commercial property exterior design',
    'luxury real estate office building city',
  ],
  'direito-medico': [
    'hospital management clinic healthcare facility',
    'medical doctor consultation office professional',
    'modern hospital architecture interior bright',
    'healthcare compliance medical governance',
    'physicians consultation medical discussion clinic',
  ],
};

// Acervo Curado Expandido de Alta Resolução (Fallback sem repetição)
export const CURATED_IMAGES = {
  agronegocio: [
    {
      url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
      caption: 'Gestão estratégica de safras e lavouras no agronegócio brasileiro.',
    },
    {
      url: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1200&q=80',
      caption: 'Tecnologia, lavoura e financiamento da produção agropecuária.',
    },
    {
      url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=80',
      caption: 'Maquinário e infraestrutura no campo: gestão de ativos e crédito.',
    },
    {
      url: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=1200&q=80',
      caption: 'Colheitadeira operando em lavoura de grãos de alta produtividade.',
    },
    {
      url: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1200&q=80',
      caption: 'Silos industriais e estrutura de armazenagem de commodities agrícolas.',
    },
    {
      url: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=1200&q=80',
      caption: 'Cultivo de café e lavouras perenes de alto valor agregado.',
    },
    {
      url: 'https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?auto=format&fit=crop&w=1200&q=80',
      caption: 'Pecuária moderna e gestão criteriosa de pastagens e rebanhos.',
    },
    {
      url: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=1200&q=80',
      caption: 'Agricultura de precisão e monitoramento tecnológico da safra.',
    },
    {
      url: 'https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=1200&q=80',
      caption: 'Análise agronômica e conformidade regulatória nas propriedades rurais.',
    },
    {
      url: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=1200&q=80',
      caption: 'Vista aérea de áreas produtivas organizadas e preservadas.',
    },
    {
      url: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=1200&q=80',
      caption: 'Manejo sustentável e segurança jurídica da terra produtiva.',
    },
  ],
  recuperacao: [
    {
      url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      caption: 'Sede corporativa e estruturação financeira de companhias em momento de crise.',
    },
    {
      url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80',
      caption: 'Análise contábil, negociação de passivos e reestruturação com credores.',
    },
    {
      url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
      caption: 'Decisões colegiadas e preservação da liquidez operacional.',
    },
    {
      url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80',
      caption: 'Mesa de negociação estratégica com instituições financeiras e credores.',
    },
    {
      url: 'https://images.unsplash.com/photo-1520607164069-c5b042986117?auto=format&fit=crop&w=1200&q=80',
      caption: 'Reunião de diretoria executiva para validação de plano de reestruturação.',
    },
    {
      url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      caption: 'Ambiente empresarial focado em superação e continuidade das atividades.',
    },
    {
      url: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&w=1200&q=80',
      caption: 'Gestão de ativos operacionais e essencialidade de bens de capital.',
    },
    {
      url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
      caption: 'Auditoria forense e sustentabilidade jurídica do fluxo de pagamentos.',
    },
  ],
  societario: [
    {
      url: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80',
      caption: 'Acordos societários, resolução de disputas e governança corporativa.',
    },
    {
      url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80',
      caption: 'Alinhamento estratégico entre acionistas e diretoria jurídica.',
    },
    {
      url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
      caption: 'Planejamento e apuração criteriosa de haveres em empresas familiares.',
    },
    {
      url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
      caption: 'Governança e planejamento sucessório em grupos empresariais.',
    },
    {
      url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80',
      caption: 'Mediação jurídica preventiva em conflitos de controle societário.',
    },
    {
      url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80',
      caption: 'Auditoria prévia (Due Diligence) em transações societárias e M&A.',
    },
  ],
  tributario: [
    {
      url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
      caption: 'Auditoria tributária, conformidade fiscal e recuperação de créditos.',
    },
    {
      url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      caption: 'Demonstrações financeiras e impacto da transição da reforma tributária.',
    },
    {
      url: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80',
      caption: 'Otimização de custos fiscais e fluxo de caixa empresarial.',
    },
    {
      url: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=1200&q=80',
      caption: 'Planejamento tributário preventivo e mitigação de contingências fiscais.',
    },
    {
      url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80',
      caption: 'Estruturação contábil e fiscal de empresas de médio e grande porte.',
    },
  ],
  imobiliario: [
    {
      url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      caption: 'Due diligence em grandes aquisições fundiárias e imobiliárias.',
    },
    {
      url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
      caption: 'Regularização documental, contratos de construção e incorporações.',
    },
    {
      url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      caption: 'Segurança jurídica para investimentos imobiliários de alta monta.',
    },
  ],
  'direito-medico': [
    {
      url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
      caption: 'Gestão hospitalar e conformidade jurídica em estabelecimentos de saúde.',
    },
    {
      url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80',
      caption: 'Defesa ética e responsabilidade civil em procedimentos médicos complexos.',
    },
    {
      url: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1200&q=80',
      caption: 'Governança clínica e adequação de protocolos em clínicas de especialidades.',
    },
  ],
};

/**
 * Normaliza categoria para chave interna
 */
function getCategoryKey(categorySlug = '') {
  const cat = (categorySlug || '').toLowerCase();
  if (cat.includes('agro')) return 'agronegocio';
  if (cat.includes('recupera') || cat.includes('falencia')) return 'recuperacao';
  if (cat.includes('socie') || cat.includes('contrato') || cat.includes('societario')) return 'societario';
  if (cat.includes('tribut') || cat.includes('fiscal')) return 'tributario';
  if (cat.includes('imob')) return 'imobiliario';
  if (cat.includes('medico') || cat.includes('saude')) return 'direito-medico';
  return 'recuperacao';
}

/**
 * Extrai o ID da foto do Unsplash da URL para comparação confiável
 */
function extractPhotoId(url = '') {
  if (!url) return '';
  const match = url.match(/photo-([a-zA-Z0-9_-]+)/);
  return match ? match[1] : url.split('?')[0];
}

/**
 * Busca imagens temáticas garantindo variedade e evitando repetição
 * Suporta assinatura compatível: fetchTopicImages(categorySlug, keywords, options) ou fetchTopicImages(options)
 */
export async function fetchTopicImages(arg1 = '', arg2 = [], arg3 = {}) {
  let categorySlug = '';
  let keywords = [];
  let excludeUrls = [];
  let theme = '';
  let title = '';

  if (typeof arg1 === 'object' && arg1 !== null) {
    categorySlug = arg1.categorySlug || '';
    keywords = arg1.keywords || [];
    excludeUrls = arg1.excludeUrls || [];
    theme = arg1.theme || '';
    title = arg1.title || '';
  } else {
    categorySlug = arg1 || '';
    keywords = Array.isArray(arg2) ? arg2 : [];
    excludeUrls = arg3?.excludeUrls || [];
    theme = arg3?.theme || '';
    title = arg3?.title || '';
  }

  const unsplashKey =
    process.env.UNSPLASH_ACCESS_KEY ||
    process.env.UNSPLASH_Access_Key ||
    process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

  const catKey = getCategoryKey(categorySlug);
  const excludedIds = new Set(excludeUrls.map(extractPhotoId).filter(Boolean));

  if (unsplashKey) {
    try {
      // 1. Seleciona termo semântico dinâmico para a busca
      const pool = SEARCH_QUERY_POOLS[catKey] || SEARCH_QUERY_POOLS.recuperacao;
      let chosenQuery = pool[Math.floor(Math.random() * pool.length)];

      // Se houver palavras-chave contextuais do artigo, intercala para maior relevância
      if (keywords && keywords.length > 0 && Math.random() > 0.4) {
        const randomKw = keywords[Math.floor(Math.random() * keywords.length)]
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^\w\s]/g, ' ')
          .trim();
        if (randomKw.length > 3) {
          chosenQuery = `${chosenQuery} ${randomKw}`;
        }
      }

      // 2. Randomiza página e ordenação para trazer fotos inéditas
      const randomPage = Math.floor(Math.random() * 3) + 1; // páginas 1 a 3
      const orderBy = Math.random() > 0.5 ? 'relevant' : 'latest';

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          chosenQuery
        )}&orientation=landscape&per_page=20&page=${randomPage}&order_by=${orderBy}&client_id=${unsplashKey.trim()}`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        let results = data.results || [];

        if (results.length >= 3) {
          // Embaralha os resultados para que a mesma ordem nunca seja mantida
          const shuffled = shuffleArray(results);

          // Filtra fotos que já foram usadas recentemente como capa
          const nonRepeated = shuffled.filter((item) => {
            const id = extractPhotoId(item.urls?.regular);
            return !excludedIds.has(id);
          });

          // Se após o filtro sobrar pelo menos 3 fotos, usa as inéditas; caso contrário, usa shuffled
          const finalPool = nonRepeated.length >= 3 ? nonRepeated : shuffled;

          const coverItem = finalPool[0];
          const body1Item = finalPool[1] || shuffled[1];
          const body2Item = finalPool[2] || shuffled[2];

          const cap1 =
            body1Item.description ||
            body1Item.alt_description ||
            'Alinhamento técnico e análise documental estratégica.';
          const cap2 =
            body2Item.description ||
            body2Item.alt_description ||
            'Segurança jurídica e governança corporativa no cenário brasileiro.';

          console.log(
            `[ImageProvider] Unsplash selecionou 3 fotos dinâmicas para "${catKey}" (termo: "${chosenQuery}", pág: ${randomPage}). Capa ID: ${extractPhotoId(
              coverItem.urls.regular
            )}`
          );

          return {
            cover: coverItem.urls.regular,
            body1: {
              url: body1Item.urls.regular,
              caption: cap1.length > 110 ? cap1.slice(0, 107) + '...' : cap1,
            },
            body2: {
              url: body2Item.urls.regular,
              caption: cap2.length > 110 ? cap2.slice(0, 107) + '...' : cap2,
            },
          };
        }
      }
    } catch (e) {
      console.warn(
        '[ImageProvider] Aviso: Consulta na Unsplash API falhou ou excedeu timeout, acionando curadoria dinâmica:',
        e?.message || e
      );
    }
  }

  // Fallback curado expandido e sem repetição
  return getCuratedImages(categorySlug, excludeUrls);
}

/**
 * Retorna imagens do acervo curado com sorteio aleatório e verificação de repetição
 */
export function getCuratedImages(categorySlug = '', excludeUrls = []) {
  const catKey = getCategoryKey(categorySlug);
  const baseList = CURATED_IMAGES[catKey] || CURATED_IMAGES.recuperacao;
  const excludedIds = new Set(excludeUrls.map(extractPhotoId).filter(Boolean));

  // Embaralha o acervo curado
  const shuffled = shuffleArray(baseList);

  // Tenta selecionar fotos que não estejam no histórico recente
  const nonRepeated = shuffled.filter((item) => !excludedIds.has(extractPhotoId(item.url)));
  const finalPool = nonRepeated.length >= 3 ? nonRepeated : shuffled;

  console.log(
    `[ImageProvider] Curadoria dinâmica selecionou fotos para "${catKey}". Capa ID: ${extractPhotoId(
      finalPool[0].url
    )}`
  );

  return {
    cover: finalPool[0].url,
    body1: finalPool[1] || shuffled[1],
    body2: finalPool[2] || shuffled[2],
  };
}
