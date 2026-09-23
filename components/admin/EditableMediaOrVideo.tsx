'use client';

import React, { useState, useEffect } from 'react';
import { useAdminEditor } from './AdminAuthProvider';
import { useSiteContent } from './SiteContentProvider';
import { saveSiteContent, uploadSiteMedia } from '../../lib/site-content';
import { Camera, Video, Upload, Link2, X, Check, Loader2, Smile } from 'lucide-react';

interface EditableMediaOrVideoProps {
  page: string;
  section: string;
  fieldKey: string;
  defaultType?: 'image' | 'video' | 'icon';
  defaultSrc?: string;
  defaultIcon?: string;
  alt?: string;
  className?: string;
  compact?: boolean;
  allowVideo?: boolean;
  modalTitle?: string;
}

function getEmbedUrl(url: string): string {
  try {
    if (!url) return '';
    if (url.includes('youtube.com/embed/')) return url;
    if (url.includes('watch?v=')) {
      const videoId = url.split('watch?v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  } catch {
    return url;
  }
}

export default function EditableMediaOrVideo({
  page,
  section,
  fieldKey,
  defaultType = 'icon',
  defaultSrc = '',
  defaultIcon = '📚',
  alt = 'Mídia',
  className = '',
  compact = false,
  allowVideo = true,
  modalTitle = 'Personalizar Ícone / Mídia',
}: EditableMediaOrVideoProps) {
  const { isAdmin, isEditing, setStatusMessage } = useAdminEditor();
  const { getContentItem, updateContent } = useSiteContent();

  const item = getContentItem(page, section, fieldKey);
  const savedType = (item?.metadata?.mediaType || (item?.contentType === 'video' ? 'video' : item?.contentType === 'image' ? 'image' : undefined)) as ('image' | 'video' | 'icon' | undefined);
  const effectiveType = savedType || defaultType;
  const effectiveSrc = (effectiveType !== 'icon' && item?.value) ? item.value : defaultSrc;
  const effectiveIcon = (effectiveType === 'icon' && item?.value) ? item.value : defaultIcon;

  const [mediaType, setMediaType] = useState<'image' | 'video' | 'icon'>(effectiveType);
  const [mediaSrc, setMediaSrc] = useState<string>(effectiveSrc);
  const [currentIcon, setCurrentIcon] = useState<string>(effectiveIcon);
  const [modalOpen, setModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states no modal
  const [selectedType, setSelectedType] = useState<'image' | 'video' | 'icon'>(effectiveType);
  const [inputUrl, setInputUrl] = useState('');
  const [customEmoji, setCustomEmoji] = useState(effectiveIcon);

  useEffect(() => {
    setMediaType(effectiveType);
    setMediaSrc(effectiveSrc);
    setCurrentIcon(effectiveIcon);
  }, [effectiveType, effectiveSrc, effectiveIcon]);

  const handleOpenModal = () => {
    setSelectedType(mediaType);
    setInputUrl(mediaSrc);
    setCustomEmoji(currentIcon);
    setError(null);
    setModalOpen(true);
  };

  const handleSave = async (
    typeToSave: 'image' | 'video' | 'icon',
    valueToSave: string
  ) => {
    setIsUploading(true);
    setError(null);
    setStatusMessage('Salvando mídia...');

    const res = await saveSiteContent({
      page,
      section,
      fieldKey,
      value: valueToSave,
      contentType: typeToSave === 'video' ? 'video' : typeToSave === 'image' ? 'image' : 'text',
      metadata: { mediaType: typeToSave },
    });

    setIsUploading(false);

    if (res.success) {
      setMediaType(typeToSave);
      if (typeToSave === 'icon') {
        setCurrentIcon(valueToSave);
      } else {
        setMediaSrc(valueToSave);
      }
      updateContent(
        page,
        section,
        fieldKey,
        valueToSave,
        { mediaType: typeToSave },
        typeToSave === 'video' ? 'video' : typeToSave === 'image' ? 'image' : 'text'
      );
      setStatusMessage('Atualizado com sucesso!');
      setTimeout(() => setStatusMessage(null), 2500);
      setModalOpen(false);
    } else {
      setError(res.error || 'Erro ao salvar mídia.');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setStatusMessage('Enviando arquivo para o Supabase...');

    const formData = new FormData();
    formData.append('file', file);

    const uploadRes = await uploadSiteMedia(formData);

    if (uploadRes.success && uploadRes.url) {
      const isVideoFile = file.type.startsWith('video/');
      const detectedType = isVideoFile && allowVideo ? 'video' : 'image';
      await handleSave(detectedType, uploadRes.url);
    } else {
      setIsUploading(false);
      setError(uploadRes.error || 'Falha ao enviar arquivo.');
    }
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim() && selectedType !== 'icon') return;
    await handleSave(selectedType, inputUrl.trim());
  };

  const handleIconSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmoji.trim()) return;
    await handleSave('icon', customEmoji.trim());
  };

  // Renderização do elemento visual
  const renderVisual = () => {
    if (mediaType === 'video' && allowVideo) {
      const embed = getEmbedUrl(mediaSrc);
      const isDirectVideo =
        mediaSrc.endsWith('.mp4') ||
        mediaSrc.endsWith('.webm') ||
        mediaSrc.includes('/storage/v1/object/public/');
      return (
        <div className={`w-full ${compact ? 'max-w-[80px] aspect-square' : 'aspect-[4/3]'} rounded-xl overflow-hidden shadow-lg bg-black relative`}>
          {isDirectVideo ? (
            <video src={mediaSrc} controls className="w-full h-full object-cover" />
          ) : (
            <iframe
              src={embed}
              title={alt}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          )}
        </div>
      );
    }

    if (mediaType === 'image' && mediaSrc) {
      if (compact) {
        return (
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/80 border border-evi-border flex items-center justify-center p-1 shadow-sm">
            <img
              src={mediaSrc}
              alt={alt}
              className="w-full h-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        );
      }

      return (
        <div className="w-full max-h-56 py-1 rounded-xl overflow-hidden flex items-center justify-center">
          <img
            src={mediaSrc}
            alt={alt}
            className="max-h-52 w-auto max-w-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      );
    }

    // Default icon/emoji
    return (
      <div className={`${compact ? 'text-3xl' : 'text-5xl'} block transition-transform duration-300 group-hover:scale-110`}>
        {currentIcon}
      </div>
    );
  };

  return (
    <>
      <div className={`relative group ${className}`}>
        {renderVisual()}

        {/* Overlay ou Botão de Edição quando Admin no Modo Edição */}
        {isAdmin && isEditing && (
          <div
            onClick={handleOpenModal}
            className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-1 rounded-xl z-30 backdrop-blur-[2px] cursor-pointer p-1"
          >
            <button
              type="button"
              className="flex items-center gap-1 px-2.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-md shadow-xl text-[10px] font-semibold uppercase tracking-wider transition-transform active:scale-95"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Trocar</span>
            </button>
            <span className="text-[9px] text-slate-300 font-sans text-center leading-tight">
              Imagem ou Emoji
            </span>
          </div>
        )}
      </div>

      {/* Modal de Escolha e Upload */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 z-[9999999] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#0f172a] border border-slate-700 rounded-2xl max-w-md w-full p-6 text-slate-200 shadow-2xl relative font-sans text-left">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
              <Camera className="w-5 h-5 text-sky-400" />
              {modalTitle}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Escolha se prefere exibir uma Imagem (logo/ícone personalizado) ou Emoji:
            </p>

            {error && (
              <div className="mb-4 p-3 bg-rose-950/60 border border-rose-800 rounded text-rose-200 text-xs">
                {error}
              </div>
            )}

            {/* Seletor de Tipo */}
            <div className={`grid ${allowVideo ? 'grid-cols-3' : 'grid-cols-2'} gap-2 mb-4`}>
              <button
                type="button"
                onClick={() => setSelectedType('image')}
                className={`py-2 px-3 rounded-lg text-xs font-medium border flex flex-col items-center gap-1 transition-all ${
                  selectedType === 'image'
                    ? 'border-sky-500 bg-sky-950/40 text-sky-300'
                    : 'border-slate-700 bg-slate-900/50 text-slate-400 hover:text-white'
                }`}
              >
                <Camera className="w-4 h-4" />
                Imagem / Logo
              </button>
              <button
                type="button"
                onClick={() => setSelectedType('icon')}
                className={`py-2 px-3 rounded-lg text-xs font-medium border flex flex-col items-center gap-1 transition-all ${
                  selectedType === 'icon'
                    ? 'border-sky-500 bg-sky-950/40 text-sky-300'
                    : 'border-slate-700 bg-slate-900/50 text-slate-400 hover:text-white'
                }`}
              >
                <Smile className="w-4 h-4" />
                Emoji / Ícone
              </button>
              {allowVideo && (
                <button
                  type="button"
                  onClick={() => setSelectedType('video')}
                  className={`py-2 px-3 rounded-lg text-xs font-medium border flex flex-col items-center gap-1 transition-all ${
                    selectedType === 'video'
                      ? 'border-sky-500 bg-sky-950/40 text-sky-300'
                      : 'border-slate-700 bg-slate-900/50 text-slate-400 hover:text-white'
                  }`}
                >
                  <Video className="w-4 h-4" />
                  Vídeo
                </button>
              )}
            </div>

            {selectedType === 'icon' && (
              <form onSubmit={handleIconSubmit} className="space-y-4">
                <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 text-center space-y-3">
                  <span className="text-4xl block">{customEmoji || '⭐'}</span>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Digite ou cole o Emoji desejado:
                    </label>
                    <input
                      type="text"
                      value={customEmoji}
                      onChange={(e) => setCustomEmoji(e.target.value)}
                      placeholder="Ex: 🩺, 👨‍👩‍👧‍👦, 🔒..."
                      className="w-28 text-center text-xl py-1.5 border border-slate-700 rounded-lg bg-slate-950 text-white outline-none focus:border-sky-500"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Você pode usar qualquer emoji do teclado (Windows: Win + .)
                  </p>
                  <button
                    type="submit"
                    disabled={isUploading || !customEmoji.trim()}
                    className="w-full py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    Salvar Emoji
                  </button>
                </div>
              </form>
            )}

            {selectedType === 'image' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    1. Enviar arquivo de imagem (do computador):
                  </label>
                  <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-700 hover:border-sky-500 rounded-xl cursor-pointer bg-slate-900/60 hover:bg-slate-800/60 transition-colors">
                    {isUploading ? (
                      <div className="flex flex-col items-center gap-2 text-sky-400">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span className="text-xs">Enviando imagem...</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-slate-400 mb-1" />
                        <span className="text-xs text-slate-200">Clique para enviar imagem</span>
                        <span className="text-[10px] text-slate-500">PNG, SVG, JPG, WebP</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="text-center text-[10px] text-slate-500 uppercase tracking-wider">
                  — ou por URL —
                </div>

                <form onSubmit={handleUrlSubmit} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      placeholder="https://exemplo.com/icone.png"
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
                    />
                    <button
                      type="submit"
                      disabled={isUploading || !inputUrl.trim()}
                      className="px-4 py-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-lg text-xs font-medium shrink-0"
                    >
                      Salvar
                    </button>
                  </div>
                </form>
              </div>
            )}

            {allowVideo && selectedType === 'video' && (
              <div className="space-y-4">
                <form onSubmit={handleUrlSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Link do Vídeo no YouTube:
                    </label>
                    <input
                      type="url"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isUploading || !inputUrl.trim()}
                      className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-lg text-xs font-medium flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Salvar Vídeo
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
