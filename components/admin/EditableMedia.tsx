'use client';

import React, { useState, useEffect } from 'react';
import { useAdminEditor } from './AdminAuthProvider';
import { useSiteContent } from './SiteContentProvider';
import { saveSiteContent, uploadSiteMedia } from '../../lib/site-content';
import { Camera, Upload, Link2, X, Check, Loader2 } from 'lucide-react';

interface EditableMediaProps {
  page: string;
  section: string;
  fieldKey: string;
  defaultSrc: string;
  alt: string;
  className?: string;
  imgClassName?: string;
}

export default function EditableMedia({
  page,
  section,
  fieldKey,
  defaultSrc,
  alt,
  className = '',
  imgClassName = '',
}: EditableMediaProps) {
  const { isAdmin, isEditing, setStatusMessage } = useAdminEditor();
  const { getContent, updateContent } = useSiteContent();

  const savedSrc = getContent(page, section, fieldKey, defaultSrc);
  const [src, setSrc] = useState<string>(savedSrc);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [urlInput, setUrlInput] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSrc(savedSrc);
  }, [savedSrc]);

  const hasCustomWidth = className.includes('w-');
  const hasCustomHeight = className.includes('h-');
  const baseDim = `${hasCustomWidth ? '' : 'w-full'} ${hasCustomHeight ? '' : 'h-full'}`.trim();
  const wrapperClass = `${baseDim} ${className}`.trim();

  if (!isAdmin || !isEditing) {
    return (
      <div className={wrapperClass}>
        <img src={src} alt={alt} className={imgClassName} />
      </div>
    );
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setStatusMessage('Enviando imagem para o Supabase Storage...');

    const formData = new FormData();
    formData.append('file', file);

    const uploadRes = await uploadSiteMedia(formData);

    if (uploadRes.success && uploadRes.url) {
      // Salva a nova URL na tabela de conteúdos
      const saveRes = await saveSiteContent({
        page,
        section,
        fieldKey,
        value: uploadRes.url,
        contentType: 'image',
      });

      if (saveRes.success) {
        setSrc(uploadRes.url);
        updateContent(page, section, fieldKey, uploadRes.url, undefined, 'image');
        setStatusMessage('Imagem atualizada com sucesso!');
        setTimeout(() => setStatusMessage(null), 2500);
        setModalOpen(false);
      } else {
        setError(saveRes.error || 'Erro ao persistir nova URL da imagem.');
      }
    } else {
      setError(uploadRes.error || 'Falha no upload do arquivo.');
    }

    setIsUploading(false);
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setIsUploading(true);
    setError(null);
    setStatusMessage('Salvando nova imagem...');

    const saveRes = await saveSiteContent({
      page,
      section,
      fieldKey,
      value: urlInput.trim(),
      contentType: 'image',
    });

    setIsUploading(false);

    if (saveRes.success) {
      setSrc(urlInput.trim());
      updateContent(page, section, fieldKey, urlInput.trim(), undefined, 'image');
      setStatusMessage('Imagem atualizada!');
      setTimeout(() => setStatusMessage(null), 2500);
      setModalOpen(false);
      setUrlInput('');
    } else {
      setError(saveRes.error || 'Erro ao salvar URL.');
    }
  };

  return (
    <>
      <div className={`relative group ${wrapperClass} overflow-hidden`}>
        <img src={src} alt={alt} className={imgClassName} />

        {/* Overlay interativo de troca - sempre centralizado na div visível da imagem */}
        <div className="absolute inset-0 w-full h-full bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 rounded z-10 backdrop-blur-[2px]">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setModalOpen(true);
            }}
            className="flex items-center gap-2 px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg shadow-xl text-xs font-semibold uppercase tracking-wider transition-transform active:scale-95 cursor-pointer z-20 pointer-events-auto"
            title="Trocar esta imagem em tempo real"
          >
            <Camera className="w-4 h-4" />
            <span>Trocar Imagem</span>
          </button>
          <span className="text-[10px] text-slate-300 font-sans tracking-wide">
            Live Upload (Supabase Storage)
          </span>
        </div>
      </div>

      {/* Modal Flutuante para Upload / Seleção de Imagem */}
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
              <Camera className="w-5 h-5 text-sky-400" />
              Editar Imagem em Tempo Real
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Seção: <strong className="text-slate-300">{section}</strong> • Campo: <strong className="text-slate-300">{fieldKey}</strong>
            </p>

            {error && (
              <div className="mb-4 p-3 bg-rose-950/60 border border-rose-800/80 rounded text-rose-200 text-xs">
                {error}
              </div>
            )}

            {/* Opção 1: Upload de Arquivo Local */}
            <div className="mb-5">
              <label className="block text-xs font-medium text-slate-300 mb-2">
                1. Enviar nova imagem do computador:
              </label>
              <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-slate-700 hover:border-sky-500 rounded-lg cursor-pointer bg-slate-900/60 hover:bg-slate-800/60 transition-colors">
                {isUploading ? (
                  <div className="flex flex-col items-center gap-2 text-sky-400">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="text-xs">Enviando para nuvem...</span>
                  </div>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-slate-400 mb-2" />
                    <span className="text-xs font-medium text-slate-200">
                      Clique para escolher o arquivo
                    </span>
                    <span className="text-[10px] text-slate-500 mt-0.5">
                      PNG, JPG, WebP ou SVG (Até 5MB)
                    </span>
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

            {/* Divisor */}
            <div className="flex items-center gap-2 my-4 text-[10px] text-slate-500 uppercase tracking-widest">
              <div className="flex-1 h-px bg-slate-800"></div>
              <span>ou por link</span>
              <div className="flex-1 h-px bg-slate-800"></div>
            </div>

            {/* Opção 2: Inserir Link Direto */}
            <form onSubmit={handleUrlSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  2. Cole a URL pública da imagem:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    placeholder="https://exemplo.com/foto.jpg"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                  <button
                    type="submit"
                    disabled={isUploading || !urlInput.trim()}
                    className="px-3 py-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded text-xs font-medium flex items-center gap-1 shrink-0"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Aplicar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
