import React from 'react';
import Link from 'next/link';

const areas = [
  {
    num: '01',
    title: 'Direito Médico e Biomédico',
    desc: 'Consultoria geral e análise preventiva de riscos para médicos, interface com hospitais e laboratórios, bioética e avanços biotecnológicos.',
    motion: 'left',
    link: '/areas-de-atuacao#medico',
  },
  {
    num: '02',
    title: 'Trabalhista',
    desc: 'Consultoria preventiva, alinhamento com RH e Medicina do Trabalho, correção de procedimentos e defesas de padrão técnico superior.',
    motion: 'up',
    link: '/areas-de-atuacao#trabalhista',
  },
  {
    num: '03',
    title: 'Empresarial',
    desc: 'Elaboração e análise de contratos mercantis e aplicação estratégica da legislação às práticas de natureza econômica corporativa.',
    motion: 'right',
    link: '/areas-de-atuacao#empresarial',
  },
  {
    num: '04',
    title: 'Cível',
    desc: 'Análise preventiva de contratos e negociações gerais, bem como propositura e condução contenciosa de demandas cíveis e de consumo.',
    motion: 'left',
    link: '/areas-de-atuacao#civel',
  },
  {
    num: '05',
    title: 'Família',
    desc: 'Atuação consultiva e contenciosa em Direito de Família e Sucessões, demandas judiciais e cartorárias, abrangendo relações homoafetivas.',
    motion: 'up',
    link: '/areas-de-atuacao#familia',
  },
  {
    num: '06',
    title: 'Proteção de Dados',
    desc: 'Consultoria em parceria especializada para implementação de programas corporativos em plena conformidade com a LGPD.',
    motion: 'right',
    link: '/areas-de-atuacao#protecao-de-dados',
  },
];

export default function AreasSection() {
  return (
    <section className="section areas" id="atuacao">
      <div className="container">
        <div className="section-head section-head-center motion-item" data-motion="up">
          <span className="eyebrow">Expertise Multidisciplinar de Alta Precisão</span>
          <h2>Advocacia estratégica para decisões determinantes.</h2>
          <p className="max-w-2xl mx-auto text-base text-evi-text-light">
            Da prevenção inteligente à batalha judicial nos tribunais superiores: protegemos seu patrimônio, sua empresa e sua família com soluções sólidas.
          </p>
        </div>

        <div className="area-grid">
          {areas.map((area, idx) => (
            <article key={idx} className="area motion-item" data-motion={area.motion}>
              <span>{area.num}</span>
              <h3>{area.title}</h3>
              <p>{area.desc}</p>
              <Link href={area.link} className="font-bold">
                Conhecer atuação detalhada →
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/areas-de-atuacao" className="btn btn-outline">
            Ver todas as Áreas de Atuação →
          </Link>
        </div>
      </div>
    </section>
  );
}
