'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';

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
            <span className="eyebrow justify-center mb-3">Canais Oficiais de Atendimento</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-evi-deep font-bold tracking-tight mb-6">
              Fale Conosco
            </h1>
            <p className="text-evi-text-light text-lg md:text-xl leading-relaxed">
              Estamos sediados no bairro histórico do Ipiranga, em São Paulo, e prontos para atender você presencialmente ou por videoconferência em todo o Brasil.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
            {/* Informações de Contato e Endereço */}
            <div className="lg:col-span-5 space-y-8">
              <div className="bg-white rounded-3xl border border-evi-border p-8 shadow-evi-card space-y-6">
                <div>
                  <span className="eyebrow mb-2">Sede Principal</span>
                  <h2 className="text-2xl font-serif font-bold text-evi-deep">
                    Ipiranga, São Paulo · SP
                  </h2>
                  <div className="flex items-start gap-3 text-evi-text-light text-sm mt-3 leading-relaxed">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-evi-accent flex-shrink-0 mt-0.5" aria-hidden="true">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <div>
                      Rua Costa Aguiar, nº 2432<br />
                      Ipiranga, São Paulo – SP<br />
                      CEP: 04204-002
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-evi-border/60 space-y-3">
                  <h3 className="text-xs uppercase tracking-wider font-bold text-evi-deep">
                    Telefones Fixos:
                  </h3>
                  <div className="flex flex-col gap-2.5 text-sm text-evi-text">
                    <a href="tel:+551143623533" className="inline-flex items-center gap-2.5 hover:text-evi-accent font-semibold transition-colors">
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-evi-accent flex-shrink-0" aria-hidden="true">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      <span>(11) 4362-3533</span>
                    </a>
                    <a href="tel:+551143675850" className="inline-flex items-center gap-2.5 hover:text-evi-accent transition-colors">
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 flex-shrink-0" aria-hidden="true">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      <span>(11) 4367-5850</span>
                    </a>
                    <a href="tel:+551141773834" className="inline-flex items-center gap-2.5 hover:text-evi-accent transition-colors">
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 flex-shrink-0" aria-hidden="true">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      <span>(11) 4177-3834</span>
                    </a>
                  </div>
                </div>

                <div className="pt-4 border-t border-evi-border/60 space-y-3">
                  <h3 className="text-xs uppercase tracking-wider font-bold text-evi-deep">
                    WhatsApp Direto:
                  </h3>
                  <a
                    href="https://wa.me/5511991390045"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 text-sm font-bold text-green-700 hover:text-green-800 bg-green-50 hover:bg-green-100 px-4 py-2.5 rounded-xl border border-green-200 transition-colors"
                  >
                    <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" className="text-green-600 flex-shrink-0" aria-hidden="true">
                      <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.25a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.591-6.592 6.591zm3.615-4.934c-.197-.1-1.17-.578-1.353-.643-.182-.064-.315-.096-.445.1-.133.197-.514.643-.63.775-.116.133-.232.15-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.17-1.101-1.37-.116-.197-.013-.304.087-.403.09-.089.197-.232.296-.348.1-.116.133-.197.197-.33.064-.133.033-.25-.017-.348-.05-.1-.445-1.075-.61-1.47-.16-.389-.326-.336-.445-.343-.116-.007-.25-.007-.38-.007a.729.729 0 0 0-.527.245c-.182.197-.691.676-.691 1.648s.708 1.912.807 2.045c.1.133 1.394 2.13 3.38 2.99.473.204.84.326 1.129.416.473.15.904.129 1.244.078.38-.058 1.17-.48 1.337-.943.164-.464.164-.86.116-.943-.05-.084-.182-.133-.38-.232z" />
                    </svg>
                    <span>(11) 99139-0045</span>
                    <span className="text-green-600 font-bold">→</span>
                  </a>
                </div>

                <div className="pt-4 border-t border-evi-border/60 space-y-2">
                  <h3 className="text-xs uppercase tracking-wider font-bold text-evi-deep">
                    E-mail Oficial:
                  </h3>
                  <a href="mailto:contato@evi.adv.br" className="inline-flex items-center gap-2.5 text-sm font-semibold text-evi-deep hover:text-evi-accent transition-colors">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-evi-accent flex-shrink-0" aria-hidden="true">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    <span>contato@evi.adv.br</span>
                  </a>
                </div>
              </div>

              {/* Card de Horários */}
              <div className="bg-evi-deep text-white rounded-3xl p-8 shadow-evi-card">
                <h3 className="text-xl font-serif font-bold mb-2">Horário de Atendimento</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  Segunda a Sexta-feira: 08h30 às 18h00.<br />
                  Plantão WhatsApp para situações urgentes e medidas cautelares.
                </p>
                <div className="text-xs text-evi-silver font-semibold uppercase tracking-wider">
                  Atendimento com agendamento prévio
                </div>
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
            <div className="mb-3 px-4 pt-2">
              <span className="text-xs font-bold text-evi-deep uppercase tracking-wider">Localização no Ipiranga</span>
              <p className="text-xs text-evi-text-light">Rua Costa Aguiar, 2432 - Ipiranga, São Paulo - SP</p>
            </div>
            <div className="aspect-[21/9] w-full rounded-2xl overflow-hidden border border-evi-border">
              <iframe
                title="Mapa EVI Sociedade de Advogados"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3656.3262809628045!2d-46.6025537!3d-23.5926526!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce5b8c34f1954d%3A0xc3ce7ef6e2361661!2sR.%20Costa%20Aguiar%2C%202432%20-%20Ipiranga%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2004204-002!5e0!3m2!1spt-BR!2sbr!4v1710500000000!5m2!1spt-BR!2sbr"
              ></iframe>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
