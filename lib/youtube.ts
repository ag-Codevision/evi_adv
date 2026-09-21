export interface PodcastEpisode {
  videoId: string;
  title: string;
  category: string;
  desc: string;
  publishedAt?: string;
  duration?: string;
}

export const fallbackEpisodes: PodcastEpisode[] = [
  {
    videoId: 'EQzXftGILak',
    title: 'LÉO ÁQUILLA - ARTE E POLÍTICA',
    category: 'Arte, Cultura & Cidadania',
    desc: 'Dr. Eduardo Veríssimo Inocente recebe Léo Áquilla para um diálogo inspirador sobre representatividade, desafios, liberdade de expressão, direitos civis e bastidores da política.',
    duration: '58:33',
    publishedAt: 'há 3 semanas',
  },
  {
    videoId: '6cO59SATpFo',
    title: 'ILMAR MUNIZ - ADVOGADO E COMENTARISTA DE TV',
    category: 'Comunicação Jurídica & Mídia',
    desc: 'Um debate instigante sobre o papel do advogado na grande mídia, a cobertura jornalística de julgamentos de repercussão e a ética na comunicação do Direito.',
    duration: '45:44',
    publishedAt: 'há 1 mês',
  },
  {
    videoId: 'VhncIaqR-kc',
    title: 'EDUARDO CAUDURO - DIA A DIA DE UMA DELEGACIA, SEGURANÇA PÚBLICA E CARREIRA',
    category: 'Segurança Pública & Direito Penal',
    desc: 'A rotina da atividade policial, desafios da investigação criminal, garantias constitucionais e as nuances práticas da segurança pública.',
    duration: '53:59',
    publishedAt: 'há 1 mês',
  },
  {
    videoId: '8zbAetG8z6Y',
    title: 'ELIANA PASSARELLI: JUSTIÇA, DIREITOS E CIDADANIA',
    category: 'Justiça & Cidadania',
    desc: 'Uma aula magna sobre as transformações do sistema penal, atuação do Ministério Público, proteção aos direitos fundamentais e o futuro da Justiça brasileira.',
    duration: '47:24',
    publishedAt: 'há 3 meses',
  },
  {
    videoId: 'pZ8KJTQtHvM',
    title: 'CARLOS SECCO: SEGURANÇA PÚBLICA, TECNOLOGIA NA POLÍCIA E OPERAÇÕES',
    category: 'Tecnologia Policial & Perícia',
    desc: 'Inovações tecnológicas nas forças de segurança, inteligência investigativa, operações estratégicas e os limites da atuação estatal.',
    duration: '58:11',
    publishedAt: 'há 3 meses',
  },
  {
    videoId: 'U1mxFT0Lgjg',
    title: 'KEILA - SUCESSO, DESAFIOS E RECOMEÇOS',
    category: 'Empreendedorismo & Superação',
    desc: 'Histórias reais de liderança, superação profissional, resiliência empresarial e os aspectos humanos e jurídicos dos novos começos.',
    duration: '58:09',
    publishedAt: 'há 3 meses',
  },
  {
    videoId: 'o9Vw7DEeNIw',
    title: 'LEÃO LOBO: O UNIVERSO DAS CELEBRIDADES',
    category: 'Direito de Imagem & Bastidores',
    desc: 'O lendário apresentador e jornalista Leão Lobo conversa com o Dr. Eduardo Veríssimo Inocente sobre fama, privacidade, liberdade de imprensa e direito de resposta.',
    duration: '59:49',
    publishedAt: 'há 4 meses',
  },
  {
    videoId: '3cj-YXApKaY',
    title: 'RAQUEL PACHECO (BRUNA SURFISTINHA): Filme 2, maternidade, sonhos e projetos',
    category: 'Direito de Família & Maternidade',
    desc: 'Um relato íntimo e corajoso sobre novos projetos cinematográficos, maternidade, superação de preconceitos e os direitos da mulher e da família.',
    duration: '51:18',
    publishedAt: 'há 4 meses',
  },
  {
    videoId: 'Sgs_hGx-TPA',
    title: 'VANDRÉ SILVEIRA: TRAJETÓRIA, ATUAÇÃO, NOVELAS E A HORA DO BOI',
    category: 'Arte, Teatro & Cultura',
    desc: 'O talentoso ator e diretor Vandré Silveira compartilha os bastidores da teledramaturgia, dedicação à arte e o encontro entre a expressividade artística e a cidadania.',
    duration: '38:02',
    publishedAt: 'há 5 meses',
  },
  {
    videoId: 'RJGzCDP3UB8',
    title: 'OSCAR MAGRINI COMO VOCÊ NUNCA VIU!',
    category: 'Entrevistas & Cultura',
    desc: 'Grandes histórias e revelações exclusivas de um dos atores mais icônicos do país, abordando carreira artística, direitos autorais e trajetória de vida.',
    duration: '48:29',
    publishedAt: 'há 5 meses',
  },
];

function categorizeTitle(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('léo áquilla') || t.includes('leo aquilla')) return 'Arte, Cultura & Cidadania';
  if (t.includes('ilmar') || t.includes('comentarista') || t.includes('mídia')) return 'Comunicação Jurídica & Mídia';
  if (t.includes('cauduro') || t.includes('delegacia') || t.includes('polícia') || t.includes('segurança')) return 'Segurança Pública & Penal';
  if (t.includes('passarelli') || t.includes('provas')) return 'Direito Digital & Cidadania';
  if (t.includes('leão lobo') || t.includes('celebridades')) return 'Direito de Imagem & Mídia';
  if (t.includes('raquel pacheco') || t.includes('surfistinha') || t.includes('maternidade')) return 'Família & Direitos';
  if (t.includes('magrini') || t.includes('ator') || t.includes('arte') || t.includes('novela')) return 'Arte & Cultura';
  if (t.includes('família') || t.includes('divórcio') || t.includes('guarda') || t.includes('herança')) return 'Família & Sucessões';
  if (t.includes('tributário') || t.includes('imposto')) return 'Direito Tributário';
  if (t.includes('trabalhista') || t.includes('trabalho') || t.includes('clt')) return 'Trabalhista Corporativo';
  if (t.includes('consumidor') || t.includes('golpe')) return 'Direito do Consumidor';
  if (t.includes('saúde') || t.includes('médico') || t.includes('plano de saúde')) return 'Direito Médico & Saúde';
  return 'Debates & Entrevistas';
}

function sanitizeDescription(rawTitle: string, rawDesc?: string): string {
  if (rawDesc && rawDesc.trim().length > 20) {
    const clean = rawDesc
      .replace(/https?:\/\/\S+/g, '')
      .replace(/#\S+/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (clean.length > 210) {
      return clean.slice(0, 207) + '...';
    }
    return clean;
  }
  return `Acompanhe este debate exclusivo do Podcast Direito e Arte sob a perspectiva e liderança jurídica do Dr. Eduardo Veríssimo Inocente.`;
}

const BLOCKED_SHORT_IDS = new Set([
  'vnLazcQC5Sw', // Short da Eliana Passarelli (3:11)
]);

/**
 * Filtra e rejeita Shorts do YouTube, clipes e vídeos menores que 5 minutos.
 * Apenas episódios completos de podcast são aceitos.
 */
export function isShortOrClip(videoId: string, title?: string, duration?: string): boolean {
  if (BLOCKED_SHORT_IDS.has(videoId)) return true;

  const t = (title || '').toLowerCase();
  if (t.includes('#shorts') || t.includes('#short') || t.includes('/shorts/')) {
    return true;
  }

  if (duration) {
    const parts = duration.split(':').map((p) => parseInt(p.trim(), 10));
    if (parts.length === 2) {
      const [minutes] = parts;
      if (!isNaN(minutes) && minutes < 5) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Puxa dinamicamente da aba 'videos' oficial do canal @direitoearte_podcast no YouTube.
 * A aba /videos contém apenas os episódios completos/longos (vídeos regulares), excluindo Shorts.
 */
export async function getLatestPodcastEpisodes(maxItems: number = 11): Promise<PodcastEpisode[]> {
  const channelVideosUrl = 'https://www.youtube.com/@direitoearte_podcast/videos';

  try {
    const res = await fetch(channelVideosUrl, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(3500),
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
      },
    });

    if (!res.ok) {
      console.warn(`[YouTube Videos Tab] HTTP ${res.status}. Utilizando episódios recentes locais.`);
      return fallbackEpisodes.slice(0, maxItems);
    }

    const html = await res.text();
    const idx = html.indexOf('ytInitialData = ');
    if (idx === -1) {
      return fallbackEpisodes.slice(0, maxItems);
    }

    const start = idx + 'ytInitialData = '.length;
    const end = html.indexOf(';</script>', start);
    if (end === -1) {
      return fallbackEpisodes.slice(0, maxItems);
    }

    const jsonStr = html.slice(start, end);
    const data = JSON.parse(jsonStr);

    const items: any[] = [];
    const extractVideoItems = (obj: any) => {
      if (!obj || typeof obj !== 'object') return;
      if (obj.richItemRenderer?.content?.lockupViewModel) {
        items.push(obj.richItemRenderer.content.lockupViewModel);
      } else if (obj.videoRenderer) {
        items.push(obj.videoRenderer);
      }
      for (const k of Object.keys(obj)) {
        extractVideoItems(obj[k]);
      }
    };
    extractVideoItems(data);

    if (items.length === 0) {
      return fallbackEpisodes.slice(0, maxItems);
    }

    const episodes: PodcastEpisode[] = [];

    for (const item of items) {
      // Formato moderno (lockupViewModel)
      if (item.contentId) {
        const videoId = item.contentId;
        const title = item.metadata?.lockupMetadataViewModel?.title?.content || '';
        const rawDesc = item.metadata?.lockupMetadataViewModel?.descriptionSnippet?.content || '';
        const lines = item.metadata?.lockupMetadataViewModel?.metadata?.contentMetadataViewModel?.metadataRows || [];
        const metadataTexts = lines.flatMap((r: any) => r.metadataParts?.map((p: any) => p.text?.content)).filter(Boolean);
        const published = metadataTexts[metadataTexts.length - 1] || undefined;

        // Duração
        let duration = '';
        const overlays = item.contentImage?.thumbnailViewModel?.overlays || [];
        for (const ov of overlays) {
          const badges = ov.thumbnailBottomOverlayViewModel?.badges || [];
          for (const b of badges) {
            if (b.thumbnailBadgeViewModel?.text) {
              duration = b.thumbnailBadgeViewModel.text;
            }
          }
        }

        if (videoId && title) {
          if (isShortOrClip(videoId, title, duration)) {
            continue;
          }

          // Garante fallback de descrição detalhada se o YouTube retornar descrição vazia
          const matchingFallback = fallbackEpisodes.find((f) => f.videoId === videoId);
          const desc = matchingFallback?.desc || sanitizeDescription(title, rawDesc);
          const category = matchingFallback?.category || categorizeTitle(title);

          episodes.push({
            videoId,
            title: title.trim(),
            category,
            desc,
            publishedAt: published,
            duration: duration || matchingFallback?.duration,
          });
        }
      }
      // Formato legado (videoRenderer)
      else if (item.videoId) {
        const videoId = item.videoId;
        const title = item.title?.runs?.map((r: any) => r.text).join('') || item.title?.simpleText || '';
        const rawDesc = item.descriptionSnippet?.runs?.map((r: any) => r.text).join('') || '';
        const published = item.publishedTimeText?.simpleText;
        const duration = item.lengthText?.simpleText;

        if (videoId && title) {
          if (isShortOrClip(videoId, title, duration)) {
            continue;
          }

          const matchingFallback = fallbackEpisodes.find((f) => f.videoId === videoId);
          const desc = matchingFallback?.desc || sanitizeDescription(title, rawDesc);
          const category = matchingFallback?.category || categorizeTitle(title);

          episodes.push({
            videoId,
            title: title.trim(),
            category,
            desc,
            publishedAt: published,
            duration: duration || matchingFallback?.duration,
          });
        }
      }

      if (episodes.length >= maxItems) {
        break;
      }
    }

    if (episodes.length > 0) {
      return episodes.slice(0, maxItems);
    }

    return fallbackEpisodes.slice(0, maxItems);
  } catch (err) {
    console.error('[YouTube Videos Tab] Falha ao extrair vídeos da aba videos:', err);
    return fallbackEpisodes.slice(0, maxItems);
  }
}
