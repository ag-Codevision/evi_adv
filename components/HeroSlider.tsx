'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const targetOffsetRef = useRef({ x: 0, y: 0, spotX: 50, spotY: 50 });
  const currentOffsetRef = useRef({ x: 0, y: 0, spotX: 50, spotY: 50 });

  const SLIDE_DURATION = 5500; // 5.5 segundos para cadência cinematográfica

  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev === 0 ? 1 : 0));
    }, SLIDE_DURATION);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? 1 : 0));
    startTimer();
  }, [startTimer]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 1 ? 0 : 1));
    startTimer();
  }, [startTimer]);

  const goToSlide = useCallback(
    (index: number) => {
      setCurrentSlide(index);
      startTimer();
    },
    [startTimer]
  );

  // Suporte a gesto de arrasto / swipe touch no mobile
  const touchStartXRef = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!e.touches || e.touches.length === 0) return;
    touchStartXRef.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    if (!e.changedTouches || e.changedTouches.length === 0) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;
    // Se arrastou mais de 40px
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartXRef.current = null;
  };

  // Iniciar timer do slider contínuo com respeito à visibilidade da aba
  useEffect(() => {
    startTimer();

    const handleVisibility = () => {
      if (document.hidden) {
        stopTimer();
      } else {
        startTimer();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      stopTimer();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [startTimer, stopTimer]);

  // Listener de mouse para Parallax 2.5D e Spotlight dinâmico
  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl) return;

    // Checar preferência de redução de movimento
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = heroEl.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      // Limitar entre 0 e 1
      const clampedX = Math.max(0, Math.min(1, x));
      const clampedY = Math.max(0, Math.min(1, y));

      // Deslocamento de parallax sutil: -20px a +20px no background
      targetOffsetRef.current = {
        x: (clampedX - 0.5) * -22,
        y: (clampedY - 0.5) * -14,
        spotX: clampedX * 100,
        spotY: clampedY * 100,
      };
    };

    const handlePointerLeave = () => {
      targetOffsetRef.current = { x: 0, y: 0, spotX: 50, spotY: 50 };
    };

    heroEl.addEventListener('pointermove', handlePointerMove, { passive: true });
    heroEl.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    // Loop de interpolação Lerp suave a 60fps
    let isRunning = true;
    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const tick = () => {
      if (!isRunning) return;

      const cur = currentOffsetRef.current;
      const tar = targetOffsetRef.current;

      cur.x = lerp(cur.x, tar.x, 0.06);
      cur.y = lerp(cur.y, tar.y, 0.06);
      cur.spotX = lerp(cur.spotX, tar.spotX, 0.08);
      cur.spotY = lerp(cur.spotY, tar.spotY, 0.08);

      setParallaxOffset({ x: cur.x, y: cur.y });
      setSpotlightPos({ x: cur.spotX, y: cur.spotY });

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      isRunning = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      heroEl.removeEventListener('pointermove', handlePointerMove);
      heroEl.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  // Canvas com partículas sutis de poeira luminosa (ambient light motes)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Respeita acessibilidade
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Criar partículas sutis
    const particleCount = window.innerWidth < 768 ? 12 : 24;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.6,
      speedY: Math.random() * 0.22 + 0.08,
      speedX: (Math.random() - 0.5) * 0.12,
      opacity: Math.random() * 0.45 + 0.15,
      fadeSpeed: Math.random() * 0.006 + 0.003,
      fadeDirection: Math.random() > 0.5 ? 1 : -1,
    }));

    let animId: number;
    let isVisible = true;

    // Desligar render quando não estiver na viewport para poupar bateria e GPU
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(canvas);

    const render = () => {
      if (!isVisible) {
        animId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.y -= p.speedY;
        p.x += p.speedX;

        // Pulsação suave de brilho
        p.opacity += p.fadeSpeed * p.fadeDirection;
        if (p.opacity > 0.6) {
          p.opacity = 0.6;
          p.fadeDirection = -1;
        } else if (p.opacity < 0.08) {
          p.opacity = 0.08;
          p.fadeDirection = 1;
        }

        // Reposicionar quando sair da tela
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(184, 199, 214, ${p.opacity.toFixed(3)})`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.35)';
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, []);

  return (
    <section
      className="hero"
      id="inicio"
      ref={heroRef}
      aria-label="Apresentação institucional EVI Advogados"
    >
      {/* CAMADA 1: BACKGROUND CINEMATOGRÁFICO DE ALTA DEFINIÇÃO */}
      <div className="hero-cinematic-stage" aria-hidden="true">
        {/* Imagem de Fundo com Parallax e Escala Lenta */}
        <div
          className="hero-bg-media"
          style={{
            transform: `translate3d(${parallaxOffset.x.toFixed(2)}px, ${parallaxOffset.y.toFixed(2)}px, 0) scale(1.045)`,
          }}
        />

        {/* Gradientes Atmosféricos de Estúdio: Vinhetagem e Máscara de Leitura */}
        <div className="hero-vignette" />

        {/* Efeito React Bits: Beams / Linhas de Luz Volumétricas Sutis */}
        <div className="hero-light-beams" />

        {/* Efeito React Bits: Spotlight Interativo com Perseguição de Cursor */}
        <div
          className="hero-interactive-spotlight"
          style={{
            background: `radial-gradient(circle 620px at ${spotlightPos.x.toFixed(1)}% ${spotlightPos.y.toFixed(1)}%, rgba(135, 175, 215, 0.16) 0%, rgba(24, 40, 58, 0.08) 45%, transparent 75%)`,
          }}
        />

        {/* Canvas de Partículas / Poeira de Luz Flutuante */}
        <canvas ref={canvasRef} className="hero-particles-canvas" />

        {/* Film Grain Analógico Texturizado (Zero banding, sensação cinematográfica) */}
        <div className="hero-film-grain" />
      </div>

      {/* CONTROLES DE NAVEGAÇÃO LATERAL (AEROSPACE FROSTED GLASS) */}
      <button
        type="button"
        className="hero-arrow-btn hero-arrow-prev"
        onClick={prevSlide}
        aria-label="Slide anterior"
      >
        <svg
          viewBox="0 0 24 24"
          width="22"
          height="22"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <button
        type="button"
        className="hero-arrow-btn hero-arrow-next"
        onClick={nextSlide}
        aria-label="Próximo slide"
      >
        <svg
          viewBox="0 0 24 24"
          width="22"
          height="22"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* CONTEÚDO PRINCIPAL FOREGROUND */}
      <div className="container hero-grid">
        <div
          className="hero-slider-wrap"
          id="heroSlider"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* SLIDE 0: 25 ANOS DE HISTÓRIA & AUTORIDADE NACIONAL */}
          <div
            className={`hero-slide-panel ${currentSlide === 0 ? 'active' : ''}`}
            aria-hidden={currentSlide !== 0}
          >
            <div className="hero-copy">
              {/* Logomarca de 25 Anos com Revelação e Efeito de Luz */}
              <div className="hero-logo-box">
                <img
                  src="/assets/logo_25_anos.webp"
                  alt="25 Anos EVI Sociedade de Advogados"
                  className="hero-logo-25"
                  width={420}
                  height={310}
                />
              </div>

              {/* Texto de Apoio Intacto */}
              <p>
                Sob a liderança do <strong>Dr. Eduardo Veríssimo Inocente</strong>, há mais de duas décadas construímos estratégias jurídicas de alta precisão para proteger negócios, preservar patrimônios e vencer disputas complexas em todo o Brasil.
              </p>

              {/* Ações e Botões com Microinterações e Shimmer Metálico */}
              <div className="hero-actions">
                <a
                  className="btn btn-wa btn-shine-effect"
                  href="https://wa.me/5511991390045?text=Ol%C3%A1%2C%20encontrei%20o%20site%20e%20gostaria%20de%20receber%20uma%20orienta%C3%A7%C3%A3o%20jur%C3%ADdica%20com%20o%20Dr.%20Eduardo."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="wa-icon" viewBox="0 0 16 16" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.25a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.591-6.592 6.591zm3.615-4.934c-.197-.1-1.17-.578-1.353-.643-.182-.064-.315-.096-.445.1-.133.197-.514.643-.63.775-.116.133-.232.15-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.17-1.101-1.37-.116-.197-.013-.304.087-.403.09-.089.197-.232.296-.348.1-.116.133-.197.197-.33.064-.133.033-.25-.017-.348-.05-.1-.445-1.075-.61-1.47-.16-.389-.326-.336-.445-.343-.116-.007-.25-.007-.38-.007a.729.729 0 0 0-.527.245c-.182.197-.691.676-.691 1.648s.708 1.912.807 2.045c.1.133 1.394 2.13 3.38 2.99.473.204.84.326 1.129.416.473.15.904.129 1.244.078.38-.058 1.17-.48 1.337-.943.164-.464.164-.86.116-.943-.05-.084-.182-.133-.38-.232z"
                    />
                  </svg>
                  <span>Agende uma Consulta</span>
                </a>
                <a className="btn btn-outline btn-glass-hover" href="#autoridade">
                  Ver Reconhecimento na Mídia
                </a>
              </div>
            </div>
          </div>

          {/* SLIDE 1: MÍDIA, TV & ESTRATÉGIA DE ELITE */}
          <div
            className={`hero-slide-panel ${currentSlide === 1 ? 'active' : ''}`}
            aria-hidden={currentSlide !== 1}
          >
            <div className="hero-copy">
              <div className="hero-heading-group">
                <span className="eyebrow">Autoridade Jurídica na Mídia Nacional</span>
                <h1 className="hero-cinematic-title">
                  A assessoria jurídica que a grande mídia respeita, ao lado da sua empresa!
                </h1>
              </div>
              <p>
                O Dr. Eduardo Veríssimo Inocente foi destaque na <strong>Band News</strong>, <strong>SBT</strong>, <strong>Rede Brasil</strong>, <strong>CNN</strong>, <strong>Globo Repórter</strong>, <strong>Estadão</strong>, <strong>Veja</strong>, capa da <strong>International Business Magazine</strong> e capa da <strong>Revista Prospere</strong>. Conduzimos todos os casos com segurança, ética e eficácia comprovada.
              </p>
              <div className="hero-actions">
                <a
                  className="btn btn-wa btn-shine-effect"
                  href="https://wa.me/5511991390045?text=Ol%C3%A1%2C%20vi%20a%20atua%C3%A7%C3%A3o%20da%20EVI%20e%20gostaria%20de%20uma%20consulta%20estrat%C3%A9gica."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="wa-icon" viewBox="0 0 16 16" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.25a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.591-6.592 6.591zm3.615-4.934c-.197-.1-1.17-.578-1.353-.643-.182-.064-.315-.096-.445.1-.133.197-.514.643-.63.775-.116.133-.232.15-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.17-1.101-1.37-.116-.197-.013-.304.087-.403.09-.089.197-.232.296-.348.1-.116.133-.197.197-.33.064-.133.033-.25-.017-.348-.05-.1-.445-1.075-.61-1.47-.16-.389-.326-.336-.445-.343-.116-.007-.25-.007-.38-.007a.729.729 0 0 0-.527.245c-.182.197-.691.676-.691 1.648s.708 1.912.807 2.045c.1.133 1.394 2.13 3.38 2.99.473.204.84.326 1.129.416.473.15.904.129 1.244.078.38-.058 1.17-.48 1.337-.943.164-.464.164-.86.116-.943-.05-.084-.182-.133-.38-.232z"
                    />
                  </svg>
                  <span>Agende uma Consulta</span>
                </a>
                <Link className="btn btn-outline btn-glass-hover" href="/quem-somos#dr-eduardo">
                  Conhecer o Dr. Eduardo Veríssimo Inocente
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* NAVEGAÇÃO POR PONTOS & BARRA TEMPORAL DISCRETA */}
        <div className="hero-pagination-wrap" aria-label="Controle de slides da Hero">
          <button
            type="button"
            className={`hero-dot ${currentSlide === 0 ? 'active' : ''}`}
            onClick={() => goToSlide(0)}
            aria-label="Ver slide 1 - 25 Anos"
          >
            <span className="hero-dot-bar" key={currentSlide === 0 ? 'active-dot-0' : 'inactive-dot-0'} />
          </button>
          <button
            type="button"
            className={`hero-dot ${currentSlide === 1 ? 'active' : ''}`}
            onClick={() => goToSlide(1)}
            aria-label="Ver slide 2 - Reconhecimento na Mídia"
          >
            <span className="hero-dot-bar" key={currentSlide === 1 ? 'active-dot-1' : 'inactive-dot-1'} />
          </button>
        </div>
      </div>
    </section>
  );
}
