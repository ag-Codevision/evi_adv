import React from 'react';
import { createClient } from '../../lib/supabase/server';
import Link from 'next/link';
import { FileText, Newspaper, Sparkles, Globe, ArrowUpRight, CheckCircle, Sliders } from 'lucide-react';
import { redirect } from 'next/navigation';
import { getAllBlogArticles } from '@/lib/blog-data';
import { getAllPressArticles } from '@/lib/press-data';
import { getBlogAiConfig } from '@/lib/blog-ai-actions';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  // 1. Busca dados do Blog, Imprensa, Configurações de IA e Conteúdos em paralelo
  const [
    { data: dbPosts },
    { data: blogCustom },
    { data: blogDeleted },
    { data: pressCustom },
    { count: siteContentsCount },
  ] = await Promise.all([
    supabase.from('posts').select('*'),
    supabase.from('site_contents').select('field_key, content_value').eq('page', 'blog').eq('section', 'custom_articles'),
    supabase.from('site_contents').select('field_key').eq('page', 'blog').eq('section', 'deleted_articles'),
    supabase.from('site_contents').select('field_key, content_value').eq('page', 'imprensa').eq('section', 'custom_articles'),
    supabase.from('site_contents').select('*', { count: 'exact', head: true }),
  ]);

  // Monta lista real de artigos de Blog
  const customBlogArticles: any[] = [];
  if (dbPosts) {
    dbPosts.forEach((row: any) => {
      customBlogArticles.push({
        slug: row.slug,
        title: row.title,
        category: row.category?.name || 'Geral',
        categorySlug: row.category?.slug || 'geral',
        date: row.published_at ? new Date(row.published_at).toLocaleDateString('pt-BR') : '',
        publishedAt: row.published_at || new Date().toISOString(),
        readingTime: 6,
        featuredImage: row.cover_image || '/img/01.png',
        excerpt: row.excerpt || row.title,
        paragraphs: [row.excerpt || row.title],
        author: { name: 'Dr. Eduardo Veríssimo Inocente', role: 'Sócio-Fundador', avatar: '/img/01.png' },
        keywords: [],
      });
    });
  }
  if (blogCustom) {
    blogCustom.forEach((row: any) => {
      try {
        if (row.content_value) {
          const item = JSON.parse(row.content_value);
          if (item && item.slug) customBlogArticles.push(item);
        }
      } catch {}
    });
  }
  const deletedSlugs = blogDeleted ? blogDeleted.map((d: any) => d.field_key) : [];
  const allBlogArticles = getAllBlogArticles(customBlogArticles, deletedSlugs);
  const totalBlogCount = allBlogArticles.length;

  // Monta lista real de matérias de Imprensa
  const customPressArticles: any[] = [];
  if (pressCustom) {
    pressCustom.forEach((row: any) => {
      try {
        if (row.content_value) {
          const item = JSON.parse(row.content_value);
          if (item && item.slug) customPressArticles.push(item);
        }
      } catch {}
    });
  }
  const allPress = getAllPressArticles(customPressArticles);
  const totalPressCount = allPress.length;

  // Obtém configurações do Motor de IA
  const aiConfig = await getBlogAiConfig();
  const isAiActive = aiConfig.enabled;
  const aiThemesCount = (aiConfig.customThemes || []).length;

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

        {/* Grade de Estatísticas e Acessos Rápidos com Dados Reais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Artigos do Blog */}
          <div className="bg-[#111e33]/80 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">Artigos no Blog</span>
              <FileText className="w-5 h-5 text-sky-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">{totalBlogCount}</div>
            <span className="text-[11px] text-slate-400 block mb-3">
              Publicados e ativos no site
            </span>
            <Link
              href="/blog"
              className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium"
            >
              <span>Gerenciar na página do Blog</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Card 2: Clipping & TV (Imprensa) */}
          <div className="bg-[#111e33]/80 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">Clipping & TV</span>
              <Newspaper className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">{totalPressCount}</div>
            <span className="text-[11px] text-slate-400 block mb-3">
              Matérias de TV, jornais e revistas
            </span>
            <Link
              href="/imprensa"
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
            >
              <span>Gerenciar matérias</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Card 3: Motor Editorial de IA */}
          <div className="bg-[#111e33]/80 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">Motor Editorial IA</span>
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl font-bold text-white">
                {isAiActive ? 'Ativo' : 'Pausado'}
              </span>
              <span className="text-xs text-amber-400 font-semibold">
                ({aiThemesCount} temas)
              </span>
            </div>
            <span className="text-[11px] text-slate-400 block mb-3">
              {isAiActive ? 'Geração automática semanal ativa' : 'Automação pausada no momento'}
            </span>
            <Link
              href="/blog"
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
            >
              <span>Configurar Motor no Blog</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Card 4: Live CMS Customizações */}
          <div className="bg-[#111e33]/80 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">Edições no Live CMS</span>
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">{siteContentsCount ?? 0}</div>
            <span className="text-[11px] text-slate-400 block mb-3">
              Textos e fotos customizadas salvas
            </span>
            <Link
              href="/"
              className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium"
            >
              <span>Editar Home e Páginas</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Guia Rápido do Live Editor */}
        <div className="bg-[#101b2e] border border-slate-800/90 rounded-2xl p-6 lg:p-8 space-y-4">
          <h2 className="font-serif text-xl font-semibold text-[#e2e8f0] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-400" />
            Como utilizar a Edição em Tempo Real (Live CMS)
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Com sua conta de administrador conectada, você não precisa ficar navegando em painéis complexos para alterar o site.
            Basta acessar qualquer página pública com o <strong>Modo Edição ATIVO</strong> na barra superior:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="bg-[#0b1322] border border-slate-800 p-4 rounded-xl">
              <strong className="text-sky-400 text-sm block mb-1">1. Textos e Chamadas</strong>
              <p className="text-xs text-slate-400">
                Passe o mouse sobre qualquer título, parágrafo ou número e clique para digitar diretamente no local. Ao clicar fora, é salvo automaticamente no banco de dados.
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
