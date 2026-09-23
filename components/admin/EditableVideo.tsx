'use client';

import React, { useState, useEffect } from 'react';
import { useAdminEditor } from './AdminAuthProvider';
import { useSiteContent } from './SiteContentProvider';
import { saveSiteContent } from '../../lib/site-content';
import { Video, Check, X, Edit3 } from 'lucide-react';

interface EditableVideoProps {
  page: string;
  section: string;
  fieldKey: string;
  defaultVideoUrl: string;
  title?: string;
  className?: string;
}

// Extrai o ID de vídeo do YouTube e gera a URL de embed compatível
function getEmbedUrl(url: string): string {
  try {
    if (!url) return '';
    if (url.includes('youtube.com/embed/')) return url;

    // Formato youtube.com/watch?v=ID
    if (url.includes('watch?v=')) {
      const videoId = url.split('watch?v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // Formato youtu.be/ID
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    return url;
  } catch {
    return url;
  }
}

export default function EditableVideo({
  page,
  section,
  fieldKey,
  defaultVideoUrl,
  title = 'Vídeo em Destaque',
  className = '',
}: EditableVideoProps) {
  const { isAdmin, isEditing, setStatusMessage } = useAdminEditor();
  const { getContent, updateContent } = useSiteContent();

  const savedVideoUrl = getContent(page, section, fieldKey, defaultVideoUrl);
  const [videoUrl, setVideoUrl] = useState<string>(savedVideoUrl);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [inputUrl, setInputUrl] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setVideoUrl(savedVideoUrl);
  }, [savedVideoUrl]);

  const embedUrl = getEmbedUrl(videoUrl);

  if (!isAdmin || !isEditing) {
    return (
      <div className={`relative aspect-video w-full rounded-xl overflow-hidden shadow-2xl bg-black ${className}`}>
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;

    setIsSaving(true);
    setError(null);
    setStatusMessage('Atualizando vídeo...');

    const res = await saveSiteContent({
      page,
      section,
      fieldKey,
      value: inputUrl.trim(),
      contentType: 'video',
    });

    setIsSaving(false);

    if (res.success) {
      setVideoUrl(inputUrl.trim());
      updateContent(page, section, fieldKey, inputUrl.trim(), undefined, 'video');
      setStatusMessage('Vídeo atualizado com sucesso!');
      setTimeout(() => setStatusMessage(null), 2500);
      setModalOpen(false);
      setInputUrl('');
    } else {
      setError(res.error || 'Erro ao atualizar vídeo.');
    }
  };

  return (
    <>
      <div className={`relative group aspect-video w-full rounded-xl overflow-hidden shadow-2xl bg-black ${className}`}>
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
        />

        {/* Botão flutuante de edição sobre o player */}
        <div className="absolute top-3 right-3 z-30 opacity-90 hover:opacity-100 transition-opacity">
          <button
            onClick={() => {
              setInputUrl(videoUrl);
              setModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0c1524]/95 hover:bg-sky-600 text-slate-100 hover:text-white rounded-md shadow-2xl border border-slate-700/80 text-xs font-medium backdrop-blur-md transition-all active:scale-95"
            title="Alterar link deste vídeo"
          >
            <Edit3 className="w-3.5 h-3.5 text-sky-400" />
            <span>Alterar Vídeo</span>
          </button>
        </div>
      </div>

      {/* Modal para Troca de Vídeo */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 z-[999999] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#0f172a] border border-slate-700 rounded-xl max-w-md w-full p-6 text-slate-200 shadow-2xl relative font-sans">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
              <Video className="w-5 h-5 text-sky-400" />
              Editar Vídeo em Tempo Real
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Seção: <strong className="text-slate-300">{section}</strong> • Campo: <strong className="text-slate-300">{fieldKey}</strong>
            </p>

            {error && (
              <div className="mb-4 p-3 bg-rose-950/60 border border-rose-800/80 rounded text-rose-200 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Link do Vídeo no YouTube (ou embed):
                </label>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
                <span className="block text-[10px] text-slate-500 mt-1">
                  Exemplos suportados: youtube.com/watch?v=ID ou youtu.be/ID
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 rounded text-xs text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving || !inputUrl.trim()}
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded text-xs font-medium flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  {isSaving ? 'Salvando...' : 'Atualizar Vídeo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
