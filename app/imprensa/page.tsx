'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import { getAllPressArticles, PressArticle } from '@/lib/press-data';
import EditableText from '@/components/admin/EditableText';
import PressAdminActions from '@/components/admin/PressAdminActions';
import PressArticleEditModal from '@/components/admin/PressArticleEditModal';
import { useAdminEditor } from '@/components/admin/AdminAuthProvider';
import { createClient } from '@/lib/supabase/client';
import { Edit2, Trash2, Clock, Calendar, ArrowUpDown, RotateCcw, Filter } from 'lucide-react';
import { deleteSiteContent } from '@/lib/site-content';
import ConfirmModal from '@/components/admin/ConfirmModal';
import { formatCardDate, getTimestamp } from '@/lib/date-utils';

const ITEMS_PER_PAGE = 9;

export default function ImprensaPage() {
  const { isAdmin, isEditing, setStatusMessage } = useAdminEditor();
  const [customArticles, setCustomArticles] = useState<PressArticle[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('Todas');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Estados de Filtro de Data e Ordenação
  const [dateRange, setDateRange] = useState<'all' | '7days' | '30days' | '90days' | 'year' | 'custom'>('all');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const [editingArticle, setEditingArticle] = useState<PressArticle | null>(null);
  const [itemToDelete, setItemToDelete] = useState<PressArticle | null>(null);
  const [isDeletingDirect, setIsDeletingDirect] = useState(false);

  // Busca as matérias salvas no Supabase
  const loadCustomArticles = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('site_contents')
        .select('field_key, content_value')
        .eq('page', 'imprensa')
        .eq('section', 'custom_articles');

      if (!error && data) {
        const parsed: PressArticle[] = [];
        data.forEach((row) => {
          try {
            if (row.content_value) {
              const item = JSON.parse(row.content_value);
              if (item && item.slug) {
                parsed.push(item);
              }
            }
          } catch (e) {
            console.error('Erro ao analisar JSON de matéria:', e);
          }
        });
        setCustomArticles(parsed);
      }
    } catch (err) {
      console.error('Erro ao buscar matérias do Supabase:', err);
    }
  };

  useEffect(() => {
    loadCustomArticles();
  }, []);

  // Lista unificada com override de custom articles
  const allArticles = getAllPressArticles(customArticles);

  const categories = [
    'Todas',
    'TV & Vídeos',
    'Jornais & Imprensa',
    'Revistas & Publicações',
    'Premiações & Homenagens',
  ];

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (typeof window !== 'undefined') {
      const gridEl = document.getElementById('grid-imprensa');
      if (gridEl) {
        gridEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleArticleAdded = (newArticle: PressArticle) => {
    setCustomArticles((prev) => {
      const filtered = prev.filter((a) => a.slug !== newArticle.slug);
      return [newArticle, ...filtered];
    });
    setCurrentPage(1);
  };

  const handleArticleUpdated = (updatedArticle: PressArticle) => {
    setCustomArticles((prev) => {
      const filtered = prev.filter((a) => a.slug !== updatedArticle.slug);
      return [updatedArticle, ...filtered];
    });
  };

  const handleArticleDeleted = async (slug: string) => {
    setCustomArticles((prev) => prev.filter((a) => a.slug !== slug));
  };

  const handleTriggerDelete = (item: PressArticle, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setItemToDelete(item);
  };

  const confirmDeleteAction = async () => {
    if (!itemToDelete) return;

    setIsDeletingDirect(true);
    setStatusMessage('Excluindo matéria do banco de dados...');
    const res = await deleteSiteContent({
      page: 'imprensa',
      section: 'custom_articles',
      fieldKey: itemToDelete.slug,
    });

    setIsDeletingDirect(false);

    if (res.success) {
      setStatusMessage('Matéria excluída com sucesso!');
      handleArticleDeleted(itemToDelete.slug);
      setItemToDelete(null);
      setTimeout(() => setStatusMessage(null), 2500);
    } else {
      setStatusMessage(`Erro ao excluir: ${res.error || 'Falha'}`);
      setTimeout(() => setStatusMessage(null), 3500);
    }
  };

  const handleResetFilters = () => {
    setActiveCategory('Todas');
    setDateRange('all');
    setCustomStartDate('');
    setCustomEndDate('');
    setSortOrder('desc');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    activeCategory !== 'Todas' ||
    dateRange !== 'all' ||
    customStartDate !== '' ||
    customEndDate !== '' ||
    sortOrder !== 'desc';

  const filteredArticles = allArticles
    .filter((item) => {
      // 1. Filtro por Categoria
      let matchesCategory = true;
      if (activeCategory === 'TV & Vídeos') {
        matchesCategory = Boolean(item.youtubeId || (item.category && item.category.includes('TV')));
      } else if (activeCategory === 'Jornais & Imprensa') {
        matchesCategory = Boolean((item.outlet && item.outlet.includes('Jornal')) || (item.category && item.category.includes('Jornais')));
      } else if (activeCategory === 'Revistas & Publicações') {
        matchesCategory = Boolean(
          (item.outlet && (item.outlet.includes('Magazine') || item.outlet.includes('Revista') || item.outlet.includes('IBI'))) ||
          (item.category && item.category.includes('Revistas'))
        );
      } else if (activeCategory === 'Premiações & Homenagens') {
        matchesCategory = Boolean(
          (item.category && item.category.includes('Premiações')) ||
          (item.title && (item.title.includes('Troféu') || item.title.includes('Prêmio')))
        );
      }
      if (!matchesCategory) return false;

      // 2. Filtro por Data
      if (dateRange !== 'all') {
        const itemTs = getTimestamp(item.publishedAt || item.date);
        const now = Date.now();
        if (dateRange === '7days') {
          const limit = now - 7 * 24 * 60 * 60 * 1000;
          if (itemTs < limit) return false;
        } else if (dateRange === '30days') {
          const limit = now - 30 * 24 * 60 * 60 * 1000;
          if (itemTs < limit) return false;
        } else if (dateRange === '90days') {
          const limit = now - 90 * 24 * 60 * 60 * 1000;
          if (itemTs < limit) return false;
        } else if (dateRange === 'year') {
          const limit = now - 365 * 24 * 60 * 60 * 1000;
          if (itemTs < limit) return false;
        } else if (dateRange === 'custom') {
          if (customStartDate) {
            const startTs = new Date(`${customStartDate}T00:00:00`).getTime();
            if (itemTs < startTs) return false;
          }
          if (customEndDate) {
            const endTs = new Date(`${customEndDate}T23:59:59`).getTime();
            if (itemTs > endTs) return false;
          }
        }
      }

      return true;
    })
    .sort((a, b) => {
      const tsA = getTimestamp(a.publishedAt || a.date);
      const tsB = getTimestamp(b.publishedAt || b.date);
      return sortOrder === 'desc' ? tsB - tsA : tsA - tsB;
    });

  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <>
      <Header />

      <main className="bg-[#f8fafb] min-h-screen py-16">
        <div className="container max-w-6xl">
          {/* Header da Sala de Imprensa */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <EditableText
              page="imprensa"
              section="header"
              fieldKey="eyebrow"
              defaultContent="Comunicação Oficial & Sala de Imprensa"
              as="span"
              className="eyebrow justify-center mb-3"
            />
            <EditableText
              page="imprensa"
              section="header"
              fieldKey="title"
              defaultContent="A Voz do Direito nos Principais Veículos do País"
              as="h1"
              className="text-4xl md:text-5xl lg:text-6xl font-serif text-evi-deep font-bold tracking-tight mb-6 leading-tight"
            />
            <EditableText
              page="imprensa"
              section="header"
              fieldKey="desc"
              defaultContent="Acompanhe a presença constante do Dr. Eduardo Veríssimo Inocente e da equipe da EVI Advogados em reportagens de TV, jornais de grande circulação, revistas internacionais e premiações jurídicas."
              as="p"
              className="text-evi-text-light text-lg md:text-xl leading-relaxed"
              multiline
            />
          </div>

          {/* Botão de Adicionar Novo Artigo de Imprensa (Visível no modo edição) */}
          <PressAdminActions onArticleAdded={handleArticleAdded} />

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

                {/* Inputs de Data Personalizada */}
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
                    <option value="asc">Mais antigas primeiro</option>
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
          <div id="grid-imprensa" className="flex items-center justify-between text-xs text-evi-text-muted mb-6 px-1 pt-2">
            <span>
              Mostrando <strong className="text-evi-deep">{filteredArticles.length === 0 ? 0 : startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filteredArticles.length)}</strong> de <strong className="text-evi-deep">{filteredArticles.length}</strong> matérias
            </span>
            {totalPages > 1 && (
              <span>
                Página <strong className="text-evi-deep">{currentPage}</strong> de <strong className="text-evi-deep">{totalPages}</strong>
              </span>
            )}
          </div>

          {/* Grid de Matérias com 9 Cards por Página com CRUD Completo */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {paginatedArticles.map((item) => (
              <article
                key={item.slug}
                className="bg-white rounded-3xl border border-evi-border overflow-hidden shadow-evi-card hover:shadow-evi-hover transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 relative"
              >
                {/* Ações de Edição CRUD quando Admin estiver em modo edição */}
                {isAdmin && isEditing && (
                  <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700 shadow-xl">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setEditingArticle(item);
                      }}
                      className="p-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                      title="Editar Matéria (Título, Texto, Mídias)"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-semibold pr-0.5">Editar</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleTriggerDelete(item, e)}
                      className="p-1.5 bg-red-600/90 hover:bg-red-600 text-white rounded-lg text-xs transition-colors"
                      title="Excluir Matéria"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div>
                  {/* Foto de Capa da Matéria */}
                  <Link href={`/imprensa/${item.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-slate-900 border-b border-evi-border">
                    <img
                      src={item.featuredImage}
                      alt={item.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 bg-evi-deep/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {item.outlet}
                    </div>
                    {item.youtubeId && !isAdmin && (
                      <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-md">
                        <span>▶ Vídeo</span>
                      </div>
                    )}
                  </Link>

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-evi-accent">
                        {item.category}
                      </span>
                    </div>

                    <h2 className="text-xl font-serif font-bold text-evi-deep mb-3 leading-snug group-hover:text-evi-accent transition-colors line-clamp-2">
                      <Link href={`/imprensa/${item.slug}`}>
                        {item.title}
                      </Link>
                    </h2>

                    <p className="text-evi-text-light text-xs leading-relaxed line-clamp-3 mb-2">
                      {item.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-0">
                  <div className="pt-3 border-t border-evi-border/60 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-medium text-evi-text-muted truncate max-w-[170px]">
                        Cobertura Oficial
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-2.5 h-2.5 text-slate-400" />
                        <span>{formatCardDate(item.publishedAt || item.date)}</span>
                      </span>
                    </div>
                    <Link
                      href={`/imprensa/${item.slug}`}
                      className="text-xs font-bold text-evi-deep hover:text-evi-accent uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Ler Matéria Completa →</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Controles de Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mb-16">
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

          {/* Banner de Relacionamento com a Imprensa */}
          <div className="bg-gradient-to-br from-evi-deep to-[#22394f] text-white rounded-3xl p-8 md:p-14 text-center max-w-4xl mx-auto shadow-evi-card">
            <span className="text-xs uppercase tracking-widest text-evi-silver font-semibold block mb-2">
              Assessoria de Imprensa & Entrevistas
            </span>
            <h3 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Jornalistas e Produtores: Solicite uma fonte jurídica especializada
            </h3>
            <p className="text-slate-300 max-w-2xl mx-auto mb-8 text-base leading-relaxed">
              O Dr. Eduardo Veríssimo Inocente e os advogados da EVI estão disponíveis para análises em tempo real sobre decisões do STF, STJ, Direito de Família, Recuperação Judicial e Direito Médico.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://wa.me/5511991390045?text=Ol%C3%A1%2C%20sou%20jornalista%2Fprodutor%20e%20gostaria%20de%20solicitar%20uma%20entrevista%20com%20o%20Dr.%20Eduardo."
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-wa text-base"
              >
                Solicitar Fonte via WhatsApp
              </a>
              <Link href="/contato" className="btn btn-outline border-white text-white hover:bg-white hover:text-evi-deep">
                Contato de Assessoria
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de Edição CRUD de Artigos Existentes */}
      {editingArticle && (
        <PressArticleEditModal
          article={editingArticle}
          onClose={() => setEditingArticle(null)}
          onSave={handleArticleUpdated}
          onDelete={handleArticleDeleted}
        />
      )}

      {/* Modal de Confirmação com a Estética do Site */}
      <ConfirmModal
        isOpen={Boolean(itemToDelete)}
        title="Excluir Matéria de Imprensa"
        message={
          itemToDelete
            ? `Tem certeza que deseja excluir a matéria "${itemToDelete.title}"? Esta ação removerá o artigo do banco de dados.`
            : ''
        }
        confirmLabel="Sim, Excluir Matéria"
        cancelLabel="Cancelar"
        variant="danger"
        isLoading={isDeletingDirect}
        onConfirm={confirmDeleteAction}
        onCancel={() => setItemToDelete(null)}
      />
    </>
  );
}
