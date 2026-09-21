'use client';

import React from 'react';
import Link from 'next/link';
import EditableText from './admin/EditableText';
import EditableMedia from './admin/EditableMedia';
import EditableLink from './admin/EditableLink';

const mediaHighlights = [
  {
    id: 'nani_venancio',
    outlet: 'Rede Brasil de Televisão',
    tag: 'Programa Tarde Top com Nani Venâncio',
    title: 'Análise Jurídica com a Apresentadora Nani Venâncio',
    desc: 'O Dr. Eduardo Veríssimo Inocente foi entrevistado em rede nacional para esclarecer direitos fundamentais e segurança jurídica para famílias e empresas.',
    image: '/img/imprensa/nani-venancio.jpg',
    link: '/imprensa/participacao-do-dr-eduardo-verissimo-inocente-no-programa-tarde-top',
    isExternal: false,
  },
  {
    id: 'band_news',
    outlet: 'Band News TV',
    tag: 'Empresários de Sucesso',
    title: 'Modelo Inovador de Assessoria Jurídica na Band News',
    desc: 'Entrevista do Dr. Eduardo sobre os métodos contemporâneos de preservação de empresas, blindagem preventiva e reestruturação corporativa.',
    image: '/img/imprensa/band-news.png',
    link: '/imprensa/entrevista-dr-eduardo-empresarios-de-sucesso',
    isExternal: false,
  },
  {
    id: 'ib_magazine',
    outlet: 'International Business Magazine',
    tag: 'Destaque de Capa Internacional',
    title: '“Assessoria Jurídica Moderna e Inovadora é a Marca da EVI”',
    desc: 'Reconhecimento editorial internacional ressaltando os mais de 20 anos de vanguarda, solidez e liderança da EVI Advogados.',
    image: '/img/imprensa/ib-magazine.png',
    link: '/imprensa/destaque-publicado-pela-international-business-magazine',
    isExternal: false,
  },
  {
    id: 'sbt_sinistros',
    outlet: 'SBT - Sistema Brasileiro de Televisão',
    tag: 'Jornal do SBT - SP',
    title: 'Entrevista SBT: Responsabilidade Civil e Perícias em Sinistros',
    desc: 'Esclarecimentos técnicos ao vivo sobre medidas cautelares, indenizações e perícias judiciais de impacto à coletividade.',
    image: '/img/imprensa/sbt-entrevista.jpg',
    link: '/imprensa/entrevista-jornal-do-sbt-sp-explosao-em-academia-afeta-casas-vizinhas',
    isExternal: false,
  },
  {
    id: 'premio_quality',
    outlet: 'Prêmio QUALITY JUSTIÇA',
    tag: 'Excelência & Ética',
    title: 'Comenda Oficial de Responsabilidade Social e Justiça',
    desc: 'Reconhecimento público ao compromisso ético e à excelência dos serviços prestados pela EVI Advogados nas comunidades onde atua.',
    image: '/img/imprensa/premio-quality.jpg',
    link: '/imprensa/premio-quality-justica',
    isExternal: false,
  },
  {
    id: 'ibi_membership',
    outlet: 'International Business Institute (IBI)',
    tag: 'Chancela Global',
    title: 'Membership Internacional em Governança Jurídica',
    desc: 'Atestado de conformidade com os mais rigorosos padrões internacionais de governança, sigilo e soluções jurídicas para negócios.',
    image: '/img/imprensa/certificado-ibi.jpg',
    link: '/imprensa/certificado-ibi',
    isExternal: false,
  },
];

export default function MediaAuthoritySection() {
  return (
    <section className="section bg-[#f8fafb] border-y border-evi-border/80" id="autoridade">
      <div className="container">
        <div className="section-head section-head-center motion-item" data-motion="up">
          <EditableText
            page="home"
            section="autoridade"
            fieldKey="eyebrow"
            defaultContent="Autoridade Consagrada · Presença Nacional"
            as="span"
            className="eyebrow inline-block justify-center"
          />

          <EditableText
            page="home"
            section="autoridade"
            fieldKey="heading"
            defaultContent="Reconhecimento, Mídia e Solidez Comprovada."
            as="h2"
          />

          <EditableText
            page="home"
            section="autoridade"
            fieldKey="subheading"
            defaultContent="A liderança estratégica do Dr. Eduardo Veríssimo Inocente e da EVI Advogados em evidência nas principais emissoras de televisão, publicações internacionais e prêmios de excelência."
            as="p"
            className="max-w-3xl mx-auto text-evi-text-light text-base md:text-lg"
            multiline
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {mediaHighlights.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-evi-border overflow-hidden shadow-evi-card hover:shadow-evi-hover transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group motion-item"
              data-motion="up"
            >
              <div>
                <div className="aspect-[16/10] w-full overflow-hidden bg-slate-100 relative border-b border-evi-border">
                  <EditableMedia
                    page="home"
                    section="autoridade"
                    fieldKey={`media_img_${item.id}`}
                    defaultSrc={item.image}
                    alt={item.title}
                    imgClassName="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 bg-evi-deep/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider pointer-events-none z-10">
                    {item.outlet}
                  </div>
                </div>

                <div className="p-6">
                  <span className="text-[11px] font-semibold text-evi-accent uppercase tracking-wider block mb-2">
                    {item.tag}
                  </span>
                  <EditableText
                    page="home"
                    section="autoridade"
                    fieldKey={`media_title_${item.id}`}
                    defaultContent={item.title}
                    as="h3"
                    className="text-xl font-serif font-bold text-evi-deep mb-3 leading-snug group-hover:text-evi-accent transition-colors"
                  />
                  <EditableText
                    page="home"
                    section="autoridade"
                    fieldKey={`media_desc_${item.id}`}
                    defaultContent={item.desc}
                    as="p"
                    className="text-sm text-evi-text-light leading-relaxed"
                    multiline
                  />
                </div>
              </div>

              <div className="px-6 pb-6 pt-2">
                <div className="pt-4 border-t border-evi-border/60 flex items-center justify-between">
                  <EditableLink
                    page="home"
                    section="autoridade"
                    fieldKey={`media_link_${item.id}`}
                    defaultLabel={item.isExternal ? 'Assistir reportagem ↗' : 'Ver cobertura →'}
                    defaultHref={item.link}
                    target={item.isExternal ? '_blank' : undefined}
                    rel={item.isExternal ? 'noopener noreferrer' : undefined}
                    className="text-xs font-bold text-evi-deep group-hover:text-evi-accent flex items-center gap-1.5 uppercase tracking-wider"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <EditableLink
            page="home"
            section="autoridade"
            fieldKey="cta"
            defaultLabel="Ver Todas as Aparições na Mídia →"
            defaultHref="/imprensa"
            className="btn btn-outline"
          />
        </div>
      </div>
    </section>
  );
}
