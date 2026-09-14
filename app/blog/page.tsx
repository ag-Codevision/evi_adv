import React from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import { INITIAL_EDITORIAL_TOPICS } from '@/lib/blog-topics';
import { fetchPosts } from '@/lib/supabase';
import { Post } from '@/lib/types';

export const revalidate = 60;

export default async function BlogPage() {
  const dbPosts: Post[] = await fetchPosts();
  const hasDbPosts = dbPosts.length > 0;

  return (
    <>
      <Header
        leftLinks={[
          { label: 'Início', href: '/' },
          { label: 'Áreas de Atuação', href: '/#atuacao' },
        ]}
        rightLinks={[
          { label: 'Dr. Eduardo', href: '/eduardo-verissimo' },
          { label: 'Contato', href: '/#contato' },
        ]}
      />

      <main className="bg-[#f8fafb] min-h-screen py-16">
        <div className="container">
          {/* Cabeçalho do Blog */}
          <div className="text-center max-w-3xl mx-auto mb-16 motion-item" data-motion="up">
            <span className="eyebrow justify-center mb-3">Inteligência & Análises</span>
            <h1 className="text-4xl md:text-5xl font-serif text-evi-deep font-semibold tracking-tight mb-4">
              Blog & Artigos Jurídicos
            </h1>
            <p className="text-evi-text-light text-lg">
              Estudos aprofundados, teses estratégicas e atualizações jurisprudenciais em Recuperação Judicial, Agronegócio, Direito Empresarial e Tributário.
            </p>
          </div>

          {/* Grid de Artigos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hasDbPosts
              ? dbPosts.map((post) => {
                  const cover = post.cover_image || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80';
                  return (
                    <article
                      key={post.id}
                      className="bg-white rounded-2xl border border-evi-border overflow-hidden flex flex-col justify-between shadow-evi-card hover:shadow-evi-hover transition-all duration-300 hover:-translate-y-1.5 group"
                    >
                      <div>
                        {/* Imagem de Capa do Card */}
                        <div className="w-full aspect-[16/9] overflow-hidden bg-slate-100 relative">
                          <img
                            src={cover}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        </div>
                        <div className="p-7 pb-2">
                          <div className="flex items-center justify-between text-xs text-evi-text-muted mb-3">
                            <span className="font-semibold text-evi-accent uppercase tracking-wider">
                              {post.category?.name || 'Direito Empresarial'}
                            </span>
                            <span>{new Date(post.published_at).toLocaleDateString('pt-BR')}</span>
                          </div>
                          <h2 className="text-xl font-serif font-bold text-evi-deep mb-3 leading-snug group-hover:text-evi-accent transition-colors">
                            <Link href={`/blog/${post.slug}`}>
                              {post.title}
                            </Link>
                          </h2>
                          <p className="text-evi-text-light text-sm line-clamp-3 mb-4">
                            {post.excerpt}
                          </p>
                        </div>
                      </div>
                      <div className="px-7 pb-6 pt-4 border-t border-evi-border/60 flex items-center justify-between">
                        <span className="text-xs text-evi-text-muted">
                          Por {post.author?.name || 'Dr. Eduardo Veríssimo'}
                        </span>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-xs font-bold text-evi-deep hover:text-evi-accent uppercase tracking-wider"
                        >
                          Ler Análise →
                        </Link>
                      </div>
                    </article>
                  );
                })
              : INITIAL_EDITORIAL_TOPICS.map((topic, idx) => {
                  const slug = topic.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                  const cover = 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80';
                  return (
                    <article
                      key={idx}
                      className="bg-white rounded-2xl border border-evi-border overflow-hidden flex flex-col justify-between shadow-evi-card hover:shadow-evi-hover transition-all duration-300 hover:-translate-y-1.5 group"
                    >
                      <div>
                        {/* Imagem de Capa do Card */}
                        <div className="w-full aspect-[16/9] overflow-hidden bg-slate-100 relative">
                          <img
                            src={cover}
                            alt={topic.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        </div>
                        <div className="p-7 pb-2">
                          <div className="flex items-center justify-between text-xs text-evi-text-muted mb-3">
                            <span className="font-semibold text-evi-accent uppercase tracking-wider">
                              {topic.categoryName}
                            </span>
                            <span>Análise Estratégica</span>
                          </div>
                          <h2 className="text-xl font-serif font-bold text-evi-deep mb-3 leading-snug group-hover:text-evi-accent transition-colors">
                            <Link href={`/blog/${slug}`}>
                              {topic.title}
                            </Link>
                          </h2>
                          <p className="text-evi-text-light text-sm line-clamp-3 mb-4">
                            {topic.excerpt}
                          </p>
                        </div>
                      </div>
                      <div className="px-7 pb-6 pt-4 border-t border-evi-border/60 flex items-center justify-between">
                        <span className="text-xs text-evi-text-muted">
                          Coordenação: Dr. Eduardo Veríssimo
                        </span>
                        <Link
                          href={`/blog/${slug}`}
                          className="text-xs font-bold text-evi-deep hover:text-evi-accent uppercase tracking-wider"
                        >
                          Ler Análise →
                        </Link>
                      </div>
                    </article>
                  );
                })}
          </div>

          {/* Banner de Consulta Direta */}
          <div className="mt-16 bg-evi-deep rounded-3xl p-10 text-white text-center flex flex-col items-center">
            <h3 className="text-2xl md:text-3xl font-serif font-semibold mb-3">
              Precisa de uma avaliação jurídica para a sua empresa?
            </h3>
            <p className="text-slate-300 max-w-2xl mb-8">
              Nossa equipe multidisciplinar está preparada para conduzir análises preliminares de risco, due diligence e soluções para momentos decisivos.
            </p>
            <a
              href="https://wa.me/5511991390045?text=Ol%C3%A1%2C%20li%20os%20artigos%20no%20blog%20e%20gostaria%20de%20agendar%20uma%20conversa."
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-wa"
            >
              Falar com o Dr. Eduardo e Equipe
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
