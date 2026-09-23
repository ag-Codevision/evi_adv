'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import EditableText from '@/components/admin/EditableText';
import EditableLink from '@/components/admin/EditableLink';

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    assunto: '',
    mensagem: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Redireciona para o WhatsApp com os dados preenchidos para resposta imediata
    const msg = `*Contato via Site EVI Advogados*%0A*Nome:* ${encodeURIComponent(formData.nome)}%0A*E-mail:* ${encodeURIComponent(formData.email)}%0A*Telefone:* ${encodeURIComponent(formData.telefone)}%0A*Assunto:* ${encodeURIComponent(formData.assunto)}%0A*Mensagem:* ${encodeURIComponent(formData.mensagem)}`;
    window.open(`https://wa.me/5511991390045?text=${msg}`, '_blank');
    setSubmitted(true);
  };

  return (
    <>
      <Header />

      <main className="bg-[#f8fafb] min-h-screen py-16">
        <div className="container max-w-6xl">
          {/* Header da Página */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <EditableText
              page="contato"
              section="header"
              fieldKey="eyebrow"
              defaultContent="Canais Oficiais de Atendimento"
              as="span"
              className="eyebrow justify-center mb-3"
            />
            <EditableText
              page="contato"
              section="header"
              fieldKey="title"
              defaultContent="Fale Conosco"
              as="h1"
              className="text-4xl md:text-5xl lg:text-6xl font-serif text-evi-deep font-bold tracking-tight mb-6"
            />
            <EditableText
              page="contato"
              section="header"
              fieldKey="desc"
              defaultContent="Estamos sediados no bairro histórico do Ipiranga, em São Paulo, e prontos para atender você presencialmente ou por videoconferência em todo o Brasil."
              as="p"
              className="text-evi-text-light text-lg md:text-xl leading-relaxed"
              multiline
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
            {/* Informações de Contato e Endereço */}
            <div className="lg:col-span-5 space-y-8">
              <div className="bg-white rounded-3xl border border-evi-border p-8 shadow-evi-card space-y-6">
                <div>
                  <EditableText
                    page="contato"
                    section="sede"
                    fieldKey="eyebrow"
                    defaultContent="Sede Principal"
                    as="span"
                    className="eyebrow mb-2"
                  />
                  <EditableText
                    page="contato"
                    section="sede"
                    fieldKey="title"
                    defaultContent="Ipiranga, São Paulo · SP"
                    as="h2"
                    className="text-2xl font-serif font-bold text-evi-deep"
                  />
                  <div className="flex items-start gap-3 text-evi-text-light text-sm mt-3 leading-relaxed">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-evi-accent flex-shrink-0 mt-0.5" aria-hidden="true">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <EditableText
                      page="contato"
                      section="sede"
                      fieldKey="address"
                      defaultContent="Rua Costa Aguiar, nº 2432 — Ipiranga, São Paulo – SP — CEP: 04204-002"
                      as="div"
                      multiline
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-evi-border/60 space-y-3">
                  <h3 className="text-xs uppercase tracking-wider font-bold text-evi-deep">
                    Telefones Fixos:
                  </h3>
                  <div className="flex flex-col gap-2.5 text-sm text-evi-text">
                    <EditableLink
                      page="global"
                      section="contact"
                      fieldKey="phone"
                      defaultLabel="(11) 4362-3533"
                      defaultHref="tel:+551143623533"
                      className="inline-flex items-center gap-2.5 hover:text-evi-accent font-bold text-evi-deep transition-colors"
                    />
                    <EditableLink
                      page="global"
                      section="contact"
                      fieldKey="phone_2"
                      defaultLabel="(11) 4367-5850"
                      defaultHref="tel:+551143675850"
                      className="inline-flex items-center gap-2.5 hover:text-evi-accent transition-colors"
                    />
                    <EditableLink
                      page="global"
                      section="contact"
                      fieldKey="phone_3"
                      defaultLabel="(11) 4177-3834"
                      defaultHref="tel:+551141773834"
                      className="inline-flex items-center gap-2.5 hover:text-evi-accent transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-evi-border/60 space-y-3">
                  <h3 className="text-xs uppercase tracking-wider font-bold text-evi-deep">
                    WhatsApp Direto:
                  </h3>
                  <EditableLink
                    page="global"
                    section="contact"
                    fieldKey="whatsapp"
                    defaultLabel="(11) 99139-0045 →"
                    defaultHref="https://wa.me/5511991390045"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 text-sm font-bold text-green-700 hover:text-green-800 bg-green-50 hover:bg-green-100 px-4 py-2.5 rounded-xl border border-green-200 transition-colors"
                  />
                </div>

                <div className="pt-4 border-t border-evi-border/60 space-y-2">
                  <h3 className="text-xs uppercase tracking-wider font-bold text-evi-deep">
                    E-mail Oficial:
                  </h3>
                  <EditableLink
                    page="global"
                    section="contact"
                    fieldKey="email"
                    defaultLabel="contato@evi.adv.br"
                    defaultHref="mailto:contato@evi.adv.br"
                    className="inline-flex items-center gap-2.5 text-sm font-semibold text-evi-deep hover:text-evi-accent transition-colors"
                  />
                </div>

                <div className="pt-4 border-t border-evi-border/60 space-y-2">
                  <h3 className="text-xs uppercase tracking-wider font-bold text-evi-deep">
                    Redes Sociais Oficiais:
                  </h3>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <EditableLink
                      page="global"
                      section="contact"
                      fieldKey="social_facebook"
                      defaultLabel="Facebook"
                      defaultHref="https://www.facebook.com/EVISociedadedeAdvogados/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-evi-deep bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg transition-colors border border-slate-200"
                    />
                    <EditableLink
                      page="global"
                      section="contact"
                      fieldKey="social_instagram"
                      defaultLabel="Instagram"
                      defaultHref="https://www.instagram.com/eviadvogados/?hl=pt-br"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-evi-deep bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg transition-colors border border-slate-200"
                    />
                    <EditableLink
                      page="global"
                      section="contact"
                      fieldKey="social_linkedin"
                      defaultLabel="LinkedIn"
                      defaultHref="https://www.linkedin.com/company/evi-sociedade-de-advogados/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-evi-deep bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg transition-colors border border-slate-200"
                    />
                    <EditableLink
                      page="global"
                      section="contact"
                      fieldKey="social_youtube"
                      defaultLabel="YouTube"
                      defaultHref="https://www.youtube.com/channel/UCo_k-NzKbkFVJ5zXz4xOwrQ"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-evi-deep bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg transition-colors border border-slate-200"
                    />
                  </div>
                </div>
              </div>

              {/* Card de Horários */}
              <div className="bg-evi-deep text-white rounded-3xl p-8 shadow-evi-card">
                <EditableText
                  page="contato"
                  section="horarios"
                  fieldKey="title"
                  defaultContent="Horário de Atendimento"
                  as="h3"
                  className="text-xl font-serif font-bold mb-2"
                />
                <EditableText
                  page="contato"
                  section="horarios"
                  fieldKey="desc"
                  defaultContent="Segunda a Sexta-feira: 08h30 às 18h00. Plantão WhatsApp para situações urgentes e medidas cautelares."
                  as="p"
                  className="text-slate-300 text-sm leading-relaxed mb-4"
                  multiline
                />
                <EditableText
                  page="contato"
                  section="horarios"
                  fieldKey="notice"
                  defaultContent="Atendimento com agendamento prévio"
                  as="div"
                  className="text-xs text-evi-silver font-semibold uppercase tracking-wider"
                />
              </div>
            </div>

            {/* Formulário de Contato */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl border border-evi-border p-8 md:p-12 shadow-evi-card">
                <span className="eyebrow mb-2">Envie uma Mensagem</span>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-evi-deep mb-4">
                  Como podemos ajudar você hoje?
                </h2>
                <p className="text-evi-text-light text-sm mb-8">
                  Preencha o formulário abaixo e nossa assessoria entrará em contato prontamente.
                </p>

                {submitted ? (
                  <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-2xl text-center space-y-3">
                    <h3 className="font-serif font-bold text-lg">Mensagem enviada com sucesso!</h3>
                    <p className="text-sm">
                      Nossa equipe jurídica responderá com a máxima brevidade e sigilo.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="btn btn-outline text-xs mt-2"
                    >
                      Enviar nova mensagem
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-evi-deep uppercase tracking-wider mb-1.5">
                        Seu Nome Completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        placeholder="Ex: Roberto Silveira"
                        className="w-full px-4 py-3 rounded-xl border border-evi-border bg-[#fdfdfd] text-evi-text text-sm focus:outline-none focus:border-evi-accent"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-evi-deep uppercase tracking-wider mb-1.5">
                          Seu E-mail *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="seuemail@empresa.com.br"
                          className="w-full px-4 py-3 rounded-xl border border-evi-border bg-[#fdfdfd] text-evi-text text-sm focus:outline-none focus:border-evi-accent"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-evi-deep uppercase tracking-wider mb-1.5">
                          Telefone / WhatsApp *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.telefone}
                          onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                          placeholder="(11) 99999-9999"
                          className="w-full px-4 py-3 rounded-xl border border-evi-border bg-[#fdfdfd] text-evi-text text-sm focus:outline-none focus:border-evi-accent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-evi-deep uppercase tracking-wider mb-1.5">
                        Assunto / Área de Interesse *
                      </label>
                      <select
                        required
                        value={formData.assunto}
                        onChange={(e) => setFormData({ ...formData, assunto: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-evi-border bg-[#fdfdfd] text-evi-text text-sm focus:outline-none focus:border-evi-accent"
                      >
                        <option value="">Selecione uma área</option>
                        <option value="Direito Médico e Biomédico">Direito Médico e Biomédico</option>
                        <option value="Recuperação Judicial e Insolvência">Recuperação Judicial e Insolvência</option>
                        <option value="Agronegócio e Crédito Rural">Agronegócio e Crédito Rural</option>
                        <option value="Direito de Família e Sucessões">Direito de Família e Sucessões</option>
                        <option value="Direito Empresarial e Societário">Direito Empresarial e Societário</option>
                        <option value="Direito Trabalhista Corporativo">Direito Trabalhista Corporativo</option>
                        <option value="Direito Cível Estratégico">Direito Cível Estratégico</option>
                        <option value="Outro Assunto">Outro Assunto</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-evi-deep uppercase tracking-wider mb-1.5">
                        Sua Mensagem *
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={formData.mensagem}
                        onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                        placeholder="Descreva brevemente a situação ou o interesse de sua consulta..."
                        className="w-full px-4 py-3 rounded-xl border border-evi-border bg-[#fdfdfd] text-evi-text text-sm focus:outline-none focus:border-evi-accent resize-none"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full btn btn-wa py-3.5 text-center justify-center font-bold text-sm"
                    >
                      Enviar Mensagem e Iniciar Atendimento
                    </button>
                    <p className="text-[11px] text-evi-text-muted text-center">
                      🔒 Suas informações são estritamente confidenciais e protegidas pelo sigilo profissional da OAB.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Mapa do Google Maps Embutido */}
          <div className="bg-white rounded-3xl border border-evi-border overflow-hidden shadow-evi-card p-4">
            <div className="mb-3 px-4 pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-evi-deep uppercase tracking-wider">Localização no Ipiranga</span>
                <p className="text-xs text-evi-text-light">Rua Costa Aguiar, 2432 - Ipiranga, São Paulo - SP</p>
              </div>
              <a
                href="https://www.google.com/maps/place/EVI+Sociedade+de+Advogados/@-23.5955075,-46.6083219,712m/data=!3m2!1e3!4b1!4m6!3m5!1s0x94ce59b8983035d9:0x344dfa9c9341de93!8m2!3d-23.5955124!4d-46.605747!16s%2Fg%2F11c6ldrhgn?hl=pt-BR&entry=ttu&g_ep=EgoyMDI2MDkxNS4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-evi-deep hover:text-evi-accent bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl border border-slate-200 transition-colors w-fit"
              >
                <span>Abrir no Google Maps</span>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>
            <div className="aspect-[21/9] w-full rounded-2xl overflow-hidden border border-evi-border">
              <iframe
                title="Localização de EVI Sociedade de Advogados no Google Maps"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3656.241512497698!2d-46.6083219!3d-23.5955075!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59b8983035d9%3A0x344dfa9c9341de93!2sEVI%20Sociedade%20de%20Advogados!5e0!3m2!1spt-BR!2sbr!4v1710500000000!5m2!1spt-BR!2sbr"
              ></iframe>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
