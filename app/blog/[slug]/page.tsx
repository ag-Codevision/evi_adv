import React from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import { Metadata } from 'next';
import { fetchPostBySlug } from '@/lib/supabase';
import { INITIAL_EDITORIAL_TOPICS } from '@/lib/blog-topics';
import { getCuratedImages } from '@/lib/image-provider';
import { Post } from '@/lib/types';

interface PageProps {
  params: {
    slug: string;
  };
}

export const revalidate = 60;

function findLocalTopic(slug: string) {
  return INITIAL_EDITORIAL_TOPICS.find((t) => {
    const s = t.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return s === slug || slug.includes(t.categorySlug);
  }) || INITIAL_EDITORIAL_TOPICS[0];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await fetchPostBySlug(params.slug);
  if (post) {
    return {
      title: `${post.seo_title || post.title} | EVI Sociedade de Advogados`,
      description: post.seo_description || post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        images: post.cover_image ? [{ url: post.cover_image }] : [],
      },
    };
  }

  const topic = findLocalTopic(params.slug);
  return {
    title: `${topic.title} | EVI Sociedade de Advogados`,
    description: topic.excerpt,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const post: Post | null = await fetchPostBySlug(params.slug);

  if (!post) {
    const localTopic = findLocalTopic(params.slug);
    const images = getCuratedImages(localTopic.categorySlug);

    return (
      <>
        <Header
          leftLinks={[
            { label: 'Início', href: '/' },
            { label: 'Blog', href: '/blog' },
          ]}
          rightLinks={[
            { label: 'Dr. Eduardo', href: '/eduardo-verissimo' },
            { label: 'Contato', href: '/#contato' },
          ]}
        />
        <article className="bg-[#f8fafb] min-h-screen py-16">
          <div className="container max-w-4xl">
            <Link
              href="/blog"
              className="text-sm font-semibold text-evi-accent hover:text-evi-deep mb-8 inline-block"
            >
              ← Voltar para o Blog
            </Link>

            <div className="bg-white rounded-3xl border border-evi-border overflow-hidden shadow-evi-card">
              {/* Banner de Capa do Artigo (mesma imagem do card do blog) */}
              <div className="w-full aspect-[21/9] md:aspect-[2.2/1] overflow-hidden relative bg-slate-100">
                <img
                  src={images.cover}
                  alt={localTopic.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-8 md:p-14">
                <span className="eyebrow mb-4">{localTopic.categoryName}</span>
                <h1 className="text-3xl md:text-5xl font-serif text-evi-deep font-bold leading-tight mb-6">
                  {localTopic.title}
                </h1>

                <div className="flex items-center gap-4 py-4 border-y border-evi-border mb-10 text-sm text-evi-text-muted">
                  <div className="font-semibold text-evi-deep">
                    Por Dr. Eduardo Veríssimo Inocente
                  </div>
                  <span>·</span>
                  <div>OAB/SP 200.322</div>
                  <span>·</span>
                  <div>5 min de leitura</div>
                </div>

                <div className="prose max-w-none text-evi-text font-sans leading-relaxed space-y-6 text-lg">
                  <p className="text-xl font-serif text-evi-deep leading-relaxed">
                    {localTopic.excerpt}
                  </p>
                  <p>
                    O cenário jurídico contemporâneo exige soluções estratégicas que combinem rigor técnico, conhecimento aprofundado dos precedentes judiciais e visão pragmática dos negócios. Em temas de alta complexidade, a prevenção de riscos e a correta estruturação contratual e processual definem o desfecho das decisões empresariais.
                  </p>

                  {/* 1ª Imagem no Corpo do Artigo */}
                  <figure className="my-10 overflow-hidden rounded-2xl border border-evi-border shadow-evi-card">
                    <img
                      src={images.body1.url}
                      alt={images.body1.caption}
                      className="w-full max-h-[460px] object-cover"
                      loading="lazy"
                    />
                    <figcaption className="p-4 bg-evi-soft text-xs text-evi-text-muted italic border-t border-evi-border text-center">
                      {images.body1.caption}
                    </figcaption>
                  </figure>

                  <h2 className="text-2xl font-serif font-bold text-evi-deep pt-4">
                    Considerações Técnicas e Precedentes dos Tribunais Superiores
                  </h2>
                  <p>
                    A uniformização de entendimentos no Superior Tribunal de Justiça (STJ) tem conferido maior previsibilidade e segurança jurídica aos operadores do direito e aos gestores corporativos. Diante disso, a atuação jurídica deve ser pautada em uma análise individualizada e detalhada de cada caso concreto.
                  </p>

                  {/* 2ª Imagem no Corpo do Artigo */}
                  <figure className="my-10 overflow-hidden rounded-2xl border border-evi-border shadow-evi-card">
                    <img
                      src={images.body2.url}
                      alt={images.body2.caption}
                      className="w-full max-h-[460px] object-cover"
                      loading="lazy"
                    />
                    <figcaption className="p-4 bg-evi-soft text-xs text-evi-text-muted italic border-t border-evi-border text-center">
                      {images.body2.caption}
                    </figcaption>
                  </figure>

                  <p>
                    A estruturação preventiva permite às companhias salvaguardar seus fluxos de caixa, otimizar garantias e estabelecer negociações de alto nível com credores, instituições bancárias e parceiros comerciais estratégicos.
                  </p>
                </div>

                {/* Caixa de Autoridade do Dr. Eduardo */}
                <div className="mt-14 p-6 bg-evi-soft rounded-2xl border border-evi-border flex flex-col md:flex-row items-center gap-6">
                  <img
                    src="/assets/hero.jpg"
                    alt="Dr. Eduardo Veríssimo Inocente"
                    className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md flex-shrink-0"
                  />
                  <div>
                    <h4 className="font-serif font-bold text-evi-deep text-lg">
                      Dr. Eduardo Veríssimo Inocente
                    </h4>
                    <p className="text-xs text-evi-text-muted mb-2">
                      Sócio-Fundador & Diretor Jurídico · OAB/SP 200.322
                    </p>
                    <p className="text-xs text-evi-text-light leading-relaxed">
                      Mais de 25 anos de vanguarda no Direito Empresarial, referência nacional em Recuperação Judicial, Reestruturação de Dívidas e Agronegócio.
                    </p>
                  </div>
                </div>

                {/* CTA do Artigo */}
                <div className="mt-10 text-center pt-8 border-t border-evi-border">
                  <p className="text-evi-deep font-serif text-xl font-semibold mb-4">
                    Deseja discutir a aplicação desse tema ao seu caso?
                  </p>
                  <a
                    href="https://wa.me/5511991390045?text=Ol%C3%A1%2C%20li%20o%20artigo%20sobre%20esse%20tema%20e%20gostaria%20de%20conversar."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-wa"
                  >
                    Falar Diretamente com a Equipe
                  </a>
                </div>
              </div>
            </div>
          </div>
        </article>
      </>
    );
  }

  // Artigo vindo do Supabase
  const cover = post.cover_image || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80';

  return (
    <>
      <Header
        leftLinks={[
          { label: 'Início', href: '/' },
          { label: 'Blog', href: '/blog' },
        ]}
        rightLinks={[
          { label: 'Dr. Eduardo', href: '/eduardo-verissimo' },
          { label: 'Contato', href: '/#contato' },
        ]}
      />
      <article className="bg-[#f8fafb] min-h-screen py-16">
        <div className="container max-w-4xl">
          <Link
            href="/blog"
            className="text-sm font-semibold text-evi-accent hover:text-evi-deep mb-8 inline-block"
          >
            ← Voltar para o Blog
          </Link>

          <div className="bg-white rounded-3xl border border-evi-border overflow-hidden shadow-evi-card">
            {/* Banner de Capa do Artigo (mesma imagem do card do blog) */}
            <div className="w-full aspect-[21/9] md:aspect-[2.2/1] overflow-hidden relative bg-slate-100">
              <img
                src={cover}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-8 md:p-14">
              <span className="eyebrow mb-4">
                {post.category?.name || 'Direito Empresarial'}
              </span>
              <h1 className="text-3xl md:text-5xl font-serif text-evi-deep font-bold leading-tight mb-6">
                {post.title}
              </h1>

              <div className="flex items-center gap-4 py-4 border-y border-evi-border mb-10 text-sm text-evi-text-muted">
                <div className="font-semibold text-evi-deep">
                  Por {post.author?.name || 'Dr. Eduardo Veríssimo Inocente'}
                </div>
                <span>·</span>
                <div>{new Date(post.published_at).toLocaleDateString('pt-BR')}</div>
                <span>·</span>
                <div>{post.reading_time || 5} min de leitura</div>
              </div>

              {/* Corpo do Artigo com tipografia e suporte a figuras com imagens */}
              <div
                className="prose max-w-none text-evi-text font-sans leading-relaxed space-y-6 text-lg article-body"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Caixa de Autoridade do Dr. Eduardo */}
              <div className="mt-14 p-6 bg-evi-soft rounded-2xl border border-evi-border flex flex-col md:flex-row items-center gap-6">
                <img
                  src={post.author?.avatar_url || '/assets/hero.jpg'}
                  alt={post.author?.name || 'Dr. Eduardo Veríssimo Inocente'}
                  className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md flex-shrink-0"
                />
                <div>
                  <h4 className="font-serif font-bold text-evi-deep text-lg">
                    {post.author?.name || 'Dr. Eduardo Veríssimo Inocente'}
                  </h4>
                  <p className="text-xs text-evi-text-muted mb-2">
                    {post.author?.role || 'Sócio-Fundador & Diretor Jurídico'} {post.author?.oab && `· ${post.author.oab}`}
                  </p>
                  <p className="text-xs text-evi-text-light leading-relaxed">
                    {post.author?.bio || 'Mais de 25 anos de liderança e atuação de vanguarda no Direito Empresarial e Estratégico.'}
                  </p>
                </div>
              </div>

              {/* CTA do Artigo */}
              <div className="mt-10 text-center pt-8 border-t border-evi-border">
                <p className="text-evi-deep font-serif text-xl font-semibold mb-4">
                  Deseja discutir a aplicação desse tema ao seu caso?
                </p>
                <a
                  href="https://wa.me/5511991390045?text=Ol%C3%A1%2C%20li%20o%20artigo%20e%20gostaria%20de%20uma%20orienta%C3%A7%C3%A3o."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-wa"
                >
                  Falar Diretamente com a Equipe
                </a>
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
