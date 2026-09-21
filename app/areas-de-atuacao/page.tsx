'use client';

import React from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import EditableText from '@/components/admin/EditableText';
import EditableLink from '@/components/admin/EditableLink';
import EditableMediaOrVideo from '@/components/admin/EditableMediaOrVideo';

const areas = [
  {
    id: 'medico',
    title: 'Direito Médico e Biomédico',
    emoji: '🩺',
    tag: 'Saúde & Biotecnologia',
    desc: 'Prestamos consultoria geral aos médicos, envolvendo análise preventiva de riscos, atuando diretamente em interface com hospitais e laboratórios. Atuamos ainda nas relações jurídicas entre o direito e os avanços tecnológicos conectados à medicina e à biotecnologia, com peculiaridades relacionadas ao corpo e à dignidade da pessoa humana.',
    highlights: [
      'Consultoria geral aos médicos com análise preventiva de riscos',
      'Atuação direta em interface com hospitais e laboratórios',
      'Relações jurídicas entre direito, medicina e avanços biotecnológicos',
      'Atenção às peculiaridades ligadas ao corpo e à dignidade da pessoa humana',
    ],
  },
  {
    id: 'trabalhista',
    title: 'Trabalhista',
    emoji: '⚖️',
    tag: 'Prevenção & Defesa Técnica',
    desc: 'Prestamos consultoria geral ao cliente, envolvendo análise preventiva de riscos, corrigindo procedimentos trabalhistas internos, atuando diretamente em interface com diversos departamentos das companhias, tais como Recursos Humanos, Medicina do Trabalho, Segurança do Trabalho, além de realizar defesas trabalhistas com padrão técnico de excelência.',
    highlights: [
      'Consultoria preventiva com identificação e mitigação de riscos',
      'Correção estratégica de procedimentos trabalhistas internos',
      'Interface direta com Recursos Humanos, Medicina e Segurança do Trabalho',
      'Defesas trabalhistas conduzidas com padrão técnico de excelência',
    ],
  },
  {
    id: 'empresarial',
    title: 'Empresarial',
    emoji: '🏢',
    tag: 'Contratos & Atividade Econômica',
    desc: 'Orientamos o cliente na elaboração e análise de contratos mercantis e na aplicação da legislação atinente às atividades do empresário nas práticas de natureza econômica.',
    highlights: [
      'Elaboração e análise aprofundada de contratos mercantis',
      'Aplicação estratégica da legislação às atividades empresariais',
      'Orientação consultiva em práticas de natureza econômica',
      'Prevenção de litígios e segurança jurídica corporativa',
    ],
  },
  {
    id: 'civel',
    title: 'Cível',
    emoji: '📜',
    tag: 'Contratos & Relações de Consumo',
    desc: 'Atuamos de forma preventiva na análise de contratos, negociações e orientações gerais, assim como na esfera contenciosa, com a propositura de ações que envolvam questões cíveis e de consumo.',
    highlights: [
      'Atuação preventiva na análise de contratos e negociações',
      'Orientações jurídicas gerais para clientes corporativos e individuais',
      'Propositura e acompanhamento de ações cíveis e de consumo',
      'Soluções rápidas e seguras na pacificação de controvérsias',
    ],
  },
  {
    id: 'familia',
    title: 'Família',
    emoji: '👨‍👩‍👧‍👦',
    tag: 'Sensibilidade & Planejamento',
    desc: 'Atuamos de forma preventiva orientando nas questões que envolvam casamentos, uniões estáveis, divórcios, partilha de bens, pactos antenupciais e convivenciais, elaboração de testamentos e planejamento sucessório, além de atuar no contencioso que envolva questões de família e sucessões.',
    highlights: [
      'Planejamento sucessório, testamentos e partilhas amigáveis',
      'Orientação preventiva em uniões estáveis, divórcios e pactos antenupciais',
      'Atuação combativa e humanizada no contencioso familiar e de herança',
      '2 sessões de acolhimento psicanalítico gratuitas aos clientes',
    ],
  },
  {
    id: 'protecao-de-dados',
    title: 'Proteção de Dados',
    emoji: '🔒',
    tag: 'LGPD & Segurança Digital',
    desc: 'Atuamos na elaboração de contratos atinentes à proteção de dados e na adequação de procedimentos das empresas em consonância com a Lei Geral de Proteção de Dados (LGPD).',
    highlights: [
      'Elaboração e revisão de contratos específicos de proteção de dados',
      'Adequação completa de rotinas e procedimentos internos à LGPD',
      'Treinamento e mitigação de vulnerabilidades com dados sensíveis',
      'Defesa técnica em autuações da ANPD e ações judiciais indenizatórias',
    ],
  },
];

const pillars = [
  {
    num: '01',
    title: 'Autoridade & Liderança Consagrada',
    subtitle: 'Comandado pelo Dr. Eduardo Veríssimo Inocente',
    desc: 'Mais de duas décadas e meia de atuações de destaque nos tribunais, docência jurídica, publicações de livros de referência e constante presença como fonte de grandes emissoras de TV como Band News, SBT e Rede Brasil.',
    tag: 'Credibilidade Nacional',
  },
  {
    num: '02',
    title: 'Acolhimento Humano & Suporte Emocional',
    subtitle: 'O Pioneirismo do Cuidado Integral',
    desc: 'Entendemos que litígios complexos — sejam disputas societárias, inventários de família ou crises corporativas — geram desgaste emocional severo. Por isso, oferecemos aos nossos clientes um programa exclusivo com 2 sessões gratuitas de suporte e acolhimento com profissional de psicanálise.',
    tag: 'Diferencial Exclusivo',
  },
  {
    num: '03',
    title: 'Chancela Internacional & Reconhecimento',
    subtitle: 'Membro IBI & Capa de Revista Internacional',
    desc: 'Membro oficial do International Business Institute (IBI) desde 2021, laureado com o Prêmio QUALITY JUSTIÇA e capa da International Business Magazine, atestando conformidade com as melhores práticas mundiais de governança jurídica.',
    tag: 'Padrão Internacional',
  },
  {
    num: '04',
    title: 'Estratégia Artesanal & Visão de Negócios',
    subtitle: 'Sem Fórmulas Prontas, com Foco em Soluções',
    desc: 'Cada caso é tratado de maneira única. Unimos o preventivo inteligente para evitar litígios onerosos ao contencioso cirúrgico e implacável para quando a batalha judicial se faz indispensável.',
    tag: 'Alta Performance',
  },
  {
    num: '05',
    title: 'Atuação em Todo o Território Nacional',
    subtitle: 'Da Sede em São Paulo a Qualquer Tribunal do País',
    desc: 'Com uma infraestrutura tecnológica robusta e equipes integradas, atuamos em processos em São Paulo, Brasília (STJ/STF) e em todas as unidades federativas com a mesma agilidade e atenção ao cliente.',
    tag: 'Abrangência Brasil',
  },
  {
    num: '06',
    title: 'Corpo Jurídico Especializado e Multidisciplinar',
    subtitle: 'Domínio em Direito Médico, Empresarial, Família e Cível',
    desc: 'Nossa equipe conjuga advogados seniores, mestres e especialistas que operam de forma coordenada, permitindo avaliar impactos fiscais, societários, contratuais e humanos em cada decisão tomada.',
    tag: 'Equipe de Elite',
  },
];

export default function AreasDeAtuacaoPage() {
  return (
    <>
      <Header />

      <main className="bg-[#f8fafb] min-h-screen py-16">
        <div className="container max-w-6xl">
          {/* Header da Página */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <EditableText
              page="areas_page"
              section="header"
              fieldKey="eyebrow"
              defaultContent="Atuação Jurídica de Excelência"
              as="span"
              className="eyebrow justify-center mb-3"
            />
            <EditableText
              page="areas_page"
              section="header"
              fieldKey="title"
              defaultContent="Áreas de Atuação"
              as="h1"
              className="text-4xl md:text-5xl lg:text-6xl font-serif text-evi-deep font-bold tracking-tight mb-6"
            />
            <EditableText
              page="areas_page"
              section="header"
              fieldKey="desc"
              defaultContent="Combinamos visão de negócios, profundo domínio dogmático e determinação implacável para entregar resultados consistentes nas causas mais sensíveis e decisivas de nossos clientes."
              as="p"
              className="text-evi-text-light text-lg md:text-xl leading-relaxed"
              multiline
            />
          </div>

          {/* Grid de Áreas de Atuação */}
          <div className="space-y-8 mb-16">
            {areas.map((area, idx) => (
              <div
                key={area.id}
                id={area.id}
                className="bg-white rounded-3xl border border-evi-border p-8 md:p-12 shadow-evi-card hover:shadow-evi-hover transition-all duration-300"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <EditableText
                        page="areas_page"
                        section={area.id}
                        fieldKey="tag"
                        defaultContent={area.tag}
                        as="span"
                        className="text-xs font-serif font-bold uppercase tracking-widest text-evi-accent bg-evi-soft px-3 py-1 rounded-full border border-evi-border"
                      />
                      <EditableText
                        page="areas_page"
                        section={area.id}
                        fieldKey="badge_num"
                        defaultContent={`Especialidade 0${idx + 1}`}
                        as="span"
                        className="text-xs text-evi-text-muted"
                      />
                    </div>

                    <EditableText
                      page="areas_page"
                      section={area.id}
                      fieldKey="title"
                      defaultContent={area.title}
                      as="h2"
                      className="text-2xl md:text-3xl font-serif font-bold text-evi-deep"
                    />

                    <EditableText
                      page="areas_page"
                      section={area.id}
                      fieldKey="desc"
                      defaultContent={area.desc}
                      as="p"
                      className="text-base text-evi-text-light leading-relaxed"
                      multiline
                    />

                    <div className="pt-2">
                      <EditableLink
                        page="areas_page"
                        section={area.id}
                        fieldKey="cta"
                        defaultLabel={`Consultar Especialista em ${area.title}`}
                        defaultHref={`https://wa.me/5511991390045?text=Ol%C3%A1%2C%20gostaria%20de%20orienta%C3%A7%C3%A3o%20especializada%20na%20%C3%A1rea%20de%20${encodeURIComponent(area.title)}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-wa text-xs inline-block"
                      />
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-evi-soft/70 rounded-2xl p-6 border border-evi-border/80">
                    <EditableMediaOrVideo
                      page="areas_page"
                      section={area.id}
                      fieldKey="icon_media"
                      defaultType="icon"
                      defaultIcon={area.emoji}
                      compact={true}
                      allowVideo={false}
                      modalTitle={`Ícone / Imagem — ${area.title}`}
                      alt={area.title}
                      className="mb-3 inline-block"
                    />
                    <EditableText
                      page="areas_page"
                      section={area.id}
                      fieldKey="highlights_header"
                      defaultContent="FRENTES DE ATUAÇÃO TÉCNICA:"
                      as="h3"
                      className="text-xs uppercase tracking-wider font-bold text-evi-deep mb-4"
                    />
                    <ul className="space-y-2.5">
                      {area.highlights.map((h, hIdx) => (
                        <li key={hIdx} className="text-xs text-evi-text leading-relaxed flex items-start gap-2.5">
                          <span className="text-evi-accent font-bold mt-0.5">✓</span>
                          <EditableText
                            page="areas_page"
                            section={area.id}
                            fieldKey={`highlight_${hIdx}`}
                            defaultContent={h}
                            as="span"
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Seção de Pilares e Diferenciais */}
          <div id="diferenciais" className="pt-8 mb-16">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <EditableText
                page="areas_page"
                section="diferenciais"
                fieldKey="eyebrow"
                defaultContent="Por Que Escolher a EVI Advogados?"
                as="span"
                className="eyebrow justify-center mb-3"
              />
              <EditableText
                page="areas_page"
                section="diferenciais"
                fieldKey="title"
                defaultContent="Seis Pilares Que Sustentam Nossa Vanguarda de 25 Anos"
                as="h2"
                className="text-3xl md:text-4xl font-serif text-evi-deep font-bold tracking-tight mb-4"
              />
              <EditableText
                page="areas_page"
                section="diferenciais"
                fieldKey="desc"
                defaultContent="Nossa prática vai além do conhecimento da lei: construímos relacionamentos de longo prazo alicerçados em confiança absoluta, coragem técnica e acolhimento humano genuíno."
                as="p"
                className="text-evi-text-light text-base md:text-lg leading-relaxed"
                multiline
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pillars.map((pillar) => (
                <div
                  key={pillar.num}
                  className="bg-white rounded-3xl border border-evi-border p-8 shadow-evi-card hover:shadow-evi-hover transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-2xl font-bold text-evi-accent">
                        {pillar.num}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                        {pillar.tag}
                      </span>
                    </div>

                    <EditableText
                      page="areas_page"
                      section="pillars"
                      fieldKey={`pillar_${pillar.num}_title`}
                      defaultContent={pillar.title}
                      as="h3"
                      className="font-serif text-xl font-bold text-evi-deep"
                    />

                    <EditableText
                      page="areas_page"
                      section="pillars"
                      fieldKey={`pillar_${pillar.num}_desc`}
                      defaultContent={pillar.desc}
                      as="p"
                      className="text-xs text-evi-text-light leading-relaxed"
                      multiline
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Banner de Chamada para Ação */}
          <div className="bg-evi-deep text-white rounded-3xl p-8 md:p-14 text-center max-w-4xl mx-auto shadow-evi-card">
            <EditableText
              page="areas_page"
              section="cta_banner"
              fieldKey="eyebrow"
              defaultContent="Atendimento Consultivo e Contencioso"
              as="span"
              className="text-xs uppercase tracking-widest text-evi-silver font-semibold block mb-2"
            />
            <EditableText
              page="areas_page"
              section="cta_banner"
              fieldKey="title"
              defaultContent="Sua demanda exige uma equipe experiente e com autoridade comprovada?"
              as="h3"
              className="text-3xl md:text-4xl font-serif font-bold mb-4"
            />
            <EditableText
              page="areas_page"
              section="cta_banner"
              fieldKey="desc"
              defaultContent="Nossa equipe multidisciplinar está preparada para conduzir sua causa com sigilo, rapidez e determinação."
              as="p"
              className="text-slate-300 max-w-2xl mx-auto mb-8 text-base"
              multiline
            />
            <div className="flex flex-wrap justify-center gap-4">
              <EditableLink
                page="areas_page"
                section="cta_banner"
                fieldKey="wa_btn"
                defaultLabel="Falar com a Equipe pelo WhatsApp"
                defaultHref="https://wa.me/5511991390045?text=Ol%C3%A1%2C%20gostaria%20de%20conversar%20sobre%20uma%20demanda%20jur%C3%ADdica."
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-wa text-base px-8 py-4"
              />
              <EditableLink
                page="areas_page"
                section="cta_banner"
                fieldKey="contact_btn"
                defaultLabel="Enviar Mensagem Institucional"
                defaultHref="/contato"
                className="btn btn-outline border-white text-white hover:bg-white hover:text-evi-deep"
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
