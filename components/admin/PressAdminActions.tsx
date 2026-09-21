'use client';

import React, { useState } from 'react';
import { useAdminEditor } from './AdminAuthProvider';
import { uploadSiteMedia, saveSiteContent } from '../../lib/site-content';
import { PlusCircle, X, Upload, Loader2, Image as ImageIcon, Video, Sparkles, FileText, CheckCircle2, Calendar, Clock } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import { formatForDateTimeInput, formatCardDate } from '../../lib/date-utils';

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export default function PressAdminActions({ onArticleAdded }: { onArticleAdded?: (article: any) => void }) {
  const { isAdmin, isEditing, setStatusMessage } = useAdminEditor();
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [outlet, setOutlet] = useState('');
  const [category, setCategory] = useState('TV & Vídeos');
  const [customCategory, setCustomCategory] = useState('');
  const [publishedDateTime, setPublishedDateTime] = useState(() => formatForDateTimeInput(new Date().toISOString()));
  const [date, setDate] = useState(() => formatCardDate(new Date().toISOString()));
  const [featuredImage, setFeaturedImage] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'youtube' | 'video'>('image');
  const [youtubeId, setYoutubeId] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [richContent, setRichContent] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  if (!isAdmin || !isEditing) {
    return null;
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(val));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isGallery = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatusMessage('Enviando mídia para o Supabase Storage...');
    const formData = new FormData();
    formData.append('file', file);

    const res = await uploadSiteMedia(formData);
    if (res.success && res.url) {
      if (isGallery) {
        setGalleryImages((prev) => [...prev, res.url!]);
      } else {
        setFeaturedImage(res.url);
      }
      setStatusMessage('Mídia carregada com sucesso!');
      setTimeout(() => setStatusMessage(null), 2500);
    } else {
      setError(res.error || 'Falha ao fazer upload da imagem.');
      setTimeout(() => setError(null), 4000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim() || !outlet.trim()) {
      setError('Por favor preencha Título, Slug e Veículo de Imprensa.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setStatusMessage('Salvando nova matéria de imprensa...');

    const finalCategory = category === 'Outra' && customCategory.trim() ? customCategory.trim() : category;
    const isoPublishedAt = publishedDateTime ? new Date(publishedDateTime).toISOString() : new Date().toISOString();
    const formattedCardDate = formatCardDate(isoPublishedAt);

    // Se o usuário escreveu no RichTextEditor, encapsulamos como array de 1 item HTML ou dividimos
    // Para manter compatibilidade total com o leitor:
    const contentPayload = richContent.trim() ? [richContent.trim()] : [excerpt || title];

    const newArticle = {
      slug,
      title,
      outlet,
      category: finalCategory,
      date: formattedCardDate,
      publishedAt: isoPublishedAt,
      featuredImage: featuredImage || '/img/estrutura/fachada.jpg',
      youtubeId: mediaType === 'youtube' && youtubeId.trim() ? youtubeId.trim() : null,
      paragraphs: contentPayload,
      bodyImages: galleryImages,
      excerpt: excerpt || title,
    };

    // Salva na tabela site_contents sob a chave imprensa.custom_articles.<slug>
    const saveRes = await saveSiteContent({
      page: 'imprensa',
      section: 'custom_articles',
      fieldKey: slug,
      value: JSON.stringify(newArticle),
      contentType: 'list',
      metadata: { slug, title, category: finalCategory, date: formattedCardDate, publishedAt: isoPublishedAt },
    });

    setIsSubmitting(false);

    if (saveRes.success) {
      setStatusMessage('Matéria publicada com sucesso!');
      if (onArticleAdded) {
        onArticleAdded(newArticle);
      }
      // Limpa formulário
      setTitle('');
      setSlug('');
      setOutlet('');
      setExcerpt('');
      setRichContent('');
      setFeaturedImage('');
      setYoutubeId('');
      setGalleryImages([]);
      setModalOpen(false);
      setTimeout(() => setStatusMessage(null), 2500);
    } else {
      setError(saveRes.error || 'Falha ao salvar matéria.');
      setStatusMessage(null);
    }
  };

  return (
    <>
      <div className="flex justify-center mb-8">
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-full shadow-lg shadow-sky-900/30 transition-all active:scale-95 text-sm"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Adicionar Novo Artigo de Imprensa</span>
        </button>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
          {/* Container do Modal Responsivo e Elegante */}
          <div className="bg-[#0b1320] border border-slate-700/80 text-slate-100 rounded-3xl w-full max-w-5xl my-auto shadow-2xl overflow-hidden relative flex flex-col max-h-[92vh]">
            {/* Header Fixo */}
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-serif font-bold text-white leading-tight">
                    Publicar Nova Matéria na Sala de Imprensa
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Editor avançado com suporte a mídias, vídeos e formatação em tempo real
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
                title="Fechar (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Corpo com Scroll Suave */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-sm flex-1 custom-scrollbar">
              {error && (
                <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-red-200 text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                  <span>{error}</span>
                </div>
              )}

              <form id="press-article-form" onSubmit={handleSubmit} className="space-y-6">
                {/* Metadados Principais em Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                  <div className="md:col-span-8 space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Título da Matéria <span className="text-sky-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={handleTitleChange}
                      placeholder="Ex: Entrevista do Dr. Eduardo Veríssimo sobre Responsabilidade Médica"
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-sm font-medium"
                    />
                  </div>

                  <div className="md:col-span-4 space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Veículo de Imprensa <span className="text-sky-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={outlet}
                      onChange={(e) => setOutlet(e.target.value)}
                      placeholder="Ex: Band News TV, SBT, Estadão"
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-sm"
                    />
                  </div>

                  <div className="md:col-span-6 space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Slug da URL <span className="text-slate-500 font-normal">(gerado automaticamente)</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => setSlug(generateSlug(e.target.value))}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-slate-300 font-mono text-xs focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                  </div>

                  <div className="md:col-span-3 space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Categoria
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-white text-xs focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    >
                      <option value="TV & Vídeos">TV & Vídeos</option>
                      <option value="Jornais & Imprensa">Jornais & Imprensa</option>
                      <option value="Revistas & Publicações">Revistas & Publicações</option>
                      <option value="Premiações & Homenagens">Premiações & Homenagens</option>
                      <option value="Outra">+ Nova Categoria...</option>
                    </select>
                    {category === 'Outra' && (
                      <input
                        type="text"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        placeholder="Nome da categoria"
                        className="mt-1.5 w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                      />
                    )}
                  </div>

                  <div className="md:col-span-3 space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Data e Horário</span>
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
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-white text-xs focus:border-sky-500 focus:ring-1 focus:ring-sky-500 [color-scheme:dark]"
                    />
                  </div>
                </div>

                {/* Mídia de Capa do Artigo */}
                <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Mídia Principal de Capa
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setMediaType('image')}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                          mediaType === 'image' ? 'bg-sky-600 border-sky-400 text-white' : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                        }`}
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Foto de Capa</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setMediaType('youtube')}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                          mediaType === 'youtube' ? 'bg-red-600 border-red-400 text-white' : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
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
                        placeholder="Ex: rPeCb88Rnrk (ou o link completo do YouTube: https://youtu.be/rPeCb88Rnrk)"
                        className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-sky-400 text-xs font-mono"
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
                          <span className="truncate max-w-[240px]">Foto carregada com sucesso</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Resumo / Linha Fina */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Resumo da Matéria / Linha Fina <span className="text-slate-500 font-normal">(exibido no card e no topo da matéria)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Breve resumo atraente da matéria para os visitantes da Sala de Imprensa..."
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs leading-relaxed"
                  />
                </div>

                {/* Editor Rich Text Estilo Word */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Conteúdo Completo do Artigo
                    </label>
                    <span className="text-[11px] text-sky-400 font-medium">
                      Editor Estilo Word com Imagem e Vídeo Inline
                    </span>
                  </div>

                  <RichTextEditor
                    value={richContent}
                    onChange={setRichContent}
                    placeholder="Comece a redigir o corpo da matéria. Use a barra de ferramentas para criar títulos, listas, citações, e insira fotos ou vídeos diretamente no corpo do texto..."
                    minHeight="320px"
                  />
                </div>

                {/* Galeria de Fotos Adicionais / Recortes de Imprensa */}
                <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Recortes Oficiais de Jornais / Galeria Extra (Opcional)
                      </label>
                      <p className="text-[11px] text-slate-500">
                        Anexe fotos de recortes de jornal, certificados ou fotos do estúdio
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, true)}
                      className="text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-700 file:text-white hover:file:bg-slate-600 cursor-pointer"
                    />
                  </div>

                  {galleryImages.length > 0 && (
                    <div className="flex gap-3 mt-2 overflow-x-auto py-2">
                      {galleryImages.map((img, i) => (
                        <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-700 flex-shrink-0 group">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setGalleryImages((prev) => prev.filter((_, idx) => idx !== i))}
                            className="absolute top-1 right-1 bg-red-600 hover:bg-red-500 text-white rounded-full p-1 shadow-md transition-colors"
                            title="Remover foto"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Rodapé de Ações Fixo */}
            <div className="px-6 py-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between gap-4 sticky bottom-0 z-30">
              <span className="text-xs text-slate-500 hidden sm:inline">
                A publicação salva imediatamente no Live CMS
              </span>
              <div className="flex items-center gap-3 ml-auto">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  form="press-article-form"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-sky-900/30 transition-all disabled:opacity-50 active:scale-95"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{isSubmitting ? 'Salvando Matéria...' : 'Publicar Matéria'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
