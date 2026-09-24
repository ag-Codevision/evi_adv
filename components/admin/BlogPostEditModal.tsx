'use client';

import React, { useState, useEffect } from 'react';
import { useAdminEditor } from './AdminAuthProvider';
import { useSiteContent } from './SiteContentProvider';
import { upsertPostAction, deletePostAction } from '../../lib/posts-actions';
import { uploadSiteMedia, saveSiteContent } from '../../lib/site-content';
import { findBlogImageCandidateAction } from '../../lib/blog-image-actions';
import { BlogArticle, getBlogCategories } from '../../lib/blog-data';
import {
  X,
  Upload,
  Loader2,
  Trash2,
  CheckCircle2,
  BookOpen,
  Check,
  Tag,
  Clock,
  Calendar,
  Globe,
  Sparkles
} from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import ConfirmModal from './ConfirmModal';
import { formatForDateTimeInput, formatCardDate } from '../../lib/date-utils';

interface BlogPostEditModalProps {
  article: BlogArticle | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedArticle: BlogArticle) => void;
  onDelete?: (article: BlogArticle) => void;
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export default function BlogPostEditModal({
  article,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: BlogPostEditModalProps) {
  const { setStatusMessage } = useAdminEditor();
  const { updateContent } = useSiteContent();

  const standardCategories = getBlogCategories().filter((c) => c !== 'Todas');

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState(standardCategories[0] || 'Recuperação Judicial & Falências');
  const [customCategory, setCustomCategory] = useState('');
  const [readingTime, setReadingTime] = useState(5);
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [content, setContent] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [publishedDateTime, setPublishedDateTime] = useState('');

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSearchingStock, setIsSearchingStock] = useState(false);
  const [stockMessage, setStockMessage] = useState<string | null>(null);

  // Inicializa os campos quando o artigo for selecionado
  useEffect(() => {
    if (!article) return;

    setTitle(article.title || '');
    setSlug(article.slug || '');
    setReadingTime(article.readingTime || 5);
    setExcerpt(article.excerpt || '');
    setCoverImage(article.featuredImage || '');
    setIsFeatured(Boolean(article.isFeatured));
    setPublishedDateTime(formatForDateTimeInput(article.publishedAt || article.date));

    if (standardCategories.includes(article.category)) {
      setCategory(article.category);
      setCustomCategory('');
    } else {
      setCategory('Outra');
      setCustomCategory(article.category || '');
    }

    // Carrega o conteúdo
    if (article.content && article.content.trim()) {
      setContent(article.content);
    } else if (article.paragraphs && article.paragraphs.length > 0) {
      // Reconstrói texto/html a partir de paragraphs e subsections
      let builtContent = article.paragraphs.map((p) => `<p>${p}</p>`).join('\n');
      if (article.subsections && article.subsections.length > 0) {
        article.subsections.forEach((sub) => {
          builtContent += `\n<h2>${sub.subtitle}</h2>\n` + sub.paragraphs.map((p) => `<p>${p}</p>`).join('\n');
        });
      }
      setContent(builtContent);
    } else {
      setContent(`<p>${article.excerpt || article.title}</p>`);
    }

    setError(null);
  }, [article, isOpen]);

  if (!isOpen || !article) return null;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatusMessage('Enviando capa para o Supabase Storage...');
    const formData = new FormData();
    formData.append('file', file);

    const res = await uploadSiteMedia(formData);
    if (res.success && res.url) {
      setCoverImage(res.url);
      setStatusMessage('Capa carregada com sucesso!');
      setTimeout(() => setStatusMessage(null), 2500);
    } else {
      setError(res.error || 'Falha ao fazer upload da capa.');
      setTimeout(() => setError(null), 4000);
    }
  };

  const handleAutoStockImage = async () => {
    setIsSearchingStock(true);
    setError(null);
    setStockMessage(null);
    setStatusMessage('Buscando imagem no banco de imagens baseada no título...');

    const finalCategory = category === 'Outra' && customCategory.trim() ? customCategory.trim() : category;

    const res = await findBlogImageCandidateAction({
      category: finalCategory,
      title: title.trim() || article.title,
      currentUrl: coverImage,
      slug: slug.trim() || article.slug,
    });

    setIsSearchingStock(false);

    if (res.success && res.imageUrl) {
      setCoverImage(res.imageUrl);
      setStockMessage('Nova imagem selecionada com base no título e categoria do artigo!');
      setStatusMessage('Imagem selecionada automaticamente com base no título!');
      setTimeout(() => {
        setStatusMessage(null);
        setStockMessage(null);
      }, 4000);
    } else {
      setError(res.error || 'Não foi possível encontrar uma imagem adequada no banco de dados.');
      setTimeout(() => setError(null), 4000);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) {
      setError('Por favor preencha os campos obrigatórios (Título e Slug).');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setStatusMessage('Salvando alterações do artigo no Supabase...');

    const finalCategory = category === 'Outra' && customCategory.trim() ? customCategory.trim() : category;
    const isoPublishedAt = publishedDateTime ? new Date(publishedDateTime).toISOString() : (article.publishedAt || new Date().toISOString());
    const formattedCardDate = formatCardDate(isoPublishedAt);
    const finalCover = coverImage.trim() || article.featuredImage || '/img/imprensa/nani-venancio.jpg';

    // 1. Salva explicitamente a capa em site_contents para a página de detalhe e para os cards do blog
    await saveSiteContent({
      page: 'blog_detail',
      section: slug.trim(),
      fieldKey: 'cover_image',
      value: finalCover,
      contentType: 'image',
      metadata: {
        title: title.trim(),
        slug: slug.trim(),
        updated_at: new Date().toISOString(),
      },
    });

    if (article.slug && article.slug !== slug.trim()) {
      await saveSiteContent({
        page: 'blog_detail',
        section: article.slug,
        fieldKey: 'cover_image',
        value: finalCover,
        contentType: 'image',
      });
      updateContent('blog_detail', article.slug, 'cover_image', finalCover, undefined, 'image');
    }

    // 2. Atualiza imediatamente o Provider em tempo real no cliente
    updateContent('blog_detail', slug.trim(), 'cover_image', finalCover, undefined, 'image');

    // 3. Atualiza ou insere na tabela posts do Supabase
    const res = await upsertPostAction({
      id: article.id,
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim() || title.trim(),
      content: content.trim() || `<p>${excerpt || title}</p>`,
      cover_image: finalCover,
      reading_time: Number(readingTime) || 5,
      is_featured: isFeatured,
      published_at: isoPublishedAt,
      seo_title: title.trim(),
      seo_description: excerpt.trim() || title.trim(),
    });

    // 4. Salva também cópia no site_contents para sincronização do Live CMS imediata
    await saveSiteContent({
      page: 'blog',
      section: 'custom_articles',
      fieldKey: slug.trim(),
      value: JSON.stringify({
        ...article,
        id: res.postId || article.id,
        title: title.trim(),
        slug: slug.trim(),
        category: finalCategory,
        categorySlug: generateSlug(finalCategory),
        readingTime: Number(readingTime) || 5,
        featuredImage: finalCover,
        excerpt: excerpt.trim() || title.trim(),
        content: content.trim(),
        isFeatured,
        publishedAt: isoPublishedAt,
        date: formattedCardDate,
      }),
      contentType: 'list',
      metadata: { slug: slug.trim(), title: title.trim(), category: finalCategory },
    });

    setIsSubmitting(false);

    if (res.success || !res.error) {
      setStatusMessage('Artigo e capa salvos com sucesso!');
      setTimeout(() => setStatusMessage(null), 2500);

      const updatedArticle: BlogArticle = {
        ...article,
        id: res.postId || article.id,
        title: title.trim(),
        slug: slug.trim(),
        category: finalCategory,
        categorySlug: generateSlug(finalCategory),
        readingTime: Number(readingTime) || 5,
        featuredImage: finalCover,
        excerpt: excerpt.trim() || title.trim(),
        content: content.trim(),
        isFeatured,
        publishedAt: isoPublishedAt,
        date: formattedCardDate,
      };

      onSave(updatedArticle);
      onClose();
    } else {
      setError(res.error || 'Erro ao salvar artigo.');
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    setStatusMessage('Excluindo artigo do blog...');

    // Se possui ID na tabela posts, exclui via ação de posts
    if (article.id) {
      await deletePostAction(article.id);
    }

    // Salva o slug na lista de excluídos para garantir que itens estáticos também sejam ocultados
    try {
      await saveSiteContent({
        page: 'blog',
        section: 'deleted_articles',
        fieldKey: article.slug,
        value: JSON.stringify({ slug: article.slug, deletedAt: new Date().toISOString() }),
        contentType: 'text',
      });
    } catch (e) {
      console.error('Erro ao registrar exclusão em site_contents:', e);
    }

    setIsDeleting(false);
    setShowDeleteConfirm(false);
    setStatusMessage('Artigo excluído com sucesso!');
    setTimeout(() => setStatusMessage(null), 2500);

    if (onDelete) {
      onDelete(article);
    }
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/80 z-[9999999] flex items-center justify-center p-3 md:p-6 backdrop-blur-md overflow-y-auto animate-fade-in font-sans">
        <div className="bg-[#0b1320] border border-slate-700/80 rounded-3xl max-w-5xl w-full my-auto text-slate-100 shadow-2xl relative flex flex-col max-h-[92vh] overflow-hidden">
          {/* Header Fixo */}
          <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-sky-900/30 border border-sky-400/30">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg md:text-xl font-serif font-bold text-white leading-tight">
                    Editar Artigo do Blog
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-500/20 text-sky-400 border border-sky-500/30">
                    CRUD • Live CMS
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Modifique título, categoria, tempo de leitura, capa e conteúdo com o editor rico
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
              title="Fechar (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Corpo com Scroll Independente */}
          <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-sm flex-1 custom-scrollbar">
            {error && (
              <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-red-200 text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                <span>{error}</span>
              </div>
            )}

            <form id="edit-blog-post-form" onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                {/* Título */}
                <div className="md:col-span-8 space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Título do Artigo <span className="text-sky-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={handleTitleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 font-medium"
                  />
                </div>

                {/* Tempo de Leitura */}
                <div className="md:col-span-4 space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Tempo de Leitura (Min)</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={readingTime}
                    onChange={(e) => setReadingTime(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                {/* Slug da URL */}
                <div className="md:col-span-4 space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                    <span>Slug da URL</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-slate-300 font-mono focus:outline-none focus:border-sky-500"
                  />
                </div>

                {/* Categoria */}
                <div className="md:col-span-4 space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-slate-400" />
                    <span>Categoria Jurídica</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    {standardCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="Outra">+ Outra Categoria Personalizada</option>
                  </select>
                </div>

                {/* Data e Horário de Publicação */}
                <div className="md:col-span-4 space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Data e Horário</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={publishedDateTime}
                    onChange={(e) => setPublishedDateTime(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white focus:outline-none focus:border-sky-500 [color-scheme:dark]"
                  />
                </div>

                {/* Campo Categoria Personalizada se selecionado "Outra" */}
                {category === 'Outra' && (
                  <div className="md:col-span-12 space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Nome da Nova Categoria
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Direito Médico & Saúde Suplementar"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                )}
              </div>

              {/* Resumo / Excerpt */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Resumo / Linha Fina (Chamada no Card)
                </label>
                <textarea
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Breve resumo explicativo sobre a tese jurídica para exibição nos cards..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 leading-relaxed"
                />
              </div>

              {/* Upload e Busca Automática de Imagem de Capa */}
              <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Imagem de Capa do Artigo
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Sincronizada automaticamente com o card e página interna
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleAutoStockImage}
                    disabled={isSearchingStock}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 hover:from-sky-500 hover:to-indigo-500 text-xs text-white font-semibold cursor-pointer transition-all shadow-md active:scale-95 disabled:opacity-50"
                    title="Buscar automaticamente uma nova foto de alta resolução baseada no título do artigo"
                  >
                    {isSearchingStock ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    )}
                    <span>{isSearchingStock ? 'Buscando Imagem...' : 'Buscar no Banco de Imagens'}</span>
                  </button>

                  <label className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 font-semibold cursor-pointer transition-colors shadow-sm">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload de Foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>

                  <input
                    type="url"
                    placeholder="Ou cole a URL direta de uma imagem..."
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    className="flex-1 min-w-[220px] px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>

                {stockMessage && (
                  <div className="p-2.5 bg-emerald-950/70 border border-emerald-500/40 rounded-xl text-emerald-200 text-xs flex items-center gap-2 animate-fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{stockMessage}</span>
                  </div>
                )}

                {coverImage && (
                  <div className="flex items-center gap-3 mt-2">
                    <div className="aspect-[16/9] w-32 rounded-xl overflow-hidden border border-slate-700 shadow-md bg-slate-950">
                      <img src={coverImage} alt="Preview da Capa" className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-xl w-fit">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Capa pronta</span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate max-w-sm md:max-w-md">
                        {coverImage}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Conteúdo Completo com RichTextEditor */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Conteúdo Completo do Artigo <span className="text-sky-400">*</span>
                  </label>
                  <span className="text-[11px] text-sky-400 font-medium">
                    Editor Rico Completo com Mídias Inline
                  </span>
                </div>
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Escreva ou edite o conteúdo completo do artigo, teses jurídicas, doutrina, jurisprudência e insira mídias..."
                  minHeight="320px"
                />
              </div>

              {/* Destaque na Home */}
              <div className="flex items-center gap-2.5 p-3 bg-slate-900/40 border border-slate-800 rounded-xl">
                <input
                  type="checkbox"
                  id="editIsFeatured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 bg-slate-900 border-slate-700"
                />
                <label htmlFor="editIsFeatured" className="text-xs text-slate-300 font-medium cursor-pointer">
                  Destacar este artigo como matéria principal na Página Inicial (Home)
                </label>
              </div>
            </form>
          </div>

          {/* Rodapé Fixo com Botão Excluir e Salvar */}
          <div className="px-6 py-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between gap-4 sticky bottom-0 z-30">
            {/* Botão Excluir Artigo */}
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/40 border border-red-500/30 text-red-300 hover:text-red-100 text-xs font-semibold transition-colors"
              title="Excluir este artigo"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
              <span>Excluir Artigo</span>
            </button>

            {/* Ações de Salvar e Cancelar */}
            <div className="flex items-center gap-3 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="edit-blog-post-form"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-sky-950/60 transition-all active:scale-95"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Salvar Alterações</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Confirmação de Exclusão estilizado */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Excluir Artigo do Blog"
        message={`Tem certeza que deseja excluir o artigo "${article.title}"? Esta ação removerá o artigo das listagens públicas.`}
        confirmLabel="Sim, Excluir Artigo"
        cancelLabel="Cancelar"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
}
