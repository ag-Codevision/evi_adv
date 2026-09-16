import React from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nossa Estrutura | EVI Sociedade de Advogados - Sede Ipiranga SP',
  description:
    'Conheça a sede própria da EVI Advogados no Ipiranga, São Paulo: um espaço acolhedor, sofisticado e tecnológico projetado para garantir sigilo e excelência jurídica.',
};

const spaces = [
  {
    title: 'Fachada Institucional',
    category: 'Localização Privilegiada',
    image: '/img/estrutura/fachada.jpg',
    desc: 'Localizada no histórico e acessível bairro do Ipiranga, em São Paulo, nossa sede oferece discrição, fácil estacionamento e proximidade aos principais eixos viários da capital.',
  },
  {
    title: 'Recepção Executiva',
    category: 'Acolhimento & Primeiro Contato',
    image: '/img/estrutura/recepcao.jpg',
    desc: 'Um ambiente pensado para receber nossos clientes com cordialidade, conforto e total privacidade desde o primeiro instante.',
  },
  {
    title: 'Lounge de Espera',
    category: 'Conforto & Bem-Estar',
    image: '/img/estrutura/lounge.jpg',
    desc: 'Espaço aconchegante e reservado, garantindo uma experiência agradável e tranquila para reuniões, alinhamentos prévios e audiências.',
  },
  {
    title: 'Sala de Reuniões Estratégicas',
    category: 'Tecnologia & Decisão',
    image: '/img/estrutura/sala-reuniao.jpg',
    desc: 'Infraestrutura completa para sustentações orais, videoconferências com tribunais de todo o Brasil e sessões de negociação de alta relevância com segurança de dados.',
  },
];

export default function NossaEstruturaPage() {
  return (
    <>
      <Header />

      <main className="bg-[#f8fafb] min-h-screen py-16">
        <div className="container max-w-6xl">
          {/* Header da Página */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="eyebrow justify-center mb-3">Infraestrutura & Ambiente</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-evi-deep font-bold tracking-tight mb-6">
              Nossa Estrutura
            </h1>
            <p className="text-evi-text-light text-lg md:text-xl leading-relaxed">
              Um ambiente moderno, agradável e acolhedor, onde o sigilo dos seus interesses e a sofisticação tecnológica caminham lado a lado.
            </p>
          </div>

          {/* Grid de Espaços com Fotos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {spaces.map((space, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-evi-border overflow-hidden shadow-evi-card hover:shadow-evi-hover transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={space.image}
                      alt={space.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-evi-deep/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                      {space.category}
                    </div>
                  </div>

                  <div className="p-8">
                    <h2 className="text-2xl font-serif font-bold text-evi-deep mb-3">
                      {space.title}
                    </h2>
                    <p className="text-evi-text-light text-base leading-relaxed">
                      {space.desc}
                    </p>
                  </div>
                </div>

                <div className="px-8 pb-8 pt-2">
                  <div className="pt-4 border-t border-evi-border/60 flex items-center justify-between text-xs text-evi-accent font-semibold">
                    <span>EVI Sociedade de Advogados</span>
                    <span>Sede Própria · São Paulo</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Destaque de Tecnologia e Segurança */}
          <div className="bg-white rounded-3xl border border-evi-border p-8 md:p-12 shadow-evi-card mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-evi-soft flex items-center justify-center text-evi-accent font-bold">
                  01
                </div>
                <h3 className="text-xl font-serif font-bold text-evi-deep">Sigilo e Compliance</h3>
                <p className="text-sm text-evi-text-light leading-relaxed">
                  Salas com tratamento acústico para preservação do sigilo profissional indispensável em litígios societários, familiares e negociações de risco.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-evi-soft flex items-center justify-center text-evi-accent font-bold">
                  02
                </div>
                <h3 className="text-xl font-serif font-bold text-evi-deep">Conectividade Nacional</h3>
                <p className="text-sm text-evi-text-light leading-relaxed">
                  Plataformas digitais seguras com fibra ótica redundante para audiências telepresenciais e atendimento imediato a clientes de qualquer região do Brasil.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-evi-soft flex items-center justify-center text-evi-accent font-bold">
                  03
                </div>
                <h3 className="text-xl font-serif font-bold text-evi-deep">Conforto e Humanização</h3>
                <p className="text-sm text-evi-text-light leading-relaxed">
                  Espaços projetados para desmistificar a frieza dos escritórios convencionais, proporcionando uma experiência de real apoio e bem-estar.
                </p>
              </div>
            </div>
          </div>

          {/* Agendamento Presencial / Virtual */}
          <div className="bg-gradient-to-br from-evi-deep to-[#243d56] text-white rounded-3xl p-8 md:p-12 text-center max-w-4xl mx-auto shadow-evi-card">
            <h3 className="text-3xl font-serif font-bold mb-4">
              Venha tomar um café conosco ou agende sua conferência online
            </h3>
            <p className="text-slate-300 max-w-2xl mx-auto mb-8 text-base">
              Rua Costa Aguiar, nº 2432 — Ipiranga, São Paulo – SP. Atendemos presencialmente com agendamento prévio ou por videoconferência com a mesma proximidade.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://wa.me/5511991390045?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20visita%20ou%20reuni%C3%A3o%20na%20sede%20da%20EVI."
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-wa text-base"
              >
                Agendar Reunião pelo WhatsApp
              </a>
              <Link href="/contato" className="btn btn-outline border-white text-white hover:bg-white hover:text-evi-deep">
                Como Chegar & Contatos
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
