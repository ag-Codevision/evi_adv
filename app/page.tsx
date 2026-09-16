import React from 'react';
import Header from '@/components/Header';
import HeroSlider from '@/components/HeroSlider';
import Metrics from '@/components/Metrics';
import MediaAuthoritySection from '@/components/MediaAuthoritySection';
import AreasSection from '@/components/AreasSection';
import AboutSection from '@/components/AboutSection';
import ProcessSection from '@/components/ProcessSection';
import FaqSection from '@/components/FaqSection';
import ContactSection from '@/components/ContactSection';

export default function HomePage() {
  return (
    <>
      {/* Header com Menubar Simétrica Harmônica e Logotipo Centralizado */}
      <Header />

      <main>
        {/* Banner Hero com Slider 25 Anos e WebGL Glass Reveal */}
        <HeroSlider />

        {/* Indicadores e Métricas de Autoridade */}
        <Metrics />

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
