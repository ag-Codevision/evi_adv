import React from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import { Metadata } from 'next';
import { fetchPostBySlug } from '@/lib/supabase';
import { getBlogArticleBySlug, getRelatedBlogArticles, getAllBlogArticles, BlogArticle } from '@/lib/blog-data';
import { Post } from '@/lib/types';

interface PageProps {
  params: {
    slug: string;
  };
}

export const revalidate = 60;

export async function generateStaticParams() {
  const articles = getAllBlogArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const dbPost = await fetchPostBySlug(params.slug);
  if (dbPost) {
    return {
      title: `${dbPost.seo_title || dbPost.title} | EVI Sociedade de Advogados`,
      description: dbPost.seo_description || dbPost.excerpt,
      openGraph: {
        title: dbPost.title,
        description: dbPost.excerpt,
        images: dbPost.cover_image ? [{ url: dbPost.cover_image }] : [],
      },
    };
  }

  const localArticle = getBlogArticleBySlug(params.slug);
  if (localArticle) {
    return {
      title: `${localArticle.title} | EVI Sociedade de Advogados`,
      description: localArticle.excerpt,
      openGraph: {
        title: localArticle.title,
        description: localArticle.excerpt,
        images: [{ url: localArticle.featuredImage }],
      },
    };
  }

  return {
    title: 'Artigo | EVI Sociedade de Advogados',
    description: 'Análise estratégica e jurídica por EVI Advogados.',
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  // 1. Tenta buscar no banco Supabase
  const dbPost: Post | null = await fetchPostBySlug(params.slug);

  // 2. Se não estiver no Supabase, busca na base local rica do blog
  const localArticle: BlogArticle | undefined = getBlogArticleBySlug(params.slug);

  if (!dbPost && !localArticle) {
    return (
      <>
        <Header />
        <main className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8 bg-[#f8fafb]">
          <h1 className="text-3xl font-serif font-bold text-evi-deep mb-4">Artigo não encontrado</h1>
          <p className="text-evi-text-light mb-8 max-w-md">O conteúdo que você procura pode ter sido movido ou atualizado em nosso Blog.</p>
          <Link href="/blog" className="btn btn-primary">
            Voltar para o Blog
          </Link>
        </main>
      </>
    );
  }

  // Normaliza os dados para renderização
  const isDb = Boolean(dbPost);
  const title = isDb ? dbPost!.title : localArticle!.title;
  const category = isDb ? (dbPost!.category?.name || 'Direito Empresarial') : localArticle!.category;
  const date = isDb ? new Date(dbPost!.published_at).toLocaleDateString('pt-BR') : localArticle!.date;
  const readingTime = isDb ? (dbPost!.reading_time || 6) : localArticle!.readingTime;
  const excerpt = isDb ? dbPost!.excerpt : localArticle!.excerpt;
  const coverImage = isDb
    ? (dbPost!.cover_image || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80')
    : localArticle!.featuredImage;

  const related = getRelatedBlogArticles(params.slug, 3);

  return (
    <>
      <Header />

      <main className="bg-[#f8fafb] min-h-screen pb-20 pt-8">
        <div className="container max-w-5xl">
          {/* Breadcrumb de navegação */}
          <nav className="flex items-center gap-2 text-xs text-evi-text-muted mb-8 overflow-x-auto pb-2" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-evi-accent whitespace-nowrap">Início</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-evi-accent whitespace-nowrap">Blog & Artigos</Link>
            <span>/</span>
            <span className="text-evi-deep font-semibold truncate max-w-xs md:max-w-md">{title}</span>
          </nav>

          {/* Cabeçalho do Artigo */}
          <header className="mb-10">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-white bg-evi-deep px-3.5 py-1.5 rounded-full">
                {category}
              </span>
              <span className="text-xs font-semibold text-evi-accent bg-white border border-evi-border px-3 py-1 rounded-full">
                {readingTime} min de leitura
              </span>
              <span className="text-xs text-evi-text-muted">
                {date}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-evi-deep font-bold leading-tight mb-6">
              {title}
            </h1>

            <p className="text-lg md:text-xl text-evi-text-light leading-relaxed border-l-4 border-evi-accent pl-4 py-2 italic bg-white/70 rounded-r-xl shadow-sm">
              {excerpt}
            </p>
          </header>

          {/* Imagem de Capa do Artigo */}
          <div className="mb-12 rounded-3xl overflow-hidden shadow-evi-card border border-evi-border bg-slate-900">
            <div className="relative aspect-[21/9] md:aspect-[2.2/1] w-full overflow-hidden">
              <img
                src={coverImage}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Grid do Conteúdo com Barra Lateral Institucional */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
            {/* Coluna Principal: Texto Completo */}
            <div className="lg:col-span-8 bg-white p-8 md:p-12 rounded-3xl border border-evi-border shadow-evi-card space-y-8">
              {isDb ? (
                /* Conteúdo HTML vindo do Supabase */
                <div
                  className="prose prose-slate max-w-none text-evi-text leading-relaxed text-base md:text-lg space-y-6 article-body"
                  dangerouslySetInnerHTML={{ __html: dbPost!.content }}
                />
              ) : (
                /* Conteúdo Estruturado Local */
                <div className="prose prose-slate max-w-none text-evi-text leading-relaxed text-base md:text-lg space-y-6">
                  {localArticle!.paragraphs.map((para, idx) => (
                    <p key={idx} className="text-justify md:text-left">
                      {para}
                    </p>
                  ))}

                  {/* 1ª Imagem Ilustrativa / Técnica se houver */}
                  {localArticle!.bodyImages && localArticle!.bodyImages[0] && (
                    <figure className="my-8 overflow-hidden rounded-2xl border border-evi-border shadow-evi-card">
                      <img
                        src={localArticle!.bodyImages[0].url}
                        alt={localArticle!.bodyImages[0].caption}
                        className="w-full max-h-[460px] object-cover"
                        loading="lazy"
                      />
                      <figcaption className="p-4 bg-evi-soft text-xs text-evi-text-muted italic border-t border-evi-border text-center">
                        {localArticle!.bodyImages[0].caption}
                      </figcaption>
                    </figure>
                  )}

                  {/* Subseções com subtítulos h2 */}
                  {localArticle!.subsections &&
                    localArticle!.subsections.map((sub, sIdx) => (
                      <div key={sIdx} className="space-y-4 pt-4">
                        <h2 className="text-2xl font-serif font-bold text-evi-deep border-b border-evi-border/60 pb-2">
                          {sub.subtitle}
                        </h2>
                        {sub.paragraphs.map((subPara, spIdx) => (
                          <p key={spIdx} className="text-justify md:text-left">
                            {subPara}
                          </p>
                        ))}
                      </div>
                    ))}
                </div>
              )}

              {/* Compartilhamento e Voltar */}
              <div className="pt-8 border-t border-evi-border/80 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-evi-text-muted">
                  <span className="font-semibold text-evi-deep">Compartilhar:</span>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`${title} - Leia este artigo completo: ` + (typeof window !== 'undefined' ? window.location.href : ''))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full hover:bg-emerald-100 transition-colors"
                  >
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    <span>LinkedIn</span>
                  </a>
                </div>

                <Link
                  href="/blog"
                  className="text-xs font-bold text-evi-deep hover:text-evi-accent uppercase tracking-wider inline-flex items-center gap-1"
                >
                  <span>← Voltar para o Blog</span>
                </Link>
              </div>

              {/* Caixa de Autoridade do Dr. Eduardo no final da página */}
              <div className="p-6 md:p-8 bg-evi-soft rounded-2xl border border-evi-border flex flex-col md:flex-row items-center gap-6">
                <img
                  src="/img/01.png"
                  alt="Dr. Eduardo Veríssimo Inocente"
                  className="w-24 h-24 rounded-full object-cover border-2 border-evi-accent shadow-md flex-shrink-0"
                />
                <div>
                  <h4 className="font-serif font-bold text-evi-deep text-xl">
                    Dr. Eduardo Veríssimo Inocente
                  </h4>
                  <p className="text-xs font-semibold text-evi-accent mb-2">
                    Sócio-Fundador & Diretor Jurídico · OAB/SP 200.334
                  </p>
                  <p className="text-xs text-evi-text-light leading-relaxed">
                    Mais de 25 anos de vanguarda no Direito Empresarial, referência nacional em Recuperação Judicial, Reestruturação de Dívidas e Agronegócio.
                  </p>
                </div>
              </div>

              {/* CTA do Artigo */}
              <div className="pt-6 border-t border-evi-border text-center">
                <p className="text-evi-deep font-serif text-xl font-semibold mb-3">
                  Deseja discutir a aplicação desse tema ao seu caso?
                </p>
                <p className="text-sm text-evi-text-light mb-6 max-w-lg mx-auto">
                  Agende uma consulta com o Dr. Eduardo Veríssimo Inocente e nossa banca de especialistas.
                </p>
                <a
                  href={`https://wa.me/5511991390045?text=${encodeURIComponent(`Olá, li o artigo "${title}" no blog e gostaria de conversar com o Dr. Eduardo Veríssimo Inocente.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-wa"
                >
                  Falar com Dr. Eduardo Veríssimo Inocente e Equipe
                </a>
              </div>
            </div>

            {/* Coluna Lateral: Perfil do Dr. Eduardo & CTA Institucional */}
            <aside className="lg:col-span-4 space-y-8">
              {/* Card do Dr. Eduardo Veríssimo Inocente */}
              <div className="bg-white p-6 rounded-3xl border border-evi-border shadow-evi-card">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src="/img/01.png"
                    alt="Dr. Eduardo Veríssimo Inocente"
                    className="w-16 h-16 rounded-full object-cover border-2 border-evi-accent shadow-sm"
                  />
                  <div>
                    <h4 className="font-serif font-bold text-evi-deep text-lg">Dr. Eduardo Veríssimo Inocente</h4>
                    <span className="text-xs text-evi-accent font-semibold block">Sócio-Fundador EVI</span>
                    <span className="text-[11px] text-evi-text-muted">OAB/SP 200.334</span>
                  </div>
                </div>
                <p className="text-xs text-evi-text-light leading-relaxed mb-4">
                  Advocacia de vanguarda e soluções sob medida para empresas em momentos decisivos, reestruturação societária e proteção patrimonial.
                </p>
                <Link href="/quem-somos#dr-eduardo" className="btn btn-outline w-full text-center text-xs py-2.5">
                  Conhecer Perfil Completo
                </Link>
              </div>

              {/* Card de Atendimento Direto */}
              <div className="bg-evi-deep text-white p-6 rounded-3xl shadow-evi-card">
                <span className="text-[10px] uppercase tracking-widest text-evi-silver font-semibold block mb-2">
                  Atendimento Especializado
                </span>
                <h4 className="font-serif font-bold text-xl mb-3">
                  Precisa de assessoria jurídica personalizada?
                </h4>
                <p className="text-slate-300 text-xs leading-relaxed mb-6">
                  Converse diretamente com o Dr. Eduardo e nossos advogados especialistas para analisar o seu caso com total sigilo.
                </p>
                <a
                  href={`https://wa.me/5511991390045?text=${encodeURIComponent(`Olá, li um artigo no blog e gostaria de uma avaliação jurídica especializada.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-wa w-full text-center text-sm py-3 font-bold"
                >
                  Falar no WhatsApp
                </a>
              </div>
            </aside>
          </div>

          {/* Seção de Artigos Recomendados */}
          {related && related.length > 0 && (
            <section className="pt-12 border-t border-evi-border">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-evi-accent">Veja Também</span>
                  <h2 className="text-2xl font-serif font-bold text-evi-deep">Análises Recomendadas</h2>
                </div>
                <Link href="/blog" className="text-xs font-bold text-evi-deep hover:text-evi-accent uppercase tracking-wider">
                  Ver Todas →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/blog/${rel.slug}`}
                    className="bg-white rounded-2xl border border-evi-border p-5 hover:shadow-evi-hover transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
                  >
                    <div>
                      <span className="text-[11px] font-bold text-evi-accent uppercase tracking-wider block mb-2">
                        {rel.category}
                      </span>
                      <h3 className="font-serif font-bold text-evi-deep group-hover:text-evi-accent transition-colors line-clamp-2 text-base mb-2">
                        {rel.title}
                      </h3>
                      <p className="text-xs text-evi-text-light line-clamp-2 leading-relaxed">
                        {rel.excerpt}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-evi-deep group-hover:text-evi-accent pt-4 mt-4 border-t border-evi-border/60 block">
                      Ler análise completa →
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
