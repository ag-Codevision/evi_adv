'use client';

import React from 'react';
import { Cookie } from 'lucide-react';

export default function OpenCookieSettingsButton({ className = '' }: { className?: string }) {
  const handleOpen = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-lgpd-modal'));
    }
  };

  return (
    <button
      type="button"
      onClick={handleOpen}
      className={`inline-flex items-center gap-1.5 text-xs text-evi-accent hover:text-amber-500 font-semibold transition-colors ${className}`}
    >
      <Cookie className="w-3.5 h-3.5" />
      <span>Gerenciar Preferências de Cookies</span>
    </button>
  );
}
