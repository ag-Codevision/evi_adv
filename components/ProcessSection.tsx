'use client';

import React from 'react';
import EditableText from './admin/EditableText';

export default function ProcessSection() {
  return (
    <section className="section process">
      <div className="container">
        <div className="section-head section-head-center motion-item" data-motion="up">
          <EditableText page="home" section="process" fieldKey="eyebrow" defaultContent="Como funciona" as="span" className="eyebrow" />
          <EditableText page="home" section="process" fieldKey="heading" defaultContent="Um caminho claro desde o primeiro contato." as="h2" />
          <EditableText page="home" section="process" fieldKey="desc" defaultContent="Organização e transparência para que você compreenda o andamento e participe das decisões." as="p" className="section-subtitle" multiline />
        </div>
        <div className="steps">
          <article className="step motion-item" data-motion="left">
            <b>01</b>
            <EditableText page="home" section="process" fieldKey="s1_title" defaultContent="Primeiro contato" as="h3" />
            <EditableText page="home" section="process" fieldKey="s1_desc" defaultContent="Você apresenta a situação e os objetivos principais." as="p" />
          </article>
          <article className="step motion-item" data-motion="up">
            <b>02</b>
            <EditableText page="home" section="process" fieldKey="s2_title" defaultContent="Análise inicial" as="h3" />
            <EditableText page="home" section="process" fieldKey="s2_desc" defaultContent="O contexto e os documentos disponíveis são avaliados." as="p" />
          </article>
          <article className="step motion-item" data-motion="up">
            <b>03</b>
            <EditableText page="home" section="process" fieldKey="s3_title" defaultContent="Estratégia" as="h3" />
            <EditableText page="home" section="process" fieldKey="s3_desc" defaultContent="São explicados os caminhos possíveis, riscos e próximos passos." as="p" />
          </article>
          <article className="step motion-item" data-motion="right">
            <b>04</b>
            <EditableText page="home" section="process" fieldKey="s4_title" defaultContent="Acompanhamento" as="h3" />
            <EditableText page="home" section="process" fieldKey="s4_desc" defaultContent="O caso é conduzido com atualizações e comunicação objetiva." as="p" />
          </article>
        </div>
      </div>
    </section>
  );
}
