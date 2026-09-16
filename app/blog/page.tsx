'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import { getAllBlogArticles, getBlogCategories, BlogArticle } from '@/lib/blog-data';

const ITEMS_PER_PAGE = 9;

export default function BlogPage() {
  const allArticles: BlogArticle[] = getAllBlogArticles();
  const categories = getBlogCategories();

  const [activeCategory, setActiveCategory] = useState<string>('Todas');
  const [currentPage, setCurrentPage] = useState<number>(1);

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

  const filteredArticles = allArticles.filter((item) => {
    if (activeCategory === 'Todas') return true;
    return item.category === activeCategory || item.categorySlug === activeCategory;
  });

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
            <span className="eyebrow justify-center mb-3">Inteligência & Análises Jurídicas</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-evi-deep font-bold tracking-tight mb-6 leading-tight">
              Blog & Artigos Estratégicos
            </h1>
            <p className="text-evi-text-light text-lg md:text-xl leading-relaxed">
              Estudos aprofundados, teses estratégicas e atualizações jurisprudenciais em Recuperação Judicial, Agronegócio, Direito Empresarial e Tributário conduzidos pelo <strong>Dr. Eduardo Veríssimo Inocente</strong> e equipe.
            </p>
          </div>

          {/* Filtros por Categoria */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                  activeCategory === cat
                    ? 'bg-evi-deep text-white shadow-md'
                    : 'bg-white text-evi-text-muted hover:text-evi-deep border border-evi-border hover:border-evi-accent'
                }`}
              >
                {cat}
              </button>
            ))}
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

          {/* Grid de Artigos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {paginatedArticles.map((article) => (
              <article
                key={article.slug}
                className="bg-white rounded-3xl border border-evi-border overflow-hidden shadow-evi-card hover:shadow-evi-hover transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5"
              >
                <div>
                  {/* Capa do Artigo */}
                  <Link href={`/blog/${article.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-slate-900 border-b border-evi-border">
                    <img
                      src={article.featuredImage}
                      alt={article.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 bg-evi-deep/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {article.category}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md text-evi-deep text-[10px] font-semibold px-2 py-0.5 rounded border border-evi-border">
                      {article.date}
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
                    <span className="text-[11px] text-evi-text-muted truncate max-w-[150px]">
                      Por {article.author.name}
                    </span>
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
    </>
  );
}
