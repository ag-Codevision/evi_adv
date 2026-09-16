import React from 'react';

export default function ProcessSection() {
  return (
    <section className="section process">
      <div className="container">
        <div className="section-head section-head-center motion-item" data-motion="up">
          <span className="eyebrow">Como funciona</span>
          <h2>Um caminho claro desde o primeiro contato.</h2>
          <p>
            Organização e transparência para que você compreenda o andamento e participe das decisões.
          </p>
        </div>
        <div className="steps">
          <article className="step motion-item" data-motion="left">
            <b>01</b>
            <h3>Primeiro contato</h3>
            <p>Você apresenta a situação e os objetivos principais.</p>
          </article>
          <article className="step motion-item" data-motion="up">
            <b>02</b>
            <h3>Análise inicial</h3>
            <p>O contexto e os documentos disponíveis são avaliados.</p>
          </article>
          <article className="step motion-item" data-motion="up">
            <b>03</b>
            <h3>Estratégia</h3>
            <p>São explicados os caminhos possíveis, riscos e próximos passos.</p>
          </article>
          <article className="step motion-item" data-motion="right">
            <b>04</b>
            <h3>Acompanhamento</h3>
            <p>O caso é conduzido com atualizações e comunicação objetiva.</p>
          </article>
        </div>
      </div>
    </section>
  );
}
