'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPressArticleBySlug, getRelatedPressArticles, PressArticle } from '@/lib/press-data';
import EditableText from '@/components/admin/EditableText';
import EditableMedia from '@/components/admin/EditableMedia';
import { createClient } from '@/lib/supabase/client';
import PressArticleEditModal from '@/components/admin/PressArticleEditModal';
import { useAdminEditor } from '@/components/admin/AdminAuthProvider';
import { Edit2, Trash2, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatFullDateWithTime } from '@/lib/date-utils';

interface PressDetailPageProps {
  params: {
    slug: string;
  };
}

export default function PressDetailPage({ params }: PressDetailPageProps) {
  const router = useRouter();
  const { isAdmin, isEditing } = useAdminEditor();
  const [customArticles, setCustomArticles] = useState<PressArticle[]>([]);
  const [currentArticle, setCurrentArticle] = useState<PressArticle | null | undefined>(undefined);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Carrega matérias salvas no Supabase
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('site_contents')
          .select('field_key, content_value')
          .eq('page', 'imprensa')
          .eq('section', 'custom_articles');

        const parsedList: PressArticle[] = [];
        if (!error && data) {
          data.forEach((row) => {
            try {
              if (row.content_value) {
                const item = JSON.parse(row.content_value);
                if (item && item.slug) {
                  parsedList.push(item);
                }
              }
            } catch (e) {
              console.error('Erro ao analisar JSON:', e);
            }
          });
        }
        setCustomArticles(parsedList);

        // Busca o artigo atual com os dados mesclados
        const found = getPressArticleBySlug(params.slug, parsedList);
        setCurrentArticle(found || null);
      } catch (err) {
        console.error('Erro ao carregar artigo:', err);
        const fallback = getPressArticleBySlug(params.slug, []);
        setCurrentArticle(fallback || null);
      }
    };

    fetchArticles();
  }, [params.slug]);

  // Se ainda estiver carregando
  if (currentArticle === undefined) {
    return (
      <>
        <Header />
        <main className="min-h-[60vh] flex items-center justify-center bg-[#f8fafb]">
          <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin" />
        </main>
      </>
    );
  }

  // Se não encontrou a matéria
  if (currentArticle === null) {
    return (
      <>
        <Header />
        <main className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8 bg-[#f8fafb]">
          <h1 className="text-3xl font-serif font-bold text-evi-deep mb-4">Matéria não encontrada</h1>
          <p className="text-evi-text-light mb-8 max-w-md">O conteúdo que você procura pode ter sido movido ou atualizado em nossa Sala de Imprensa.</p>
          <Link href="/imprensa" className="btn btn-primary">
            Voltar para Sala de Imprensa
          </Link>
        </main>
      </>
    );
  }

  const article = currentArticle;
  const related = getRelatedPressArticles(article.slug, 3, customArticles);

  return (
    <>
      <Header />

      <main className="bg-[#f8fafb] min-h-screen pb-20 pt-8">
        <div className="container max-w-5xl">
          {/* Barra de Ações Rápidas de Admin no Artigo */}
          {isAdmin && isEditing && (
            <div className="mb-6 p-4 bg-slate-900 text-white rounded-2xl border border-slate-700 flex flex-wrap items-center justify-between gap-3 shadow-xl">
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold text-slate-200">Modo de Edição CRUD Ativo:</span>
                <span className="text-slate-400 font-mono text-[11px]">{article.slug}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Editar Matéria Completa (Word / Mídias)</span>
                </button>
              </div>
            </div>
          )}

          {/* Breadcrumb de navegação */}
          <nav className="flex items-center gap-2 text-xs text-evi-text-muted mb-8 overflow-x-auto pb-2" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-evi-accent whitespace-nowrap">Início</Link>
            <span>/</span>
            <Link href="/imprensa" className="hover:text-evi-accent whitespace-nowrap">Imprensa & Mídia</Link>
            <span>/</span>
            <span className="text-evi-deep font-semibold truncate max-w-xs md:max-w-md">{article.title}</span>
          </nav>

          {/* Cabeçalho da Matéria */}
          <header className="mb-10">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-white bg-evi-deep px-3.5 py-1.5 rounded-full">
                {article.outlet}
              </span>
              <span className="text-xs font-semibold text-evi-accent bg-white border border-evi-border px-3 py-1 rounded-full">
                {article.category}
              </span>
              <span className="text-xs text-evi-text-muted flex items-center gap-1.5 bg-white border border-evi-border px-3.5 py-1 rounded-full font-medium">
                <Clock className="w-3.5 h-3.5 text-evi-accent" />
                <span>Publicado em {formatFullDateWithTime(article.publishedAt || article.date)}</span>
              </span>
            </div>

            <EditableText
              page="imprensa_detail"
              section={params.slug}
              fieldKey="title"
              defaultContent={article.title}
              as="h1"
              className="text-3xl md:text-4xl lg:text-5xl font-serif text-evi-deep font-bold leading-tight mb-6"
            />

            <EditableText
              page="imprensa_detail"
              section={params.slug}
              fieldKey="excerpt"
              defaultContent={article.excerpt}
              as="p"
              className="text-lg md:text-xl text-evi-text-light leading-relaxed border-l-4 border-evi-accent pl-4 py-1 italic bg-white/60 rounded-r-xl"
              multiline
            />
          </header>

          {/* Mídia Principal: Vídeo do YouTube OU Imagem em Alta Resolução */}
          <div className="mb-12 rounded-3xl overflow-hidden shadow-evi-card border border-evi-border bg-black">
            {article.youtubeId ? (
              <div className="relative aspect-video w-full">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${article.youtubeId}?autoplay=0&rel=0`}
                  title={article.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            ) : (
              <div className="relative aspect-[16/9] w-full bg-slate-900 flex items-center justify-center overflow-hidden">
                <EditableMedia
                  page="imprensa_detail"
                  section={params.slug}
                  fieldKey="featured_image"
                  defaultSrc={article.featuredImage}
                  alt={article.title}
                  imgClassName="w-full h-full object-contain md:object-cover"
                />
              </div>
            )}
          </div>

          {/* Grid do Conteúdo com Barra Lateral Institucional */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
            {/* Coluna Principal: Texto Completo e Recortes */}
            <div className="lg:col-span-8 bg-white p-8 md:p-12 rounded-3xl border border-evi-border shadow-evi-card space-y-6">
              <div className="prose prose-slate max-w-none text-evi-text leading-relaxed text-base md:text-lg space-y-5">
                {article.paragraphs.map((para, idx) => {
                  const isHtml = /<[a-z][\s\S]*>/i.test(para);
                  if (isHtml) {
                    return (
                      <div
                        key={idx}
                        className="prose prose-slate max-w-none text-evi-text leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: para }}
                      />
                    );
                  }
                  return (
                    <EditableText
                      key={idx}
                      page="imprensa_detail"
                      section={params.slug}
                      fieldKey={`paragraph_${idx}`}
                      defaultContent={para}
                      as="p"
                      className="text-justify md:text-left"
                      multiline
                    />
                  );
                })}
              </div>

              {/* Imagens de Recortes de Jornais / Documentos se houver */}
              {article.bodyImages && article.bodyImages.length > 0 && (
                <div className="pt-8 border-t border-evi-border space-y-6">
                  <h3 className="text-xl font-serif font-bold text-evi-deep">
                    Registros Fotográficos & Recortes Oficiais
                  </h3>
                  <div className="grid grid-cols-1 gap-6">
                    {article.bodyImages.map((img, i) => (
                      <div key={i} className="rounded-2xl overflow-hidden border border-evi-border shadow-sm bg-slate-50">
                        <img src={img} alt={`Registro ${i + 1} - ${article.title}`} className="w-full h-auto object-contain" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Compartilhamento e Ações */}
              <div className="pt-8 border-t border-evi-border/80 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-evi-text-muted">
                  <span className="font-semibold text-evi-deep">Compartilhar matéria:</span>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`${article.title} - Leia na íntegra: ` + (typeof window !== 'undefined' ? window.location.href : ''))}`}
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
                  href="/imprensa"
                  className="text-xs font-bold text-evi-deep hover:text-evi-accent uppercase tracking-wider inline-flex items-center gap-1"
                >
                  <span>← Voltar à Sala de Imprensa</span>
                </Link>
              </div>
            </div>

            {/* Coluna Lateral: Perfil do Dr. Eduardo & CTA Institucional */}
            <aside className="lg:col-span-4 space-y-8">
              {/* Card do Dr. Eduardo Veríssimo */}
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
                  Referência jurídica com mais de 25 anos de atuação estratégica, destaque frequente na Band News, SBT, Rede Brasil e publicações internacionais de negócios.
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
                  href="https://wa.me/5511991390045?text=Ol%C3%A1%2C%20li%20a%20mat%C3%A9ria%20na%20sala%20de%20imprensa%20e%20gostaria%20de%20uma%20orienta%C3%A7%C3%A3o%20jur%C3%ADdica."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-wa w-full text-center text-sm py-3 font-bold"
                >
                  Falar no WhatsApp
                </a>
              </div>
            </aside>
          </div>

          {/* Seção de Matérias Relacionadas */}
          {related && related.length > 0 && (
            <section className="pt-12 border-t border-evi-border">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-evi-accent">Veja Também</span>
                  <h2 className="text-2xl font-serif font-bold text-evi-deep">Outras Aparições na Mídia</h2>
                </div>
                <Link href="/imprensa" className="text-xs font-bold text-evi-deep hover:text-evi-accent uppercase tracking-wider">
                  Ver Todas →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/imprensa/${rel.slug}`}
                    className="bg-white rounded-2xl border border-evi-border p-5 hover:shadow-evi-hover transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
                  >
                    <div>
                      <span className="text-[11px] font-bold text-evi-accent uppercase tracking-wider block mb-2">
                        {rel.outlet}
                      </span>
                      <h3 className="font-serif font-bold text-evi-deep group-hover:text-evi-accent transition-colors line-clamp-2 text-base mb-2">
                        {rel.title}
                      </h3>
                      <p className="text-xs text-evi-text-light line-clamp-2 leading-relaxed">
                        {rel.excerpt}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-evi-deep group-hover:text-evi-accent pt-4 mt-4 border-t border-evi-border/60 block">
                      Ler matéria completa →
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Modal de Edição Direta no Detalhe */}
      {isEditModalOpen && (
        <PressArticleEditModal
          article={article}
          onClose={() => setIsEditModalOpen(false)}
          onSave={(updated) => {
            setCurrentArticle(updated);
            setCustomArticles((prev) => [updated, ...prev.filter((a) => a.slug !== updated.slug)]);
          }}
          onDelete={() => {
            router.push('/imprensa');
          }}
        />
      )}
    </>
  );
}
