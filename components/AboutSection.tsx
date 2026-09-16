import React from 'react';
import Link from 'next/link';

export default function AboutSection() {
  return (
    <>
      <section className="section" id="escritorio">
      <div className="container about-grid">
        <div className="about-visual motion-item" data-motion="left">
          <img
            src="/img/estrutura/recepcao.jpg"
            alt="Recepção e sede corporativa da EVI Sociedade de Advogados"
            loading="lazy"
            className="rounded-3xl shadow-evi-card border border-evi-border w-full h-auto"
          />
          <div className="about-badge">
            <strong>25 Anos de Vanguarda</strong>
            <small>Fundado pelo Dr. Eduardo Veríssimo</small>
          </div>
        </div>
        <div className="about-copy motion-item" data-motion="right">
          <span className="eyebrow">Sobre o Escritório</span>
          <h2>Autoridade jurídica e acolhimento humano real.</h2>
          <p>
            Fundada em 2001 pelo <strong>Dr. Eduardo Veríssimo Inocente</strong>, a <strong>EVI Sociedade de Advogados</strong> une um quarto de século de tradição a soluções contemporâneas e dinâmicas. Com sede própria no Ipiranga (São Paulo) e atuação em todo o território nacional, representamos empresas e famílias em decisões críticas de alto impacto.
          </p>
          <p className="mt-4 text-muted">
            Nossa prática alia rigor técnico processual a um atendimento personalizado e consultivo, assegurando solidez jurídica e tranquilidade para cada cliente.
          </p>
        </div>
      </div>
    </section>

    {/* Minisseção Clara: Pilares & Diferenciais de Atuação */}
    <section className="about-values-strip">
      <div className="container">
        <div className="values-grid motion-item" data-motion="up">
          <div className="value-card">
            <div className="value-icon">✓</div>
            <div className="value-content">
              <strong>Liderança do Dr. Eduardo Veríssimo</strong>
              <p>Mestre em Direitos Difusos, autor de livro, ex-instrutor de Ética da OAB e fonte de grandes redes de TV.</p>
            </div>
          </div>

          <div className="value-card">
            <div className="value-icon">✓</div>
            <div className="value-content">
              <strong>Suporte Emocional Exclusivo</strong>
              <p>Programa pioneiro com 2 sessões de psicanálise gratuitas para que o cliente enfrente litígios com serenidade.</p>
            </div>
          </div>

          <div className="value-card">
            <div className="value-icon">✓</div>
            <div className="value-content">
              <strong>Chancela Internacional & Prêmios</strong>
              <p>Membership oficial do IBI (International Business Institute) e laureado com o Prêmio QUALITY JUSTIÇA.</p>
            </div>
          </div>
        </div>

        <div className="values-actions motion-item" data-motion="up">
          <Link className="btn btn-primary" href="/quem-somos">
            Conhecer Nossa História de 25 Anos →
          </Link>
          <Link className="btn btn-outline" href="/diferenciais">
            Ver Todos os Diferenciais
          </Link>
        </div>
      </div>
    </section>
    </>
  );
}
