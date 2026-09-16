import React from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quem Somos & Corpo Jurídico | EVI Sociedade de Advogados - 25 Anos',
  description:
    'Conheça a história de 25 anos da EVI Advogados, fundada e liderada pelo Dr. Eduardo Veríssimo Inocente, nosso corpo jurídico de excelência, valores e sede própria no Ipiranga.',
};

const teamMembers = [
  {
    name: 'Dra. Sandra S. Ferreira Nunes',
    role: 'Consultora de Assuntos Estratégicos',
    image: '/img/04.png',
    bio: [
      'Atuação estratégica na gestão de riscos e alinhamento consultivo corporativo',
      'Assessoria em casos de alta repercussão patrimonial e estruturação de acordos',
      'Coordenação multidisciplinar em interface com auditorias externas e perícias técnicas',
    ],
  },
  {
    name: 'Dra. Liziane Luciana da S. Sucena',
    role: 'Advogada Sênior',
    image: '/img/05.png',
    bio: [
      'Larga experiência no contencioso cível, médico e empresarial nos tribunais estaduais e superiores',
      'Especialista em redação recursal refinada, sustentações orais e cumprimento de sentenças',
      'Condução de processos complexos com foco na celeridade e preservação de direitos',
    ],
  },
  {
    name: 'Dra. Paloma Duarte Costa',
    role: 'Advogada Júnior II',
    image: '/img/06.png',
    bio: [
      'Atuação focada no contencioso civil, família e contratos com rigor nos prazos processuais',
      'Acompanhamento direto de diligências, audiências e perícias técnicas judiciais',
      'Compromisso com o atendimento detalhado e a prestação de informações contínuas ao cliente',
    ],
  },
  {
    name: 'Dr. André Carneiro Fuzinato',
    role: 'Bacharel em Direito & Assistente Jurídico',
    image: '/img/03.png',
    bio: [
      'Pesquisa jurisprudencial avançada em tribunais de todo o país',
      'Elaboração de minutas de peças processuais e relatórios de inteligência forense',
      'Suporte analítico às frentes de recuperação de crédito e contratos empresariais',
    ],
  },
  {
    name: 'Andressa Aparecida Galvani',
    role: 'Secretária Executiva & Gestão de Atendimento',
    image: '/img/07.png',
    bio: [
      'Gestão da agenda de audiências, conferências e atendimentos executivos do Dr. Eduardo',
      'Primeiro ponto de contato acolhedor e humanizado com o cliente da EVI Advogados',
      'Organização administrativa e suporte ao fluxo do programa de atendimento ao cliente',
    ],
  },
];

const timelineEvents = [
  {
    year: '2001',
    title: 'Fundação da EVI Advogados',
    desc: 'Em 02 de julho de 2001, em São Bernardo do Campo, o Dr. Eduardo Veríssimo Inocente funda a banca, unindo rigor acadêmico a uma postura combativa em defesa dos clientes.',
  },
  {
    year: '2010',
    title: 'Expansão e Nova Sede no Ipiranga',
    desc: 'Consolidação das práticas corporativas, cíveis e médicas com a transferência da sede principal para o bairro nobre e histórico do Ipiranga, em São Paulo.',
  },
  {
    year: '2018',
    title: 'Reconhecimento & Troféu Personalidade ABC',
    desc: 'O Dr. Eduardo Veríssimo Inocente é homenageado com o tradicional Troféu Personalidade ABC. Projeção nas emissoras de TV em rede nacional (SBT, Rede Brasil e programas especializados).',
  },
  {
    year: '2019',
    title: 'Prêmio QUALITY JUSTIÇA & Band News TV',
    desc: 'Outorga do cobiçado Prêmio QUALITY JUSTIÇA, chancelando a responsabilidade social e o padrão ético do escritório. Participação no programa Empresários de Sucesso na Band News.',
  },
  {
    year: '2021',
    title: 'Chancela Internacional IBI',
    desc: 'A EVI Sociedade de Advogados torna-se Membership oficial do conceituado International Business Institute (IBI), ampliando relações globais.',
  },
  {
    year: '2022',
    title: 'Capa da International Business Magazine',
    desc: 'Destaque editorial com o título “Assessoria Jurídica Moderna e Inovadora é a marca da E.V.I. Sociedade de Advogados”, evidenciando a liderança do escritório.',
  },
  {
    year: '2026',
    title: 'Jubileu de Prata: 25 Anos de Vanguarda',
    desc: 'Comemoração de 25 anos de atuação ininterrupta, modernização digital, podcast exclusivo e atendimento estratégico a clientes em todo o território nacional.',
  },
];

export default function QuemSomosPage() {
  return (
    <>
      <Header />

      <main className="bg-[#f8fafb] min-h-screen py-16">
        <div className="container max-w-6xl">
          {/* 1. HERO INSTITUCIONAL: 25 ANOS DE HISTÓRIA */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="eyebrow justify-center mb-3">25 Anos de Vanguarda Jurídica · 2001–2026</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-evi-deep font-bold tracking-tight mb-6 leading-tight">
              Uma história de excelência, coragem estratégica e liderança jurídica.
            </h1>
            <p className="text-evi-text-light text-lg md:text-xl leading-relaxed">
              Fundada em <strong>02 de julho de 2001</strong> pelo Dr. Eduardo Veríssimo Inocente, a EVI Sociedade de Advogados consolidou-se como uma das bancas mais respeitadas do Brasil, defendendo causas determinantes com inteligência estratégica e acolhimento humano real.
            </p>
          </div>

          {/* 2. PERFIL DO FUNDADOR & DIRETOR JURÍDICO (#dr-eduardo) */}
          <div id="dr-eduardo" className="bg-white rounded-3xl border border-evi-border p-8 md:p-14 shadow-evi-card mb-16 scroll-mt-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-2xl overflow-hidden border border-evi-border shadow-evi-hover group">
                  <img
                    src="/img/01.png"
                    alt="Dr. Eduardo Veríssimo Inocente - Sócio-Fundador"
                    className="w-full h-[520px] object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-evi-deep/95 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                    <span className="text-xs uppercase tracking-widest text-slate-300 font-semibold mb-1">
                      Sócio-Diretor & Fundador
                    </span>
                    <strong className="text-xl font-serif">Dr. Eduardo Veríssimo Inocente</strong>
                    <span className="text-xs text-slate-300">Inscrição OAB/SP 200.322 · Mestre em Direitos Difusos</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-6 text-evi-text leading-relaxed">
                <div>
                  <span className="eyebrow mb-1">Liderança & Trajetória</span>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-evi-deep">
                    Do Grande ABC ao Centro das Decisões Nacionais
                  </h2>
                  <p className="text-evi-accent font-semibold text-base mt-1">
                    25 Anos de Militância, Doutrina e Defesa Estratégica
                  </p>
                </div>

                <p className="text-base md:text-lg text-evi-text-light">
                  A trajetória da EVI teve início em São Bernardo do Campo, sob a visão obstinada do advogado <strong>Eduardo Veríssimo Inocente</strong>, cujas iniciais batizam o escritório. O propósito desde o primeiro dia foi claro: romper com a advocacia burocrática e entregar uma atuação proativa, artesanal e implacável na defesa dos direitos de cada cliente.
                </p>
                <p className="text-base text-evi-text-light">
                  Com mais de <strong>25 anos de atuação ininterrupta</strong>, o Dr. Eduardo é uma das mentes jurídicas mais respeitadas do país, com formação acadêmica de ponta — incluindo Mestrado em Direitos Difusos e Coletivos e diplomação em Ávila (Espanha) —, além de presença frequente como fonte técnica de grandes redes de TV como <strong>Band News</strong>, <strong>SBT</strong> e <strong>Rede Brasil de Televisão</strong>.
                </p>
                <div className="pt-4 flex flex-wrap gap-4 items-center">
                  <a
                    href="https://wa.me/5511991390045?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20consulta%20estrat%C3%A9gica%20com%20o%20Dr.%20Eduardo%20Ver%C3%ADssimo."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-wa"
                  >
                    Agendar Consulta com Dr. Eduardo
                  </a>
                  <Link href="/imprensa" className="btn btn-outline">
                    Ver Matérias na TV e Imprensa
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 3. CREDENCIAIS & TITULAÇÕES DO DR. EDUARDO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white rounded-3xl border border-evi-border p-8 md:p-10 shadow-evi-card">
              <span className="eyebrow mb-3">Formação Acadêmica & Docência</span>
              <h2 className="text-2xl font-serif font-bold text-evi-deep mb-6">
                Excelência Acadêmica & Internacional
              </h2>
              <ul className="space-y-3.5 text-sm text-evi-text">
                <li className="flex items-start gap-3">
                  <span className="text-evi-accent font-bold mt-1">✔</span>
                  <div>
                    <strong>Graduado em Direito</strong> pela Universidade São Judas Tadeu (USJT).
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-evi-accent font-bold mt-1">✔</span>
                  <div>
                    <strong>Especialista em Direito Civil</strong> pela Universidade São Judas Tadeu (USJT).
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-evi-accent font-bold mt-1">✔</span>
                  <div>
                    <strong>Mestre em Direitos Difusos e Coletivos</strong> pela UNIMES.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-evi-accent font-bold mt-1">✔</span>
                  <div>
                    <strong>Diplomado no Seminário Internacional de Estudos em Ávila</strong> — Espanha.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-evi-accent font-bold mt-1">✔</span>
                  <div>
                    <strong>Professor Universitário de Direito</strong>, formando gerações de operadores jurídicos.
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl border border-evi-border p-8 md:p-10 shadow-evi-card">
              <span className="eyebrow mb-3">Atuação Institucional & Reconhecimento</span>
              <h2 className="text-2xl font-serif font-bold text-evi-deep mb-6">
                Liderança na OAB & Chancelas Oficiais
              </h2>
              <ul className="space-y-3.5 text-sm text-evi-text">
                <li className="flex items-start gap-3">
                  <span className="text-evi-accent font-bold mt-1">✔</span>
                  <div>
                    <strong>Ex-Instrutor do Tribunal de Ética e Disciplina da OAB/SP</strong> (Subseção SBC).
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-evi-accent font-bold mt-1">✔</span>
                  <div>
                    <strong>Vice-Presidente da Comissão de Combate ao Exercício Ilegal da Profissão</strong> da OAB/SBC.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-evi-accent font-bold mt-1">✔</span>
                  <div>
                    <strong>Autor do Livro</strong> “Direito das Famílias Esquematizado – Teoria e Prática Processual”.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-evi-accent font-bold mt-1">✔</span>
                  <div>
                    <strong>Homenageado com o Troféu Personalidade ABC</strong> no calendário oficial de São Paulo.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-evi-accent font-bold mt-1">✔</span>
                  <div>
                    <strong>Laureado com o Prêmio QUALITY JUSTIÇA</strong> em reconhecimento ético e responsabilidade social.
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* 4. DESTAQUE DA OBRA LITERÁRIA */}
          <div className="bg-evi-deep text-white rounded-3xl p-8 md:p-12 mb-16 shadow-evi-card relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <span className="text-xs uppercase tracking-widest text-evi-silver font-semibold block">
                  Doutrina & Produção Intelectual
                </span>
                <h3 className="text-3xl font-serif font-bold leading-snug">
                  Livro: “Direito das Famílias Esquematizado – Teoria e Prática Processual”
                </h3>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                  Fruto de anos de magistério acadêmico e prática forense combativa, a obra do Dr. Eduardo Veríssimo Inocente sistematiza os institutos contemporâneos do Direito de Família e Sucessões, servindo como referência prática para advogados, magistrados e operadores jurídicos de todo o país.
                </p>
                <div className="pt-2">
                  <Link href="/areas-de-atuacao" className="btn btn-outline border-white text-white hover:bg-white hover:text-evi-deep">
                    Conhecer Atuação em Direito de Família →
                  </Link>
                </div>
              </div>
              <div className="lg:col-span-4 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-center">
                <span className="text-5xl block mb-2">📚</span>
                <strong className="text-lg font-serif block mb-1">Referência Nacional</strong>
                <p className="text-xs text-slate-300">Teoria sólida aplicada a vitórias judiciais concretas.</p>
              </div>
            </div>
          </div>

          {/* 5. CORPO JURÍDICO & EQUIPE MULTIDISCIPLINAR (#profissionais) */}
          <div id="profissionais" className="mb-16 scroll-mt-24">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="eyebrow justify-center mb-3">Capital Humano de Elite</span>
              <h2 className="text-3xl md:text-4xl font-serif text-evi-deep font-bold tracking-tight mb-4">
                Corpo Jurídico & Equipe Multidisciplinar
              </h2>
              <p className="text-evi-text-light text-base md:text-lg leading-relaxed">
                Advogados associados, consultores e assistentes dedicados à máxima precisão técnica e ao atendimento humanizado de cada cliente.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl border border-evi-border overflow-hidden shadow-evi-card hover:shadow-evi-hover transition-all duration-300 group flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-[4/5] w-full overflow-hidden bg-slate-100 relative">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-evi-deep/80 via-transparent to-transparent opacity-60"></div>
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-200 block">
                          {member.role}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-serif font-bold text-evi-deep mb-4">
                        {member.name}
                      </h3>

                      <ul className="space-y-2">
                        {member.bio.map((item, bIdx) => (
                          <li key={bIdx} className="text-xs text-evi-text-light leading-relaxed flex items-start gap-2">
                            <span className="text-evi-accent font-bold mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2">
                    <div className="pt-4 border-t border-evi-border/60 flex items-center justify-between text-xs">
                      <span className="text-evi-text-muted">Equipe EVI Advogados</span>
                      <a
                        href="https://wa.me/5511991390045"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-evi-deep hover:text-evi-accent"
                      >
                        Contato →
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 6. HISTÓRICO & LINHA DO TEMPO: 25 ANOS (#historico) */}
          <div id="historico" className="mb-20 scroll-mt-24">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="eyebrow justify-center mb-3">Trajetória Institucional · 2001 a 2026</span>
              <h2 className="text-3xl md:text-4xl font-serif text-evi-deep font-bold tracking-tight mb-4">
                25 Anos Construindo Segurança e Justiça
              </h2>
              <p className="text-evi-text-light text-base md:text-lg leading-relaxed">
                Uma linha do tempo marcada por coragem técnica, crescimento orgânico e resultados expressivos para centenas de empresas e famílias brasileiras.
              </p>
            </div>

            {/* Linha do Tempo */}
            <div className="relative border-l-2 border-evi-accent/30 ml-4 md:ml-32 space-y-10 mb-16 pl-6 md:pl-10">
              {timelineEvents.map((evt, idx) => (
                <div key={idx} className="relative group">
                  {/* Marcador */}
                  <div className="absolute -left-[31px] md:-left-[47px] top-1.5 w-6 h-6 rounded-full bg-white border-4 border-evi-accent group-hover:scale-125 group-hover:border-evi-deep transition-all duration-300"></div>

                  <div className="bg-white rounded-2xl border border-evi-border p-7 shadow-evi-card hover:shadow-evi-hover transition-all duration-300">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="text-2xl font-serif font-bold text-evi-deep bg-evi-soft px-3 py-0.5 rounded-lg border border-evi-border">
                        {evt.year}
                      </span>
                      <h3 className="text-xl font-serif font-bold text-evi-deep">
                        {evt.title}
                      </h3>
                    </div>
                    <p className="text-evi-text-light text-base leading-relaxed">
                      {evt.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 7. PILARES ESTRATÉGICOS: MISSÃO, VISÃO E VALORES */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-2xl border border-evi-border p-8 shadow-evi-card hover:shadow-evi-hover transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-evi-soft flex items-center justify-center text-evi-accent mb-6 border border-evi-border">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 3v18M6 8l6-2 6 2M6 8L3 14h6L6 8zm12 0l-3 6h6l-3-6zM4 21h16" />
                  </svg>
                </div>
                <h3 className="text-2xl font-serif font-bold text-evi-deep mb-3">Missão</h3>
                <p className="text-sm text-evi-text-light leading-relaxed">
                  Oferecer soluções jurídicas contemporâneas, dinâmicas e de alto impacto, aliando rigor técnico inegociável, ética e obstinação por resultados que garantam a tranquilidade de nossos clientes.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-evi-border/60 text-xs font-semibold text-evi-accent uppercase tracking-wider">
                Foco no Resultado & Proteção
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-evi-border p-8 shadow-evi-card hover:shadow-evi-hover transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-evi-soft flex items-center justify-center text-evi-accent mb-6 border border-evi-border">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                  </svg>
                </div>
                <h3 className="text-2xl font-serif font-bold text-evi-deep mb-3">Visão</h3>
                <p className="text-sm text-evi-text-light leading-relaxed">
                  Consolidar-se perenemente como referência de excelência jurídica, autoridade moral e inovação processual no Brasil, sendo o parceiro definitivo para decisões críticas e momentos de transição.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-evi-border/60 text-xs font-semibold text-evi-accent uppercase tracking-wider">
                Vanguarda & Respeito Nacional
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-evi-border p-8 shadow-evi-card hover:shadow-evi-hover transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-evi-soft flex items-center justify-center text-evi-accent mb-6 border border-evi-border">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                </div>
                <h3 className="text-2xl font-serif font-bold text-evi-deep mb-3">Valores</h3>
                <p className="text-sm text-evi-text-light leading-relaxed mb-4">
                  Prática jurídica pautada por <strong>ética inegociável</strong>, sigilo rigoroso e inovação contínua. Unimos rigor processual a um <strong>acolhimento humano genuíno</strong>, defendendo cada causa com lealdade e excelência artesanal.
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs text-evi-deep pt-1">
                  <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200/70 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-evi-accent shrink-0"></span>
                    Ética & Sigilo
                  </span>
                  <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200/70 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-evi-accent shrink-0"></span>
                    Rigor Técnico
                  </span>
                  <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200/70 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-evi-accent shrink-0"></span>
                    Apoio Humano
                  </span>
                  <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200/70 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-evi-accent shrink-0"></span>
                    Multidisciplinar
                  </span>
                </div>
              </div>
              <div className="pt-6 mt-6 border-t border-evi-border/60 text-xs font-semibold text-evi-accent uppercase tracking-wider">
                Compromisso com o Cliente
              </div>
            </div>
          </div>

          {/* 8. SEDE CORPORATIVA NO IPIRANGA */}
          <div className="bg-evi-deep text-white rounded-3xl p-8 md:p-14 mb-16 relative overflow-hidden shadow-evi-card">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7 space-y-4">
                <span className="text-xs uppercase tracking-widest text-evi-silver font-semibold block">
                  Infraestrutura de Primeiro Mundo
                </span>
                <h2 className="text-3xl md:text-4xl font-serif font-bold leading-snug">
                  Ambiente acolhedor, sigiloso e dotado de tecnologia de ponta.
                </h2>
                <p className="text-slate-300 text-base leading-relaxed">
                  Sediada no nobre bairro do Ipiranga em São Paulo, contamos com salas de conferência climatizadas, sistemas de segurança de dados em nuvem criptografada e conectividade para atendimento remoto em tempo real para qualquer tribunal do país.
                </p>
                <div className="pt-2">
                  <Link href="/nossa-estrutura" className="btn btn-outline border-white text-white hover:bg-white hover:text-evi-deep">
                    Conhecer Fotos da Estrutura →
                  </Link>
                </div>
              </div>
              <div className="md:col-span-5 grid grid-cols-2 gap-3">
                <img
                  src="/img/estrutura/fachada.jpg"
                  alt="Fachada EVI Advogados"
                  className="rounded-xl object-cover h-36 w-full border border-white/20 shadow-md"
                />
                <img
                  src="/img/estrutura/recepcao.jpg"
                  alt="Recepção EVI Advogados"
                  className="rounded-xl object-cover h-36 w-full border border-white/20 shadow-md"
                />
                <img
                  src="/img/estrutura/lounge.jpg"
                  alt="Lounge EVI Advogados"
                  className="rounded-xl object-cover h-36 w-full border border-white/20 shadow-md"
                />
                <img
                  src="/img/estrutura/sala-reuniao.jpg"
                  alt="Sala de Reunião EVI Advogados"
                  className="rounded-xl object-cover h-36 w-full border border-white/20 shadow-md"
                />
              </div>
            </div>
          </div>

          {/* 9. CTA FINAL */}
          <div className="bg-white rounded-3xl border border-evi-border p-10 md:p-14 text-center max-w-3xl mx-auto shadow-evi-card">
            <h3 className="text-3xl font-serif font-bold text-evi-deep mb-3">
              Agende uma reunião estratégica com o Dr. Eduardo e equipe
            </h3>
            <p className="text-evi-text-light text-base mb-8">
              Atendimento presencial na sede do Ipiranga em São Paulo ou por videoconferência reservada com discrição incondicional.
            </p>
            <a
              href="https://wa.me/5511991390045?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20consulta%20com%20o%20Dr.%20Eduardo%20Ver%C3%ADssimo%20e%20equipe."
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-wa text-base px-8 py-4"
            >
              Falar no WhatsApp com o Dr. Eduardo e Equipe
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
