import React from 'react';

const areas = [
  {
    num: '01',
    title: 'Direito Médico',
    desc: 'Consultoria preventiva, análise de riscos e interface jurídica com médicos, hospitais e laboratórios.',
    motion: 'left',
  },
  {
    num: '02',
    title: 'Direito Cível',
    desc: 'Análise de contratos, negociações, orientações e atuação em demandas contenciosas.',
    motion: 'up',
  },
  {
    num: '03',
    title: 'Direito de Família',
    desc: 'Orientação em questões familiares e patrimoniais que exigem condução cuidadosa.',
    motion: 'right',
  },
  {
    num: '04',
    title: 'Direito Trabalhista',
    desc: 'Consultoria preventiva e atuação em situações ligadas às relações de trabalho.',
    motion: 'left',
  },
  {
    num: '05',
    title: 'Direito Empresarial',
    desc: 'Orientação societária, concorrencial e jurídica para decisões empresariais.',
    motion: 'right',
  },
];

export default function AreasSection() {
  return (
    <section className="section areas" id="atuacao">
      <div className="container">
        <div className="section-head section-head-center motion-item" data-motion="up">
          <span className="eyebrow">Áreas de atuação</span>
          <h2>Orientação clara para decisões que não podem esperar.</h2>
          <p>
            Atuação organizada por contexto, com análise individual e comunicação objetiva ao longo de cada etapa.
          </p>
        </div>
        <div className="area-grid">
          {areas.map((area, idx) => (
            <article key={idx} className="area motion-item" data-motion={area.motion}>
              <span>{area.num}</span>
              <h3>{area.title}</h3>
              <p>{area.desc}</p>
              <a
                href="https://wa.me/5511991390045?text=Ol%C3%A1%2C%20encontrei%20o%20site%20e%20gostaria%20de%20receber%20uma%20orienta%C3%A7%C3%A3o%20jur%C3%ADdica."
                target="_blank"
                rel="noopener noreferrer"
              >
                Conversar sobre esta área →
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
