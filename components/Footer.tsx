import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer bg-evi-deep text-white">
      <div className="container">
        <div className="footer-grid">
          {/* Coluna 1: Marca Institucional & Autoridade */}
          <div className="motion-item" data-motion="left">
            <Link className="footer-brand" href="/">
              <img
                src="/assets/logo_25_anos.webp"
                alt="Logo oficial EVI Sociedade de Advogados - 25 Anos"
              />
            </Link>
            <p className="text-slate-300 text-sm leading-relaxed mt-4">
              Fundada em 2001 pelo <strong>Dr. Eduardo Veríssimo Inocente</strong>, a EVI Advogados une 25 anos de solidez jurídica, presença na grande mídia e atendimento humanizado para clientes em todo o território nacional.
            </p>
          </div>

          {/* Coluna 2: Institucional */}
          <div className="motion-item" data-motion="up">
            <h3 className="font-serif text-lg font-bold text-white mb-4">O Escritório</h3>
            <div className="footer-links text-sm space-y-2">
              <Link href="/quem-somos">Quem Somos</Link>
              <Link href="/quem-somos#historico">Histórico 25 Anos</Link>
              <Link href="/nossa-estrutura">Nossa Estrutura</Link>
              <Link href="/areas-de-atuacao#diferenciais">Diferenciais</Link>
              <Link href="/quem-somos#profissionais">Corpo Jurídico</Link>
              <Link href="/quem-somos#dr-eduardo">Dr. Eduardo Veríssimo Inocente</Link>
            </div>
          </div>

          {/* Coluna 3: Áreas de Atuação */}
          <div className="motion-item" data-motion="up">
            <h3 className="font-serif text-lg font-bold text-white mb-4">Áreas de Atuação</h3>
            <div className="footer-links text-sm space-y-2">
              <Link href="/areas-de-atuacao#medico">Direito Médico e Biomédico</Link>
              <Link href="/areas-de-atuacao#trabalhista">Trabalhista</Link>
              <Link href="/areas-de-atuacao#empresarial">Empresarial</Link>
              <Link href="/areas-de-atuacao#civel">Cível</Link>
              <Link href="/areas-de-atuacao#familia">Família</Link>
              <Link href="/areas-de-atuacao#protecao-de-dados">Proteção de Dados</Link>
            </div>
          </div>

          {/* Coluna 4: Canais Oficiais & Mídia */}
          <div className="motion-item" data-motion="right">
            <h3 className="font-serif text-lg font-bold text-white mb-4">Mídia & Atendimento</h3>
            <div className="footer-links text-sm space-y-2 mb-4">
              <Link href="/blog">Blog & Artigos Jurídicos</Link>
              <Link href="/imprensa">Sala de Imprensa & Clipping</Link>
              <Link href="/podcast">Podcast Direito e Arte no YouTube</Link>
              <Link href="/atendimento">Atendimento Personalizado</Link>
              <Link href="/contato">Fale Conosco</Link>
            </div>

            <div className="pt-3 border-t border-white/10 space-y-2.5 text-xs text-slate-300">
              <a href="tel:+551143623533" className="flex items-center gap-2 hover:text-white transition-colors">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 flex-shrink-0" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>(11) 4362-3533</span>
              </a>
              <a href="mailto:contato@evi.adv.br" className="flex items-center gap-2 hover:text-white transition-colors">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 flex-shrink-0" aria-hidden="true">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <span>contato@evi.adv.br</span>
              </a>
              <a
                href="https://www.google.com/maps/place/EVI+Sociedade+de+Advogados/@-23.5955075,-46.6083219,712m/data=!3m2!1e3!4b1!4m6!3m5!1s0x94ce59b8983035d9:0x344dfa9c9341de93!8m2!3d-23.5955124!4d-46.605747!16s%2Fg%2F11c6ldrhgn?hl=pt-BR&entry=ttu&g_ep=EgoyMDI2MDkxNS4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                title="Ver endereço no Google Maps"
                className="flex items-start gap-2 hover:text-white transition-colors text-slate-300 leading-snug"
              >
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 flex-shrink-0 mt-0.5" aria-hidden="true">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>Sede Própria: Rua Costa Aguiar, 2432 — Ipiranga, São Paulo · SP</span>
              </a>
            </div>

            <div className="topbar-social mt-4">
              <a href="https://www.facebook.com/EVISociedadedeAdvogados/" target="_blank" rel="noopener noreferrer" title="Facebook da EVI Advogados" aria-label="Facebook">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="https://www.instagram.com/eviadvogados/?hl=pt-br" target="_blank" rel="noopener noreferrer" title="Instagram da EVI Advogados" aria-label="Instagram">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a href="https://www.linkedin.com/company/evi-sociedade-de-advogados/" target="_blank" rel="noopener noreferrer" title="LinkedIn da EVI Advogados" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a href="https://www.youtube.com/@evisociedadedeadvogados443" target="_blank" rel="noopener noreferrer" title="YouTube da EVI Advogados" aria-label="YouTube">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33zM9.75 15.02l.01-6.54 5.74 3.27-5.75 3.27z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Rodapé inferior com copyright estável */}
        <div className="footer-bottom mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <span>© 2001–2026 EVI Sociedade de Advogados. 25 Anos de Vanguarda. Todos os direitos reservados.</span>
          <span>Conteúdo de caráter estritamente informativo, pautado pelo Provimento 205/2021 da OAB.</span>
        </div>
      </div>
    </footer>
  );
}
