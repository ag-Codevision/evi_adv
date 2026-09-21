'use client';

import React from 'react';
import { useAdminEditor } from './AdminAuthProvider';
import Link from 'next/link';
import { Edit3, Eye, LogOut, LayoutDashboard, CheckCircle, RefreshCw } from 'lucide-react';

export default function AdminTopBar() {
  const { user, isEditing, toggleEditMode, logout, statusMessage } = useAdminEditor();

  return (
    <aside aria-label="Barra de administração EVI CMS" className="fixed top-0 left-0 right-0 h-12 bg-[#0c1524] text-slate-200 z-[99999] px-4 flex items-center justify-between border-b border-slate-700/80 shadow-2xl font-sans text-xs select-none">
      {/* Lado Esquerdo: Identificação & Status */}
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#18283a] border border-[#728699]/40 text-[#e2e8f0] font-semibold tracking-wider uppercase text-[10px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          EVI Live CMS
        </span>

        <span className="hidden sm:inline text-slate-400">
          Admin: <strong className="text-slate-200 font-medium">{user?.email}</strong>
        </span>

        {statusMessage ? (
          <span className="flex items-center gap-1 text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/50">
            <RefreshCw className="w-3 h-3 animate-spin" />
            {statusMessage}
          </span>
        ) : (
          <span className="hidden md:flex items-center gap-1 text-emerald-400/90">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            Salvo no Supabase
          </span>
        )}
      </div>

      {/* Centro: Alternador de Modo de Edição */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleEditMode}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-medium transition-all duration-200 ${
            isEditing
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/40 ring-2 ring-emerald-400/50'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
          title={isEditing ? 'Clique para ver o site como visitante comum' : 'Clique para habilitar edição direta de textos, imagens e vídeos'}
        >
          {isEditing ? (
            <>
              <Edit3 className="w-3.5 h-3.5 text-white" />
              <span>Modo Edição: <strong className="uppercase">ATIVO</strong></span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span>Modo Visualização (Padrão)</span>
            </>
          )}
        </button>
      </div>

      {/* Lado Direito: Atalhos e Logout */}
      <div className="flex items-center gap-2">
        <Link
          href="/admin"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/50"
          title="Abrir painel administrativo e visão geral de leads e pautas"
        >
          <LayoutDashboard className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden lg:inline">Painel / Leads</span>
        </Link>

        <button
          onClick={() => logout()}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-rose-100 transition-colors border border-rose-800/40"
          title="Encerrar sessão de administrador"
        >
          <LogOut className="w-3.5 h-3.5 text-rose-400" />
          <span className="hidden sm:inline">Sair</span>
        </button>
      </div>
    </aside>
  );
}
