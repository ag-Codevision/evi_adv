'use client';

import React from 'react';
import EditableText from './admin/EditableText';
import EditableLink from './admin/EditableLink';

export default function ContactSection() {
  return (
    <section className="contact" id="contato">
      <div className="container contact-panel">
        <div className="contact-copy motion-item" data-motion="left">
          <EditableText page="home" section="contact" fieldKey="eyebrow" defaultContent="Contato" as="span" className="eyebrow" />
          <EditableText page="home" section="contact" fieldKey="heading" defaultContent="Converse com o escritório." as="h2" />
          <EditableText page="home" section="contact" fieldKey="desc" defaultContent="Apresente sua necessidade pelos canais oficiais e receba orientação sobre o atendimento." as="p" className="section-subtitle" multiline />
          <div className="contact-list">
            {/* 3 Telefones Fixos da Banca - Um abaixo do outro, como no Footer */}
            <div className="space-y-1.5 py-1">
              {/* Telefone Principal em Negrito */}
              <EditableLink
                page="global"
                section="contact"
                fieldKey="phone"
                defaultLabel="(11) 4125-1000"
                defaultHref="tel:+551141251000"
                className="flex items-center gap-2.5 font-bold text-evi-deep text-base hover:text-evi-accent transition-colors"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-evi-accent flex-shrink-0" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </EditableLink>

              {/* Telefone 2 */}
              <EditableLink
                page="global"
                section="contact"
                fieldKey="phone_2"
                defaultLabel="(11) 4367-5850"
                defaultHref="tel:+551143675850"
                className="flex items-center gap-2.5 text-slate-600 hover:text-evi-accent text-sm transition-colors"
              >
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 flex-shrink-0" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </EditableLink>

              {/* Telefone 3 */}
              <EditableLink
                page="global"
                section="contact"
                fieldKey="phone_3"
                defaultLabel="(11) 4177-3834"
                defaultHref="tel:+551141773834"
                className="flex items-center gap-2.5 text-slate-600 hover:text-evi-accent text-sm transition-colors"
              >
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 flex-shrink-0" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </EditableLink>
            </div>

            <EditableLink
              page="global"
              section="contact"
              fieldKey="email"
              defaultLabel="contato@evi.adv.br"
              defaultHref="mailto:contato@evi.adv.br"
              className="flex items-center gap-2.5 text-slate-600 hover:text-evi-accent text-sm transition-colors pt-2 border-t border-slate-200/80"
            >
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 flex-shrink-0" aria-hidden="true">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </EditableLink>

            <EditableText page="home" section="contact" fieldKey="badge" defaultContent="Atendimento em todo o território nacional" as="span" className="text-xs text-evi-text-muted mt-1 block" />
          </div>
          <EditableLink
            page="home"
            section="contact"
            fieldKey="wa_link"
            defaultLabel="Iniciar conversa"
            defaultHref="https://wa.me/5511991390045?text=Ol%C3%A1%2C%20encontrei%20o%20site%20e%20gostaria%20de%20receber%20uma%20orienta%C3%A7%C3%A3o%20jur%C3%ADdica."
            className="btn btn-wa"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg className="wa-icon" viewBox="0 0 16 16" aria-hidden="true">
              <path
                fill="currentColor"
                d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.25a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.591-6.592 6.591zm3.615-4.934c-.197-.1-1.17-.578-1.353-.643-.182-.064-.315-.096-.445.1-.133.197-.514.643-.63.775-.116.133-.232.15-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.17-1.101-1.37-.116-.197-.013-.304.087-.403.09-.089.197-.232.296-.348.1-.116.133-.197.197-.33.064-.133.033-.25-.017-.348-.05-.1-.445-1.075-.61-1.47-.16-.389-.326-.336-.445-.343-.116-.007-.25-.007-.38-.007a.729.729 0 0 0-.527.245c-.182.197-.691.676-.691 1.648s.708 1.912.807 2.045c.1.133 1.394 2.13 3.38 2.99.473.204.84.326 1.129.416.473.15.904.129 1.244.078.38-.058 1.17-.48 1.337-.943.164-.464.164-.86.116-.943-.05-.084-.182-.133-.38-.232z"
              />
            </svg>
          </EditableLink>
        </div>
        <iframe
          className="motion-item"
          data-motion="right"
          title="Mapa de EVI Sociedade de Advogados"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3656.241512497698!2d-46.6083219!3d-23.5955075!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59b8983035d9%3A0x344dfa9c9341de93!2sEVI%20Sociedade%20de%20Advogados!5e0!3m2!1spt-BR!2sbr!4v1710500000000!5m2!1spt-BR!2sbr"
        />
      </div>
    </section>
  );
}
