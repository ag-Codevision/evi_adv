'use client';

import React, { useState } from 'react';

const faqs = [
  {
    q: 'O escritório atende em todo o Brasil?',
    a: 'Sim. A EVI informa atuação em todo o território nacional.',
  },
  {
    q: 'Há consultoria preventiva para médicos?',
    a: 'Sim. A atuação divulgada inclui análise preventiva de riscos e interface com hospitais e laboratórios.',
  },
  {
    q: 'Quais áreas são atendidas?',
    a: 'Direito Médico, Cível, de Família, Trabalhista e Empresarial estão entre as áreas divulgadas.',
  },
  {
    q: 'Como iniciar o atendimento?',
    a: 'Entre em contato pelos canais oficiais e apresente a demanda para uma análise inicial.',
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="section" id="duvidas">
      <div className="container faq-grid">
        <div className="faq-intro motion-item" data-motion="left">
          <span className="eyebrow">Dúvidas frequentes</span>
          <h2>Informação também é segurança.</h2>
          <p>Respostas iniciais para facilitar seu primeiro contato com o escritório.</p>
        </div>
        <div className="faq-list motion-item" data-motion="right">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className={`faq-item ${isOpen ? 'open' : ''}`}>
                <button
                  type="button"
                  className="faq-q"
                  aria-expanded={isOpen}
                  onClick={() => toggleFaq(idx)}
                >
                  <span>{faq.q}</span>
                  <b>+</b>
                </button>
                <div className="faq-a">
                  <p>{faq.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
