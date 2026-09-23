'use client';

import React, { useState, useEffect } from 'react';
import { useAdminEditor } from './AdminAuthProvider';
import { useSiteContent } from './SiteContentProvider';
import { saveSiteContent } from '../../lib/site-content';
import { Edit2, Check, Sparkles, X } from 'lucide-react';
import RichTextEditor from './RichTextEditor';

interface EditableHtmlProps {
  page: string;
  section: string;
  fieldKey: string;
  defaultHtml: string;
  className?: string;
}

export default function EditableHtml({
  page,
  section,
  fieldKey,
  defaultHtml,
  className = '',
}: EditableHtmlProps) {
  const { isAdmin, isEditing, setStatusMessage } = useAdminEditor();
  const { getContent, updateContent } = useSiteContent();

  const savedHtml = getContent(page, section, fieldKey, defaultHtml);
  const [content, setContent] = useState<string>(savedHtml);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [tempContent, setTempContent] = useState<string>(savedHtml);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [justSaved, setJustSaved] = useState<boolean>(false);

  useEffect(() => {
    setContent(savedHtml);
    setTempContent(savedHtml);
  }, [savedHtml]);

  const handleOpenEdit = () => {
    setTempContent(content);
    setEditModalOpen(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setStatusMessage('Salvando conteúdo formatado...');

    const res = await saveSiteContent({
      page,
      section,
      fieldKey,
      value: tempContent,
      contentType: 'html',
    });

    setIsSaving(false);

    if (res.success) {
      setContent(tempContent);
      updateContent(page, section, fieldKey, tempContent, undefined, 'html');
      setJustSaved(true);
      setEditModalOpen(false);
      setStatusMessage('Salvo com sucesso!');
      setTimeout(() => {
        setJustSaved(false);
        setStatusMessage(null);
      }, 2000);
    } else {
      setStatusMessage(`Erro: ${res.error || 'Falha ao salvar'}`);
      setTimeout(() => setStatusMessage(null), 3500);
    }
  };

  // Se o visitante for comum ou edição desligada, renderiza o HTML diretamente
  if (!isAdmin || !isEditing) {
    return (
      <div
        className={className}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  return (
    <div className="relative group my-2">
      <div
        onClick={handleOpenEdit}
        className={`${className} cursor-pointer outline-dashed outline-1 outline-sky-400/50 hover:outline-sky-400 hover:bg-sky-500/5 transition-all duration-150 rounded-xl p-2`}
        title="Clique para abrir o editor de texto completo (estilo Word)"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* Badge de Edição Flutuante */}
      <button
        type="button"
        onClick={handleOpenEdit}
        className="absolute -top-3 -right-2 hidden group-hover:flex items-center gap-1 bg-sky-600 hover:bg-sky-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-lg z-10 transition-colors"
      >
        <Edit2 className="w-3 h-3" />
        <span>Editar Conteúdo com Word</span>
      </button>

      {/* Modal de Edição Rica */}
      {editModalOpen && (
        <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0b1320] border border-slate-700 text-slate-100 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-serif">
                  Editar Conteúdo Formatado
                </h3>
                <p className="text-xs text-slate-400">
                  Formate textos, parágrafos, insira imagens e vídeos em tempo real
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <RichTextEditor
                value={tempContent}
                onChange={setTempContent}
                minHeight="350px"
              />
            </div>

            <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-1.5 px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-lg disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>{isSaving ? 'Salvando...' : 'Salvar Alterações'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
