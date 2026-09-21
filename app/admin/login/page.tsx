'use client';

import React, { useState } from 'react';
import { createClient } from '../../../lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMsg('Credenciais inválidas ou e-mail não autorizado.');
        setLoading(false);
        return;
      }

      if (data.session) {
        // Redireciona para o site com o modo de edição ativo
        router.push('/');
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro inesperado ao realizar login.');
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col justify-center items-center px-4 font-sans text-slate-100 relative overflow-hidden"
      style={{
        backgroundImage: 'url(/img/fundo-hero2.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center 28%',
      }}
    >
      {/* Overlay escuro para garantir legibilidade */}
      <div className="absolute inset-0 bg-[#0c1524]/80 backdrop-blur-sm pointer-events-none" />

      {/* Cartão de Autenticação */}
      <div className="max-w-md w-full bg-[#111e33]/90 border border-slate-700/80 rounded-2xl shadow-2xl p-8 backdrop-blur-xl relative z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img src="/assets/logo.png" alt="EVI Sociedade de Advogados" className="h-16 object-contain" />
          </div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-[#e2e8f0]">
            Acesso Restrito
          </h1>
          <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">
            Painel Administrativo & Live CMS
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3.5 bg-rose-950/70 border border-rose-800/80 rounded-lg flex items-center gap-3 text-rose-200 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              E-mail Corporativo
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@eviadvogados.com.br"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#0c1524]/80 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Senha de Acesso
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#0c1524]/80 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-500 hover:to-sky-600 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-950/60 disabled:opacity-50 transition-all active:scale-[0.99]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Autenticando...</span>
              </>
            ) : (
              <>
                <span>Acessar Painel / Modo Edição</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            ← Voltar para o Portal Institucional
          </Link>
        </div>
      </div>

      <div className="mt-6 text-[11px] text-slate-500 tracking-wider text-center">
        Ambiente protegido com criptografia de ponta a ponta (Supabase Auth SSL).
      </div>
    </div>
  );
}
