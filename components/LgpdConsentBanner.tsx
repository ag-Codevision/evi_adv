'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Cookie, ChevronRight, X, Check } from 'lucide-react';

export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

const STORAGE_KEY = 'evi_lgpd_consent_v1';

export default function LgpdConsentBanner() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // Sempre obrigatório
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        // Exibe com um delay suave de 800ms para uma experiência refinada
        const timer = setTimeout(() => setIsOpen(true), 800);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignora erro de localStorage desabilitado no navegador
    }

    // Ouvinte para reabrir configurações a partir do rodapé
    const handleReopen = () => {
      setIsOpen(true);
      setShowDetails(true);
    };

    window.addEventListener('open-lgpd-modal', handleReopen);
    return () => window.removeEventListener('open-lgpd-modal', handleReopen);
  }, []);

  const savePreferences = (prefs: { essential: boolean; analytics: boolean; marketing: boolean }) => {
    try {
      const payload: CookiePreferences = {
        ...prefs,
        essential: true,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // fallback
    }
    setIsOpen(false);
    setShowDetails(false);
  };

  const handleAcceptAll = () => {
    savePreferences({ essential: true, analytics: true, marketing: true });
  };

  const handleAcceptEssentialOnly = () => {
    savePreferences({ essential: true, analytics: false, marketing: false });
  };

  const handleSaveCustom = () => {
    savePreferences(preferences);
  };

  if (!mounted || !isOpen) return null;

  return (
    <aside
      role="dialog"
      aria-live="polite"
      aria-label="Aviso de Privacidade e Cookies LGPD"
      className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-xl z-50 animate-in fade-in slide-in-from-bottom-5 duration-500"
    >
      <div className="bg-slate-900/95 backdrop-blur-md border border-amber-600/30 text-white rounded-2xl p-5 md:p-6 shadow-2xl ring-1 ring-white/10">
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-base md:text-lg text-white flex items-center gap-2">
                Privacidade & Proteção de Dados
              </h3>
              <button
                onClick={handleAcceptEssentialOnly}
                className="text-slate-400 hover:text-white p-1 transition-colors"
                title="Fechar e aceitar apenas essenciais"
                aria-label="Fechar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Em conformidade com a <strong>LGPD (Lei nº 13.709/2018)</strong>, a EVI Advogados utiliza cookies e tecnologias correlatas para assegurar a navegabilidade técnica, segurança institucional e métricas de aprimoramento de nossos conteúdos jurídicos.
            </p>

            {/* Painel detalhado de categorias de cookies */}
            {showDetails && (
              <div className="pt-3 pb-1 border-t border-slate-700/60 space-y-3 mt-3 text-xs">
                {/* Essenciais */}
                <div className="flex items-start justify-between gap-3 p-2.5 rounded-lg bg-slate-800/60 border border-slate-700">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-white flex items-center gap-1.5">
                      <Cookie className="w-3.5 h-3.5 text-amber-400" />
                      Cookies Estritamente Necessários
                    </span>
                    <p className="text-slate-400">
                      Indispensáveis para a funcionalidade do site, segurança de formulários e gerenciamento da sessão.
                    </p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 shrink-0">
                    Obrigatório
                  </span>
                </div>

                {/* Analíticos */}
                <div className="flex items-start justify-between gap-3 p-2.5 rounded-lg bg-slate-800/60 border border-slate-700">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-white">Métricas de Desempenho e Audiência</span>
                    <p className="text-slate-400">
                      Coletam estatísticas anonimizadas de visitação para mensurar e elevar o desempenho do portal.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                  </label>
                </div>
              </div>
            )}

            {/* Ações */}
            <div className="pt-3 flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-3">
                <Link
                  href="/politica-de-privacidade"
                  className="text-xs text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors font-medium"
                >
                  Ler Política de Privacidade
                </Link>
                <button
                  type="button"
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-xs text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-0.5"
                >
                  <span>{showDetails ? 'Ocultar detalhes' : 'Personalizar preferências'}</span>
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showDetails ? 'rotate-90' : ''}`} />
                </button>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                {showDetails ? (
                  <button
                    type="button"
                    onClick={handleSaveCustom}
                    className="text-xs font-semibold px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 transition-colors"
                  >
                    Salvar Selecionados
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleAcceptEssentialOnly}
                    className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors"
                  >
                    Apenas Essenciais
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="text-xs font-bold px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/20 transition-all flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Aceitar Todos</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
