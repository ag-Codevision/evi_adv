import React from 'react';

export default function AboutSection() {
  return (
    <section className="section" id="escritorio">
      <div className="container about-grid">
        <div className="about-visual motion-item" data-motion="left">
          <img
            src="/assets/escritorio.webp"
            alt="Estrutura e equipe de EVI Sociedade de Advogados"
            loading="lazy"
          />
          <div className="about-badge">
            <strong>EVI Advogados</strong>
            <small>Advocacia com propósito</small>
          </div>
        </div>
        <div className="about-copy motion-item" data-motion="right">
          <span className="eyebrow">O escritório</span>
          <h2>Prevenção e contencioso conectados em uma visão completa.</h2>
          <p>
            A EVI reúne profissionais experientes e atuação multidisciplinar para antecipar riscos e conduzir conflitos. O atendimento nacional integra consultoria, estratégia e acompanhamento jurídico responsável.
          </p>
          <div className="values">
            <div className="value">
              <i>✓</i>
              <div>
                <strong>Análise individual</strong>
                <span>Cada situação é compreendida antes da definição de qualquer estratégia.</span>
              </div>
            </div>
            <div className="value">
              <i>✓</i>
              <div>
                <strong>Comunicação transparente</strong>
                <span>Informações objetivas sobre possibilidades, riscos e próximos passos.</span>
              </div>
            </div>
            <div className="value">
              <i>✓</i>
              <div>
                <strong>Atuação responsável</strong>
                <span>Compromisso técnico e ético, sem promessas de resultado.</span>
              </div>
            </div>
          </div>
          <a className="btn btn-outline" href="#contato">
            Ver canais de contato
          </a>
        </div>
      </div>
    </section>
  );
}
