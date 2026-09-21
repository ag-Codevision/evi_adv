'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { createClient } from '../../../lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Loader2, Clock } from 'lucide-react';
import Link from 'next/link';

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60 * 1000; // 60 segundos de bloqueio temporário

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lockoutRemaining, setLockoutRemaining] = useState<number>(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // Verifica bloqueio prévio e parâmetros de URL na montagem
  useEffect(() => {
    if (searchParams.get('error') === 'unauthorized') {
      setErrorMsg('Acesso restrito: sua conta não possui privilégios de administrador.');
    }

    const checkLockout = () => {
      const storedLockout = localStorage.getItem('evi_admin_lockout_until');
      if (storedLockout) {
        const lockoutTime = parseInt(storedLockout, 10);
        const now = Date.now();
        if (now < lockoutTime) {
          setLockoutRemaining(Math.ceil((lockoutTime - now) / 1000));
        } else {
          localStorage.removeItem('evi_admin_lockout_until');
          localStorage.removeItem('evi_admin_failed_attempts');
          setLockoutRemaining(0);
        }
      }
    };

    checkLockout();
    const interval = setInterval(checkLockout, 1000);
    return () => clearInterval(interval);
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutRemaining > 0) return;

    setLoading(true);
    setErrorMsg(null);

    const cleanEmail = email.trim().toLowerCase();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        // Registra tentativa falha e calcula lockout
        const currentAttempts = parseInt(localStorage.getItem('evi_admin_failed_attempts') || '0', 10) + 1;
        localStorage.setItem('evi_admin_failed_attempts', currentAttempts.toString());

        if (currentAttempts >= MAX_FAILED_ATTEMPTS) {
          const lockoutUntil = Date.now() + LOCKOUT_DURATION_MS;
          localStorage.setItem('evi_admin_lockout_until', lockoutUntil.toString());
          setLockoutRemaining(Math.ceil(LOCKOUT_DURATION_MS / 1000));
          setErrorMsg(`Muitas tentativas incorretas. Por segurança, o acesso foi temporariamente suspenso por 60 segundos.`);
        } else {
          const attemptsLeft = MAX_FAILED_ATTEMPTS - currentAttempts;
          setErrorMsg(`Credenciais inválidas. ${attemptsLeft} tentativa(s) restante(s) antes do bloqueio temporário.`);
        }

        setLoading(false);
        return;
      }

      // Sucesso na autenticação: limpa tentativas e redireciona
      localStorage.removeItem('evi_admin_failed_attempts');
      localStorage.removeItem('evi_admin_lockout_until');

      if (data.session) {
        router.push('/');
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg('Falha de conexão ou erro no servidor de autenticação.');
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
                disabled={lockoutRemaining > 0}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@eviadvogados.com.br"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#0c1524]/80 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                disabled={lockoutRemaining > 0}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#0c1524]/80 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || lockoutRemaining > 0}
            className={`w-full mt-2 py-3 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.99] ${
              lockoutRemaining > 0
                ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-500 hover:to-sky-600 text-white shadow-sky-950/60 disabled:opacity-50'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Autenticando...</span>
              </>
            ) : lockoutRemaining > 0 ? (
              <>
                <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="text-amber-300">Acesso suspenso ({lockoutRemaining}s)</span>
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

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0c1524] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
