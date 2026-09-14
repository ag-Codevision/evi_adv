'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev === 0 ? 1 : 0));
    }, 6000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, []);

  useEffect(() => {
    // Carrega dinamicamente o script do Glass Reveal WebGL após montagem
    if (typeof window !== 'undefined') {
      // Configuração global de assets para o glass reveal
      (window as any).__GLASS_REVEAL_ASSETS__ = {
        inside: '/assets/banner_color.webp',
        outside: '/assets/banner_pb.webp',
      };

      const existingScript = document.getElementById('glass-reveal-script');
      if (!existingScript) {
        const scriptData = document.createElement('script');
        scriptData.src = '/assets/banner-data.js';
        scriptData.async = true;

        const scriptReveal = document.createElement('script');
        scriptReveal.id = 'glass-reveal-script';
        scriptReveal.src = '/assets/glass-reveal.js';
        scriptReveal.async = true;

        scriptData.onload = () => {
          document.body.appendChild(scriptReveal);
        };

        document.body.appendChild(scriptData);
      }
    }
  }, []);

  return (
    <section className="hero" id="inicio">
      <div className="container hero-grid">
        <div
          className="hero-slider-wrap"
          id="heroSlider"
          onPointerEnter={stopTimer}
          onPointerLeave={startTimer}
        >
          {/* SLIDE 0: 25 ANOS DE TRADIÇÃO */}
          <div
            className={`hero-slide-panel ${currentSlide === 0 ? 'active' : ''}`}
            aria-hidden={currentSlide !== 0}
          >
            <div className="hero-copy">
              <span className="eyebrow">Desde 2001 · 25 Anos de Tradição</span>
              <div className="hero-logo-box">
                <img
                  src="/assets/logo_25_anos.png"
                  alt="25 Anos EVI Sociedade de Advogados"
                  className="hero-logo-25"
                />
              </div>
              <p>
                Um quarto de século dedicando excelência jurídica, solidez e inovação estratégica na defesa e estruturação de empresas em todo o território nacional.
              </p>
              <div className="hero-actions">
                <a
                  className="btn btn-wa"
                  href="https://wa.me/5511991390045?text=Ol%C3%A1%2C%20encontrei%20o%20site%20e%20gostaria%20de%20receber%20uma%20orienta%C3%A7%C3%A3o%20jur%C3%ADdica."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="wa-icon" viewBox="0 0 16 16" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.25a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.591-6.592 6.591zm3.615-4.934c-.197-.1-1.17-.578-1.353-.643-.182-.064-.315-.096-.445.1-.133.197-.514.643-.63.775-.116.133-.232.15-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.17-1.101-1.37-.116-.197-.013-.304.087-.403.09-.089.197-.232.296-.348.1-.116.133-.197.197-.33.064-.133.033-.25-.017-.348-.05-.1-.445-1.075-.61-1.47-.16-.389-.326-.336-.445-.343-.116-.007-.25-.007-.38-.007a.729.729 0 0 0-.527.245c-.182.197-.691.676-.691 1.648s.708 1.912.807 2.045c.1.133 1.394 2.13 3.38 2.99.473.204.84.326 1.129.416.473.15.904.129 1.244.078.38-.058 1.17-.48 1.337-.943.164-.464.164-.86.116-.943-.05-.084-.182-.133-.38-.232z"
                    />
                  </svg>
                  <span>Falar com especialista</span>
                </a>
                <a className="btn btn-outline" href="#atuacao">
                  Conhecer áreas
                </a>
              </div>
              <div className="trust">
                <span className="stars">★★★★★</span>
                <div>
                  <strong>25 Anos de história</strong>
                  <small>Mais de duas décadas de liderança</small>
                </div>
              </div>
            </div>
          </div>

          {/* SLIDE 1: ESTRATÉGIA JURÍDICA */}
          <div
            className={`hero-slide-panel ${currentSlide === 1 ? 'active' : ''}`}
            aria-hidden={currentSlide !== 1}
          >
            <div className="hero-copy">
              <span className="eyebrow">Excelência Jurídica</span>
              <h1>Estratégia jurídica para momentos decisivos.</h1>
              <p>
                Consultoria e contencioso sob medida para proteger seus interesses, antecipar riscos e construir soluções jurídicas sustentáveis.
              </p>
              <div className="hero-actions">
                <a
                  className="btn btn-wa"
                  href="https://wa.me/5511991390045?text=Ol%C3%A1%2C%20encontrei%20o%20site%20e%20gostaria%20de%20receber%20uma%20orienta%C3%A7%C3%A3o%20jur%C3%ADdica."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="wa-icon" viewBox="0 0 16 16" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.25a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.591-6.592 6.591zm3.615-4.934c-.197-.1-1.17-.578-1.353-.643-.182-.064-.315-.096-.445.1-.133.197-.514.643-.63.775-.116.133-.232.15-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.17-1.101-1.37-.116-.197-.013-.304.087-.403.09-.089.197-.232.296-.348.1-.116.133-.197.197-.33.064-.133.033-.25-.017-.348-.05-.1-.445-1.075-.61-1.47-.16-.389-.326-.336-.445-.343-.116-.007-.25-.007-.38-.007a.729.729 0 0 0-.527.245c-.182.197-.691.676-.691 1.648s.708 1.912.807 2.045c.1.133 1.394 2.13 3.38 2.99.473.204.84.326 1.129.416.473.15.904.129 1.244.078.38-.058 1.17-.48 1.337-.943.164-.464.164-.86.116-.943-.05-.084-.182-.133-.38-.232z"
                    />
                  </svg>
                  <span>Agendar consulta</span>
                </a>
                <a className="btn btn-outline" href="#escritorio">
                  Conheça o escritório
                </a>
              </div>
              <div className="trust">
                <span className="stars">★★★★★</span>
                <div>
                  <strong>Atuação multidisciplinar</strong>
                  <small>Estratégia de alto impacto</small>
                </div>
              </div>
            </div>
          </div>

          {/* NAVEGAÇÃO DOS SLIDES (DOTS) */}
          <div className="hero-slider-nav" role="tablist" aria-label="Controle de slides da apresentação">
            <button
              type="button"
              className={`hero-slider-dot ${currentSlide === 0 ? 'active' : ''}`}
              role="tab"
              aria-selected={currentSlide === 0}
              aria-label="Slide 1 de 2: 25 Anos"
              onClick={() => {
                setCurrentSlide(0);
                startTimer();
              }}
            >
              <span className="hero-slider-bar" />
            </button>
            <button
              type="button"
              className={`hero-slider-dot ${currentSlide === 1 ? 'active' : ''}`}
              role="tab"
              aria-selected={currentSlide === 1}
              aria-label="Slide 2 de 2: Estratégia Jurídica"
              onClick={() => {
                setCurrentSlide(1);
                startTimer();
              }}
            >
              <span className="hero-slider-bar" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
