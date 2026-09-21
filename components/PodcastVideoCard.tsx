'use client';

import React, { useState } from 'react';
import { Play, Loader2, Clock, ExternalLink } from 'lucide-react';
import { PodcastEpisode } from '@/lib/youtube';

interface PodcastVideoCardProps {
  episode: PodcastEpisode;
  formattedDate: string | null;
  priority?: boolean;
}

export default function PodcastVideoCard({
  episode,
  formattedDate,
  priority = false,
}: PodcastVideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingIframe, setIsLoadingIframe] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleStartPlay = () => {
    setIsPlaying(true);
    setIsLoadingIframe(true);
  };

  const thumbnailUrl = `https://i.ytimg.com/vi/${episode.videoId}/hqdefault.jpg`;

  return (
    <article className="bg-white rounded-3xl border border-evi-border overflow-hidden shadow-evi-card hover:shadow-evi-hover transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Container do Player / Thumbnail com Aspect Video */}
        <div className="relative aspect-video w-full bg-slate-900 overflow-hidden select-none">
          {!isPlaying ? (
            <div
              className="relative w-full h-full cursor-pointer group/thumb"
              onClick={handleStartPlay}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleStartPlay();
                }
              }}
              aria-label={`Assistir ao episódio: ${episode.title}`}
            >
              {/* Efeito Shimmer de Carregamento enquanto a thumbnail é obtida */}
              {!imageLoaded && (
                <div className="absolute inset-0 bg-slate-800 animate-pulse flex flex-col items-center justify-center gap-2">
                  <div className="w-8 h-8 rounded-full border-2 border-slate-600 border-t-evi-silver animate-spin" />
                  <span className="text-[11px] text-slate-400 font-medium tracking-wide">
                    Carregando capa...
                  </span>
                </div>
              )}

              {/* Thumbnail do YouTube de Alta Resolução */}
              <img
                src={thumbnailUrl}
                alt={episode.title}
                loading={priority ? 'eager' : 'lazy'}
                onLoad={() => setImageLoaded(true)}
                className={`w-full h-full object-cover transition-transform duration-500 group-hover/thumb:scale-105 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />

              {/* Vinhetagem / Sombra suave para contraste */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />

              {/* Botão de Play Estilizado com Microinterações */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative flex items-center justify-center">
                  {/* Anel de Pulso */}
                  <span className="absolute w-16 h-16 rounded-full bg-red-600/30 animate-ping" />
                  {/* Botão Principal */}
                  <div className="relative w-14 h-14 rounded-full bg-red-600 group-hover/thumb:bg-red-500 text-white flex items-center justify-center shadow-lg group-hover/thumb:scale-110 transition-all duration-300">
                    <Play className="w-6 h-6 fill-white translate-x-0.5" />
                  </div>
                </div>
              </div>

              {/* Badges sobre a Thumbnail (Duração e Tag de Vídeo) */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs pointer-events-none">
                <span className="bg-black/75 backdrop-blur-md text-white px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 border border-white/10 shadow-sm">
                  <Play className="w-3 h-3 fill-white" /> Vídeo Completo
                </span>

                {episode.duration && (
                  <span className="bg-black/75 backdrop-blur-md text-slate-200 px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 border border-white/10 shadow-sm">
                    <Clock className="w-3 h-3 text-slate-400" /> {episode.duration}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full bg-black">
              {/* Animação no Card avisando que o vídeo está carregando */}
              {isLoadingIframe && (
                <div className="absolute inset-0 z-10 bg-slate-950 flex flex-col items-center justify-center gap-3 p-4 text-center">
                  <div className="relative flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border-3 border-red-500/20 border-t-red-500 animate-spin" />
                    <Play className="w-5 h-5 text-red-500 absolute fill-red-500/80" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-white tracking-wide animate-pulse">
                      Carregando vídeo...
                    </p>
                    <p className="text-xs text-slate-400">
                      Conectando ao YouTube em alta definição
                    </p>
                  </div>
                </div>
              )}

              {/* Iframe carregado sob demanda (instantâneo e sem travar a página) */}
              <iframe
                className="w-full h-full relative z-0"
                src={`https://www.youtube-nocookie.com/embed/${episode.videoId}?autoplay=1&rel=0&modestbranding=1`}
                title={episode.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={() => setIsLoadingIframe(false)}
              />
            </div>
          )}
        </div>

        {/* Informações Textuais do Episódio */}
        <div className="p-6">
          <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider text-evi-accent bg-evi-soft px-3 py-1 rounded-full border border-evi-border inline-block">
              {episode.category}
            </span>
            <div className="flex items-center gap-2">
              {episode.duration && (
                <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                  ⏱ {episode.duration}
                </span>
              )}
              {formattedDate && (
                <span className="text-[11px] text-evi-text-muted font-medium">
                  {formattedDate}
                </span>
              )}
            </div>
          </div>

          <h2
            onClick={!isPlaying ? handleStartPlay : undefined}
            className={`text-xl font-serif font-bold text-evi-deep mb-3 leading-snug group-hover:text-evi-accent transition-colors line-clamp-2 ${
              !isPlaying ? 'cursor-pointer' : ''
            }`}
          >
            {episode.title}
          </h2>

          <p className="text-sm text-evi-text-light leading-relaxed line-clamp-3">
            {episode.desc}
          </p>
        </div>
      </div>

      {/* Rodapé com links e ações */}
      <div className="px-6 pb-6 pt-2">
        <div className="pt-4 border-t border-evi-border/60 flex items-center justify-between text-xs">
          <span className="text-evi-text-muted">Podcast Direito e Arte</span>
          <a
            href={`https://www.youtube.com/watch?v=${episode.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-evi-deep hover:text-evi-accent inline-flex items-center gap-1 transition-colors"
          >
            Abrir no YouTube <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
}
