/**
 * Provedor de Imagens Gratuitas para os Artigos Jurídicos
 * Integração: Unsplash API + Fallback de Curadoria Temática de Alta Resolução
 */

const CURATED_IMAGES = {
  agronegocio: [
    {
      url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
      caption: 'Plantações e gestão estratégica de safras no agronegócio brasileiro.',
    },
    {
      url: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1200&q=80',
      caption: 'Tecnologia, lavoura e financiamento da produção agropecuária.',
    },
    {
      url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=80',
      caption: 'Maquinário e infraestrutura no campo: gestão de ativos e crédito.',
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
};

export async function fetchTopicImages(categorySlug, keywords = []) {
  const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;

  if (unsplashKey) {
    try {
      const query = (keywords[0] || categorySlug || 'business law').replace(/-/g, ' ');
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&orientation=landscape&per_page=5&client_id=${unsplashKey}`
      );
      if (res.ok) {
        const data = await res.json();
        if (data.results && data.results.length >= 3) {
          return {
            cover: data.results[0].urls.regular,
            body1: {
              url: data.results[1].urls.regular,
              caption: data.results[1].alt_description || 'Análise jurídica e contexto empresarial.',
            },
            body2: {
              url: data.results[2].urls.regular,
              caption: data.results[2].alt_description || 'Aplicação prática e estratégia jurídica sustentável.',
            },
          };
        }
      }
    } catch (e) {
      console.warn('Erro ao consultar Unsplash API, utilizando curadoria temática:', e.message);
    }
  }

export function getCuratedImages(categorySlug = '') {
  let catKey = 'recuperacao';
  if (categorySlug.includes('agro')) catKey = 'agronegocio';
  else if (categorySlug.includes('socie') || categorySlug.includes('contencioso')) catKey = 'societario';
  else if (categorySlug.includes('tribut')) catKey = 'tributario';
  else if (categorySlug.includes('imob')) catKey = 'imobiliario';

  const list = CURATED_IMAGES[catKey] || CURATED_IMAGES.recuperacao;

  return {
    cover: list[0].url,
    body1: list[1],
    body2: list[2],
  };
}

