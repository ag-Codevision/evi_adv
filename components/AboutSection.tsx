'use client';

import React from 'react';
import EditableText from './admin/EditableText';
import EditableMedia from './admin/EditableMedia';
import EditableLink from './admin/EditableLink';

export default function AboutSection() {
  return (
    <>
      <section className="section" id="escritorio">
      <div className="container about-grid">
        <div className="about-visual motion-item" data-motion="left">
          <EditableMedia page="home" section="about" fieldKey="image" defaultSrc="/img/estrutura/recepcao.jpg" alt="Recepção e sede corporativa da EVI Sociedade de Advogados" className="rounded-3xl shadow-evi-card border border-evi-border w-full h-auto" />
          <div className="about-badge">
            <EditableText page="home" section="about" fieldKey="badge" defaultContent="25 Anos de Vanguarda" as="strong" />
            <EditableText page="home" section="about" fieldKey="sub_badge" defaultContent="Fundado pelo Dr. Eduardo Veríssimo Inocente" as="small" />
          </div>
        </div>
        <div className="about-copy motion-item" data-motion="right">
          <EditableText page="home" section="about" fieldKey="eyebrow" defaultContent="Sobre o Escritório" as="span" className="eyebrow" />
          <EditableText page="home" section="about" fieldKey="heading" defaultContent="Autoridade jurídica e acolhimento humano real." as="h2" />
          <EditableText page="home" section="about" fieldKey="p1" defaultContent="Fundada em 2001 pelo Dr. Eduardo Veríssimo Inocente, a EVI Sociedade de Advogados une há mais de duas décadas tradição a soluções contemporâneas e dinâmicas. Com sede própria no Ipiranga (São Paulo) e atuação em todo o território nacional, representamos empresas e famílias em decisões críticas de alto impacto." as="p" multiline />
          <EditableText page="home" section="about" fieldKey="p2" defaultContent="Nossa prática alia rigor técnico processual a um atendimento personalizado e consultivo, assegurando solidez jurídica e tranquilidade para cada cliente." as="p" className="mt-4 text-muted" multiline />
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
              <EditableText page="home" section="about" fieldKey="v1_title" defaultContent="Liderança do Dr. Eduardo Veríssimo Inocente" as="strong" />
              <EditableText page="home" section="about" fieldKey="v1_desc" defaultContent="Mestre em Direitos Difusos, autor de livro, ex-instrutor de Ética da OAB e fonte de grandes redes de TV." as="p" />
            </div>
          </div>

          <div className="value-card">
            <div className="value-icon">✓</div>
            <div className="value-content">
              <EditableText page="home" section="about" fieldKey="v2_title" defaultContent="Suporte Emocional Exclusivo" as="strong" />
              <EditableText page="home" section="about" fieldKey="v2_desc" defaultContent="Programa pioneiro com 2 sessões de psicanálise gratuitas para que o cliente enfrente litígios com serenidade." as="p" />
            </div>
          </div>

          <div className="value-card">
            <div className="value-icon">✓</div>
            <div className="value-content">
              <EditableText page="home" section="about" fieldKey="v3_title" defaultContent="Chancela Internacional & Prêmios" as="strong" />
              <EditableText page="home" section="about" fieldKey="v3_desc" defaultContent="Membership oficial do IBI (International Business Institute) e laureado com o Prêmio QUALITY JUSTIÇA." as="p" />
            </div>
          </div>
        </div>

        <div className="values-actions motion-item" data-motion="up">
          <EditableLink page="home" section="about" fieldKey="cta1" defaultLabel="Conhecer Nossa História de 25 Anos →" defaultHref="/quem-somos" className="btn btn-primary" />
          <EditableLink page="home" section="about" fieldKey="cta2" defaultLabel="Ver Todos os Diferenciais" defaultHref="/diferenciais" className="btn btn-outline" />
        </div>
      </div>
    </section>
    </>
  );
}
