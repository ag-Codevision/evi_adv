import React from 'react';
import Header from '@/components/Header';
import HeroSlider from '@/components/HeroSlider';
import GoogleReviewsSection from '@/components/GoogleReviewsSection';
import Metrics from '@/components/Metrics';
import MediaAuthoritySection from '@/components/MediaAuthoritySection';
import AreasSection from '@/components/AreasSection';
import AboutSection from '@/components/AboutSection';
import ProcessSection from '@/components/ProcessSection';
import FaqSection from '@/components/FaqSection';
import ContactSection from '@/components/ContactSection';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EVI Sociedade de Advogados | Recuperação Judicial, Agro e Direito Médico',
  description:
    'Sociedade de advogados fundada em 2001 pelo Dr. Eduardo Veríssimo Inocente. Especialistas em Recuperação Judicial, Agronegócio, Direito Médico e Soluções Empresariais Estratégicas em todo o Brasil.',
  alternates: {
    canonical: '/',
  },
};

const homeFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'O escritório EVI Advogados atende em todo o Brasil?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sim. A EVI Sociedade de Advogados possui atuação e infraestrutura para atender demandas consultivas e contenciosas em todo o território nacional.',
      },
    },
    {
      '@type': 'Question',
      name: 'Há consultoria preventiva para médicos e hospitais?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sim. Atuamos com análise preventiva de riscos, elaboração de termos de consentimento, compliance hospitalar e defesa técnica especializada em Direito Médico.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quais áreas do Direito são atendidas pelo escritório?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Nossos eixos de excelência incluem Recuperação Judicial e Falências, Agronegócio e Crédito Rural, Direito Médico, Direito Societário, Contratos Empresariais, Direito Tributário, Trabalhista e Cível Estratégico.',
      },
    },
    {
      '@type': 'Question',
      name: 'Como iniciar o atendimento ou agendar uma consulta jurídica?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Basta entrar em contato pelos canais oficiais (WhatsApp, formulário de contato ou telefone) para que nossa equipe faça a triagem e direcionamento imediato ao especialista da área.',
      },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqSchema) }}
      />
      {/* Header com Menubar Simétrica Harmônica e Logotipo Centralizado */}
      <Header />

      <main>
        {/* Banner Hero com Slider 25 Anos e WebGL Glass Reveal */}
        <HeroSlider />

        {/* Indicadores e Métricas de Autoridade */}
        <Metrics />

        {/* Avaliações do Google Meu Negócio */}
        <GoogleReviewsSection />

        {/* Seção de Autoridade na Mídia, TV e Premiações */}
        <MediaAuthoritySection />

        {/* Áreas de Atuação */}
        <AreasSection />

        {/* Estrutura, Equipe e Valores do Escritório */}
        <AboutSection />

        {/* Fluxo de Atendimento */}
        <ProcessSection />

        {/* Dúvidas Frequentes */}
        <FaqSection />

        {/* Contato e Localização */}
        <ContactSection />
      </main>
    </>
  );
}
