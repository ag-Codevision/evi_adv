import React from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Áreas de Atuação & Diferenciais | EVI Sociedade de Advogados - 25 Anos',
  description:
    'Consultoria preventiva e contenciosa em Direito Médico, Trabalhista, Empresarial, Cível, Família e Proteção de Dados, com 25 anos de vanguarda jurídica, chancela internacional e acolhimento humano real.',
};

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
      'Atuação contenciosa com propositura de ações cíveis estratégicas',
      'Resolução de disputas e demandas em relações de consumo',
    ],
  },
  {
    id: 'familia',
    title: 'Família',
    emoji: '👨‍👩‍👧‍👦',
    tag: 'Família & Sucessões',
    desc: 'Prestamos serviços de natureza consultiva e contenciosa no Direito de Família e das Sucessões, por meio do patrocínio e acompanhamento de ações judiciais, ou ainda através de demandas da competência do cartório de registro civil. Nossa atuação abrange as relações homoafetivas.',
    highlights: [
      'Serviços consultivos e contenciosos em Direito de Família e Sucessões',
      'Patrocínio e acompanhamento integral de ações judiciais',
      'Atuação em demandas de competência de cartórios de registro civil',
      'Atuação jurídica inclusiva abrangendo relações homoafetivas',
    ],
  },
  {
    id: 'protecao-de-dados',
    title: 'Proteção de Dados',
    emoji: '🛡️',
    tag: 'Conformidade & LGPD',
    desc: 'Em parceria com profissionais especializados no assunto, prestamos serviços de natureza consultiva para orientar e ajudar as empresas na implementação de programa de proteção de dados pessoais que atendam às exigências da Lei Geral de Proteção de Dados Pessoais.',
    highlights: [
      'Serviços de natureza consultiva para conformidade corporativa',
      'Parceria técnica com profissionais especializados no tema',
      'Orientação na implementação de programas de proteção de dados',
      'Atendimento integral às exigências da Lei Geral de Proteção de Dados (LGPD)',
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
            <span className="eyebrow justify-center mb-3">Atuação Jurídica de Excelência</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-evi-deep font-bold tracking-tight mb-6">
              Áreas de Atuação
            </h1>
            <p className="text-evi-text-light text-lg md:text-xl leading-relaxed">
              Combinamos visão de negócios, profundo domínio dogmático e determinação implacável para entregar resultados consistentes nas causas mais sensíveis e decisivas de nossos clientes.
            </p>
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
                      <span className="text-xs font-serif font-bold uppercase tracking-widest text-evi-accent bg-evi-soft px-3 py-1 rounded-full border border-evi-border">
                        {area.tag}
                      </span>
                      <span className="text-xs text-evi-text-muted">Especialidade 0{idx + 1}</span>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-evi-deep">
                      {area.title}
                    </h2>

                    <p className="text-base text-evi-text-light leading-relaxed">
                      {area.desc}
                    </p>

                    <div className="pt-2">
                      <a
                        href={`https://wa.me/5511991390045?text=Ol%C3%A1%2C%20gostaria%20de%20orienta%C3%A7%C3%A3o%20especializada%20na%20%C3%A1rea%20de%20${encodeURIComponent(area.title)}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-wa text-xs"
                      >
                        Consultar Especialista em {area.title}
                      </a>
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-evi-soft/70 rounded-2xl p-6 border border-evi-border/80">
                    <span className="text-3xl mb-3 block">{area.emoji}</span>
                    <h3 className="text-xs uppercase tracking-wider font-bold text-evi-deep mb-4">
                      Frentes de Atuação Técnica:
                    </h3>
                    <ul className="space-y-2.5">
                      {area.highlights.map((h, hIdx) => (
                        <li key={hIdx} className="text-xs text-evi-text leading-relaxed flex items-start gap-2.5">
                          <span className="text-evi-accent font-bold mt-0.5">✔</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* SEÇÃO UNIFICADA: DIFERENCIAIS ESTRATÉGICOS (#diferenciais) */}
          <div id="diferenciais" className="scroll-mt-24 pt-8 mb-20 border-t border-evi-border/80">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="eyebrow justify-center mb-3">Por que escolher a EVI Advogados</span>
              <h2 className="text-4xl md:text-5xl font-serif text-evi-deep font-bold tracking-tight mb-6">
                Diferenciais que Constroem Vitórias
              </h2>
              <p className="text-evi-text-light text-lg md:text-xl leading-relaxed">
                Não entregamos apenas pareceres ou petições: entregamos segurança, proteção patrimonial e o amparo necessário para os momentos mais cruciais da sua vida ou da sua empresa.
              </p>
            </div>

            {/* Grid dos 6 Pilares de Diferenciais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {pillars.map((pillar, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl border border-evi-border p-8 shadow-evi-card hover:shadow-evi-hover transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl font-serif font-bold text-evi-accent">
                        {pillar.num}
                      </span>
                      <span className="text-xs uppercase tracking-wider font-semibold bg-evi-soft text-evi-deep px-3 py-1 rounded-full border border-evi-border">
                        {pillar.tag}
                      </span>
                    </div>

                    <h3 className="text-2xl font-serif font-bold text-evi-deep mb-1 group-hover:text-evi-accent transition-colors">
                      {pillar.title}
                    </h3>
                    <span className="text-xs text-evi-accent font-semibold block mb-4">
                      {pillar.subtitle}
                    </span>

                    <p className="text-sm text-evi-text-light leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-evi-border/60 flex items-center justify-between text-xs">
                    <span className="text-evi-text-muted">Padrão EVI 25 Anos</span>
                    <Link href="/contato" className="font-bold text-evi-deep hover:text-evi-accent">
                      Saiba mais →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Card de Destaque: Suporte Emocional e Cuidado Integral */}
            <div className="bg-white rounded-3xl border border-evi-border p-8 md:p-14 shadow-evi-card mb-16 relative overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-8 space-y-4">
                  <span className="eyebrow">Pioneirismo no Atendimento Humanizado</span>
                  <h3 className="text-3xl font-serif font-bold text-evi-deep leading-snug">
                    Cuidamos da sua causa jurídica e da sua saúde emocional.
                  </h3>
                  <p className="text-base text-evi-text-light leading-relaxed">
                    Sabemos que uma separação, uma disputa sucessória ou uma crise financeira empresarial afetam profundamente o equilíbrio pessoal e familiar. Para que você tome decisões com clareza mental e serenidade, oferecemos <strong>2 sessões gratuitas de acolhimento emocional com profissional de psicanálise</strong> no início de sua jornada conosco.
                  </p>
                  <div className="pt-2">
                    <a
                      href="https://wa.me/5511991390045?text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20o%20programa%20de%20acolhimento%20humanizado%20da%20EVI."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      Saber Mais sobre o Acolhimento Humanizado →
                    </a>
                  </div>
                </div>
                <div className="md:col-span-4 bg-evi-soft p-8 rounded-2xl border border-evi-border text-center">
                  <span className="text-4xl mb-3 block">🤝</span>
                  <h4 className="font-serif font-bold text-xl text-evi-deep mb-2">Acolhimento Real</h4>
                  <p className="text-xs text-evi-text-light leading-relaxed">
                    Tratamento respeitoso, exclusivo e adaptado às peculiaridades de cada história humana.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Banner de Chamada para Ação */}
          <div className="bg-evi-deep text-white rounded-3xl p-8 md:p-14 text-center max-w-4xl mx-auto shadow-evi-card">
            <span className="text-xs uppercase tracking-widest text-evi-silver font-semibold block mb-2">
              Atendimento Consultivo e Contencioso
            </span>
            <h3 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Sua demanda exige uma equipe experiente e com autoridade comprovada?
            </h3>
            <p className="text-slate-300 max-w-2xl mx-auto mb-8 text-base">
              Nossa equipe multidisciplinar está preparada para conduzir sua causa com sigilo, rapidez e determinação.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://wa.me/5511991390045?text=Ol%C3%A1%2C%20gostaria%20de%20conversar%20sobre%20uma%20demanda%20jur%C3%ADdica."
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-wa text-base px-8 py-4"
              >
                Falar com a Equipe pelo WhatsApp
              </a>
              <Link href="/contato" className="btn btn-outline border-white text-white hover:bg-white hover:text-evi-deep">
                Enviar Mensagem Institucional
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
