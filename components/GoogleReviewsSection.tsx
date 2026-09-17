'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

interface ReviewItem {
  id: string;
  author: string;
  badge?: string;
  timeAgo: string;
  stars: number;
  avatar?: string;
  initials: string;
  content: string;
}

const REVIEWS_DATA: ReviewItem[] = [
  {
    id: '1',
    author: 'qunxiao ye',
    badge: 'Avaliação Verificada',
    timeAgo: '2 semanas atrás',
    stars: 5,
    avatar: 'https://lh3.googleusercontent.com/a/ACg8ocLvHSuW2Av18yQYPoTnWnJUY2k3ytyzTlCGGgooNaVVGLqEtw=w72-h72-p-rp-mo-br100',
    initials: 'QY',
    content:
      'Excelente profissional! Muito competente, atencioso e responsável. Sempre foi muito claro nas orientações, demonstrando conhecimento, dedicação e agilidade durante todo o processo. Além disso, transmite muita confiança e está sempre à disposição para esclarecer qualquer dúvida. Recomendo de olhos fechados!',
  },
  {
    id: '2',
    author: 'Vanessinha Figueira',
    badge: 'Avaliação Verificada',
    timeAgo: '3 meses atrás',
    stars: 5,
    avatar: 'https://lh3.googleusercontent.com/a-/ALV-UjUAXaT_UdJelSkLMiOkdF7v0w9Yq5fB3J3tV8c=w72-h72-p-rp-mo-br100',
    initials: 'VF',
    content:
      'Se tivesse 10 estrelas colocaria. Tive um atendimento exemplar desde a recepção. Tenho a maior admiração pelo Dr. Eduardo, ele é muito humano, amoroso, atencioso e extremamente capacitado. Gratidão imensa a toda a equipe da EVI!',
  },
  {
    id: '3',
    author: 'Lulla Balulla',
    badge: 'Local Guide · 34 avaliações',
    timeAgo: '3 meses atrás',
    stars: 5,
    avatar: 'https://lh3.googleusercontent.com/a-/ALV-UjX6dg_S79CthrCIxItGfZ0F0w5Qx8yW2eF8V0a=w72-h72-p-rp-mo-br100',
    initials: 'LB',
    content:
      'Gostaria de registrar minha imensa satisfação com o atendimento da EVI Sociedade de Advogados. O Dr. Eduardo é um profissional brilhante, extremamente competente, estratégico e dedicado, sempre transmitindo segurança e confiança. Sua atuação jurídica faz total diferença.',
  },
  {
    id: '4',
    author: 'Mauricio Lopes',
    badge: '12 avaliações no Google',
    timeAgo: '3 meses atrás',
    stars: 5,
    avatar: 'https://lh3.googleusercontent.com/a-/ALV-UjXY37VPtpmX-1Xx6joWcK12mY5P0q1=w72-h72-p-rp-mo-br100',
    initials: 'ML',
    content:
      'Dr. Eduardo e sua equipe são bem prestativos, atenciosos e competentes. Ótimo direcionamento perante o andamento dos processos com esclarecimentos e mostrando de forma clara os fatos. Recomendo com absoluta tranquilidade.',
  },
  {
    id: '5',
    author: 'joao jelde',
    badge: 'Avaliação Verificada',
    timeAgo: '3 meses atrás',
    stars: 5,
    avatar: 'https://lh3.googleusercontent.com/a-/ALV-UjU4OFV_YKJfM21ur8rW2V6P9s1=w72-h72-p-rp-mo-br100',
    initials: 'JJ',
    content:
      'Recomendo fortemente este escritório de advocacia. A equipe demonstrou um profissionalismo exemplar em todos os momentos. Fui atendido com grande prestatividade e competência, o que me transmitiu muita segurança. A gentileza e simpatia de todos tornam o ambiente acolhedor.',
  },
];

const GOOGLE_MAPS_URL =
  'https://www.google.com/maps/place/EVI+Sociedade+de+Advogados/@-23.5955075,-46.6083219,712m/data=!3m1!1e3!4m16!1m7!3m6!1s0x94ce59b8983035d9:0x344dfa9c9341de93!2sEVI+Sociedade+de+Advogados!8m2!3d-23.5955124!4d-46.605747!16s%2Fg%2F11c6ldrhgn!3m7!1s0x94ce59b8983035d9:0x344dfa9c9341de93!8m2!3d-23.5955124!4d-46.605747!9m1!1b1!16s%2Fg%2F11c6ldrhgn?hl=pt-BR&entry=ttu&g_ep=EgoyMDI2MDkxNS4wIKXMDSoASAFQAw%3D%3D';

export default function GoogleReviewsSection() {
  // Triplicamos a lista para permitir arraste livre e loop contínuo infinito
  const marqueeReviews = [...REVIEWS_DATA, ...REVIEWS_DATA, ...REVIEWS_DATA];

  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const isHoveredRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const offsetRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const lastTimeRef = useRef<number | null>(null);

  // Normaliza o offset para rotação contínua infinita
  const normalizeOffset = useCallback((offset: number): number => {
    if (!trackRef.current) return offset;
    const singleSetWidth = trackRef.current.scrollWidth / 3;
    if (singleSetWidth <= 0) return offset;

    let normalized = offset;
    while (normalized <= -singleSetWidth) {
      normalized += singleSetWidth;
    }
    while (normalized > 0) {
      normalized -= singleSetWidth;
    }
    return normalized;
  }, []);

  // Animação contínua suave via requestAnimationFrame
  useEffect(() => {
    let animationFrameId: number;

    const animate = (time: number) => {
      if (lastTimeRef.current !== null && trackRef.current) {
        const deltaTime = Math.min((time - lastTimeRef.current) / 1000, 0.1);
        const speed = 42; // 42 pixels por segundo (movimento suave e elegante)

        if (!isDraggingRef.current && !isHoveredRef.current) {
          offsetRef.current -= speed * deltaTime;
          offsetRef.current = normalizeOffset(offsetRef.current);
          trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
        }
      }

      lastTimeRef.current = time;
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [normalizeOffset]);

  // Eventos de Mouse Drag globais na window
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !trackRef.current) return;

      const deltaX = e.pageX - dragStartXRef.current;
      if (Math.abs(deltaX) > 4) {
        hasDraggedRef.current = true;
      }

      offsetRef.current = dragStartOffsetRef.current + deltaX;
      offsetRef.current = normalizeOffset(offsetRef.current);
      trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
    };

    const handleMouseUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        setIsDragging(false);

        // Previne clique acidental em links se houve arraste
        setTimeout(() => {
          hasDraggedRef.current = false;
        }, 120);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [normalizeOffset]);

  // Início do arraste com o mouse
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    setIsDragging(true);
    hasDraggedRef.current = false;
    dragStartXRef.current = e.pageX;
    dragStartOffsetRef.current = offsetRef.current;
  };

  // Suporte a Touch Drag para telas sensíveis ao toque
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      setIsDragging(true);
      hasDraggedRef.current = false;
      dragStartXRef.current = e.touches[0].pageX;
      dragStartOffsetRef.current = offsetRef.current;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || !trackRef.current || e.touches.length !== 1) return;

    const deltaX = e.touches[0].pageX - dragStartXRef.current;
    if (Math.abs(deltaX) > 4) {
      hasDraggedRef.current = true;
    }

    offsetRef.current = dragStartOffsetRef.current + deltaX;
    offsetRef.current = normalizeOffset(offsetRef.current);
    trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
  };

  const handleTouchEnd = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDragging(false);
      setTimeout(() => {
        hasDraggedRef.current = false;
      }, 120);
    }
  };

  // Botões de navegação rápida manual
  const handleNavigate = (direction: 'prev' | 'next') => {
    if (!trackRef.current) return;
    const step = 380;
    const targetOffset = direction === 'next' ? offsetRef.current - step : offsetRef.current + step;
    offsetRef.current = normalizeOffset(targetOffset);
    trackRef.current.style.transition = 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
    trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;

    setTimeout(() => {
      if (trackRef.current) {
        trackRef.current.style.transition = 'none';
      }
    }, 360);
  };

  return (
    <section
      id="avaliacoes-google"
      className="relative bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#edf2f7] pt-10 pb-16 md:pt-14 md:pb-20 border-b border-slate-200/80 overflow-hidden"
      aria-labelledby="google-reviews-title"
    >
      {/* Luz ambiente suave decorativa */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[220px] bg-gradient-to-b from-blue-100/30 via-amber-100/20 to-transparent blur-3xl pointer-events-none -z-0" />

      <div className="container relative z-10 mb-8 md:mb-10">
        {/* Cabeçalho Oficial do Google Meu Negócio */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm border border-slate-200/90">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            {/* Bloco de Marca Google + Nota */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              {/* Ícone oficial Google G */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center p-3.5 flex-shrink-0">
                <svg viewBox="0 0 48 48" className="w-full h-full" aria-hidden="true">
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.79l7.97-6.2z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  />
                </svg>
              </div>

              {/* Informações de Avaliação */}
              <div>
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-evi-deep tracking-tight">
                    5.0
                  </span>
                  {/* 5 Estrelas Douradas */}
                  <div className="flex items-center text-[#F4B400] gap-1 text-xl" aria-label="5 de 5 estrelas">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <svg
                        key={i}
                        viewBox="0 0 24 24"
                        className="w-5 h-5 fill-current"
                        aria-hidden="true"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <span className="font-sans bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200/80">
                    Classificação Máxima
                  </span>
                </div>

                <h2
                  id="google-reviews-title"
                  className="font-serif text-xl sm:text-2xl font-medium text-evi-deep flex items-center gap-2.5 flex-wrap"
                >
                  <span>Avaliações no Google Meu Negócio</span>
                  <span className="font-sans text-[11px] uppercase tracking-[0.14em] bg-slate-100 text-evi-text-muted font-bold px-2.5 py-0.5 rounded-full border border-slate-200/80">
                    Perfil Verificado
                  </span>
                </h2>
                <p className="font-sans text-evi-text-muted text-sm sm:text-base mt-1 leading-relaxed">
                  Baseado em <strong className="text-evi-deep font-semibold">+145 avaliações</strong> e depoimentos de clientes reais atendidos pela <strong className="text-evi-deep font-semibold">EVI Sociedade de Advogados</strong>.
                </p>
              </div>
            </div>

            {/* Ações e Links Oficiais */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 font-sans text-sm font-semibold bg-evi-deep hover:bg-[#1f334a] text-white px-6 py-3 rounded-full shadow-sm transition-all duration-200 active:scale-[0.98]"
              >
                <span>Ver Todas no Google Maps</span>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>

              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 font-sans text-sm font-semibold text-evi-deep hover:text-evi-navy bg-slate-100 hover:bg-slate-200 px-5 py-3 rounded-full transition-colors border border-slate-200/60"
              >
                <span>Escrever Avaliação</span>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Subtítulo e Controles do Carrossel */}
      <div className="container mb-5 flex items-center justify-between gap-4">
        <div>
          <span className="font-sans text-xs uppercase tracking-[0.14em] font-extrabold text-evi-accent">Depoimentos Públicos Reais</span>
          <p className="font-serif text-lg sm:text-xl font-medium text-evi-deep mt-0.5">O que nossos clientes dizem sobre nossa atuação</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Dica interativa de arraste com mouse */}
          <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-white/80 px-3 py-1.5 rounded-full border border-slate-200/80 shadow-2xs">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
              <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
              <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
              <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
              <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
            </svg>
            <span>Arraste com o mouse para navegar</span>
          </span>

          {/* Botões de navegação lateral (prev/next) */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleNavigate('prev')}
              aria-label="Avaliação anterior"
              className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-evi-deep hover:border-slate-300 hover:bg-slate-50 flex items-center justify-center shadow-xs transition-colors active:scale-95 cursor-pointer"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('next')}
              aria-label="Próxima avaliação"
              className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-evi-deep hover:border-slate-300 hover:bg-slate-50 flex items-center justify-center shadow-xs transition-colors active:scale-95 cursor-pointer"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Esteira de Cards Arrastável com o Mouse (Drag-to-scroll) & 100% sem barra de rolagem */}
      <div
        ref={containerRef}
        className={`reviews-marquee-mask ${isDragging ? 'is-dragging' : ''}`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={() => {
          isHoveredRef.current = true;
        }}
        onMouseLeave={() => {
          isHoveredRef.current = false;
        }}
      >
        <div ref={trackRef} className="reviews-marquee-track">
          {marqueeReviews.map((review, idx) => (
            <article
              key={`${review.id}-${idx}`}
              className="w-[310px] sm:w-[350px] md:w-[380px] flex-shrink-0 bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 border border-slate-200/90 flex flex-col justify-between select-none"
            >
              <div>
                {/* Topo do Card: Autor, Avatar, Data */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    {review.avatar ? (
                      <img
                        src={review.avatar}
                        alt={review.author}
                        className="w-11 h-11 rounded-full object-cover border border-slate-200 shadow-xs flex-shrink-0 pointer-events-none"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div
                      style={{ display: review.avatar ? 'none' : 'flex' }}
                      className="w-11 h-11 rounded-full bg-slate-800 text-amber-300 font-bold text-sm items-center justify-center shadow-xs flex-shrink-0 pointer-events-none"
                    >
                      {review.initials}
                    </div>

                    <div>
                      <h3 className="font-sans text-[15px] font-bold text-evi-deep leading-snug">
                        {review.author}
                      </h3>
                      <div className="flex items-center gap-1.5 font-sans text-xs text-evi-text-muted">
                        <span>{review.timeAgo}</span>
                        {review.badge && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-700 font-semibold font-sans">{review.badge}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Ícone de Aspas Google */}
                  <span className="text-evi-silver font-serif text-3xl leading-none select-none pointer-events-none">
                    “
                  </span>
                </div>

                {/* Estrelas */}
                <div className="flex items-center text-[#F4B400] gap-0.5 mb-3 pointer-events-none" aria-label={`${review.stars} estrelas`}>
                  {[0, 1, 2, 3, 4].slice(0, review.stars).map((i) => (
                    <svg
                      key={i}
                      viewBox="0 0 24 24"
                      className="w-4 h-4 fill-current"
                      aria-hidden="true"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>

                {/* Texto da Avaliação */}
                <p className="font-sans text-evi-ink text-[13.5px] leading-[1.7] mb-4 pointer-events-none">
                  "{review.content}"
                </p>
              </div>

              {/* Rodapé do Card */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between font-sans text-[11px] text-evi-text-muted">
                <span className="flex items-center gap-1 pointer-events-none">
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" className="text-slate-400">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <span>Google Maps</span>
                </span>
                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (hasDraggedRef.current) {
                      e.preventDefault();
                    }
                  }}
                  className="font-sans font-semibold text-evi-deep hover:text-evi-accent transition-colors"
                >
                  Ver no Google →
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
