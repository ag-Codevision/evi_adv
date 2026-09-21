'use client';

import React from 'react';
import EditableText from './admin/EditableText';
import EditableLink from './admin/EditableLink';

export default function Topbar() {
  return (
    <div className="topbar">
      <div className="container">
        <div className="topbar-left">
          <div className="topbar-contacts">
            <EditableLink page="global" section="topbar" fieldKey="phone" defaultLabel="(11) 4362-3533" defaultHref="tel:+551143623533" className="topbar-item" title="Telefone comercial da EVI Advogados">
              <svg className="topbar-icon" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </EditableLink>
            <EditableLink page="global" section="topbar" fieldKey="email" defaultLabel="contato@evi.adv.br" defaultHref="mailto:contato@evi.adv.br" className="topbar-item email-item" title="E-mail oficial da EVI Advogados">
              <svg className="topbar-icon" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </EditableLink>
            <EditableText page="global" section="topbar" fieldKey="badge" defaultContent="Atendimento Nacional" as="span" className="hidden md:inline-flex items-center text-xs text-slate-400 pl-2 border-l border-slate-700/60 font-medium" />
          </div>
        </div>
        <div className="topbar-social">
          <EditableText page="global" section="topbar" fieldKey="social_label" defaultContent="Siga-nos" as="span" className="topbar-social-label" />
          <EditableLink page="global" section="topbar" fieldKey="social_facebook" defaultLabel="" defaultHref="https://www.facebook.com/EVISociedadedeAdvogados/" target="_blank" rel="noopener noreferrer" title="Facebook da EVI Advogados" aria-label="Facebook">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </EditableLink>
          <EditableLink page="global" section="topbar" fieldKey="social_instagram" defaultLabel="" defaultHref="https://www.instagram.com/eviadvogados/?hl=pt-br" target="_blank" rel="noopener noreferrer" title="Instagram da EVI Advogados" aria-label="Instagram">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
          </EditableLink>
          <EditableLink page="global" section="topbar" fieldKey="social_linkedin" defaultLabel="" defaultHref="https://www.linkedin.com/company/evi-sociedade-de-advogados/" target="_blank" rel="noopener noreferrer" title="LinkedIn da EVI Advogados" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </EditableLink>
          <EditableLink page="global" section="topbar" fieldKey="social_youtube" defaultLabel="" defaultHref="https://www.youtube.com/channel/UCo_k-NzKbkFVJ5zXz4xOwrQ" target="_blank" rel="noopener noreferrer" title="YouTube da EVI Advogados" aria-label="YouTube">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33zM9.75 15.02l.01-6.54 5.74 3.27-5.75 3.27z" />
            </svg>
          </EditableLink>
        </div>
      </div>
    </div>
  );
}
