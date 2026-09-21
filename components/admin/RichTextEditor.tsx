'use client';

import React, { useRef, useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Image as ImageIcon,
  Video,
  Undo,
  Redo,
  Upload,
  Sparkles,
  Code,
  Minus
} from 'lucide-react';
import { uploadSiteMedia } from '../../lib/site-content';
import ConfirmModal from './ConfirmModal';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Escreva ou formate seu texto aqui...',
  className = '',
  minHeight = '280px',
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Executa comandos nativos document.execCommand para edição rica
  const executeCommand = (command: string, arg?: string) => {
    if (typeof document === 'undefined') return;
    document.execCommand(command, false, arg);
    handleInput();
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // Inicializa o conteúdo inicial uma vez
  React.useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      // Só atualiza se estiver vazio e tiver valor inicial
      if (!editorRef.current.innerHTML || editorRef.current.innerHTML === '<br>') {
        editorRef.current.innerHTML = value;
      }
    }
  }, [value]);

  // Manipulador de Upload de Imagem no corpo
  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const res = await uploadSiteMedia(formData);
      if (res.success && res.url) {
        insertImageAtCursor(res.url);
      } else {
        setErrorMessage(res.error || 'Falha ao carregar a imagem.');
      }
    } catch (err: any) {
      setErrorMessage('Erro ao enviar imagem: ' + (err.message || 'Falha inesperada'));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const insertImageAtCursor = (imageUrl: string) => {
    editorRef.current?.focus();
    const imageHtml = `
      <figure class="my-6 rounded-2xl overflow-hidden border border-slate-700/60 bg-slate-900/40 p-1 shadow-md">
        <img src="${imageUrl}" alt="Imagem do artigo" class="w-full h-auto rounded-xl object-contain max-h-[500px] mx-auto block" />
        <figcaption class="text-center text-xs text-slate-400 mt-2 italic">Legenda da imagem (clique para editar)</figcaption>
      </figure>
      <p><br></p>
    `;
    executeCommand('insertHTML', imageHtml);
  };

  // Inserir Vídeo (YouTube embed ou URL)
  const handleInsertVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl.trim()) return;

    let embedUrl = videoUrl.trim();
    // Extrai ID se for do YouTube
    const ytMatch = embedUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (ytMatch && ytMatch[1]) {
      embedUrl = `https://www.youtube-nocookie.com/embed/${ytMatch[1]}`;
    }

    const videoHtml = `
      <div class="my-6 rounded-2xl overflow-hidden border border-slate-700 shadow-lg bg-black aspect-video w-full max-w-3xl mx-auto">
        <iframe src="${embedUrl}" class="w-full h-full" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
      <p><br></p>
    `;

    editorRef.current?.focus();
    executeCommand('insertHTML', videoHtml);
    setVideoUrl('');
    setShowVideoModal(false);
  };

  // Inserir Link
  const handleInsertLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkUrl.trim()) return;

    editorRef.current?.focus();
    executeCommand('createLink', linkUrl.trim());
    setLinkUrl('');
    setShowLinkModal(false);
  };

  return (
    <div className={`flex flex-col border border-slate-700 rounded-xl overflow-hidden bg-slate-900/90 text-slate-100 ${className}`}>
      {/* Barra de Ferramentas Estilo Word */}
      <div className="bg-slate-800/90 border-b border-slate-700/80 px-2 py-2 flex flex-wrap items-center gap-1 text-xs select-none sticky top-0 z-20 backdrop-blur-md">
        {/* Desfazer / Refazer */}
        <div className="flex items-center gap-0.5 pr-1.5 mr-1 border-r border-slate-700">
          <button
            type="button"
            onClick={() => executeCommand('undo')}
            title="Desfazer (Ctrl+Z)"
            className="p-1.5 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('redo')}
            title="Refazer (Ctrl+Y)"
            className="p-1.5 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>

        {/* Títulos / Estilos */}
        <div className="flex items-center gap-0.5 pr-1.5 mr-1 border-r border-slate-700">
          <button
            type="button"
            onClick={() => executeCommand('formatBlock', '<h2>')}
            title="Título Principal (H2)"
            className="px-2 py-1 rounded hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs transition-colors"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => executeCommand('formatBlock', '<h3>')}
            title="Subtítulo (H3)"
            className="px-2 py-1 rounded hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs transition-colors"
          >
            H3
          </button>
          <button
            type="button"
            onClick={() => executeCommand('formatBlock', '<p>')}
            title="Parágrafo Normal"
            className="px-2 py-1 rounded hover:bg-slate-700 text-slate-300 hover:text-white text-xs transition-colors"
          >
            P
          </button>
        </div>

        {/* Formatações Básicas */}
        <div className="flex items-center gap-0.5 pr-1.5 mr-1 border-r border-slate-700">
          <button
            type="button"
            onClick={() => executeCommand('bold')}
            title="Negrito (Ctrl+B)"
            className="p-1.5 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('italic')}
            title="Itálico (Ctrl+I)"
            className="p-1.5 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('underline')}
            title="Sublinhado (Ctrl+U)"
            className="p-1.5 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <Underline className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('strikeThrough')}
            title="Tachado"
            className="p-1.5 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <Strikethrough className="w-4 h-4" />
          </button>
        </div>

        {/* Alinhamentos */}
        <div className="flex items-center gap-0.5 pr-1.5 mr-1 border-r border-slate-700">
          <button
            type="button"
            onClick={() => executeCommand('justifyLeft')}
            title="Alinhar à Esquerda"
            className="p-1.5 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('justifyCenter')}
            title="Centralizar"
            className="p-1.5 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('justifyRight')}
            title="Alinhar à Direita"
            className="p-1.5 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <AlignRight className="w-4 h-4" />
          </button>
        </div>

        {/* Listas & Citação */}
        <div className="flex items-center gap-0.5 pr-1.5 mr-1 border-r border-slate-700">
          <button
            type="button"
            onClick={() => executeCommand('insertUnorderedList')}
            title="Lista com Marcadores"
            className="p-1.5 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('insertOrderedList')}
            title="Lista Numerada"
            className="p-1.5 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('formatBlock', '<blockquote>')}
            title="Citação / Destaque"
            className="p-1.5 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('insertHorizontalRule')}
            title="Linha Divisória"
            className="p-1.5 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Inserir Mídias e Links */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowLinkModal(true)}
            title="Inserir Link"
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-700/80 hover:bg-slate-700 text-sky-400 font-medium transition-colors"
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Link</span>
          </button>

          {/* Botão Inserir Imagem com Upload */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageFile}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            title="Fazer upload e inserir imagem no texto"
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white font-semibold transition-colors disabled:opacity-50"
          >
            {isUploading ? (
              <span className="flex items-center gap-1">
                <Upload className="w-3.5 h-3.5 animate-bounce" />
                <span>Enviando...</span>
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Inserir Imagem</span>
              </span>
            )}
          </button>

          {/* Botão Inserir Vídeo */}
          <button
            type="button"
            onClick={() => setShowVideoModal(true)}
            title="Inserir Vídeo do YouTube no corpo do texto"
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-red-600/90 hover:bg-red-600 text-white font-semibold transition-colors"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Inserir Vídeo</span>
          </button>
        </div>
      </div>

      {/* Área Editável ContentEditable */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        style={{ minHeight }}
        data-placeholder={placeholder}
        className="p-4 bg-slate-900/60 focus:outline-none focus:ring-1 focus:ring-sky-500/40 text-slate-100 text-sm leading-relaxed overflow-y-auto max-h-[420px] prose prose-invert prose-sky max-w-none empty:before:content-[attr(data-placeholder)] empty:before:text-slate-500"
      />

      {/* Modal Rápido de Vídeo */}
      {showVideoModal && (
        <div className="fixed inset-0 z-[99999999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 w-full max-w-md shadow-2xl space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Video className="w-4 h-4 text-red-500" />
              Inserir Vídeo no Corpo do Artigo
            </h4>
            <p className="text-xs text-slate-400">
              Cole a URL do YouTube ou link embed para embutir o reprodutor dentro do texto da matéria.
            </p>
            <form onSubmit={handleInsertVideo} className="space-y-3">
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Ex: https://www.youtube.com/watch?v=Xr3xRUsC_zs"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs focus:outline-sky-400 font-mono"
                autoFocus
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowVideoModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-500 text-white rounded-lg"
                >
                  Inserir Vídeo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Rápido de Link */}
      {showLinkModal && (
        <div className="fixed inset-0 z-[99999999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 w-full max-w-md shadow-2xl space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-sky-400" />
              Inserir Hiperlink
            </h4>
            <p className="text-xs text-slate-400">
              Cole a URL de destino para a seleção de texto atual.
            </p>
            <form onSubmit={handleInsertLink} className="space-y-3">
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://exemplo.com.br"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs focus:outline-sky-400 font-mono"
                autoFocus
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white rounded-lg"
                >
                  Inserir Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Aviso / Erro com Estética do Site */}
      <ConfirmModal
        isOpen={Boolean(errorMessage)}
        title="Atenção"
        message={errorMessage || ''}
        confirmLabel="Entendido"
        cancelLabel="Fechar"
        variant="warning"
        onConfirm={() => setErrorMessage(null)}
        onCancel={() => setErrorMessage(null)}
      />
    </div>
  );
}
