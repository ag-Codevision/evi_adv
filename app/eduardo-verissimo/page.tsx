import React from 'react';
import Header from '@/components/Header';
import Link from 'next/link';

export const metadata = {
  title: 'Dr. Eduardo Veríssimo Inocente | Sócio-Fundador EVI Advogados',
  description:
    'Advogado com mais de 25 anos de vanguarda jurídica, referência em Recuperação Judicial, Reestruturação de Dívidas Corporativas e Agronegócio.',
};

export default function EduardoVerissimoPage() {
  return (
    <>
      <Header
        leftLinks={[
          { label: 'Início', href: '/' },
          { label: 'Áreas de Atuação', href: '/#atuacao' },
        ]}
        rightLinks={[
          { label: 'Blog Jurídico', href: '/blog' },
          { label: 'Contato', href: '/#contato' },
        ]}
      />

      <main className="bg-[#f8fafb] min-h-screen py-16">
        <div className="container max-w-5xl">
          {/* Header de Perfil */}
          <div className="bg-white rounded-3xl border border-evi-border p-8 md:p-14 shadow-evi-card mb-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
              <div className="md:col-span-5">
                <div className="relative">
                  <img
                    src="/assets/hero.jpg"
                    alt="Dr. Eduardo Veríssimo Inocente"
                    className="w-full h-[460px] object-cover rounded-2xl shadow-evi-card border border-evi-border"
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-evi-deep/90 backdrop-blur-md text-white p-4 rounded-xl border border-white/20">
                    <span className="text-xs uppercase tracking-widest text-slate-300 font-semibold block">
                      Diretoria Jurídica
                    </span>
                    <strong className="text-sm font-serif">OAB/SP 200.322</strong>
                  </div>
                </div>
              </div>

              <div className="md:col-span-7">
                <span className="eyebrow mb-2">Perfil Institucional & Liderança</span>
                <h1 className="text-3xl md:text-5xl font-serif text-evi-deep font-bold leading-tight mb-4">
                  Dr. Eduardo Veríssimo Inocente
                </h1>
                <p className="text-evi-accent font-semibold text-lg mb-6">
                  Sócio-Fundador & Diretor Jurídico da EVI Sociedade de Advogados
                </p>
                <div className="space-y-4 text-evi-text leading-relaxed text-base">
                  <p>
                    Com mais de 25 anos de atuação ininterrupta de vanguarda no Direito Empresarial e Agronegócio, o <strong>Dr. Eduardo Veríssimo Inocente</strong> consolidou-se como uma das principais referências técnicas e estratégicas do país na condução de processos de reestruturação de dívidas, recuperação judicial e contencioso societário de alta monta.
                  </p>
                  <p>
                    Sua prática jurídica alia profundo rigor acadêmico a uma visão pragmática dos negócios, atuando na linha de frente de casos que envolvem a preservação da atividade empresarial, blindagem patrimonial preventiva e renegociações com grandes conglomerados bancários e fundos de investimento.
                  </p>
                </div>
                <div className="mt-8 flex flex-wrap gap-4">
                  <a
                    href="https://wa.me/5511991390045?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20consulta%20com%20o%20Dr.%20Eduardo%20Ver%C3%ADssimo."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-wa"
                  >
                    Agendar Consulta Estratégica
                  </a>
                  <Link href="/blog" className="btn btn-outline">
                    Ver Artigos & Pareceres
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Destaques de Expertise */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-8 rounded-2xl border border-evi-border shadow-evi-card">
              <span className="text-2xl font-serif text-evi-accent font-bold mb-2 block">01</span>
              <h3 className="text-xl font-serif font-bold text-evi-deep mb-3">
                Recuperação Judicial & Insolvência
              </h3>
              <p className="text-sm text-evi-text-light leading-relaxed">
                Elaboração e condução de planos de soerguimento empresarial, liberação de travas bancárias, obtenção de stay period e negociação com comitês de credores.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-evi-border shadow-evi-card">
              <span className="text-2xl font-serif text-evi-accent font-bold mb-2 block">02</span>
              <h3 className="text-xl font-serif font-bold text-evi-deep mb-3">
                Agronegócio & Crédito Rural
              </h3>
              <p className="text-sm text-evi-text-light leading-relaxed">
                Defesa especializada em títulos de crédito rural (CPR, CCR, CDCA), renegociação de operações com tradings e prorrogação de dívidas (Súmula 298 do STJ).
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-evi-border shadow-evi-card">
              <span className="text-2xl font-serif text-evi-accent font-bold mb-2 block">03</span>
              <h3 className="text-xl font-serif font-bold text-evi-deep mb-3">
                Contencioso Estratégico & M&A
              </h3>
              <p className="text-sm text-evi-text-light leading-relaxed">
                Resolução de disputas societárias complexas, apuração de haveres, litígios entre sócios e governança jurídica preventiva para empresas familiares e holdings.
              </p>
            </div>
          </div>

          {/* Citação & Manifesto */}
          <div className="bg-evi-deep text-white rounded-3xl p-10 md:p-14 text-center">
            <p className="text-xl md:text-2xl font-serif italic text-slate-200 max-w-3xl mx-auto mb-6 leading-relaxed">
              “A advocacia empresarial moderna não se limita à defesa contenciosa no tribunal; ela deve ser um vetor de inteligência estratégica capaz de antecipar crises, proteger patrimônios construídos ao longo de gerações e viabilizar a continuidade dos negócios.”
            </p>
            <span className="font-serif font-bold text-lg text-evi-silver block">
              Dr. Eduardo Veríssimo Inocente
            </span>
            <small className="text-xs text-slate-400">Diretor Jurídico da EVI Advogados</small>
          </div>
        </div>
      </main>
    </>
  );
}
