export interface BlogArticle {
  id?: string;
  slug: string;
  title: string;
  category: string;
  categorySlug: string;
  date: string;
  publishedAt: string;
  readingTime: number;
  featuredImage: string;
  excerpt: string;
  paragraphs: string[];
  content?: string;
  isFeatured?: boolean;
  subsections?: {
    subtitle: string;
    paragraphs: string[];
  }[];
  bodyImages?: {
    url: string;
    caption: string;
  }[];
  author: {
    name: string;
    role: string;
    oab?: string;
    avatar: string;
    bio?: string;
  };
  keywords: string[];
}

export const BLOG_ARTICLES: BlogArticle[] = [
  // --- Eixo 1: Recuperação Judicial & Falências ---
  {
    slug: 'recuperacao-judicial-no-agronegocio-requisitos-e-jurisprudencia-do-stj',
    title: 'Recuperação Judicial no Agronegócio: Requisitos e Jurisprudência do STJ',
    category: 'Recuperação Judicial & Falências',
    categorySlug: 'recuperacao-judicial',
    date: '10 de março de 2024',
    publishedAt: '2024-03-10',
    readingTime: 7,
    featuredImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'Análise aprofundada sobre a evolução jurisprudencial que viabilizou o acesso do produtor rural pessoa física ao instituto da recuperação judicial sem a exigência de dois anos prévios de registro na Junta Comercial.',
    author: {
      name: 'Dr. Eduardo Veríssimo Inocente',
      role: 'Sócio-Fundador & Diretor Jurídico',
      oab: 'OAB/SP 200.334',
      avatar: '/img/01.png',
      bio: 'Mais de 25 anos de vanguarda no Direito Empresarial, referência nacional em Recuperação Judicial, Reestruturação de Dívidas e Agronegócio.',
    },
    keywords: ['recuperação judicial agronegócio', 'produtor rural STJ', 'reestruturação de dívidas agrícolas', 'lei 14112'],
    paragraphs: [
      'A expansão e a sofisticação do agronegócio nacional nos últimos anos trouxeram consigo desafios financeiros de magnitude sem precedentes. Flutuações drásticas nas cotações internacionais de commodities, quebras de safra impulsionadas por eventos climáticos extremos e o encarecimento das linhas de crédito rural colocaram produtores de grande e médio porte diante de severos estrangulamentos de liquidez.',
      'Historicamente, debatia-se nos tribunais a legitimidade do produtor rural pessoa física para se socorrer da Recuperação Judicial regida pela Lei nº 11.101/2005. O ponto central da divergência residia no art. 48 do diploma legal, que exige o exercício regular das atividades empresariais há mais de dois anos. Instituições financeiras sustentavam que tal lapso temporal deveria ser contado estritamente a partir da formalização da inscrição no Registro Público de Empresas Mercantis (Junta Comercial).',
      'Essa controvérsia foi definitivamente superada pelo Superior Tribunal de Justiça (STJ), notadamente com o julgamento do emblemático Recurso Especial nº 1.800.032/MT e consolidada com o advento da Lei nº 14.112/2020. O STJ firmou a tese de que o registro do produtor rural possui natureza meramente declaratória — e não constitutiva —, bastando a comprovação documental do exercício efetivo da atividade agrária profissional durante o biênio anterior ao pedido.',
    ],
    subsections: [
      {
        subtitle: 'Submissão de Créditos Anteriores e a Blindagem Operacional',
        paragraphs: [
          'Com a consolidação legislativa do art. 48, § 2º, e art. 49 da Lei 11.101/2005, apenas os créditos decorrentes exclusivamente da atividade rural e expressamente discriminados na contabilidade ou livros fiscais submetem-se aos efeitos da recuperação.',
          'Essa blindagem assegura a manutenção dos bens de capital essenciais à colheita e ao escoamento da produção durante o período de stay period (suspensão de 180 dias, prorrogável). O produtor rural ganha o fôlego necessário para renegociar contratos de fornecimento, travar execuções desordenadas e apresentar um plano de soerguimento financeiro sustentável.',
        ],
      },
      {
        subtitle: 'Conclusão Estratégica para Produtores e Gestores do Campo',
        paragraphs: [
          'A recuperação judicial no agro não pode ser encarada como uma medida desesperada, mas como uma ferramenta sofisticada de engenharia jurídica e financeira. A correta escrituração dos livros contábeis, a segregação de passivos pessoais e a assessoria jurídica especializada desde a fase pré-processual são determinantes para afastar questionamentos bancários e viabilizar a aprovação do plano de recuperação com ampla maioria de credores.',
        ],
      },
    ],
    bodyImages: [
      {
        url: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1200&q=80',
        caption: 'Gestão preventiva de passivos e proteção de ativos produtivos na atividade agrícola.',
      },
    ],
  },
  {
    slug: 'trava-bancaria-e-cessao-fiduciaria-na-recuperacao-judicial-limites-e-excecoes',
    title: 'Trava Bancária e Cessão Fiduciária na Recuperação Judicial: Limites e Exceções',
    category: 'Recuperação Judicial & Falências',
    categorySlug: 'recuperacao-judicial',
    date: '18 de março de 2024',
    publishedAt: '2024-03-18',
    readingTime: 6,
    featuredImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'Como estruturar a liquidez da empresa em crise diante de recebíveis travados por instituições financeiras e quais medidas judiciais podem ser pleiteadas para garantir o capital de giro.',
    author: {
      name: 'Dr. Eduardo Veríssimo Inocente',
      role: 'Sócio-Fundador & Diretor Jurídico',
      oab: 'OAB/SP 200.334',
      avatar: '/img/01.png',
      bio: 'Mais de 25 anos de vanguarda no Direito Empresarial, referência nacional em Recuperação Judicial, Reestruturação de Dívidas e Agronegócio.',
    },
    keywords: ['trava bancária', 'cessão fiduciária', 'créditos extraconcursais', 'capital de giro', 'bens essenciais'],
    paragraphs: [
      'A chamada "trava bancária", juridicamente consubstanciada na cessão fiduciária de direitos creditórios e recebíveis futuros, constitui uma das garantias prediletas das instituições financeiras brasileiras. Por força do art. 49, § 3º, da Lei 11.101/2005, o crédito garantido por alienação ou cessão fiduciária não se sujeita aos efeitos da recuperação judicial.',
      'Na prática diária corporativa, essa exceção legal representa a retenção automática, pelos bancos credores, de todo o fluxo de caixa proveniente das vendas a prazo da empresa recuperanda. Essa asfixia financeira imediata inviabiliza o pagamento da folha de salários, fornecedores críticos de matéria-prima e tributos correntes, comprometendo o objetivo maior da preservação da empresa.',
      'No entanto, a jurisprudência especializada do STJ e dos Tribunais de Justiça estaduais desenvolveu parâmetros rigorosos para a higidez da cessão fiduciária, abrindo margem para defesas táticas de grande impacto.',
    ],
    subsections: [
      {
        subtitle: 'Formalização e Individualização dos Títulos Cedidos',
        paragraphs: [
          'Para que a cessão fiduciária goze da prerrogativa da extraconcursalidade, exige-se a individualização clara e expressa dos títulos de crédito ou contas vinculadas no instrumento contratual, além do devido registro perante o Cartório de Títulos e Documentos competente.',
          'Cessões genéricas de recebíveis futuros sem a identificação precisa dos devedores ou duplicatas frequentemente são reclassificadas pelo Poder Judiciário como créditos quirografários, devolvendo ao caixa da recuperanda valores vultosos retidos indevidamente pelo sistema bancário.',
        ],
      },
      {
        subtitle: 'A Cláusula de Essencialidade do Capital de Giro',
        paragraphs: [
          'A aplicação do princípio da preservação da empresa permite aos magistrados determinar a liberação parcial e controlada dos saldos retidos quando demonstrada a essencialidade absoluta daqueles recursos para a manutenção da atividade operacional e cumprimento do plano de recuperação.',
        ],
      },
    ],
    bodyImages: [
      {
        url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80',
        caption: 'Análise contábil, negociação de passivos e liberação de liquidez na recuperação judicial.',
      },
    ],
  },
  {
    slug: 'dip-financing-no-brasil-como-financiar-a-empresa-durante-a-recuperacao',
    title: 'DIP Financing no Brasil: Como Financiar a Empresa Durante a Recuperação',
    category: 'Recuperação Judicial & Falências',
    categorySlug: 'recuperacao-judicial',
    date: '25 de março de 2024',
    publishedAt: '2024-03-25',
    readingTime: 6,
    featuredImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'O papel do financiamento pós-pedido (Debtor-in-Possession) na nova lei 14.112/2020: garantias, prioridade no recebimento e atração de fundos de Special Situations.',
    author: {
      name: 'Dr. Eduardo Veríssimo Inocente',
      role: 'Sócio-Fundador & Diretor Jurídico',
      oab: 'OAB/SP 200.334',
      avatar: '/img/01.png',
      bio: 'Mais de 25 anos de vanguarda no Direito Empresarial, referência nacional em Recuperação Judicial, Reestruturação de Dívidas e Agronegócio.',
    },
    keywords: ['DIP financing', 'financiamento recuperação judicial', 'fundos special situations', 'lei 14112'],
    paragraphs: [
      'Um dos maiores entraves históricos à recuperação judicial no Brasil era a escassez crônica de novo capital durante o processo. Tradicionalmente, bancos comerciais encerravam limites de crédito e recusavam qualquer nova injeção de recursos para devedores em recuperação judicial.',
      'A reforma introduzida pela Lei 14.112/2020 institucionalizou o modelo anglo-saxão de DIP Financing (Debtor-in-Possession), disciplinado expressamente nos artigos 69-A a 69-F da Lei de Recuperação de Empresas e Falências.',
      'Essa inovação legislativa conferiu ao financiador do devedor privilégios de pagamento absolutos, posicionando o novo crédito como extraconcursal superprioritário em caso de eventual convolação em falência, além de autorizar a oneração de bens do ativo não circulante mediante autorização judicial.',
    ],
    subsections: [
      {
        subtitle: 'Atração de Fundos de Investimento e Special Situations',
        paragraphs: [
          'A segurança jurídica proporcionada pela Lei 14.112/2020 atraiu fundos internacionais e gestoras brasileiras de Special Situations focadas em ativos estressados. A constituição de garantias de primeira ordem (inclusive subordinadas) confere robustez jurídica às operações de empréstimo pontual para reativação de linhas produtivas.',
        ],
      },
    ],
  },
  {
    slug: 'blindagem-patrimonial-legal-dos-socios-na-crise-empresarial',
    title: 'Blindagem Patrimonial Legal dos Sócios na Crise Empresarial',
    category: 'Recuperação Judicial & Falências',
    categorySlug: 'recuperacao-judicial',
    date: '02 de abril de 2024',
    publishedAt: '2024-04-02',
    readingTime: 6,
    featuredImage: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'Os limites estritos entre o patrimônio social da empresa e os bens particulares dos administradores, à luz da desconsideração da personalidade jurídica no Código Civil.',
    author: {
      name: 'Dr. Eduardo Veríssimo Inocente',
      role: 'Sócio-Fundador & Diretor Jurídico',
      oab: 'OAB/SP 200.334',
      avatar: '/img/01.png',
      bio: 'Mais de 25 anos de vanguarda no Direito Empresarial, referência nacional em Recuperação Judicial, Reestruturação de Dívidas e Agronegócio.',
    },
    keywords: ['blindagem patrimonial lícita', 'desconsideração da personalidade jurídica', 'proteção patrimonial', 'artigo 50 código civil'],
    paragraphs: [
      'Momentos de retração e turbulência corporativa geram apreensão natural nos sócios e administradores quanto à segurança de seu patrimônio familiar. A confusão patrimonial e o risco de desconsideração da personalidade jurídica figuram no topo das preocupações dos fundadores.',
      'Com as modificações trazidas pela Lei da Liberdade Econômica (Lei nº 13.874/2019) no artigo 50 do Código Civil, o ordenamento jurídico brasileiro passou a exigir requisitos estritos e cumulativos para a desconsideração: a inequívoca comprovação de desvio de finalidade ou confusão patrimonial dolosa.',
      'O simples encerramento irregular ou a insuficiência patrimonial da sociedade não autorizam, de forma automática, a invasão do patrimônio pessoal dos sócios nas relações civis e comerciais típicas.',
    ],
    subsections: [
      {
        subtitle: 'Estruturação Lícita via Holdings e Governança Familiar',
        paragraphs: [
          'A segregação eficiente de ativos imobiliários, a constituição de holdings patrimoniais e a adoção de boas práticas contábeis afastam os riscos de contaminação e garantem a perenidade do legado familiar sem ferir a boa-fé e os direitos legítimos de credores.',
        ],
      },
    ],
  },

  // --- Eixo 2: Agronegócio & Crédito Rural ---
  {
    slug: 'cedula-de-produto-rural-cpr-novas-regras-e-execucao-de-garantias',
    title: 'Cédula de Produto Rural (CPR): Novas Regras e Execução de Garantias',
    category: 'Agronegócio & Títulos de Crédito',
    categorySlug: 'agronegocio',
    date: '14 de abril de 2024',
    publishedAt: '2024-04-14',
    readingTime: 7,
    featuredImage: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'Impactos da Lei do Agro nas emissões de CPR física e financeira, patrimônio de afetação e estratégias defensivas frente a quebras de safra decorrentes de fatores climáticos.',
    author: {
      name: 'Dr. Eduardo Veríssimo Inocente',
      role: 'Sócio-Fundador & Diretor Jurídico',
      oab: 'OAB/SP 200.334',
      avatar: '/img/01.png',
      bio: 'Mais de 25 anos de vanguarda no Direito Empresarial, referência nacional em Recuperação Judicial, Reestruturação de Dívidas e Agronegócio.',
    },
    keywords: ['CPR financeira', 'lei do agro', 'execução CPR', 'frustração de safra', 'títulos do agro'],
    paragraphs: [
      'A Cédula de Produto Rural (CPR), instituída originalmente pela Lei nº 8.929/1994 e profundamente modernizada pelas Leis nº 13.986/2020 e 14.421/2022 (conhecidas como Nova Lei do Agro), representa hoje o principal instrumento de captação de recursos privados no campo.',
      'A emissão de CPR física (com entrega do produto) ou financeira (com liquidação monetária) foi ampliada para contemplar atividades florestais, derivados e serviços ambientais, além de exigir registro obrigatório em entidades autorizadas pelo Banco Central, como a B3.',
      'No entanto, nos ciclos agrícolas marcados por adversidades climáticas agudas (secas severas, geadas e fenômenos climáticos globais), a execução precipitada dessas garantias por tradings e revendas de insumos pode inviabilizar completamente as safras subsequentes do produtor.',
    ],
    subsections: [
      {
        subtitle: 'Teoria da Imprevisão e Quebra Involuntária de Safra',
        paragraphs: [
          'Diante da impossibilidade física de entrega da produção gerada por caso fortuito ou força maior com laudos agronômicos probatórios, a defesa jurídica estratégica possibilita a suspensão de medidas executivas agressivas e a renegociação dos cronogramas de liquidação, evitando expropriações patrimoniais danosas.',
        ],
      },
    ],
    bodyImages: [
      {
        url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
        caption: 'Emissão e estruturação segura de títulos do agronegócio com respaldo jurídico especializado.',
      },
    ],
  },
  {
    slug: 'alongamento-de-dividas-agricolas-manual-de-credito-rural-e-sumula-298-do-stj',
    title: 'Alongamento de Dívidas Agrícolas (Manual de Crédito Rural e Súmula 298 do STJ)',
    category: 'Agronegócio & Títulos de Crédito',
    categorySlug: 'agronegocio',
    date: '22 de abril de 2024',
    publishedAt: '2024-04-22',
    readingTime: 6,
    featuredImage: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'O direito subjetivo do produtor rural à prorrogação dos prazos de vencimento dos financiamentos agrícolas em razão de frustração de safra ou desaquecimento de preços.',
    author: {
      name: 'Dr. Eduardo Veríssimo Inocente',
      role: 'Sócio-Fundador & Diretor Jurídico',
      oab: 'OAB/SP 200.334',
      avatar: '/img/01.png',
      bio: 'Mais de 25 anos de vanguarda no Direito Empresarial, referência nacional em Recuperação Judicial, Reestruturação de Dívidas e Agronegócio.',
    },
    keywords: ['alongamento de dívida rural', 'súmula 298 STJ', 'manual de crédito rural', 'crédito agrícola'],
    paragraphs: [
      'A atividade agropecuária está permanentemente sujeita a riscos biológicos, fitossanitários e climáticos alheios à vontade do empreendedor do campo. Por essa razão, a legislação de crédito rural brasileira não trata a prorrogação das dívidas rurais como mera concessão benevolente das instituições financeiras, mas como um autêntico direito subjetivo do produtor.',
      'O Superior Tribunal de Justiça consagrou esse entendimento através do enunciado da Súmula 298: "O alongamento de dívida originada de crédito rural não constitui faculdade da instituição financeira, mas, sim, direito do devedor nos termos da lei".',
      'O Manual de Crédito Rural (MCR 2.6.4), editado pelo Conselho Monetário Nacional, prevê expressamente a prorrogação obrigatória dos débitos quando comprovada a frustração de safras, a impossibilidade de comercialização dos produtos decorrente de desaquecimento acentuado de preços de mercado ou despesas extraordinárias.',
    ],
    subsections: [
      {
        subtitle: 'Notificação Prévia e Prova Pericial Agronômica',
        paragraphs: [
          'Para assegurar a efetividade do alongamento, o produtor deve formalizar o pedido administrativo antes da data de vencimento da operação bancária, instruindo-o com laudo técnico emitido por engenheiro agrônomo e plano de capacidade de pagamento futura. Em caso de recusa arbitrária do agente bancário, medidas judiciais urgentes com tutela de urgência resguardam as garantias e o rating bancário do produtor.',
        ],
      },
    ],
  },
  {
    slug: 'fiagro-e-a-captacao-no-mercado-de-capitais-riscos-juridicos-e-oportunidades',
    title: 'Fiagro e a Captação no Mercado de Capitais: Riscos Jurídicos e Oportunidades',
    category: 'Agronegócio & Títulos de Crédito',
    categorySlug: 'agronegocio',
    date: '30 de abril de 2024',
    publishedAt: '2024-04-30',
    readingTime: 6,
    featuredImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'Como os Fundos de Investimento nas Cadeias Produtivas Agroindustriais operam, principais exigências de compliance fundiário e securitização de recebíveis.',
    author: {
      name: 'Dr. Eduardo Veríssimo Inocente',
      role: 'Sócio-Fundador & Diretor Jurídico',
      oab: 'OAB/SP 200.334',
      avatar: '/img/01.png',
      bio: 'Mais de 25 anos de vanguarda no Direito Empresarial, referência nacional em Recuperação Judicial, Reestruturação de Dívidas e Agronegócio.',
    },
    keywords: ['Fiagro mercado capitais', 'securitização agrícola', 'CRA', 'compliance fundiário'],
    paragraphs: [
      'A consolidação dos Fiagros (Fundos de Investimento nas Cadeias Produtivas Agroindustriais), criados pela Lei nº 14.130/2021, revolucionou a matriz de financiamento do agronegócio no Brasil, reduzindo a dependência histórica dos recursos governamentais subsidiados do Plano Safra.',
      'Os Fiagros permitem a conexão direta entre investidores do mercado de capitais e tomadores de recursos agrícolas, seja através da aquisição de imóveis rurais (Fiagro-Imobiliário), participações societárias (Fiagro-FIP) ou títulos de crédito como CRAs e CPRs (Fiagro-Direitos Creditórios).',
      'Essa sofisticação exige, contudo, um rigoroso arcabouço de governança jurídica e auditoria documental prévia em cada emissão.',
    ],
    subsections: [
      {
        subtitle: 'Auditoria Socioambiental e Mitigação de Riscos de Titularidade',
        paragraphs: [
          'A conformidade fundiária (análise de cadeia dominial centenária, CAR ativo e sem sobreposição em áreas de conservação ou terras indígenas) é condição indispensável para a aceitação e rating dos títulos nos mercados secundários.',
        ],
      },
    ],
  },

  // --- Eixo 3: Contencioso Estratégico & Societário ---
  {
    slug: 'dissolucao-parcial-de-sociedade-e-apuracao-de-haveres-em-empresas-familiares',
    title: 'Dissolução Parcial de Sociedade e Apuração de Haveres em Empresas Familiares',
    category: 'Contencioso Estratégico & Societário',
    categorySlug: 'contencioso-estrategico',
    date: '08 de maio de 2024',
    publishedAt: '2024-05-08',
    readingTime: 6,
    featuredImage: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'Metodologias contábeis e judiciais para precificar as quotas do sócio retirante ou falecido sem asfixiar o caixa operacional da companhia.',
    author: {
      name: 'Dr. Eduardo Veríssimo Inocente',
      role: 'Sócio-Fundador & Diretor Jurídico',
      oab: 'OAB/SP 200.334',
      avatar: '/img/01.png',
      bio: 'Mais de 25 anos de vanguarda no Direito Empresarial, referência nacional em Recuperação Judicial, Reestruturação de Dívidas e Agronegócio.',
    },
    keywords: ['dissolução societária', 'apuração de haveres', 'empresa familiar', 'balanço de determinação'],
    paragraphs: [
      'Empresas familiares constituem a espinha dorsal da economia brasileira. No entanto, os processos sucessórios intergeracionais e as divergências sobre os rumos do negócio frequentemente culminam na quebra da affectio societatis entre os membros da família ou sócios minoritários.',
      'Quando o consenso torna-se inalcançável, o instituto da dissolução parcial da sociedade, regulamentado pelos artigos 599 a 609 do Código de Processo Civil, viabiliza a saída ordenada de sócios ou a liquidação da quota do titular falecido.',
      'O maior ponto de tensão reside na apuração de haveres: determinar o valor justo da participação sem sangrar o capital de giro necessário para manter a empresa operacional.',
    ],
    subsections: [
      {
        subtitle: 'Balanço de Determinação vs. Fluxo de Caixa Descontado',
        paragraphs: [
          'A jurisprudência pacificada do Superior Tribunal de Justiça estabelece que, ressalvada disposição contratual unânime em contrário, a apuração deve ser realizada mediante a elaboração de balanço de determinação na data da resolução, avaliando-se bens corpóreos e incorpóreos (intangíveis) a preço de saída de mercado.',
          'Um acordo de acionistas bem desenhado prevê prazos estendidos de pagamento e parcelamento escalonado, preservando a liquidez corporativa e prevenindo litígios judiciais desgastantes.',
        ],
      },
    ],
    bodyImages: [
      {
        url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
        caption: 'Governança corporativa, apuração de quotas e preservação da harmonia societária.',
      },
    ],
  },
  {
    slug: 'arbitragem-vs-judiciario-em-contratos-comerciais-complexos-custos-e-beneficios',
    title: 'Arbitragem vs. Judiciário em Contratos Comerciais Complexos: Custos e Benefícios',
    category: 'Contencioso Estratégico & Societário',
    categorySlug: 'contencioso-estrategico',
    date: '15 de maio de 2024',
    publishedAt: '2024-05-15',
    readingTime: 6,
    featuredImage: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'Critérios estratégicos para a inserção de cláusula compromissória arbitral em transações M&A e contratos de fornecimento continuado.',
    author: {
      name: 'Dr. Eduardo Veríssimo Inocente',
      role: 'Sócio-Fundador & Diretor Jurídico',
      oab: 'OAB/SP 200.334',
      avatar: '/img/01.png',
      bio: 'Mais de 25 anos de vanguarda no Direito Empresarial, referência nacional em Recuperação Judicial, Reestruturação de Dívidas e Agronegócio.',
    },
    keywords: ['arbitragem empresarial', 'cláusula compromissória', 'contencioso M&A', 'sigilo processual'],
    paragraphs: [
      'Na formulação de contratos empresariais de grande envergadura — como fusões e aquisições (M&A), acordos de acionistas e contratos de construção e fornecimento agroindustrial —, a escolha da via para resolução de conflitos é uma das cláusulas mais críticas.',
      'A via arbitral, respaldada pela Lei nº 9.307/1996, oferece três vantagens indiscutíveis: especialização técnica dos árbitros escolhidos, celeridade temporal expressiva em comparação à morosidade judiciária e sigilo absoluto das disputas comerciais.',
      'Em contrapartida, as custas iniciais e honorários das câmaras arbitrais de primeira linha demandam uma criteriosa análise de custo-benefício financeiro prévio.',
    ],
    subsections: [
      {
        subtitle: 'Quando Adotar a Cláusula Compromissória Escalonada',
        paragraphs: [
          'Em disputas cujo valor econômico supere dezenas de milhões de reais ou envolvam segredos industriais sensíveis, a arbitragem é a escolha recomendada. Recomenda-se a adoção de cláusulas escalonadas (Med-Arb), que impõem sessões de mediação prévia antes da instauração formal do tribunal arbitral.',
        ],
      },
    ],
  },

  // --- Eixo 4: Direito Tributário Empresarial ---
  {
    slug: 'reforma-tributaria-e-o-agronegocio-regimes-especiais-e-transicao',
    title: 'Reforma Tributária e o Agronegócio: Regimes Especiais e Transição',
    category: 'Direito Tributário Empresarial',
    categorySlug: 'tributario-empresarial',
    date: '25 de maio de 2024',
    publishedAt: '2024-05-25',
    readingTime: 7,
    featuredImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'Como a unificação dos tributos de consumo (IBS e CBS) e as alíquotas reduzidas impactarão o custo dos insumos, máquinas agrícolas e exportação.',
    author: {
      name: 'Dr. Eduardo Veríssimo Inocente',
      role: 'Sócio-Fundador & Diretor Jurídico',
      oab: 'OAB/SP 200.334',
      avatar: '/img/01.png',
      bio: 'Mais de 25 anos de vanguarda no Direito Empresarial, referência nacional em Recuperação Judicial, Reestruturação de Dívidas e Agronegócio.',
    },
    keywords: ['reforma tributária agro', 'IBS CBS insumos agrícolas', 'planejamento tributário', 'emenda 132'],
    paragraphs: [
      'A promulgação da Emenda Constitucional nº 132/2023 representou a alteração mais substancial no sistema tributário brasileiro em mais de meio século. A substituição do PIS, COFINS, IPI, ICMS e ISS pelo Imposto sobre Bens e Serviços (IBS) e pela Contribuição sobre Bens e Serviços (CBS) inaugura o modelo de IVA Dual.',
      'O agronegócio e a indústria de insumos agrícolas receberam tratamentos constitucionais específicos, incluindo regimes diferenciados com redução de alíquotas em 60% ou 100% para produtos essenciais da cesta básica e insumos produtivos agropecuários.',
      'Não obstante as conquistas setoriais, o período de transição (que se estenderá de 2026 até 2033) impõe desafios monumentais de compliance para evitar bitributação e acúmulo de créditos indevidos.',
    ],
    subsections: [
      {
        subtitle: 'Desoneração das Exportações e Manutenção de Créditos',
        paragraphs: [
          'A imunidade das exportações agropecuárias permanece garantida na Constituição Federal, assegurando a competitividade dos grãos e carnes no mercado global. O ponto nevrálgico consistirá na agilidade do Fisco na restituição e compensação dos saldos credores de IBS e CBS, sob pena de corroer a margem líquida dos produtores.',
        ],
      },
    ],
    bodyImages: [
      {
        url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
        caption: 'Planejamento e reestruturação fiscal corporativa frente à transição tributária.',
      },
    ],
  },
  {
    slug: 'exclusao-do-icms-da-base-de-calculo-do-pis-cofins-e-teses-filhotes',
    title: 'Exclusão do ICMS da Base de Cálculo do PIS/COFINS e Teses Filhotes',
    category: 'Direito Tributário Empresarial',
    categorySlug: 'tributario-empresarial',
    date: '02 de junho de 2024',
    publishedAt: '2024-06-02',
    readingTime: 6,
    featuredImage: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'O aproveitamento de créditos fiscais e as oportunidades remanescentes de recuperação tributária para empresas no Lucro Real e Presumido.',
    author: {
      name: 'Dr. Eduardo Veríssimo Inocente',
      role: 'Sócio-Fundador & Diretor Jurídico',
      oab: 'OAB/SP 200.334',
      avatar: '/img/01.png',
      bio: 'Mais de 25 anos de vanguarda no Direito Empresarial, referência nacional em Recuperação Judicial, Reestruturação de Dívidas e Agronegócio.',
    },
    keywords: ['tese do século', 'exclusão ICMS PIS COFINS', 'créditos tributários', 'tema 69 stf'],
    paragraphs: [
      'O julgamento do Tema nº 69 pelo Supremo Tribunal Federal (RE 574.706) consolidou a exclusão do ICMS destacado nas notas fiscais da base de cálculo da contribuição ao PIS e da COFINS, gerando expressivos impactos de caixa para os contribuintes.',
      'A partir dessa premissa constitucional — de que ingressos que não pertencem ao patrimônio da pessoa jurídica não podem configurar faturamento —, proliferaram as chamadas "teses filhotes", abrangendo a exclusão do ISS sobre PIS/COFINS e a exclusão do próprio ICMS de outras bases fiscais.',
      'As empresas necessitam de auditoria jurídica e contábil rigorosa para retificação de obrigações acessórias e compensação administrativa sem riscos de autuações fiscais.',
    ],
    subsections: [
      {
        subtitle: 'Auditoria e Compensação Segura via PER/DCOMP',
        paragraphs: [
          'A parametrização correta dos sistemas de ERP corporativos e o levantamento documental dos últimos cinco anos de recolhimentos garantem a recuperação lícita de valores substanciais, reforçando diretamente o fluxo de caixa das companhias.',
        ],
      },
    ],
  },

  // --- Eixo 5: Direito Imobiliário & Infraestrutura ---
  {
    slug: 'due-diligence-imobiliaria-na-compra-e-venda-de-imoveis-rurais-e-fazendas',
    title: 'Due Diligence Imobiliária na Compra e Venda de Imóveis Rurais e Fazendas',
    category: 'Direito Imobiliário & Infraestrutura',
    categorySlug: 'imobiliario-infraestrutura',
    date: '12 de junho de 2024',
    publishedAt: '2024-06-12',
    readingTime: 7,
    featuredImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'Checklist rigoroso de conformidade fundiária, CAR, Georreferenciamento (SIGEF), sobreposições e passivos ambientais em grandes aquisições.',
    author: {
      name: 'Dr. Eduardo Veríssimo Inocente',
      role: 'Sócio-Fundador & Diretor Jurídico',
      oab: 'OAB/SP 200.334',
      avatar: '/img/01.png',
      bio: 'Mais de 25 anos de vanguarda no Direito Empresarial, referência nacional em Recuperação Judicial, Reestruturação de Dívidas e Agronegócio.',
    },
    keywords: ['due diligence imobiliária', 'compra de fazendas', 'CAR SIGEF regularização', 'passivo ambiental'],
    paragraphs: [
      'A aquisição de grandes glebas rurais e imóveis corporativos envolve investimentos financeiros vultosos e riscos jurídicos complexos que ultrapassam a simples análise da matrícula no Cartório de Registro de Imóveis.',
      'No meio rural, a auditoria fundiária (due diligence imobiliária) deve abranger o rastreamento da cadeia dominial ininterrupta desde o destaque originário do patrimônio público, a fim de afastar o risco de grilagem ou anulação por sobreposição a terras devolutas.',
      'Além disso, o cruzamento do Georreferenciamento com a certificação do INCRA (SIGEF) e o Cadastro Ambiental Rural (CAR) são etapas mandatórias para validar a posse legítima e a exata dimensão perimetral do imóvel.',
    ],
    subsections: [
      {
        subtitle: 'Passivos Ambientais e Responsabilidade Propter Rem',
        paragraphs: [
          'De acordo com a jurisprudência sumulada do STJ (Súmula 623), as obrigações de reparação e recomposição ambiental têm natureza propter rem, transferindo-se compulsoriamente ao novo adquirente, mesmo que a degradação ou desmatamento tenha sido provocado pelo antigo proprietário.',
          'Uma due diligence jurídica minuciosa antes da assinatura da escritura ou do contrato preliminar permite negociar descontos expressivos no preço ou retenção de valores em escrow account, salvaguardando o investidor contra execuções fiscais e embargos do IBAMA.',
        ],
      },
    ],
    bodyImages: [
      {
        url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
        caption: 'Conformidade registral, ambiental e técnica para segurança máxima em transações imobiliárias.',
      },
    ],
  },
];

export function getAllBlogArticles(
  customArticles?: BlogArticle[],
  deletedSlugs: string[] = [],
  coverOverrides: Record<string, string> = {}
): BlogArticle[] {
  const deletedSet = new Set(deletedSlugs);

  // Mapeia artigos customizados para override
  const customMap = new Map<string, BlogArticle>();
  if (customArticles) {
    customArticles.forEach((art) => {
      if (!deletedSet.has(art.slug)) {
        customMap.set(art.slug, art);
      }
    });
  }

  // Base filtrando excluídos e aplicando overrides de conteúdo e de capa
  const baseArticles = BLOG_ARTICLES
    .filter((a) => !deletedSet.has(a.slug))
    .map((a) => {
      const art = customMap.has(a.slug) ? customMap.get(a.slug)! : a;
      if (coverOverrides && coverOverrides[art.slug]) {
        return { ...art, featuredImage: coverOverrides[art.slug] };
      }
      return art;
    });

  // Artigos novos que não existem na base padrão
  const baseSlugs = new Set(BLOG_ARTICLES.map((a) => a.slug));
  const newArticles: BlogArticle[] = [];
  if (customArticles) {
    customArticles.forEach((art) => {
      if (!baseSlugs.has(art.slug) && !deletedSet.has(art.slug)) {
        const item = (coverOverrides && coverOverrides[art.slug])
          ? { ...art, featuredImage: coverOverrides[art.slug] }
          : art;
        newArticles.push(item);
      }
    });
  }

  return [...newArticles, ...baseArticles];
}

export function getBlogArticleBySlug(slug: string): BlogArticle | undefined {
  return BLOG_ARTICLES.find((article) => {
    if (article.slug === slug) return true;
    const normalizedInput = slug
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const normalizedArticle = article.slug
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return normalizedArticle === normalizedInput || normalizedArticle.includes(normalizedInput);
  });
}

export function getRelatedBlogArticles(slug: string, count: number = 3): BlogArticle[] {
  const current = getBlogArticleBySlug(slug);
  const others = BLOG_ARTICLES.filter((a) => a.slug !== slug);
  if (!current) return others.slice(0, count);

  // Prioriza artigos da mesma categoria
  const sameCategory = others.filter((a) => a.categorySlug === current.categorySlug);
  const differentCategory = others.filter((a) => a.categorySlug !== current.categorySlug);

  return [...sameCategory, ...differentCategory].slice(0, count);
}

export function getBlogCategories(): string[] {
  return [
    'Todas',
    'Recuperação Judicial & Falências',
    'Agronegócio & Títulos de Crédito',
    'Contencioso Estratégico & Societário',
    'Direito Tributário Empresarial',
    'Direito Imobiliário & Infraestrutura',
  ];
}
