'use client';

import React, { useState } from 'react';
import { useAdminEditor } from './AdminAuthProvider';
import { uploadSiteMedia, saveSiteContent, deleteSiteContent } from '../../lib/site-content';
import { PressArticle } from '../../lib/press-data';
import {
  X,
  Upload,
  Loader2,
  Image as ImageIcon,
  Video,
  FileText,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Clock,
  Pin
} from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import ConfirmModal from './ConfirmModal';
import { formatForDateTimeInput, formatCardDate } from '../../lib/date-utils';

interface PressArticleEditModalProps {
  article: PressArticle;
  onClose: () => void;
  onSave: (updatedArticle: PressArticle) => void;
  onDelete?: (slug: string) => void;
}

export default function PressArticleEditModal({
  article,
  onClose,
  onSave,
  onDelete,
}: PressArticleEditModalProps) {
  const { setStatusMessage } = useAdminEditor();

  const [title, setTitle] = useState(article.title || '');
  const [outlet, setOutlet] = useState(article.outlet || '');
  const [category, setCategory] = useState(article.category || 'TV & Vídeos');
  const [customCategory, setCustomCategory] = useState('');
  const [date, setDate] = useState(article.date || '');
  const [publishedDateTime, setPublishedDateTime] = useState(() =>
    formatForDateTimeInput(article.publishedAt || article.date)
  );
  const [featuredImage, setFeaturedImage] = useState(article.featuredImage || '');
  const [mediaType, setMediaType] = useState<'image' | 'youtube'>(
    article.youtubeId ? 'youtube' : 'image'
  );
  const [youtubeId, setYoutubeId] = useState(article.youtubeId || '');
  const [excerpt, setExcerpt] = useState(article.excerpt || '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [richContent, setRichContent] = useState(() => {
    if (article.paragraphs && article.paragraphs.length > 0) {
      return article.paragraphs.join('\n\n');
    }
    return '';
  });
  const [galleryImages, setGalleryImages] = useState<string[]>(article.bodyImages || []);
  const [pinned, setPinned] = useState<boolean>(article.pinned || false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isGallery = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatusMessage('Enviando imagem para o Supabase Storage...');
    const formData = new FormData();
    formData.append('file', file);

    const res = await uploadSiteMedia(formData);
    if (res.success && res.url) {
      if (isGallery) {
        setGalleryImages((prev) => [...prev, res.url!]);
      } else {
        setFeaturedImage(res.url);
      }
      setStatusMessage('Imagem carregada com sucesso!');
      setTimeout(() => setStatusMessage(null), 2500);
    } else {
      setError(res.error || 'Falha ao enviar imagem.');
      setTimeout(() => setError(null), 4000);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !outlet.trim()) {
      setError('Por favor preencha Título e Veículo de Imprensa.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setStatusMessage('Salvando alterações no banco de dados...');

    const finalCategory = category === 'Outra' && customCategory.trim() ? customCategory.trim() : category;
    const contentPayload = richContent.trim() ? [richContent.trim()] : [excerpt || title];
    const isoPublishedAt = publishedDateTime ? new Date(publishedDateTime).toISOString() : (article.publishedAt || new Date().toISOString());
    const formattedCardDate = formatCardDate(isoPublishedAt);

    const updatedArticle: PressArticle = {
      ...article,
      title,
      outlet,
      category: finalCategory,
      date: formattedCardDate,
      publishedAt: isoPublishedAt,
      featuredImage: featuredImage || article.featuredImage || '/img/estrutura/fachada.jpg',
      youtubeId: mediaType === 'youtube' && youtubeId.trim() ? youtubeId.trim() : null,
      paragraphs: contentPayload,
      bodyImages: galleryImages,
      excerpt: excerpt || title,
      pinned,
    };

    // Salva no banco de dados Supabase
    const saveRes = await saveSiteContent({
      page: 'imprensa',
      section: 'custom_articles',
      fieldKey: article.slug,
      value: JSON.stringify(updatedArticle),
      contentType: 'list',
      metadata: { slug: article.slug, title, category: finalCategory, date: formattedCardDate, publishedAt: isoPublishedAt, pinned },
    });

    setIsSubmitting(false);

    if (saveRes.success) {
      setStatusMessage('Matéria atualizada com sucesso no banco de dados!');
      onSave(updatedArticle);
      onClose();
      setTimeout(() => setStatusMessage(null), 2500);
    } else {
      setError(saveRes.error || 'Falha ao salvar alterações.');
      setStatusMessage(null);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setStatusMessage('Excluindo matéria do banco de dados...');

    const res = await deleteSiteContent({
      page: 'imprensa',
      section: 'custom_articles',
      fieldKey: article.slug,
    });

    setIsDeleting(false);
    setShowDeleteConfirm(false);

    if (res.success) {
      setStatusMessage('Matéria excluída com sucesso!');
      if (onDelete) {
        onDelete(article.slug);
      }
      onClose();
      setTimeout(() => setStatusMessage(null), 2500);
    } else {
      setError(res.error || 'Falha ao excluir matéria.');
      setStatusMessage(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-[#0b1320] border border-slate-700/80 text-slate-100 rounded-3xl w-full max-w-5xl my-auto shadow-2xl overflow-hidden relative flex flex-col max-h-[92vh]">
        {/* Header Fixo */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-serif font-bold text-white leading-tight">
                Editar Matéria de Imprensa
              </h2>
              <p className="text-[11px] text-slate-400 font-mono">
                Slug: {article.slug}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário com Scroll */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-sm flex-1 custom-scrollbar">
          {error && (
            <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-red-200 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form id="edit-press-form" onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              <div className="md:col-span-8 space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Título da Matéria *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-sm font-medium"
                />
              </div>

              <div className="md:col-span-4 space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Veículo de Imprensa *
                </label>
                <input
                  type="text"
                  required
                  value={outlet}
                  onChange={(e) => setOutlet(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-sm"
                />
              </div>

              <div className="md:col-span-6 space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Categoria
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-white text-xs focus:border-sky-500"
                >
                  <option value="TV & Vídeos">TV & Vídeos</option>
                  <option value="Jornais & Imprensa">Jornais & Imprensa</option>
                  <option value="Revistas & Publicações">Revistas & Publicações</option>
                  <option value="Premiações & Homenagens">Premiações & Homenagens</option>
                  <option value="Outra">+ Outra Categoria...</option>
                </select>
                {category === 'Outra' && (
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Digite o nome da categoria"
                    className="mt-1.5 w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                  />
                )}
              </div>

              <div className="md:col-span-6 space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Data e Horário de Publicação</span>
                </label>
                <input
                  type="datetime-local"
                  value={publishedDateTime}
                  onChange={(e) => {
                    setPublishedDateTime(e.target.value);
                    if (e.target.value) {
                      setDate(formatCardDate(e.target.value));
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-white text-xs focus:border-sky-500 [color-scheme:dark]"
                />
              </div>
            </div>

            {/* Opção de Fixar Matéria no Topo */}
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                  <Pin className={`w-4 h-4 ${pinned ? 'fill-amber-400' : ''}`} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-200">Fixar matéria no topo da Sala de Imprensa</h4>
                  <p className="text-[11px] text-slate-400">Artigos fixados aparecem sempre em primeiro lugar na página, antes dos demais.</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={pinned}
                  onChange={(e) => setPinned(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            {/* Mídia de Capa */}
            <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Mídia Principal de Capa
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setMediaType('image')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border ${
                      mediaType === 'image' ? 'bg-sky-600 border-sky-400 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Foto de Capa</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaType('youtube')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border ${
                      mediaType === 'youtube' ? 'bg-red-600 border-red-400 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Vídeo YouTube</span>
                  </button>
                </div>
              </div>

              {mediaType === 'youtube' ? (
                <div className="pt-2">
                  <input
                    type="text"
                    value={youtubeId}
                    onChange={(e) => setYoutubeId(e.target.value)}
                    placeholder="ID do vídeo ou URL do YouTube"
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-mono"
                  />
                </div>
              ) : (
                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, false)}
                    className="text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-sky-600 file:text-white hover:file:bg-sky-500 cursor-pointer"
                  />
                  {featuredImage && (
                    <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="truncate max-w-[240px]">Foto de capa selecionada</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Resumo */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Resumo / Linha Fina
              </label>
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-white text-xs leading-relaxed focus:border-sky-500"
              />
            </div>

            {/* Rich Text Editor */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Conteúdo do Artigo (Editor Estilo Word com Imagem e Vídeo Inline)
              </label>
              <RichTextEditor
                value={richContent}
                onChange={setRichContent}
                minHeight="320px"
              />
            </div>
          </form>
        </div>

        {/* Rodapé Fixo de Ações com Botão Excluir */}
        <div className="px-6 py-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between gap-4 sticky bottom-0 z-30">
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isDeleting || isSubmitting}
            className="flex items-center gap-1.5 px-4 py-2 bg-red-950/70 hover:bg-red-900 text-red-300 hover:text-white border border-red-800/80 text-xs font-semibold rounded-xl transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Excluir Matéria</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="edit-press-form"
              disabled={isSubmitting || isDeleting}
              className="flex items-center gap-2 px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-sky-900/30 transition-all disabled:opacity-50 active:scale-95"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isSubmitting ? 'Salvando...' : 'Salvar Alterações'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Confirmação Personalizado */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Excluir Matéria de Imprensa"
        message={`Tem certeza que deseja excluir permanentemente a matéria "${article.title}"? Esta ação removerá o artigo do banco de dados.`}
        confirmLabel="Sim, Excluir Matéria"
        cancelLabel="Cancelar"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}
