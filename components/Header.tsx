'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Menu,
  X,
  Home,
  Users,
  Scale,
  Building2,
  BookOpen,
  Radio,
  Newspaper,
  Phone,
  PhoneCall,
  Mail,
  ChevronRight,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import EditableText from './admin/EditableText';
import EditableMedia from './admin/EditableMedia';
import EditableLink from './admin/EditableLink';

export interface NavLinkItem {
  label: string;
  href: string;
}

interface HeaderProps {
  leftLinks?: NavLinkItem[];
  rightLinks?: NavLinkItem[];
  allLinks?: NavLinkItem[];
}

interface NavAppItem {
  label: string;
  href: string;
  icon: LucideIcon;
  desc: string;
}

export default function Header({ leftLinks, rightLinks, allLinks }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [rippleOrigin, setRippleOrigin] = useState<{ x: number; y: number } | null>(null);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 35);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Bloqueio de scroll do body quando o menu de aplicativo estiver aberto
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalTouchAction = document.body.style.touchAction;
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.touchAction = originalTouchAction;
      };
    }
  }, [isOpen]);

  // Fechar com a tecla ESC
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen && !isClosing) {
        handleCloseMenu();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isClosing]);

  // Limpar timer ao desmontar
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  // Efeito Ink Ripple (feedback tátil MD3 em cliques)
  const triggerInkRipple = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.6;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const wave = document.createElement('span');
    wave.className = 'md3-ink-wave';
    wave.style.width = `${size}px`;
    wave.style.height = `${size}px`;
    wave.style.left = `${x}px`;
    wave.style.top = `${y}px`;

    target.appendChild(wave);
    setTimeout(() => {
      wave.remove();
    }, 550);
  };

  // Abrir Menu com Ripple circular originado no botão
  const handleOpenMenu = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX || (rect.left + rect.width / 2);
    const y = e.clientY || (rect.top + rect.height / 2);

    setRippleOrigin({ x, y });
    setIsClosing(false);
    setIsOpen(true);
  };

  // Fechar Menu com Ripple circular regressivo
  const handleCloseMenu = (e?: React.MouseEvent<HTMLElement>) => {
    if (isClosing) return;

    if (e) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX || (rect.left + rect.width / 2);
      const y = e.clientY || (rect.top + rect.height / 2);
      setRippleOrigin({ x, y });
    }

    setIsClosing(true);

    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 360);
  };

  // Lógica de simetria do desktop
  let finalLeft: NavLinkItem[] = [];
  let finalRight: NavLinkItem[] = [];

  if (leftLinks && rightLinks) {
    finalLeft = leftLinks;
    finalRight = rightLinks;
  } else if (allLinks && allLinks.length > 0) {
    const half = Math.ceil(allLinks.length / 2);
    finalLeft = allLinks.slice(0, half);
    finalRight = allLinks.slice(half);
  } else {
    finalLeft = [
      { label: 'Início', href: '/' },
      { label: 'Quem Somos', href: '/quem-somos' },
      { label: 'Áreas de Atuação', href: '/areas-de-atuacao' },
      { label: 'Nossa Estrutura', href: '/nossa-estrutura' },
    ];
    finalRight = [
      { label: 'Blog', href: '/blog' },
      { label: 'Podcast', href: '/podcast' },
      { label: 'Imprensa & Mídia', href: '/imprensa' },
      { label: 'Contato', href: '/contato' },
    ];
  }

  // Lista com ícones e metadados para o menu estilo aplicativo
  const appNavItems: NavAppItem[] = [
    { label: 'Início', href: '/', icon: Home, desc: 'Página inicial e visão geral' },
    { label: 'Quem Somos', href: '/quem-somos', icon: Users, desc: 'Nossa trajetória e corpo jurídico' },
    { label: 'Áreas de Atuação', href: '/areas-de-atuacao', icon: Scale, desc: 'Direito Empresarial, Agronegócio e RJ' },
    { label: 'Nossa Estrutura', href: '/nossa-estrutura', icon: Building2, desc: 'Sede moderna e infraestrutura de ponta' },
    { label: 'Blog Jurídico', href: '/blog', icon: BookOpen, desc: 'Análises técnicas e novidades do Direito' },
    { label: 'Podcast Direito e Arte', href: '/podcast', icon: Radio, desc: 'Episódios e debates com especialistas' },
    { label: 'Imprensa & Mídia', href: '/imprensa', icon: Newspaper, desc: 'EVI nos principais veículos de notícia' },
    { label: 'Contato & Localização', href: '/contato', icon: Phone, desc: 'Atendimento presencial e remoto' },
  ];

  const rippleStyle = rippleOrigin
    ? ({
        '--ripple-x': `${rippleOrigin.x}px`,
        '--ripple-y': `${rippleOrigin.y}px`,
      } as React.CSSProperties)
    : undefined;

  return (
    <>
      <header id="mainHeader" className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container">
          {/* Mobile Header Bar: Logotipo no Centro e Menu Hambúrguer no Lado Direito */}
          <div className="lg:hidden mobile-header-bar">
            <div className="mobile-header-logo">
              <EditableMedia
                page="global"
                section="header"
                fieldKey="mobile_logo"
                defaultSrc="/assets/logo.png"
                alt="EVI Sociedade de Advogados"
                className="max-h-9 w-auto"
              />
            </div>

            <button
              type="button"
              className="mobile-header-btn md3-ripple-container"
              aria-label={isOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
              aria-expanded={isOpen}
              onClick={(e) => {
                triggerInkRipple(e);
                if (isOpen) {
                  handleCloseMenu(e);
                } else {
                  handleOpenMenu(e);
                }
              }}
            >
              <Menu className="w-6 h-6 text-evi-deep" strokeWidth={2.2} />
            </button>
          </div>

          {/* Desktop Harmonic Centered Split Navbar */}
          <nav className="nav-split" aria-label="Navegação Principal">
            <div className="nav-side nav-left">
              {finalLeft.map((item, idx) => (
                <Link key={idx} href={item.href} className="nav-item">
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="brand-center">
              <EditableMedia
                page="global"
                section="header"
                fieldKey="desktop_logo"
                defaultSrc="/assets/logo.png"
                alt="EVI Sociedade de Advogados"
                className="max-h-[52px] w-auto object-contain transition-all duration-350"
              />
            </div>

            <div className="nav-side nav-right">
              {finalRight.map((item, idx) => (
                <Link key={idx} href={item.href} className="nav-item">
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </header>

      {/* ==========================================================================
          MENU MOBILE ESTILO APLICATIVO COM ANIMAÇÃO RIPPLE MATERIAL DESIGN 3
          ========================================================================== */}
      {isOpen && (
        <>
          {/* Backdrop Escuro Suave */}
          <div
            className={`md3-app-backdrop ${isClosing ? 'closing' : 'open'}`}
            onClick={(e) => {
              triggerInkRipple(e);
              handleCloseMenu(e);
            }}
            aria-hidden="true"
          />

          {/* Superfície do Aplicativo Mobile com Circular Ripple */}
          <div
            className={`md3-app-surface ${isClosing ? 'exit' : 'enter'}`}
            style={rippleStyle}
            role="dialog"
            aria-modal="true"
            aria-label="Menu Principal do Aplicativo EVI"
          >
            {/* Topbar / App Header: Logotipo rigorosamente centralizado e botão fechar à direita */}
            <div className="mobile-drawer-header flex items-center justify-between px-5 pt-[max(14px,env(safe-area-inset-top))] pb-3.5 border-b border-slate-100 bg-white/95 backdrop-blur-md sticky top-0 z-20 relative min-h-[64px]">
              <Link
                href="/"
                className="mobile-drawer-logo flex items-center justify-center"
                aria-label="EVI Advogados - Início"
                onClick={(e) => {
                  triggerInkRipple(e);
                  handleCloseMenu(e);
                }}
              >
                <img
                  src="/assets/logo.png"
                  alt="EVI Advogados"
                  className="h-9 w-auto object-contain"
                />
              </Link>

              <button
                type="button"
                className="mobile-drawer-close md3-ripple-container w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 border border-slate-200/70 text-slate-700 active:scale-90 transition-all ml-auto relative z-10"
                aria-label="Fechar menu"
                onClick={(e) => {
                  triggerInkRipple(e);
                  handleCloseMenu(e);
                }}
              >
                <X className="w-5 h-5 text-evi-deep" strokeWidth={2.4} />
              </button>
            </div>

            {/* Conteúdo com Scroll Nativo do App */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 overscroll-contain">
              {/* Badge Institucional Estilo Chip MD3 */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/60 text-slate-700 text-xs">
                <ShieldCheck className="w-4 h-4 text-evi-accent flex-shrink-0" />
                <EditableText
                  page="global"
                  section="header"
                  fieldKey="mobile_oab_badge"
                  defaultContent="OAB/SP 200.344 · Desde 2001 com Atuação Nacional"
                  as="span"
                  className="font-medium tracking-wide"
                />
              </div>

              {/* Lista de Navegação Estilo App */}
              <nav className="space-y-1.5" aria-label="Navegação do Aplicativo">
                {appNavItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={idx}
                      href={item.href}
                      className="md3-stagger-item md3-ripple-container flex items-center justify-between p-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-100/90 active:bg-slate-100 transition-all shadow-sm"
                      style={{ animationDelay: `${idx * 0.035 + 0.06}s` }}
                      onClick={(e) => {
                        triggerInkRipple(e);
                        handleCloseMenu(e);
                      }}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-evi-soft/70 border border-evi-border/50 flex items-center justify-center text-evi-petrol flex-shrink-0">
                          <Icon className="w-5 h-5" strokeWidth={2} />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="font-serif font-semibold text-evi-deep text-[0.98rem] leading-tight">
                            {item.label}
                          </span>
                          <span className="text-[0.72rem] text-slate-500 font-normal mt-0.5 line-clamp-1">
                            {item.desc}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0 ml-2" />
                    </Link>
                  );
                })}
              </nav>

              {/* Card de Destaque Plantão WhatsApp VIP */}
              <div className="md3-stagger-item rounded-2xl p-4 bg-gradient-to-br from-emerald-50/90 via-teal-50/50 to-white border border-emerald-200/70 shadow-sm space-y-3" style={{ animationDelay: '0.36s' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <EditableText
                      page="global"
                      section="header"
                      fieldKey="wa_title"
                      defaultContent="Plantão Jurídico VIP"
                      as="span"
                      className="text-xs font-semibold uppercase tracking-wider text-emerald-800"
                    />
                  </div>
                  <span className="text-[0.7rem] bg-emerald-100 text-emerald-800 font-medium px-2 py-0.5 rounded-full">
                    Online agora
                  </span>
                </div>
                <EditableText
                  page="global"
                  section="header"
                  fieldKey="wa_desc"
                  defaultContent="Fale com um advogado especialista e receba orientação jurídica estratégica."
                  as="p"
                  className="text-xs text-slate-600 leading-relaxed"
                  multiline
                />
                <EditableLink
                  page="global"
                  section="header"
                  fieldKey="wa_link"
                  defaultLabel="Atendimento Rápido pelo WhatsApp"
                  defaultHref="https://wa.me/5511991390045?text=Ol%C3%A1%2C%20encontrei%20o%20site%20e%20gostaria%20de%20receber%20uma%20orienta%C3%A7%C3%A3o%20jur%C3%ADdica."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="md3-ripple-container btn btn-wa w-full py-3 text-center justify-center text-xs font-bold rounded-xl shadow-md flex items-center gap-2"
                />
              </div>

              {/* Ações Rápidas de Contato - 3 Telefones e E-mail */}
              <div className="md3-stagger-item flex flex-col gap-2 pt-1" style={{ animationDelay: '0.40s' }}>
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <PhoneCall className="w-3.5 h-3.5 text-evi-accent" />
                      Telefones Oficiais
                    </span>
                    <span className="text-[10px] bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded-full">
                      Atendimento
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    {/* Telefone 1 - Principal (em Negrito) */}
                    <EditableLink
                      page="global"
                      section="contact"
                      fieldKey="phone"
                      defaultLabel="(11) 4362-3533"
                      defaultHref="tel:+551143623533"
                      className="md3-ripple-container flex items-center justify-between p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200/60 text-evi-deep text-sm font-bold shadow-sm"
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        (11) 4362-3533
                      </span>
                      <span className="text-[10px] text-evi-accent font-semibold uppercase tracking-wider">Principal</span>
                    </EditableLink>

                    <div className="grid grid-cols-2 gap-1.5">
                      {/* Telefone 2 */}
                      <EditableLink
                        page="global"
                        section="contact"
                        fieldKey="phone_2"
                        defaultLabel="(11) 4367-5850"
                        defaultHref="tel:+551143675850"
                        className="md3-ripple-container flex items-center justify-center p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200/60 text-slate-700 text-xs font-medium"
                      />

                      {/* Telefone 3 */}
                      <EditableLink
                        page="global"
                        section="contact"
                        fieldKey="phone_3"
                        defaultLabel="(11) 4177-3834"
                        defaultHref="tel:+551141773834"
                        className="md3-ripple-container flex items-center justify-center p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200/60 text-slate-700 text-xs font-medium"
                      />
                    </div>
                  </div>
                </div>

                <EditableLink
                  page="global"
                  section="contact"
                  fieldKey="email"
                  defaultLabel="contato@evi.adv.br"
                  defaultHref="mailto:contato@evi.adv.br"
                  className="md3-ripple-container flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-evi-deep text-xs font-medium truncate"
                >
                  <Mail className="w-3.5 h-3.5 text-evi-accent flex-shrink-0" />
                </EditableLink>
              </div>
            </div>

            {/* Rodapé da Gaveta do App com Redes Sociais */}
            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/70 pb-[max(12px,env(safe-area-inset-bottom))] flex items-center justify-between">
              <span className="text-[0.72rem] text-slate-500 font-medium">
                © {new Date().getFullYear()} EVI Advogados
              </span>

              <div className="flex items-center gap-2">
                <EditableLink
                  page="global"
                  section="contact"
                  fieldKey="social_facebook"
                  defaultLabel=""
                  defaultHref="https://www.facebook.com/EVISociedadedeAdvogados/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-evi-deep text-xs"
                >
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </EditableLink>
                <EditableLink
                  page="global"
                  section="contact"
                  fieldKey="social_instagram"
                  defaultLabel=""
                  defaultHref="https://www.instagram.com/eviadvogados/?hl=pt-br"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-evi-deep text-xs"
                >
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </EditableLink>
                <EditableLink
                  page="global"
                  section="contact"
                  fieldKey="social_linkedin"
                  defaultLabel=""
                  defaultHref="https://www.linkedin.com/company/evi-sociedade-de-advogados/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-evi-deep text-xs"
                >
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </EditableLink>
                <EditableLink
                  page="global"
                  section="contact"
                  fieldKey="social_youtube"
                  defaultLabel=""
                  defaultHref="https://www.youtube.com/channel/UCo_k-NzKbkFVJ5zXz4xOwrQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-evi-deep text-xs"
                >
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33zM9.75 15.02l.01-6.54 5.74 3.27-5.75 3.27z" />
                  </svg>
                </EditableLink>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

