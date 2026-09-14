import React from 'react';
import Header from '@/components/Header';
import Link from 'next/link';

export const metadata = {
  title: 'Sala de Imprensa & Notícias | EVI Sociedade de Advogados',
  description:
    'Clipping oficial, participações na imprensa e comunicados da EVI Sociedade de Advogados e de seu corpo jurídico.',
};

const pressItems = [
  {
    outlet: 'Valor Econômico',
    title: 'Recuperação Judicial de Produtores Rurais e o Entendimento Consolidado do STJ',
    date: '2026',
    desc: 'Análise detalhada sobre os impactos da dispensa de inscrição prévia de 2 anos no registro público para o acesso a instrumentos de soerguimento no agronegócio.',
    category: 'Agronegócio',
  },
  {
    outlet: 'Consultor Jurídico (ConJur)',
    title: 'Os Limites da Cessão Fiduciária e a Preservação da Liquidez Operacional',
    date: '2026',
    desc: 'Artigo de opinião abordando os embates judiciais entre travas bancárias fiduciárias e o capital de giro indispensável à atividade produtiva.',
    category: 'Direito Empresarial',
  },
  {
    outlet: 'Jota',
    title: 'Reforma Tributária e os Desafios das Cadeias Agroindustriais no Período de Transição',
    date: '2026',
    desc: 'Comentários aos impactos fiscais práticos para produtores de grãos e exportadores com as novas regras do IBS e CBS.',
    category: 'Tributário',
  },
  {
    outlet: 'Portal Migalhas',
    title: 'Dissolução Parcial e os Riscos da Descapitalização em Empresas Familiares',
    date: '2025',
    desc: 'Parecer técnico sobre as metodologias contábeis contemporâneas de apuração de haveres admitidas pelos tribunais estaduais.',
    category: 'Societário',
  },
];

export default function ImprensaPage() {
  return (
    <>
      <Header
        leftLinks={[
          { label: 'Início', href: '/' },
          { label: 'O Escritório', href: '/#escritorio' },
        ]}
        rightLinks={[
          { label: 'Blog Jurídico', href: '/blog' },
          { label: 'Contato', href: '/#contato' },
        ]}
      />

      <main className="bg-[#f8fafb] min-h-screen py-16">
        <div className="container max-w-5xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="eyebrow justify-center mb-3">Comunicação Oficial</span>
            <h1 className="text-4xl md:text-5xl font-serif text-evi-deep font-semibold tracking-tight mb-4">
              Sala de Imprensa & Clipping
            </h1>
            <p className="text-evi-text-light text-lg">
              Acompanhe a presença da EVI Sociedade de Advogados e do Dr. Eduardo Veríssimo Inocente nos principais veículos de mídia e portais jurídicos do país.
            </p>
          </div>

          {/* Lista de Matérias */}
          <div className="space-y-6">
            {pressItems.map((item, idx) => (
              <article
                key={idx}
                className="bg-white rounded-2xl border border-evi-border p-8 shadow-evi-card hover:shadow-evi-hover transition-all duration-300"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3 text-xs text-evi-text-muted">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-evi-deep uppercase tracking-wider bg-evi-soft px-3 py-1 rounded-full border border-evi-border">
                      {item.outlet}
                    </span>
                    <span className="text-evi-accent font-semibold">{item.category}</span>
                  </div>
                  <span>{item.date}</span>
                </div>
                <h2 className="text-2xl font-serif font-bold text-evi-deep mb-3 leading-snug">
                  {item.title}
                </h2>
                <p className="text-evi-text-light text-base leading-relaxed mb-4">
                  {item.desc}
                </p>
                <div className="pt-4 border-t border-evi-border/60 flex justify-end">
                  <a
                    href="https://wa.me/5511991390045?text=Ol%C3%A1%2C%20vi%20a%20mat%C3%A9ria%20de%20imprensa%20e%20gostaria%20de%20conversar."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-evi-deep hover:text-evi-accent uppercase tracking-wider"
                  >
                    Falar com a Assessoria Jurídica →
                  </a>
                </div>
              </article>
            ))}
          </div>

          {/* Contato para Mídia */}
          <div className="mt-16 bg-white rounded-3xl border border-evi-border p-8 md:p-12 text-center shadow-evi-card">
            <h3 className="text-2xl font-serif font-bold text-evi-deep mb-3">
              Atendimento à Imprensa e Pedidos de Entrevista
            </h3>
            <p className="text-evi-text-light max-w-2xl mx-auto mb-6">
              Jornalistas e veículos de comunicação que necessitem de fontes especializadas em Recuperação Judicial, Agronegócio ou Direito Empresarial podem contatar nossa equipe diretamente:
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm font-semibold text-evi-deep">
              <a href="mailto:imprensa@evi.adv.br" className="hover:text-evi-accent">
                imprensa@evi.adv.br
              </a>
              <span>·</span>
              <a href="tel:+551143623533" className="hover:text-evi-accent">
                (11) 4362-3533
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
