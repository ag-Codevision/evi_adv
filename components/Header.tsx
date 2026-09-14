'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export interface NavLinkItem {
  label: string;
  href: string;
}

interface HeaderProps {
  leftLinks?: NavLinkItem[];
  rightLinks?: NavLinkItem[];
  allLinks?: NavLinkItem[];
}

export default function Header({ leftLinks, rightLinks, allLinks }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 35);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lógica para manter simetria de distribuição automática caso links customizados sejam passados
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
    // Links padrão equilibrados da Home
    finalLeft = [
      { label: 'Atuação', href: '/#atuacao' },
      { label: 'O Escritório', href: '/#escritorio' },
    ];
    finalRight = [
      { label: 'Dúvidas', href: '/#duvidas' },
      { label: 'Contato', href: '/#contato' },
    ];
  }

  const combinedLinks = [...finalLeft, ...finalRight];

  return (
    <header id="mainHeader" className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        {/* Mobile Header Bar */}
        <div className="md:hidden flex items-center justify-between w-full min-h-[66px]">
          <Link href="/" className="brand-center p-0">
            <img
              src="/assets/logo.png"
              alt="EVI Sociedade de Advogados"
              className="h-[42px] w-auto object-contain"
            />
          </Link>
          <button
            type="button"
            className="menu"
            aria-label="Abrir menu de navegação"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Desktop Harmonic Centered Split Navbar */}
        <nav className="nav-split" aria-label="Navegação Principal">
          {/* Lado Esquerdo Simétrico */}
          <div className="nav-side nav-left">
            {finalLeft.map((item, idx) => (
              <Link key={idx} href={item.href} className="nav-item">
                {item.label}
              </Link>
            ))}
          </div>

          {/* Logotipo EVI Centralizado */}
          <Link href="/" className="brand-center" aria-label="EVI Sociedade de Advogados - Página Inicial">
            <img
              src="/assets/logo.png"
              alt="EVI Sociedade de Advogados"
              className="transition-all duration-350"
            />
          </Link>

          {/* Lado Direito Simétrico */}
          <div className="nav-side nav-right">
            {finalRight.map((item, idx) => (
              <Link key={idx} href={item.href} className="nav-item">
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* Gaveta Mobile Responsiva */}
      {mobileMenuOpen && (
        <div className="nav-mobile-drawer md:hidden">
          {combinedLinks.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <a
            href="https://wa.me/5511991390045?text=Ol%C3%A1%2C%20encontrei%20o%20site%20e%20gostaria%20de%20receber%20uma%20orienta%C3%A7%C3%A3o%20jur%C3%ADdica."
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-wa mt-2 text-center"
            onClick={() => setMobileMenuOpen(false)}
          >
            Falar pelo WhatsApp
          </a>
        </div>
      )}
    </header>
  );
}
