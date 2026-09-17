'use client';

import React, { useState, useRef } from 'react';

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 360;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section
      id="avaliacoes-google"
      className="relative bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#edf2f7] py-14 md:py-18 border-b border-slate-200/80 overflow-hidden"
      aria-labelledby="google-reviews-title"
    >
      {/* Luz ambiente sutil decorativa */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[250px] bg-gradient-to-b from-blue-100/40 via-amber-100/20 to-transparent blur-3xl pointer-events-none -z-0" />

      <div className="container relative z-10">
        {/* Cabeçalho Oficial do Google Meu Negócio */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm border border-slate-200/90 mb-10 md:mb-12">
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
                <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
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
                  <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200/80">
                    Classificação Máxima
                  </span>
                </div>

                <h2
                  id="google-reviews-title"
                  className="text-lg sm:text-xl font-bold text-evi-deep flex items-center gap-2"
                >
                  <span>Avaliações no Google Meu Negócio</span>
                  <span className="text-xs bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-md">
                    Perfil Verificado
                  </span>
                </h2>
                <p className="text-slate-500 text-sm mt-0.5">
                  Baseado em <strong className="text-slate-800 font-bold">+145 avaliações</strong> e depoimentos de clientes reais atendidos pela <strong>EVI Sociedade de Advogados</strong>.
                </p>
              </div>
            </div>

            {/* Ações e Links Oficiais */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 text-sm font-bold bg-[#1a73e8] hover:bg-[#1557b0] text-white px-5 py-3 rounded-xl shadow-sm transition-all duration-200 active:scale-[0.98]"
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
                className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-slate-700 hover:text-evi-deep bg-slate-100 hover:bg-slate-200 px-4 py-3 rounded-xl transition-colors"
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

        {/* Controles do Carrossel de Depoimentos */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-slate-500">Depoimentos Públicos Reais</span>
            <p className="text-sm font-serif font-bold text-evi-deep">O que nossos clientes dizem sobre nossa atuação</p>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              className={`w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center transition-all ${
                canScrollLeft
                  ? 'bg-white text-slate-800 hover:bg-slate-100 shadow-sm cursor-pointer'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-60'
              }`}
              aria-label="Avaliações anteriores"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              className={`w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center transition-all ${
                canScrollRight
                  ? 'bg-white text-slate-800 hover:bg-slate-100 shadow-sm cursor-pointer'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-60'
              }`}
              aria-label="Próximas avaliações"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Lista Horizontal de Cards de Avaliações */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex items-stretch gap-6 overflow-x-auto pb-6 pt-1 snap-x snap-mandatory scrollbar-none scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {REVIEWS_DATA.map((review) => (
            <article
              key={review.id}
              className="w-[300px] sm:w-[350px] md:w-[370px] flex-shrink-0 snap-start bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-slate-200/90 flex flex-col justify-between"
            >
              <div>
                {/* Topo do Card: Autor, Avatar, Data */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    {review.avatar ? (
                      <img
                        src={review.avatar}
                        alt={review.author}
                        className="w-11 h-11 rounded-full object-cover border border-slate-200 shadow-xs"
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
                      className="w-11 h-11 rounded-full bg-slate-800 text-amber-300 font-bold text-sm items-center justify-center shadow-xs"
                    >
                      {review.initials}
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">
                        {review.author}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <span>{review.timeAgo}</span>
                        {review.badge && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-700 font-medium">{review.badge}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Ícone de Aspas Google */}
                  <span className="text-slate-300 font-serif text-3xl leading-none select-none">
                    “
                  </span>
                </div>

                {/* Estrelas */}
                <div className="flex items-center text-[#F4B400] gap-0.5 mb-3" aria-label={`${review.stars} estrelas`}>
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
                <p className="text-slate-700 text-sm leading-relaxed mb-4">
                  "{review.content}"
                </p>
              </div>

              {/* Rodapé do Card */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" className="text-slate-400">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <span>Google Maps</span>
                </span>
                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Ver no Google →
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Indicador de rolagem no mobile */}
        <div className="sm:hidden text-center mt-2 text-xs text-slate-400">
          ← Deslize para ver mais avaliações →
        </div>
      </div>
    </section>
  );
}
