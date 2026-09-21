'use client';

import React, { useState } from 'react';
import { useAdminEditor } from './AdminAuthProvider';
import { upsertPostAction } from '../../lib/posts-actions';
import { uploadSiteMedia } from '../../lib/site-content';
import { PlusCircle, X, Check, Upload, Sparkles, Loader2, BookOpen, CheckCircle2, Bot } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import BlogAiAssistantModal from './BlogAiAssistantModal';

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export default function BlogAdminActions() {
  const { isAdmin, isEditing, setStatusMessage } = useAdminEditor();
  const [modalOpen, setModalOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Campos do formulário
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [readingTime, setReadingTime] = useState(5);
  const [isFeatured, setIsFeatured] = useState(false);

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
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !content) {
      setError('Por favor preencha os campos obrigatórios (Título, Slug e Conteúdo).');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setStatusMessage('Publicando novo artigo no Supabase...');

    const res = await upsertPostAction({
      title,
      slug,
      excerpt: excerpt || title,
      content,
      cover_image: coverImage || '/img/imprensa/nani-venancio.jpg',
      reading_time: Number(readingTime) || 5,
      is_featured: isFeatured,
    });

    setIsSubmitting(false);

    if (res.success) {
      setStatusMessage('Artigo publicado com sucesso!');
      setTimeout(() => setStatusMessage(null), 2500);
      setModalOpen(false);
      window.location.reload();
    } else {
      setError(res.error || 'Erro ao publicar artigo.');
    }
  };

  return (
    <>
      {/* Botões de Ação do Blog */}
      <div className="mb-6 flex flex-wrap items-center justify-end gap-3">
        {/* Botão do Assistente de IA */}
        <button
          type="button"
          onClick={() => setAiModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-semibold text-xs tracking-wider uppercase shadow-xl shadow-sky-950/40 border border-sky-400/40 transition-all hover:scale-105 active:scale-95"
        >
          <Bot className="w-4 h-4 text-sky-200" />
          <span>Assistente de IA & Automação</span>
        </button>

        {/* Botão de Criação Manual */}
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs tracking-wider uppercase shadow-xl shadow-emerald-950/40 border border-emerald-400/40 transition-all hover:scale-105 active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Publicar Manualmente</span>
        </button>
      </div>

      {/* Modal de Criação de Post no Blog - Sem Cortes, Amplo e Responsivo */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 z-[9999999] flex items-center justify-center p-3 md:p-6 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="bg-[#0b1320] border border-slate-700/80 rounded-3xl max-w-5xl w-full my-auto text-slate-100 shadow-2xl relative flex flex-col max-h-[92vh] overflow-hidden font-sans">
            {/* Header Fixo */}
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-serif font-bold text-white leading-tight">
                    Novo Artigo do Blog Jurídico
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Live CMS • Editor rico completo com inserção de mídias e fotos
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

            {/* Corpo com Scroll Independente */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-sm flex-1 custom-scrollbar">
              {error && (
                <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-red-200 text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                  <span>{error}</span>
                </div>
              )}

              <form id="blog-post-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                  <div className="md:col-span-8 space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Título do Artigo <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Recuperação Judicial no Agronegócio: Como Proteger a Safra"
                      value={title}
                      onChange={handleTitleChange}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium"
                    />
                  </div>

                  <div className="md:col-span-4 space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Tempo de Leitura (Minutos)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={readingTime}
                      onChange={(e) => setReadingTime(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="md:col-span-12 space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Slug da URL <span className="text-slate-500 font-normal">(gerado automaticamente)</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-slate-300 font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Resumo / Linha Fina (Excerpt)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Breve resumo explicativo sobre a tese jurídica para exibição nos cards..."
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 leading-relaxed"
                  />
                </div>

                {/* Upload de Imagem de Capa */}
                <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl space-y-3">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Imagem de Capa do Artigo
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs text-white font-semibold cursor-pointer transition-colors shadow-md">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Fazer Upload da Foto</span>
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
                      className="flex-1 min-w-[240px] px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  {coverImage && (
                    <div className="flex items-center gap-3 mt-2">
                      <div className="aspect-[16/9] w-28 rounded-xl overflow-hidden border border-slate-700">
                        <img src={coverImage} alt="Preview da Capa" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Capa pronta para publicação</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Conteúdo com RichTextEditor Estilo Word */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Conteúdo Completo do Artigo <span className="text-emerald-400">*</span>
                    </label>
                    <span className="text-[11px] text-emerald-400 font-medium">
                      Editor Estilo Word com Imagem e Vídeo Inline
                    </span>
                  </div>
                  <RichTextEditor
                    value={content}
                    onChange={setContent}
                    placeholder="Escreva a análise doutrinária, tese ou artigo jurídico. Use a barra de ferramentas para formatação, listas, citações, e insira fotos e vídeos diretamente..."
                    minHeight="320px"
                  />
                </div>

                {/* Destaque */}
                <div className="flex items-center gap-2.5 p-3 bg-slate-900/40 border border-slate-800 rounded-xl">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-slate-900 border-slate-700"
                  />
                  <label htmlFor="isFeatured" className="text-xs text-slate-300 font-medium cursor-pointer">
                    Destacar este artigo como matéria principal na Página Inicial (Home)
                  </label>
                </div>
              </form>
            </div>

            {/* Rodapé Fixo */}
            <div className="px-6 py-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between gap-4 sticky bottom-0 z-30">
              <span className="text-xs text-slate-500 hidden sm:inline">
                O artigo será indexado e publicado imediatamente
              </span>
              <div className="flex items-center gap-3 ml-auto">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  form="blog-post-form"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-emerald-950/60 transition-all active:scale-95"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Gravando no Supabase...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Publicar Artigo</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Separado de Configuração do Assistente de IA & Cron */}
      <BlogAiAssistantModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        onArticleGenerated={() => {
          window.location.reload();
        }}
      />
    </>
  );
}
