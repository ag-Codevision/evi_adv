import React from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import { Metadata } from 'next';
import { getLatestPodcastEpisodes, PodcastEpisode } from '@/lib/youtube';

export const metadata: Metadata = {
  title: 'Podcast EVI Advogados | Direito, Estratégia e Sociedade',
  description:
    'Assista aos episódios do podcast oficial da EVI Sociedade de Advogados, com análises profundas do Dr. Eduardo Veríssimo Inocente e convidados sobre temas contemporâneos do Direito.',
};

// Revalidação automática em segundo plano (ISR) a cada 1 hora
export const revalidate = 3600;

function formatPublishDate(dateStr?: string): string | null {
  if (!dateStr) return null;
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return null;
  }
}

export default async function PodcastPage() {
  const episodes: PodcastEpisode[] = await getLatestPodcastEpisodes(15);

  return (
    <>
      <Header />

      <main className="bg-[#f8fafb] min-h-screen py-16">
        <div className="container max-w-6xl">
          {/* Header da Página */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="eyebrow justify-center mb-3">Conteúdo Audiovisual Exclusivo</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-evi-deep font-bold tracking-tight mb-6">
              Podcast EVI Advogados
            </h1>
            <p className="text-evi-text-light text-lg md:text-xl leading-relaxed">
              O direito explicado com inteligência, clareza e profundidade prática. Acompanhe os vídeos e episódios mais recentes com o Dr. Eduardo Veríssimo Inocente e convidados especiais.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://www.youtube.com/@evisociedadedeadvogados443"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline border-red-600 text-red-600 hover:bg-red-600 hover:text-white inline-flex items-center gap-2"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <span>Canal Oficial no YouTube</span>
              </a>
              <span className="text-xs text-evi-text-muted bg-white border border-evi-border px-3 py-2 rounded-full inline-flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Feed ao vivo sincronizado
              </span>
            </div>
          </div>

          {/* Grid de Episódios */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {episodes.map((ep, idx) => {
              const formattedDate = formatPublishDate(ep.publishedAt);
              return (
                <article
                  key={ep.videoId || idx}
                  className="bg-white rounded-3xl border border-evi-border overflow-hidden shadow-evi-card hover:shadow-evi-hover transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Iframe de Vídeo Responsivo */}
                    <div className="relative aspect-video w-full bg-black">
                      <iframe
                        className="w-full h-full"
                        src={`https://www.youtube-nocookie.com/embed/${ep.videoId}`}
                        title={ep.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                      ></iframe>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-evi-accent bg-evi-soft px-3 py-1 rounded-full border border-evi-border inline-block">
                          {ep.category}
                        </span>
                        {formattedDate && (
                          <span className="text-[11px] text-evi-text-muted font-medium">
                            {formattedDate}
                          </span>
                        )}
                      </div>

                      <h2 className="text-xl font-serif font-bold text-evi-deep mb-3 leading-snug group-hover:text-evi-accent transition-colors line-clamp-2">
                        {ep.title}
                      </h2>

                      <p className="text-sm text-evi-text-light leading-relaxed line-clamp-3">
                        {ep.desc}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2">
                    <div className="pt-4 border-t border-evi-border/60 flex items-center justify-between text-xs">
                      <span className="text-evi-text-muted">EVI Podcast & Debates</span>
                      <a
                        href={`https://youtu.be/${ep.videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-evi-deep hover:text-evi-accent"
                      >
                        Abrir no YouTube ↗
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Banner de Chamada */}
          <div className="bg-evi-deep text-white rounded-3xl p-8 md:p-14 text-center max-w-4xl mx-auto shadow-evi-card">
            <h3 className="text-3xl font-serif font-bold mb-4">
              Quer sugerir um tema ou tirar dúvidas sobre algum episódio?
            </h3>
            <p className="text-slate-300 max-w-2xl mx-auto mb-8 text-base">
              Nossa equipe jurídica está sempre conectada e pronta para orientar você.
            </p>
            <a
              href="https://wa.me/5511991390045?text=Ol%C3%A1%2C%20assisti%20ao%20podcast%20da%20EVI%20e%20gostaria%20de%20conversar%20sobre%20meu%20caso."
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-wa text-base px-8 py-4"
            >
              Conversar com Nossos Advogados
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
