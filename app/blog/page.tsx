'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import { getAllBlogArticles, getBlogCategories, BlogArticle } from '@/lib/blog-data';
import BlogAdminActions from '@/components/admin/BlogAdminActions';
import EditableText from '@/components/admin/EditableText';
import BlogPostEditModal from '@/components/admin/BlogPostEditModal';
import ConfirmModal from '@/components/admin/ConfirmModal';
import { useAdminEditor } from '@/components/admin/AdminAuthProvider';
import { useSiteContent } from '@/components/admin/SiteContentProvider';
import { createClient } from '@/lib/supabase/client';
import { deletePostAction } from '@/lib/posts-actions';
import { saveSiteContent } from '@/lib/site-content';
import { Edit2, Trash2, Clock, Calendar, ArrowUpDown, RotateCcw, Filter } from 'lucide-react';
import { formatCardDate, getTimestamp } from '@/lib/date-utils';

const ITEMS_PER_PAGE = 9;

export default function BlogPage() {
  const { isAdmin, isEditing, setStatusMessage } = useAdminEditor();
  const { getContent } = useSiteContent();

  const [dbArticles, setDbArticles] = useState<BlogArticle[]>([]);
  const [deletedSlugs, setDeletedSlugs] = useState<string[]>([]);
  const [coverOverrides, setCoverOverrides] = useState<Record<string, string>>({});
  const [activeCategory, setActiveCategory] = useState<string>('Todas');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Estados de Filtro de Data e Ordenação
  const [dateRange, setDateRange] = useState<'all' | '7days' | '30days' | '90days' | 'year' | 'custom'>('all');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Estados para CRUD
  const [editingArticle, setEditingArticle] = useState<BlogArticle | null>(null);
  const [itemToDelete, setItemToDelete] = useState<BlogArticle | null>(null);
  const [isDeletingDirect, setIsDeletingDirect] = useState(false);

  // Busca posts do Supabase (tabela posts e custom_articles / deleted_articles)
  const loadSupabasePosts = async () => {
    try {
      const supabase = createClient();

      // 1. Busca os posts da tabela 'posts'
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*, category:categories(*), author:authors(*)')
        .order('published_at', { ascending: false });

      const loadedArticles: BlogArticle[] = [];

      if (!postsError && postsData) {
        postsData.forEach((row: any) => {
          if (row.slug) {
            const pubDateIso = row.published_at || row.created_at || new Date().toISOString();
            const formattedDate = formatCardDate(pubDateIso);

            loadedArticles.push({
              id: row.id,
              slug: row.slug,
              title: row.title || 'Artigo Jurídico',
              category: row.category?.name || 'Direito Empresarial',
              categorySlug: row.category?.slug || 'direito-empresarial',
              date: formattedDate,
              publishedAt: pubDateIso,
              readingTime: row.reading_time || 5,
              featuredImage: row.cover_image || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
              excerpt: row.excerpt || row.title,
              content: row.content || '',
              paragraphs: [row.excerpt || row.title],
              isFeatured: Boolean(row.is_featured),
              author: {
                name: row.author?.name || 'Dr. Eduardo Veríssimo Inocente',
                role: row.author?.role || 'Sócio-Fundador & Diretor Jurídico',
                oab: row.author?.oab || 'OAB/SP 200.334',
                avatar: row.author?.avatar_url || '/img/01.png',
                bio: row.author?.bio || 'Mais de 25 anos de vanguarda no Direito Empresarial.',
              },
              keywords: [],
            });
          }
        });
      }

      // 2. Busca custom_articles em site_contents
      const { data: contentData } = await supabase
        .from('site_contents')
        .select('field_key, content_value')
        .eq('page', 'blog')
        .eq('section', 'custom_articles');

      if (contentData) {
        contentData.forEach((row) => {
          try {
            if (row.content_value) {
              const item = JSON.parse(row.content_value);
              if (item && item.slug) {
                // Atualiza ou insere se já não estiver
                const existingIdx = loadedArticles.findIndex((a) => a.slug === item.slug);
                if (existingIdx >= 0) {
                  loadedArticles[existingIdx] = { ...loadedArticles[existingIdx], ...item };
                } else {
                  loadedArticles.push(item);
                }
              }
            }
          } catch (e) {
            console.error('Erro ao analisar JSON de artigo customizado:', e);
          }
        });
      }

      // 3. Busca lista de slugs excluídos
      const { data: deletedData } = await supabase
        .from('site_contents')
        .select('field_key')
        .eq('page', 'blog')
        .eq('section', 'deleted_articles');

      if (deletedData) {
        setDeletedSlugs(deletedData.map((d) => d.field_key));
      }

      // 4. Busca overrides de capas alteradas na página interna do blog
      const { data: coverData } = await supabase
        .from('site_contents')
        .select('section, content_value')
        .eq('page', 'blog_detail')
        .eq('field_key', 'cover_image');

      if (coverData) {
        const coverMap: Record<string, string> = {};
        coverData.forEach((row) => {
          if (row.section && row.content_value) {
            coverMap[row.section] = row.content_value;
          }
        });
        setCoverOverrides(coverMap);
      }

      setDbArticles(loadedArticles);
    } catch (err) {
      console.error('Erro ao buscar posts do Supabase:', err);
    }
  };

  useEffect(() => {
    loadSupabasePosts();
  }, []);

  // Lista unificada com posts do banco de dados + artigos locais base (com suporte a exclusão e overrides de capa)
  const allArticles: BlogArticle[] = getAllBlogArticles(dbArticles, deletedSlugs, coverOverrides);
  const categories = getBlogCategories();

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (typeof window !== 'undefined') {
      const gridEl = document.getElementById('grid-blog');
      if (gridEl) {
        gridEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Handler ao salvar artigo no modal
  const handleArticleSaved = (updatedArticle: BlogArticle) => {
    setDbArticles((prev) => {
      const filtered = prev.filter((a) => a.slug !== updatedArticle.slug);
      return [updatedArticle, ...filtered];
    });
  };

  // Handler ao confirmar exclusão
  const confirmDeleteAction = async () => {
    if (!itemToDelete) return;

    setIsDeletingDirect(true);
    setStatusMessage('Excluindo artigo do blog...');

    // 1. Se tiver ID de banco, remove da tabela 'posts'
    if (itemToDelete.id) {
      await deletePostAction(itemToDelete.id);
    }

    // 2. Salva em site_contents como deletado para esconder mesmo os estáticos
    await saveSiteContent({
      page: 'blog',
      section: 'deleted_articles',
      fieldKey: itemToDelete.slug,
      value: JSON.stringify({ slug: itemToDelete.slug, deletedAt: new Date().toISOString() }),
      contentType: 'text',
    });

    // 3. Remove do estado local
    setDeletedSlugs((prev) => [...prev, itemToDelete.slug]);
    setDbArticles((prev) => prev.filter((a) => a.slug !== itemToDelete.slug));

    setIsDeletingDirect(false);
    setItemToDelete(null);
    setStatusMessage('Artigo excluído com sucesso!');
    setTimeout(() => setStatusMessage(null), 2500);
  };

  // Filtragem combinada por categoria, período de data e ordenação
  const filteredArticles = allArticles
    .filter((item) => {
      // 1. Filtro por Categoria
      const matchCat =
        activeCategory === 'Todas' ||
        item.category === activeCategory ||
        item.categorySlug === activeCategory;
      if (!matchCat) return false;

      // 2. Filtro por Data
      const itemTs = getTimestamp(item.publishedAt || item.date);
      const now = Date.now();

      if (dateRange === '7days') {
        return itemTs >= now - 7 * 86400000;
      }
      if (dateRange === '30days') {
        return itemTs >= now - 30 * 86400000;
      }
      if (dateRange === '90days') {
        return itemTs >= now - 90 * 86400000;
      }
      if (dateRange === 'year') {
        const startOfYear = new Date(new Date().getFullYear(), 0, 1).getTime();
        return itemTs >= startOfYear;
      }
      if (dateRange === 'custom') {
        if (customStartDate) {
          const startTs = new Date(`${customStartDate}T00:00:00`).getTime();
          if (itemTs < startTs) return false;
        }
        if (customEndDate) {
          const endTs = new Date(`${customEndDate}T23:59:59`).getTime();
          if (itemTs > endTs) return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      const tsA = getTimestamp(a.publishedAt || a.date);
      const tsB = getTimestamp(b.publishedAt || b.date);
      return sortOrder === 'desc' ? tsB - tsA : tsA - tsB;
    });

  const hasActiveFilters =
    activeCategory !== 'Todas' ||
    dateRange !== 'all' ||
    Boolean(customStartDate) ||
    Boolean(customEndDate);

  const handleResetFilters = () => {
    setActiveCategory('Todas');
    setDateRange('all');
    setCustomStartDate('');
    setCustomEndDate('');
    setSortOrder('desc');
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <>
      <Header />

      <main className="bg-[#f8fafb] min-h-screen py-16">
        <div className="container max-w-6xl">
          {/* Cabeçalho do Blog */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <EditableText
              page="blog"
              section="header"
              fieldKey="eyebrow"
              defaultContent="Inteligência & Análises Jurídicas"
              as="span"
              className="eyebrow justify-center mb-3"
            />
            <EditableText
              page="blog"
              section="header"
              fieldKey="title"
              defaultContent="Blog & Artigos Estratégicos"
              as="h1"
              className="text-4xl md:text-5xl lg:text-6xl font-serif text-evi-deep font-bold tracking-tight mb-6 leading-tight"
            />
            <EditableText
              page="blog"
              section="header"
              fieldKey="desc"
              defaultContent="Estudos aprofundados, teses estratégicas e atualizações jurisprudenciais em Recuperação Judicial, Agronegócio, Direito Empresarial e Tributário conduzidos pelo Dr. Eduardo Veríssimo Inocente e equipe."
              as="p"
              className="text-evi-text-light text-lg md:text-xl leading-relaxed"
              multiline
            />
          </div>

          {/* Botões de Ação do Administrador (Novo Artigo e Robô IA) */}
          <BlogAdminActions />

          {/* Barra de Filtros Compacta e Fina (Linha Única) */}
          <div className="bg-white border border-evi-border rounded-2xl p-3 md:px-5 md:py-3.5 mb-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              
              {/* Controles de Filtro à Esquerda */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Seletor de Categoria */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-evi-deep text-[11px]">
                    <Filter className="w-3.5 h-3.5 text-evi-accent" />
                    <span>Categoria:</span>
                  </div>
                  <select
                    value={activeCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="px-3 py-1.5 bg-[#f4f7f9] border border-slate-200 rounded-xl text-xs font-semibold text-evi-deep focus:outline-none focus:border-evi-accent cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Seletor de Data */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-evi-deep text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-evi-accent" />
                    <span>Data:</span>
                  </div>
                  <select
                    value={dateRange}
                    onChange={(e) => {
                      setDateRange(e.target.value as any);
                      setCurrentPage(1);
                    }}
                    className="px-3 py-1.5 bg-[#f4f7f9] border border-slate-200 rounded-xl text-xs font-semibold text-evi-deep focus:outline-none focus:border-evi-accent cursor-pointer"
                  >
                    <option value="all">Todas as Datas</option>
                    <option value="7days">Últimos 7 dias</option>
                    <option value="30days">Últimos 30 dias</option>
                    <option value="90days">Últimos 90 dias</option>
                    <option value="year">Este ano ({new Date().getFullYear()})</option>
                    <option value="custom">Período personalizado...</option>
                  </select>
                </div>

                {/* Seletor Customizado de Data Inicial e Final */}
                {dateRange === 'custom' && (
                  <div className="flex items-center gap-1.5 text-xs bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200 animate-fade-in">
                    <span className="text-slate-400">De:</span>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => {
                        setCustomStartDate(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="px-2 py-0.5 bg-white border border-slate-200 rounded-lg text-xs text-evi-deep"
                    />
                    <span className="text-slate-400">Até:</span>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => {
                        setCustomEndDate(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="px-2 py-0.5 bg-white border border-slate-200 rounded-lg text-xs text-evi-deep"
                    />
                  </div>
                )}
              </div>

              {/* Ordenação e Limpeza à Direita */}
              <div className="flex items-center gap-3 ml-auto">
                <div className="flex items-center gap-1.5">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as any)}
                    className="px-3 py-1.5 bg-[#f4f7f9] border border-slate-200 rounded-xl text-xs font-semibold text-evi-deep focus:outline-none focus:border-evi-accent cursor-pointer"
                  >
                    <option value="desc">Mais recentes primeiro</option>
                    <option value="asc">Mais antigos primeiro</option>
                  </select>
                </div>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                    title="Limpar todos os filtros aplicados"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Limpar</span>
                  </button>
                )}
              </div>

            </div>
          </div>

          {/* Contador de Resultados */}
          <div id="grid-blog" className="flex items-center justify-between text-xs text-evi-text-muted mb-6 px-1 pt-2">
            <span>
              Mostrando <strong className="text-evi-deep">{filteredArticles.length === 0 ? 0 : startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filteredArticles.length)}</strong> de <strong className="text-evi-deep">{filteredArticles.length}</strong> artigos
            </span>
            {totalPages > 1 && (
              <span>
                Página <strong className="text-evi-deep">{currentPage}</strong> de <strong className="text-evi-deep">{totalPages}</strong>
              </span>
            )}
          </div>

          {/* Grid de Artigos com CRUD Completo nos Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {paginatedArticles.map((article) => (
              <article
                key={article.slug}
                className="bg-white rounded-3xl border border-evi-border overflow-hidden shadow-evi-card hover:shadow-evi-hover transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5 relative"
              >
                {/* Ações de Edição CRUD quando Admin estiver no modo de edição */}
                {isAdmin && isEditing && (
                  <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700 shadow-xl">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setEditingArticle(article);
                      }}
                      className="p-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1 shadow-md"
                      title="Editar Artigo (Título, Resumo, Capa, Conteúdo)"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-semibold pr-0.5">Editar</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setItemToDelete(article);
                      }}
                      className="p-1.5 bg-red-600/90 hover:bg-red-600 text-white rounded-lg text-xs transition-colors shadow-md"
                      title="Excluir Artigo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div>
                  {/* Capa do Artigo */}
                  <Link href={`/blog/${article.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-slate-900 border-b border-evi-border">
                    <img
                      src={getContent('blog_detail', article.slug, 'cover_image', coverOverrides[article.slug] || article.featuredImage)}
                      alt={article.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 bg-evi-deep/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {article.category}
                    </div>
                  </Link>

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2 text-xs text-evi-text-muted">
                      <span className="font-semibold text-evi-accent uppercase tracking-wider text-[11px]">
                        {article.readingTime} min de leitura
                      </span>
                    </div>

                    <h2 className="text-xl font-serif font-bold text-evi-deep mb-3 leading-snug group-hover:text-evi-accent transition-colors line-clamp-2">
                      <Link href={`/blog/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h2>

                    <p className="text-evi-text-light text-xs leading-relaxed line-clamp-3 mb-2">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-0">
                  <div className="pt-3 border-t border-evi-border/60 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-medium text-evi-text-muted truncate max-w-[170px]">
                        Por {article.author?.name || 'Dr. Eduardo Veríssimo'}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-2.5 h-2.5 text-slate-400" />
                        <span>{formatCardDate(article.publishedAt || article.date)}</span>
                      </span>
                    </div>
                    <Link
                      href={`/blog/${article.slug}`}
                      className="text-xs font-bold text-evi-deep hover:text-evi-accent uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Ler Análise →</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Controles de Paginação (quando houver mais de 1 página) */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mb-16">
              {/* Botão Anterior */}
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1 ${
                  currentPage === 1
                    ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                    : 'bg-white text-evi-deep border-evi-border hover:border-evi-accent hover:bg-slate-50'
                }`}
                aria-label="Página anterior"
              >
                <span>←</span>
                <span className="hidden sm:inline">Anterior</span>
              </button>

              {/* Botões das Páginas */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-xl text-xs font-bold transition-all border flex items-center justify-center ${
                      currentPage === pageNum
                        ? 'bg-evi-deep text-white border-evi-deep shadow-sm'
                        : 'bg-white text-evi-deep border-evi-border hover:border-evi-accent hover:bg-slate-50'
                    }`}
                    aria-label={`Ir para página ${pageNum}`}
                    aria-current={currentPage === pageNum ? 'page' : undefined}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              {/* Botão Próxima */}
              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1 ${
                  currentPage === totalPages
                    ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                    : 'bg-white text-evi-deep border-evi-border hover:border-evi-accent hover:bg-slate-50'
                }`}
                aria-label="Próxima página"
              >
                <span className="hidden sm:inline">Próxima</span>
                <span>→</span>
              </button>
            </div>
          )}

          {/* Banner de Consulta Direta */}
          <div className="bg-gradient-to-br from-evi-deep to-[#22394f] text-white rounded-3xl p-8 md:p-14 text-center max-w-4xl mx-auto shadow-evi-card">
            <span className="text-xs uppercase tracking-widest text-evi-silver font-semibold block mb-2">
              Assessoria Jurídica Estratégica
            </span>
            <h3 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Precisa de uma avaliação jurídica para a sua empresa?
            </h3>
            <p className="text-slate-300 max-w-2xl mx-auto mb-8 text-base leading-relaxed">
              O Dr. Eduardo Veríssimo Inocente e os advogados da EVI estão preparados para conduzir diagnósticos preliminares de risco, due diligence e soluções jurídicas em momentos decisivos.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://wa.me/5511991390045?text=Ol%C3%A1%2C%20li%20os%20artigos%20no%20blog%20e%20gostaria%20de%20agendar%20uma%20conversa."
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-wa text-base"
              >
                Falar com Dr. Eduardo via WhatsApp
              </a>
              <Link href="/contato" className="btn btn-outline border-white text-white hover:bg-white hover:text-evi-deep">
                Solicitar Contato
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de Edição de Post do Blog (CRUD) */}
      <BlogPostEditModal
        article={editingArticle}
        isOpen={Boolean(editingArticle)}
        onClose={() => setEditingArticle(null)}
        onSave={handleArticleSaved}
        onDelete={(art) => {
          setItemToDelete(art);
          setEditingArticle(null);
        }}
      />

      {/* Modal de Confirmação de Exclusão (Estética do Site) */}
      <ConfirmModal
        isOpen={Boolean(itemToDelete)}
        title="Excluir Artigo do Blog"
        message={`Tem certeza que deseja excluir o artigo "${itemToDelete?.title}"? Esta ação removerá o artigo da listagem pública.`}
        confirmLabel="Sim, Excluir Artigo"
        cancelLabel="Cancelar"
        variant="danger"
        isLoading={isDeletingDirect}
        onConfirm={confirmDeleteAction}
        onCancel={() => setItemToDelete(null)}
      />
    </>
  );
}
