'use client';

import React, { useState } from 'react';
import EditableText from './admin/EditableText';
import { useAdminEditor } from './admin/AdminAuthProvider';
import { saveSiteContent } from '../lib/site-content';

const initialFaqs = [
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
  const [faqs, setFaqs] = useState(initialFaqs);
  const { isAdmin, isEditing, setStatusMessage } = useAdminEditor();

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleAddFaq = async () => {
    const newIndex = faqs.length + 1;
    const newQ = `Nova Pergunta ${newIndex}?`;
    const newA = 'Nova Resposta';

    setStatusMessage('Adicionando FAQ...');

    const resQ = await saveSiteContent({
      page: 'home',
      section: 'faq',
      fieldKey: `q${newIndex}`,
      value: newQ,
      contentType: 'text',
    });

    const resA = await saveSiteContent({
      page: 'home',
      section: 'faq',
      fieldKey: `a${newIndex}`,
      value: newA,
      contentType: 'text',
    });

    if (resQ.success && resA.success) {
      setFaqs([...faqs, { q: newQ, a: newA }]);
      setStatusMessage(null);
    } else {
      setStatusMessage('Erro ao adicionar FAQ');
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  return (
    <section className="section" id="duvidas">
      <div className="container faq-grid">
        <div className="faq-intro motion-item" data-motion="left">
          <EditableText page="home" section="faq" fieldKey="eyebrow" defaultContent="Dúvidas frequentes" as="span" className="eyebrow" />
          <EditableText page="home" section="faq" fieldKey="heading" defaultContent="Informação também é segurança." as="h2" />
          <EditableText page="home" section="faq" fieldKey="desc" defaultContent="Respostas iniciais para facilitar seu primeiro contato com o escritório." as="p" className="section-subtitle" multiline />
          
          {isAdmin && isEditing && (
            <button
              onClick={handleAddFaq}
              className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600/80 hover:bg-sky-700 text-white text-sm font-medium transition-colors"
            >
              + Adicionar FAQ
            </button>
          )}
        </div>
        <div className="faq-list motion-item" data-motion="right">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            const qKey = `q${idx + 1}`;
            const aKey = `a${idx + 1}`;
            return (
              <div key={idx} className={`faq-item ${isOpen ? 'open' : ''}`}>
                <button
                  type="button"
                  className="faq-q"
                  aria-expanded={isOpen}
                  onClick={() => toggleFaq(idx)}
                >
                  <EditableText page="home" section="faq" fieldKey={qKey} defaultContent={faq.q} as="span" />
                  <b>+</b>
                </button>
                <div className="faq-a">
                  <EditableText page="home" section="faq" fieldKey={aKey} defaultContent={faq.a} as="p" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
