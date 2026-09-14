export interface TopicBlueprint {
  title: string;
  categorySlug: string;
  categoryName: string;
  excerpt: string;
  keywords: string[];
  targetAudience: string;
}

export const INITIAL_EDITORIAL_TOPICS: TopicBlueprint[] = [
  // Eixo 1: Recuperação Judicial & Insolvência
  {
    title: 'Recuperação Judicial no Agronegócio: Requisitos e Jurisprudência do STJ',
    categorySlug: 'recuperacao-judicial',
    categoryName: 'Recuperação Judicial & Falências',
    excerpt: 'Análise profunda sobre a evolução jurisprudencial que viabilizou o acesso do produtor rural pessoa física ao instituto da recuperação judicial sem a exigência de dois anos prévios de registro na Junta Comercial.',
    keywords: ['recuperação judicial agronegócio', 'produtor rural STJ', 'reestruturação de dívidas agrícolas'],
    targetAudience: 'Produtores rurais, diretores financeiros e gestores do agro',
  },
  {
    title: 'Trava Bancária e Cessão Fiduciária na Recuperação Judicial: Limites e Exceções',
    categorySlug: 'recuperacao-judicial',
    categoryName: 'Recuperação Judicial & Falências',
    excerpt: 'Como estruturar a liquidez da empresa em crise diante de recebíveis travados por instituições financeiras e quais medidas judiciais podem ser pleiteadas para garantir o capital de giro.',
    keywords: ['trava bancária', 'cessão fiduciária', 'créditos extraconcursais', 'capital de giro'],
    targetAudience: 'Diretores financeiros e controllers empresariais',
  },
  {
    title: 'DIP Financing no Brasil: Como Financiar a Empresa Durante a Recuperação',
    categorySlug: 'recuperacao-judicial',
    categoryName: 'Recuperação Judicial & Falências',
    excerpt: 'O papel do financiamento pós-pedido (Debtor-in-Possession) na nova lei 14.112/2020: garantias, prioridade no recebimento e atração de fundos de Special Situations.',
    keywords: ['DIP financing', 'financiamento recuperação judicial', 'fundos special situations'],
    targetAudience: 'Investidores institucionais e CFOs',
  },
  {
    title: 'Blindagem Patrimonial Legal dos Sócios na Crise Empresarial',
    categorySlug: 'recuperacao-judicial',
    categoryName: 'Recuperação Judicial & Falências',
    excerpt: 'Os limites estritos entre o patrimônio social da empresa e os bens particulares dos administradores, à luz da desconsideração da personalidade jurídica no Código Civil.',
    keywords: ['blindagem patrimonial lícita', 'desconsideração da personalidade jurídica', 'proteção patrimonial'],
    targetAudience: 'Sócios e acionistas de médias e grandes empresas',
  },

  // Eixo 2: Agronegócio & Financiamento Rural
  {
    title: 'Cédula de Produto Rural (CPR): Novas Regras e Execução de Garantias',
    categorySlug: 'agronegocio',
    categoryName: 'Agronegócio & Títulos de Crédito',
    excerpt: 'Impactos da Lei do Agro nas emissões de CPR física e financeira, patrimônio de afetação e estratégias defensivas frente a quebras de safra decorrentes de fatores climáticos.',
    keywords: ['CPR financeira', 'lei do agro', 'execução CPR', 'frustração de safra'],
    targetAudience: 'Cooperativas agropecuárias, tradings e produtores rurais',
  },
  {
    title: 'Alongamento de Dívidas Agrícolas (Manual de Crédito Rural e Súmula 298 do STJ)',
    categorySlug: 'agronegocio',
    categoryName: 'Agronegócio & Títulos de Crédito',
    excerpt: 'O direito subjetivo do produtor rural à prorrogação dos prazos de vencimento dos financiamentos agrícolas em razão de frustração de safra ou desaquecimento de preços.',
    keywords: ['alongamento de dívida rural', 'súmula 298 STJ', 'manual de crédito rural'],
    targetAudience: 'Produtores rurais e cooperativas',
  },
  {
    title: 'Fiagro e a Captação no Mercado de Capitais: Riscos Jurídicos e Oportunidades',
    categorySlug: 'agronegocio',
    categoryName: 'Agronegócio & Títulos de Crédito',
    excerpt: 'Como os Fundos de Investimento nas Cadeias Produtivas Agroindustriais operam, principais exigências de compliance fundiário e securitização de recebíveis.',
    keywords: ['Fiagro mercado capitais', 'securitização agrícola', 'CRA'],
    targetAudience: 'Fundos de investimento e agroindústrias',
  },

  // Eixo 3: Contencioso Estratégico & Societário
  {
    title: 'Dissolução Parcial de Sociedade e Apuração de Haveres em Empresas Familiares',
    categorySlug: 'contencioso-estrategico',
    categoryName: 'Contencioso Estratégico & Societário',
    excerpt: 'Metodologias contábeis e judiciais para precificar as quotas do sócio retirante ou falecido sem asfixiar o caixa operacional da companhia.',
    keywords: ['dissolução societária', 'apuração de haveres', 'empresa familiar'],
    targetAudience: 'Acionistas, herdeiros e conselheiros de administração',
  },
  {
    title: 'Arbitragem vs. Judiciário em Contratos Comerciais Complexos: Custos e Benefícios',
    categorySlug: 'contencioso-estrategico',
    categoryName: 'Contencioso Estratégico & Societário',
    excerpt: 'Critérios estratégicos para a inserção de cláusula compromissória arbitral em transações M&A e contratos de fornecimento continuado.',
    keywords: ['arbitragem empresarial', 'cláusula compromissória', 'contencioso M&A'],
    targetAudience: 'Diretores jurídicos e investidores',
  },

  // Eixo 4: Direito Tributário Empresarial
  {
    title: 'Reforma Tributária e o Agronegócio: Regimes Especiais e Transição',
    categorySlug: 'tributario-empresarial',
    categoryName: 'Direito Tributário Empresarial',
    excerpt: 'Como a unificação dos tributos de consumo (IBS e CBS) e as alíquotas reduzidas impactarão o custo dos insumos, máquinas agrícolas e exportação.',
    keywords: ['reforma tributária agro', 'IBS CBS insumos agrícolas', 'planejamento tributário'],
    targetAudience: 'CFOs, contadores corporativos e empresários rurais',
  },
  {
    title: 'Exclusão do ICMS da Base de Cálculo do PIS/COFINS e Teses Filhotes',
    categorySlug: 'tributario-empresarial',
    categoryName: 'Direito Tributário Empresarial',
    excerpt: 'O aproveitamento de créditos fiscais e as oportunidades remanescentes de recuperação tributária para empresas no Lucro Real e Presumido.',
    keywords: ['tese do século', 'exclusão ICMS PIS COFINS', 'créditos tributários'],
    targetAudience: 'Diretores fiscais e gerentes de tributos',
  },

  // Eixo 5: Direito Imobiliário & Infraestrutura
  {
    title: 'Due Diligence Imobiliária na Compra e Venda de Imóveis Rurais e Fazendas',
    categorySlug: 'imobiliario-infraestrutura',
    categoryName: 'Direito Imobiliário & Infraestrutura',
    excerpt: 'Checklist rigoroso de conformidade fundiária, CAR, Georreferenciamento (SIGEF), sobreposições e passivos ambientais em grandes aquisições.',
    keywords: ['due diligence imobiliária', 'compra de fazendas', 'CAR SIGEF regularização'],
    targetAudience: 'Investidores fundiários, incorporadoras e agroindústrias',
  }
];
