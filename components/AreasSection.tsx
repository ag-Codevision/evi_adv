'use client';

import React from 'react';
import EditableText from './admin/EditableText';
import EditableLink from './admin/EditableLink';

const areas = [
  {
    id: 'a1',
    num: '01',
    title: 'Direito Médico e Biomédico',
    desc: 'Consultoria geral e análise preventiva de riscos para médicos, interface com hospitais e laboratórios, bioética e avanços biotecnológicos.',
    motion: 'left',
    link: '/areas-de-atuacao#medico',
  },
  {
    id: 'a2',
    num: '02',
    title: 'Trabalhista',
    desc: 'Consultoria preventiva, alinhamento com RH e Medicina do Trabalho, correção de procedimentos e defesas de padrão técnico superior.',
    motion: 'up',
    link: '/areas-de-atuacao#trabalhista',
  },
  {
    id: 'a3',
    num: '03',
    title: 'Empresarial',
    desc: 'Elaboração e análise de contratos mercantis e aplicação estratégica da legislação às práticas de natureza econômica corporativa.',
    motion: 'right',
    link: '/areas-de-atuacao#empresarial',
  },
  {
    id: 'a4',
    num: '04',
    title: 'Cível',
    desc: 'Análise preventiva de contratos e negociações gerais, bem como propositura e condução contenciosa de demandas cíveis e de consumo.',
    motion: 'left',
    link: '/areas-de-atuacao#civel',
  },
  {
    id: 'a5',
    num: '05',
    title: 'Família',
    desc: 'Atuação consultiva e contenciosa em Direito de Família e Sucessões, demandas judiciais e cartorárias, abrangendo relações homoafetivas.',
    motion: 'up',
    link: '/areas-de-atuacao#familia',
  },
  {
    id: 'a6',
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
          <EditableText page="home" section="areas" fieldKey="eyebrow" defaultContent="Expertise Multidisciplinar de Alta Precisão" as="span" className="eyebrow" />
          <EditableText page="home" section="areas" fieldKey="heading" defaultContent="Advocacia estratégica para decisões determinantes." as="h2" />
          <EditableText page="home" section="areas" fieldKey="desc" defaultContent="Da prevenção inteligente à batalha judicial nos tribunais superiores: protegemos seu patrimônio, sua empresa e sua família com soluções sólidas." as="p" className="max-w-2xl mx-auto text-base text-evi-text-light" multiline />
        </div>

        <div className="area-grid">
          {areas.map((area, idx) => (
            <article key={idx} className="area motion-item" data-motion={area.motion}>
              <span>{area.num}</span>
              <EditableText page="home" section="areas" fieldKey={`${area.id}_title`} defaultContent={area.title} as="h3" />
              <EditableText page="home" section="areas" fieldKey={`${area.id}_desc`} defaultContent={area.desc} as="p" multiline />
              <EditableLink page="home" section="areas" fieldKey={`${area.id}_link`} defaultLabel="Conhecer atuação detalhada →" defaultHref={area.link} className="font-bold area-link" />
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <EditableLink page="home" section="areas" fieldKey="cta" defaultLabel="Ver todas as Áreas de Atuação →" defaultHref="/areas-de-atuacao" className="btn btn-outline" />
        </div>
      </div>
    </section>
  );
}
