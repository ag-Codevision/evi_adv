export interface PodcastEpisode {
  videoId: string;
  title: string;
  category: string;
  desc: string;
  publishedAt?: string;
}

export const fallbackEpisodes: PodcastEpisode[] = [
  {
    title: 'Um Olhar Diferente sobre o Direito de Família',
    category: 'Família & Sucessões',
    videoId: '3Muct-a2_4c',
    desc: 'O Dr. Eduardo Veríssimo Inocente disseca as transformações nas relações familiares contemporâneas, partilhas justas e proteção patrimonial de filhos e cônjuges.',
  },
  {
    title: 'Preservando sua Herança Digital',
    category: 'Direito Digital & Sucessões',
    videoId: 'rP92NAI_9FE',
    desc: 'O que acontece com contas bancárias digitais, criptomoedas, redes sociais e patrimônio virtual após o falecimento? Entenda os aspectos jurídicos da sucessão digital.',
  },
  {
    title: 'Os Perigos da Propaganda Enganosa e Abusiva',
    category: 'Direito do Consumidor & Empresarial',
    videoId: 'QQo9SaecN3o',
    desc: 'Análise aprofundada sobre as fronteiras do marketing, responsabilidade civil dos influenciadores e direitos fundamentais do consumidor em caso de fraude.',
  },
  {
    title: 'Planejamento Tributário Estratégico',
    category: 'Tributário & Empresarial',
    videoId: '6dd6u-Mog6Q',
    desc: 'Como empresas e famílias de alta renda utilizam mecanismos jurídicos 100% lícitos para redução da carga tributária e proteção de ativos produtivos.',
  },
  {
    title: 'Direito Condominial em Perspectiva',
    category: 'Cível & Imobiliário',
    videoId: 'Rzx7sEwmPcA',
    desc: 'Resolução de litígios complexos entre condôminos, regras de convivência, inadimplência e governança das assembleias sob a ótica legal.',
  },
  {
    title: 'O Olhar do Direito sobre a Violência Doméstica',
    category: 'Direito de Família & Proteção',
    videoId: 'bRS109xh6os',
    desc: 'Mecanismos protetivos de urgência, amparo civil e medidas judiciais para garantir integridade física, psicológica e patrimonial de vítimas.',
  },
  {
    title: 'Maiores Polêmicas Envolvendo Planos de Saúde',
    category: 'Direito Médico & Saúde',
    videoId: 'Q5mSWlefRfY',
    desc: 'Negativas de cobertura de tratamentos caros, cirurgias, medicamentos de alto custo e como a Justiça atua para proteger a vida do paciente.',
  },
  {
    title: 'Olhar Aprofundado sobre o Direito Trabalhista',
    category: 'Trabalhista Corporativo',
    videoId: 'd-QmRFKQ7x8',
    desc: 'Equilíbrio nas relações de emprego pós-reforma trabalhista, mitigação de passivos para empregadores e garantias fundamentais para trabalhadores.',
  },
  {
    title: 'Pelo Olhar de uma Detetive: Infidelidade e Provas',
    category: 'Investigação & Família',
    videoId: 'XpOmCWuFuVI',
    desc: 'Um debate instigante sobre a obtenção de provas em litígios de família, limites legais da privacidade e validade probatória em juízo.',
  },
];

function categorizeTitle(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('família') || t.includes('divórcio') || t.includes('guarda') || t.includes('herança') || t.includes('pensão')) return 'Família & Sucessões';
  if (t.includes('tributário') || t.includes('imposto') || t.includes('receita') || t.includes('tributos')) return 'Direito Tributário';
  if (t.includes('trabalhista') || t.includes('trabalho') || t.includes('emprego') || t.includes('clt') || t.includes('empresa')) return 'Trabalhista Corporativo';
  if (t.includes('consumidor') || t.includes('golpe') || t.includes('propaganda') || t.includes('bets') || t.includes('banco')) return 'Direito do Consumidor';
  if (t.includes('saúde') || t.includes('médico') || t.includes('plano de saúde') || t.includes('hospital')) return 'Direito Médico & Saúde';
  if (t.includes('imobiliário') || t.includes('condomínio') || t.includes('imóvel') || t.includes('locação')) return 'Cível & Imobiliário';
  if (t.includes('corte') || t.includes('entrevista') || t.includes('trajetória') || t.includes('sentença') || t.includes('podcast') || t.includes('lágrimas')) return 'Debates & Entrevistas';
  return 'Direito & Estratégia';
}

function sanitizeDescription(desc: string, title: string): string {
  if (!desc || desc.trim().length === 0) {
    return `Acompanhe a análise do Dr. Eduardo Veríssimo Inocente e convidados no episódio "${title}".`;
  }
  const clean = desc
    .replace(/https?:\/\/\S+/g, '')
    .replace(/#\S+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (clean.length > 210) {
    return clean.slice(0, 207) + '...';
  }
  return clean || `Análise jurídica com o Dr. Eduardo Veríssimo Inocente sobre "${title}".`;
}

export async function getLatestPodcastEpisodes(maxItems: number = 15): Promise<PodcastEpisode[]> {
  const channelId = 'UCo_k-NzKbkFVJ5zXz4xOwrQ';
  const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

  try {
    const res = await fetch(rssUrl, {
      next: { revalidate: 3600 },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) EviAdvogados/1.0',
      },
    });

    if (!res.ok) {
      console.warn(`[YouTube RSS] Status ${res.status}. Usando episódios locais.`);
      return fallbackEpisodes;
    }

    const xml = await res.text();
    const entries = xml.split('<entry>').slice(1);

    if (entries.length === 0) {
      return fallbackEpisodes;
    }

    const liveEpisodes: PodcastEpisode[] = [];

    for (const entry of entries) {
      const videoIdMatch = entry.match(/<yt:videoId>([\s\S]*?)<\/yt:videoId>/);
      const titleMatch = entry.match(/<title>([\s\S]*?)<\/title>/);
      const publishedMatch = entry.match(/<published>([\s\S]*?)<\/published>/);
      const descMatch = entry.match(/<media:description>([\s\S]*?)<\/media:description>/);

      const videoId = videoIdMatch ? videoIdMatch[1].trim() : null;
      let title = titleMatch ? titleMatch[1].trim() : '';
      const published = publishedMatch ? publishedMatch[1].trim() : undefined;
      const rawDesc = descMatch ? descMatch[1].trim() : '';

      title = title
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");

      if (videoId && title) {
        liveEpisodes.push({
          videoId,
          title,
          category: categorizeTitle(title),
          desc: sanitizeDescription(rawDesc, title),
          publishedAt: published,
        });
      }
    }

    if (liveEpisodes.length > 0) {
      return liveEpisodes.slice(0, maxItems);
    }
    return fallbackEpisodes;
  } catch (err) {
    console.error('[YouTube RSS] Falha ao consultar feed:', err);
    return fallbackEpisodes;
  }
}
