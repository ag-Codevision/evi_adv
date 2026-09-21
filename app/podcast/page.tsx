import React from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import { Metadata } from 'next';
import { getLatestPodcastEpisodes, PodcastEpisode } from '@/lib/youtube';
import EditableText from '@/components/admin/EditableText';
import EditableLink from '@/components/admin/EditableLink';
import PodcastVideoCard from '@/components/PodcastVideoCard';

export const metadata: Metadata = {
  title: 'Podcast Direito e Arte | EVI Advogados',
  description:
    'Assista aos episódios do podcast Direito e Arte, com análises profundas do Dr. Eduardo Veríssimo Inocente e convidados sobre temas contemporâneos do Direito.',
};

// Revalidação automática em segundo plano (ISR) a cada 1 hora
export const revalidate = 3600;

function formatPublishDate(dateStr?: string): string | null {
  if (!dateStr) return null;
  // Se for texto relativo fornecido pelo YouTube (ex: "há 3 semanas", "há 1 mês")
  if (dateStr.toLowerCase().includes('há') || dateStr.toLowerCase().includes('atrás') || dateStr.toLowerCase().includes('ano')) {
    return dateStr;
  }
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
      return null;
    }
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return null;
  }
}

export default async function PodcastPage() {
  const episodes: PodcastEpisode[] = await getLatestPodcastEpisodes(11);

  return (
    <>
      <Header />

      <main className="bg-[#f8fafb] min-h-screen py-16">
        <div className="container max-w-6xl">
          {/* Header da Página */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <EditableText
              page="podcast"
              section="header"
              fieldKey="eyebrow"
              defaultContent="Conteúdo Audiovisual Exclusivo"
              as="span"
              className="eyebrow justify-center mb-3"
            />
            <EditableText
              page="podcast"
              section="header"
              fieldKey="title"
              defaultContent="Podcast Direito e Arte"
              as="h1"
              className="text-4xl md:text-5xl lg:text-6xl font-serif text-evi-deep font-bold tracking-tight mb-6"
            />
            <EditableText
              page="podcast"
              section="header"
              fieldKey="desc"
              defaultContent="O direito explicado com inteligência, clareza e sensibilidade cultural. Acompanhe os episódios completos e debates jurídicos e culturais sob a liderança do Dr. Eduardo Veríssimo Inocente e convidados especiais."
              as="p"
              className="text-evi-text-light text-lg md:text-xl leading-relaxed"
              multiline
            />
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <EditableLink
                page="podcast"
                section="header"
                fieldKey="youtube_channel_btn"
                defaultLabel="Canal Oficial no YouTube (@direitoearte_podcast)"
                defaultHref="https://www.youtube.com/@direitoearte_podcast"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline border-red-600 text-red-600 hover:bg-red-600 hover:text-white inline-flex items-center gap-2 font-bold shadow-sm transition-all active:scale-95"
              />
            </div>
          </div>

          {/* Grid de Episódios Otimizado com Carregamento Instantâneo & Facade */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {episodes.map((ep, idx) => {
              const formattedDate = formatPublishDate(ep.publishedAt);
              return (
                <PodcastVideoCard
                  key={ep.videoId || idx}
                  episode={ep}
                  formattedDate={formattedDate}
                  priority={idx < 3}
                />
              );
            })}
          </div>

          {/* Banner de Chamada */}
          <div className="bg-evi-deep text-white rounded-3xl p-8 md:p-14 text-center max-w-4xl mx-auto shadow-evi-card">
            <EditableText
              page="podcast"
              section="cta_banner"
              fieldKey="title"
              defaultContent="Quer sugerir um tema ou tirar dúvidas sobre algum episódio?"
              as="h3"
              className="text-3xl font-serif font-bold mb-4"
            />
            <EditableText
              page="podcast"
              section="cta_banner"
              fieldKey="desc"
              defaultContent="Nossa equipe jurídica está sempre conectada e pronta para orientar você."
              as="p"
              className="text-slate-300 max-w-2xl mx-auto mb-8 text-base"
              multiline
            />
            <EditableLink
              page="podcast"
              section="cta_banner"
              fieldKey="cta_btn"
              defaultLabel="Conversar com Nossos Advogados"
              defaultHref="https://wa.me/5511991390045?text=Ol%C3%A1%2C%20assisti%20ao%20podcast%20da%20EVI%20e%20gostaria%20de%20conversar%20sobre%20meu%20caso."
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-wa text-base px-8 py-4 inline-block"
            />
          </div>
        </div>
      </main>
    </>
  );
}
