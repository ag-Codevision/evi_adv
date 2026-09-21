import React from 'react';
import { createClient } from '../../lib/supabase/server';
import Link from 'next/link';
import { FileText, Newspaper, Users, Inbox, Sparkles, Globe, LogOut, ArrowUpRight } from 'lucide-react';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  // Busca contagens em paralelo no Supabase
  const [
    { count: postsCount },
    { count: pressCount },
    { count: leadsCount },
    { count: queueCount },
  ] = await Promise.all([
    supabase.from('posts').select('*', { count: 'exact', head: true }),
    supabase.from('press_items').select('*', { count: 'exact', head: true }),
    supabase.from('leads').select('*', { count: 'exact', head: true }),
    supabase.from('editorial_queue').select('*', { count: 'exact', head: true }),
  ]);

  return (
    <div className="min-h-screen bg-[#0a111d] text-slate-100 font-sans p-6 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header do Painel */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                Painel Administrativo EVI
              </span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-[#e2e8f0]">
              Gestão Geral de Conteúdo
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Sessão ativa: <strong className="text-slate-300">{user.email}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold uppercase tracking-wider shadow-lg shadow-sky-950/60 transition-all active:scale-95"
            >
              <Globe className="w-4 h-4" />
              <span>Abrir Site (Modo Edição)</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Grade de Estatísticas e Acessos Rápidos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Blog */}
          <div className="bg-[#111e33]/80 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">Artigos no Blog</span>
              <FileText className="w-5 h-5 text-sky-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">{postsCount ?? 0}</div>
            <Link
              href="/blog"
              className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 mt-3"
            >
              <span>Gerenciar na página do Blog</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Card 2: Imprensa */}
          <div className="bg-[#111e33]/80 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">Clipping & TV</span>
              <Newspaper className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">{pressCount ?? 0}</div>
            <Link
              href="/imprensa"
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mt-3"
            >
              <span>Gerenciar matérias</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Card 3: Leads Recebidos */}
          <div className="bg-[#111e33]/80 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">Leads de Clientes</span>
              <Inbox className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">{leadsCount ?? 0}</div>
            <span className="text-xs text-slate-400 block mt-3">
              Recebidos via formulário
            </span>
          </div>

          {/* Card 4: Pautas da IA */}
          <div className="bg-[#111e33]/80 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">Fila Editorial IA</span>
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">{queueCount ?? 0}</div>
            <span className="text-xs text-slate-400 block mt-3">
              Pautas agendadas
            </span>
          </div>
        </div>

        {/* Guia Rápido do Live Editor */}
        <div className="bg-[#101b2e] border border-slate-800/90 rounded-2xl p-6 lg:p-8 space-y-4">
          <h2 className="font-serif text-xl font-semibold text-[#e2e8f0] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-400" />
            Como utilizar a Edição em Tempo Real (Live CMS)
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Com sua conta de administrador conectada, você não precisa ficar navegando em painéis externos para alterar o site.
            Basta acessar qualquer página pública com o <strong>Modo Edição ATIVO</strong> na barra superior:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="bg-[#0b1322] border border-slate-800 p-4 rounded-xl">
              <strong className="text-sky-400 text-sm block mb-1">1. Textos e Chamadas</strong>
              <p className="text-xs text-slate-400">
                Passe o mouse sobre qualquer título, parágrafo ou número e clique para digitar diretamente no local. Ao clicar fora, é salvo automaticamente no Supabase.
              </p>
            </div>

            <div className="bg-[#0b1322] border border-slate-800 p-4 rounded-xl">
              <strong className="text-sky-400 text-sm block mb-1">2. Troca de Fotos</strong>
              <p className="text-xs text-slate-400">
                Passe o cursor sobre banners ou retratos e clique no botão <em>"Trocar Imagem"</em> para enviar uma nova foto do seu computador com preview instantâneo.
              </p>
            </div>

            <div className="bg-[#0b1322] border border-slate-800 p-4 rounded-xl">
              <strong className="text-sky-400 text-sm block mb-1">3. Vídeos no Ar</strong>
              <p className="text-xs text-slate-400">
                Nos blocos de vídeo, clique em <em>"Alterar Vídeo"</em> para atualizar o link do YouTube. O reprodutor é recarregado com o novo vídeo na mesma hora.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
