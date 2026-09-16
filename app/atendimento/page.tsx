import React from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Atendimento Personalizado & Humanizado | EVI Sociedade de Advogados',
  description:
    'Na EVI Advogados, cada cliente é único. Conheça nosso modelo de atendimento com escuta ativa, suporte emocional e transparência absoluta.',
};

const careFeatures = [
  {
    icon: '🤝',
    title: 'Acolhimento Emocional Integrado',
    desc: 'Sabemos que disputas judiciais — sejam familiares, médicas ou crises empresariais — geram angústia e sobrecarga. Para apoiá-lo de forma integral, oferecemos 2 sessões gratuitas de acolhimento com profissional de psicanálise aos nossos clientes.',
  },
  {
    icon: '⚖️',
    title: 'Comunicação Clara e Sem “Juridiquês”',
    desc: 'Explicamos cada etapa do seu processo de forma transparente, didática e direta. Você terá total clareza dos cenários, riscos, prazos e estratégias adotadas.',
  },
  {
    icon: '📱',
    title: 'Agilidade e Resposta Pontual',
    desc: 'Nada de semanas sem retorno. Nossa equipe executiva e o corpo jurídico mantêm canais diretos via WhatsApp e e-mail para que você nunca fique sem informação.',
  },
  {
    icon: '🌐',
    title: 'Atendimento Nacional Presencial & Digital',
    desc: 'Receba-nos em nossa sede própria no Ipiranga, São Paulo, ou participe de reuniões virtuais seguras e confortáveis de qualquer lugar do Brasil e do mundo.',
  },
];

export default function AtendimentoPage() {
  return (
    <>
      <Header />

      <main className="bg-[#f8fafb] min-h-screen py-16">
        <div className="container max-w-5xl">
          {/* Header da Página */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="eyebrow justify-center mb-3">Compromisso com Você</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-evi-deep font-bold tracking-tight mb-6">
              Atendimento Personalizado
            </h1>
            <p className="text-evi-text-light text-lg md:text-xl leading-relaxed">
              Nosso compromisso central é tratar cada cliente de maneira única, compreendendo suas dores, respeitando sua história e buscando a melhor solução jurídica com serenidade e afeto.
            </p>
          </div>

          {/* Card Principal de Destaque para Psicanálise */}
          <div className="bg-white rounded-3xl border border-evi-border p-8 md:p-14 shadow-evi-card mb-16 relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
              <div className="md:col-span-8 space-y-6">
                <span className="eyebrow">Diferencial Inédito no Brasil</span>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-evi-deep leading-snug">
                  2 Sessões Gratuitas de Acolhimento e Psicanálise
                </h2>
                <p className="text-base text-evi-text leading-relaxed">
                  Para que você se sinta mais acolhido e apto emocionalmente para lidar com as decisões e impactos do seu processo, a <strong>EVI Sociedade de Advogados</strong> disponibiliza <strong>2 (duas) sessões gratuitas de acolhimento psicológico/psicanálise</strong> com profissional parceiro especializado.
                </p>
                <p className="text-sm text-evi-text-light leading-relaxed">
                  Acreditamos que a vitória jurídica começa com o equilíbrio emocional e a paz de espírito de quem confia em nosso trabalho.
                </p>
                <div className="pt-2">
                  <a
                    href="https://wa.me/5511991390045?text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20o%20atendimento%20personalizado%20e%20as%20sess%C3%B5es%20de%20acolhimento."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-wa text-sm"
                  >
                    Agendar Meu Atendimento Personalizado
                  </a>
                </div>
              </div>

              <div className="md:col-span-4 bg-gradient-to-br from-evi-soft to-white p-8 rounded-2xl border border-evi-border text-center">
                <span className="text-5xl mb-4 block">🤍</span>
                <h3 className="font-serif font-bold text-xl text-evi-deep mb-2">
                  Cuidado Integral
                </h3>
                <p className="text-xs text-evi-text-light leading-relaxed mb-4">
                  Segurança para seu patrimônio, serenidade para sua mente e sua família.
                </p>
                <span className="inline-block text-[11px] font-bold text-evi-accent uppercase tracking-wider bg-white px-3 py-1 rounded-full border border-evi-border">
                  Cortesia aos Clientes EVI
                </span>
              </div>
            </div>
          </div>

          {/* Grid de Recursos do Atendimento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {careFeatures.map((feat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-evi-border p-8 shadow-evi-card hover:shadow-evi-hover transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-evi-soft flex items-center justify-center text-2xl mb-5 border border-evi-border">
                  {feat.icon}
                </div>
                <h3 className="text-xl font-serif font-bold text-evi-deep mb-3">
                  {feat.title}
                </h3>
                <p className="text-sm text-evi-text-light leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Banner de Contato Direto */}
          <div className="bg-gradient-to-r from-evi-deep to-[#243d56] text-white rounded-3xl p-8 md:p-14 text-center max-w-3xl mx-auto shadow-evi-card">
            <h3 className="text-2xl md:text-3xl font-serif font-bold mb-3">
              Estamos prontos para ouvir sua história
            </h3>
            <p className="text-slate-300 text-sm md:text-base mb-8 leading-relaxed">
              Entre em contato agora mesmo com nossa equipe de atendimento executivo e dê o primeiro passo rumo à solução definitiva da sua demanda.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://wa.me/5511991390045?text=Ol%C3%A1%2C%20gostaria%20de%20iniciar%20meu%20atendimento%20com%20a%20EVI%20Advogados."
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-wa text-base"
              >
                Falar pelo WhatsApp
              </a>
              <Link href="/contato" className="btn btn-outline border-white text-white hover:bg-white hover:text-evi-deep">
                Outros Canais de Contato
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
