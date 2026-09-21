'use client';

import React from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import EditableText from '@/components/admin/EditableText';
import EditableLink from '@/components/admin/EditableLink';

const careFeatures = [
  {
    id: 'f1',
    icon: '🤝',
    title: 'Acolhimento Emocional Integrado',
    desc: 'Sabemos que disputas judiciais — sejam familiares, médicas ou crises empresariais — geram angústia e sobrecarga. Para apoiá-lo de forma integral, oferecemos 2 sessões gratuitas de acolhimento com profissional de psicanálise aos nossos clientes.',
  },
  {
    id: 'f2',
    icon: '⚖️',
    title: 'Comunicação Clara e Sem “Juridiquês”',
    desc: 'Explicamos cada etapa do seu processo de forma transparente, didática e direta. Você terá total clareza dos cenários, riscos, prazos e estratégias adotadas.',
  },
  {
    id: 'f3',
    icon: '📱',
    title: 'Agilidade e Resposta Pontual',
    desc: 'Nada de semanas sem retorno. Nossa equipe executiva e o corpo jurídico mantêm canais diretos via WhatsApp e e-mail para que você nunca fique sem informação.',
  },
  {
    id: 'f4',
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
            <EditableText
              page="atendimento"
              section="header"
              fieldKey="eyebrow"
              defaultContent="Compromisso com Você"
              as="span"
              className="eyebrow justify-center mb-3"
            />
            <EditableText
              page="atendimento"
              section="header"
              fieldKey="title"
              defaultContent="Atendimento Personalizado"
              as="h1"
              className="text-4xl md:text-5xl lg:text-6xl font-serif text-evi-deep font-bold tracking-tight mb-6"
            />
            <EditableText
              page="atendimento"
              section="header"
              fieldKey="desc"
              defaultContent="Nosso compromisso central é tratar cada cliente de maneira única, compreendendo suas dores, respeitando sua história e buscando a melhor solução jurídica com serenidade e afeto."
              as="p"
              className="text-evi-text-light text-lg md:text-xl leading-relaxed"
              multiline
            />
          </div>

          {/* Card Principal de Destaque para Psicanálise */}
          <div className="bg-white rounded-3xl border border-evi-border p-8 md:p-14 shadow-evi-card mb-16 relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
              <div className="md:col-span-8 space-y-6">
                <EditableText
                  page="atendimento"
                  section="psicanalise"
                  fieldKey="eyebrow"
                  defaultContent="Diferencial Inédito no Brasil"
                  as="span"
                  className="eyebrow"
                />
                <EditableText
                  page="atendimento"
                  section="psicanalise"
                  fieldKey="title"
                  defaultContent="2 Sessões Gratuitas de Acolhimento e Psicanálise"
                  as="h2"
                  className="text-3xl md:text-4xl font-serif font-bold text-evi-deep leading-snug"
                />
                <EditableText
                  page="atendimento"
                  section="psicanalise"
                  fieldKey="p1"
                  defaultContent="Para que você se sinta mais acolhido e apto emocionalmente para lidar com as decisões e impactos do seu processo, a EVI Sociedade de Advogados disponibiliza 2 (duas) sessões gratuitas de acolhimento psicológico/psicanálise com profissional parceiro especializado."
                  as="p"
                  className="text-base text-evi-text leading-relaxed"
                  multiline
                />
                <EditableText
                  page="atendimento"
                  section="psicanalise"
                  fieldKey="p2"
                  defaultContent="Acreditamos que a vitória jurídica começa com o equilíbrio emocional e a paz de espírito de quem confia em nosso trabalho."
                  as="p"
                  className="text-sm text-evi-text-light leading-relaxed"
                  multiline
                />
                <div className="pt-2">
                  <EditableLink
                    page="atendimento"
                    section="psicanalise"
                    fieldKey="cta"
                    defaultLabel="Agendar Meu Atendimento Personalizado"
                    defaultHref="https://wa.me/5511991390045?text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20o%20atendimento%20personalizado%20e%20as%20sess%C3%B5es%20de%20acolhimento."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-wa text-sm inline-block"
                  />
                </div>
              </div>

              <div className="md:col-span-4 bg-gradient-to-br from-evi-soft to-white p-8 rounded-2xl border border-evi-border text-center">
                <span className="text-5xl mb-4 block">🤍</span>
                <EditableText
                  page="atendimento"
                  section="psicanalise"
                  fieldKey="side_title"
                  defaultContent="Cuidado Integral"
                  as="h3"
                  className="font-serif font-bold text-xl text-evi-deep mb-2"
                />
                <EditableText
                  page="atendimento"
                  section="psicanalise"
                  fieldKey="side_desc"
                  defaultContent="Segurança para seu patrimônio, serenidade para sua mente e sua família."
                  as="p"
                  className="text-xs text-evi-text-light leading-relaxed mb-4"
                  multiline
                />
                <EditableText
                  page="atendimento"
                  section="psicanalise"
                  fieldKey="side_badge"
                  defaultContent="Cortesia aos Clientes EVI"
                  as="span"
                  className="inline-block text-[11px] font-bold text-evi-accent uppercase tracking-wider bg-white px-3 py-1 rounded-full border border-evi-border"
                />
              </div>
            </div>
          </div>

          {/* Grid de Recursos do Atendimento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {careFeatures.map((feat) => (
              <div
                key={feat.id}
                className="bg-white rounded-3xl border border-evi-border p-8 shadow-evi-card hover:shadow-evi-hover transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-evi-soft flex items-center justify-center text-2xl mb-5 border border-evi-border">
                  {feat.icon}
                </div>
                <EditableText
                  page="atendimento"
                  section="features"
                  fieldKey={`${feat.id}_title`}
                  defaultContent={feat.title}
                  as="h3"
                  className="text-xl font-serif font-bold text-evi-deep mb-3"
                />
                <EditableText
                  page="atendimento"
                  section="features"
                  fieldKey={`${feat.id}_desc`}
                  defaultContent={feat.desc}
                  as="p"
                  className="text-sm text-evi-text-light leading-relaxed"
                  multiline
                />
              </div>
            ))}
          </div>

          {/* Banner de Contato Direto */}
          <div className="bg-gradient-to-r from-evi-deep to-[#243d56] text-white rounded-3xl p-8 md:p-14 text-center max-w-3xl mx-auto shadow-evi-card">
            <EditableText
              page="atendimento"
              section="cta_banner"
              fieldKey="title"
              defaultContent="Estamos prontos para ouvir sua história"
              as="h3"
              className="text-2xl md:text-3xl font-serif font-bold mb-3"
            />
            <EditableText
              page="atendimento"
              section="cta_banner"
              fieldKey="desc"
              defaultContent="Entre em contato agora mesmo com nossa equipe de atendimento executivo e dê o primeiro passo rumo à solução definitiva da sua demanda."
              as="p"
              className="text-slate-300 text-sm md:text-base mb-8 leading-relaxed"
              multiline
            />
            <div className="flex flex-wrap justify-center gap-4">
              <EditableLink
                page="atendimento"
                section="cta_banner"
                fieldKey="wa_btn"
                defaultLabel="Falar pelo WhatsApp"
                defaultHref="https://wa.me/5511991390045?text=Ol%C3%A1%2C%20gostaria%20de%20iniciar%20meu%20atendimento%20com%20a%20EVI%20Advogados."
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-wa text-base"
              />
              <EditableLink
                page="atendimento"
                section="cta_banner"
                fieldKey="contact_btn"
                defaultLabel="Outros Canais de Contato"
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
