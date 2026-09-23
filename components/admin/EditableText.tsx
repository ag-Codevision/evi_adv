'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAdminEditor } from './AdminAuthProvider';
import { useSiteContent } from './SiteContentProvider';
import { saveSiteContent } from '../../lib/site-content';
import { Check, Edit2 } from 'lucide-react';

interface EditableTextProps {
  page: string;
  section: string;
  fieldKey: string;
  defaultContent: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'strong' | 'small' | 'em' | 'b' | 'label' | 'blockquote';
  className?: string;
  multiline?: boolean;
}

export default function EditableText({
  page,
  section,
  fieldKey,
  defaultContent,
  as: Component = 'p',
  className = '',
  multiline = false,
}: EditableTextProps) {
  const { isAdmin, isEditing, setStatusMessage } = useAdminEditor();
  const { getContent, updateContent } = useSiteContent();

  const savedContent = getContent(page, section, fieldKey, defaultContent);
  const [content, setContent] = useState<string>(savedContent);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [justSaved, setJustSaved] = useState<boolean>(false);
  const elementRef = useRef<HTMLElement>(null);

  // Sincroniza se o conteúdo salvo no banco ou o defaultContent mudar
  useEffect(() => {
    setContent(savedContent);
  }, [savedContent]);

  // Se o visitante for comum ou o modo de edição estiver desligado, renderiza texto estático limpo
  if (!isAdmin || !isEditing) {
    return <Component className={className}>{content}</Component>;
  }

  const handleBlur = async () => {
    if (!elementRef.current) return;
    const newText = elementRef.current.innerText.trim();

    if (newText === content) return;

    setIsSaving(true);
    setStatusMessage('Salvando texto...');

    const res = await saveSiteContent({
      page,
      section,
      fieldKey,
      value: newText,
      contentType: 'text',
    });

    setIsSaving(false);

    if (res.success) {
      setContent(newText);
      updateContent(page, section, fieldKey, newText, undefined, 'text');
      setJustSaved(true);
      setStatusMessage(null);
      setTimeout(() => setJustSaved(false), 2000);
    } else {
      setStatusMessage(`Erro ao salvar: ${res.error || 'Falha'}`);
      setTimeout(() => setStatusMessage(null), 3500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!multiline && e.key === 'Enter') {
      e.preventDefault();
      elementRef.current?.blur();
    }
  };

  return (
    <div className="relative group inline-block w-full">
      <Component
        ref={elementRef as any}
        contentEditable
        suppressContentEditableWarning
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`${className} outline-dashed outline-1 outline-sky-400/50 hover:outline-sky-400 hover:bg-sky-500/5 transition-all duration-150 rounded px-1 -mx-1 cursor-text focus:outline-2 focus:outline-sky-400 focus:bg-sky-500/10`}
        title="Clique para editar este texto diretamente na página"
      >
        {content}
      </Component>

      {/* Indicador flutuante de edição */}
      <span className="absolute -top-3 -right-2 hidden group-hover:flex items-center gap-1 bg-sky-600 text-white text-[9px] px-1.5 py-0.5 rounded shadow pointer-events-none z-10 uppercase tracking-wider font-sans font-medium">
        {isSaving ? (
          'Salvando...'
        ) : justSaved ? (
          <>
            <Check className="w-2.5 h-2.5 text-emerald-300" />
            Salvo
          </>
        ) : (
          <>
            <Edit2 className="w-2.5 h-2.5" />
            Editar
          </>
        )}
      </span>
    </div>
  );
}
