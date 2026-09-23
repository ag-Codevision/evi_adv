'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useAdminEditor } from './AdminAuthProvider';
import { useSiteContent } from './SiteContentProvider';
import { saveSiteContent } from '../../lib/site-content';
import { Check, Edit2, Link2, ExternalLink, X } from 'lucide-react';

interface EditableLinkProps {
  page: string;
  section: string;
  fieldKey: string;
  defaultLabel: string;
  defaultHref: string;
  className?: string;
  target?: string;
  rel?: string;
  title?: string;
  'aria-label'?: string;
  iconOnly?: boolean;
  children?: React.ReactNode;
}

export default function EditableLink({
  page,
  section,
  fieldKey,
  defaultLabel,
  defaultHref,
  className = '',
  target,
  rel,
  title,
  'aria-label': ariaLabel,
  iconOnly = false,
  children,
}: EditableLinkProps) {
  const { isAdmin, isEditing, setStatusMessage } = useAdminEditor();
  const { getContentItem, updateContent } = useSiteContent();

  const item = getContentItem(page, section, fieldKey);
  const savedLabel = (item && item.value !== undefined && item.value !== null && item.value !== '') ? item.value : defaultLabel;
  const savedHref = item?.metadata?.href || defaultHref;

  const [label, setLabel] = useState<string>(savedLabel);
  const [href, setHref] = useState<string>(savedHref);
  
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [editLabel, setEditLabel] = useState<string>('');
  const [editHref, setEditHref] = useState<string>('');
  const [popoverCoords, setPopoverCoords] = useState<{ top: number; left: number } | null>(null);
  
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [justSaved, setJustSaved] = useState<boolean>(false);
  const triggerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setLabel(savedLabel);
    setHref(savedHref);
  }, [savedLabel, savedHref]);

  const renderContent = () => {
    if (iconOnly) {
      return children || label;
    }
    if (children && label) {
      return (
        <span className="inline-flex items-center gap-2">
          {children}
          <span>{label}</span>
        </span>
      );
    }
    return children || label;
  };

  if (!isAdmin || !isEditing) {
    const content = renderContent();
    // Verifica se o href parece ser interno (começa com / e não é external URL completo)
    const isInternal = href.startsWith('/') || href.startsWith('#');
    
    if (isInternal && (!target || target === '_self')) {
      return (
        <Link href={href} className={className} rel={rel} title={title} aria-label={ariaLabel}>
          {content}
        </Link>
      );
    }
    
    return (
      <a href={href} className={className} target={target} rel={rel} title={title} aria-label={ariaLabel}>
        {content}
      </a>
    );
  }

  const handleOpenPopover = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditLabel(label);
    setEditHref(href);

    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const popoverWidth = 300;
      const popoverHeight = 250;
      
      // Calcula posição horizontal inteligente para não vazar a tela
      let left = rect.left;
      if (left + popoverWidth > window.innerWidth - 16) {
        left = window.innerWidth - popoverWidth - 16;
      }
      if (left < 16) left = 16;

      // Calcula posição vertical (se couber embaixo, põe embaixo; se não, põe em cima)
      let top = rect.bottom + 8;
      if (top + popoverHeight > window.innerHeight && rect.top - popoverHeight > 0) {
        top = rect.top - popoverHeight - 8;
      }

      setPopoverCoords({ top, left });
    }

    setIsPopoverOpen(true);
  };

  const handleClosePopover = () => {
    setIsPopoverOpen(false);
  };

  const handleSave = async () => {
    if (editLabel === label && editHref === href) {
      setIsPopoverOpen(false);
      return;
    }

    setIsSaving(true);
    setStatusMessage('Salvando link...');

    const res = await saveSiteContent({
      page,
      section,
      fieldKey,
      value: editLabel,
      metadata: { href: editHref },
      contentType: 'link',
    });

    setIsSaving(false);

    if (res.success) {
      setLabel(editLabel);
      setHref(editHref);
      updateContent(page, section, fieldKey, editLabel, { href: editHref }, 'link');
      setJustSaved(true);
      setStatusMessage(null);
      setIsPopoverOpen(false);
      setTimeout(() => setJustSaved(false), 2000);
    } else {
      setStatusMessage(`Erro ao salvar: ${res.error || 'Falha'}`);
      setTimeout(() => setStatusMessage(null), 3500);
    }
  };

  const content = renderContent();

  return (
    <div className="relative group inline-block">
      <span
        ref={triggerRef}
        onClick={handleOpenPopover}
        className={`${className} outline-dashed outline-1 outline-sky-400/50 hover:outline-sky-400 hover:bg-sky-500/5 transition-all duration-150 rounded px-1 -mx-1 cursor-pointer focus:outline-2 focus:outline-sky-400`}
        title="Clique para editar este link"
      >
        {content}
      </span>

      {/* Indicador flutuante de edição */}
      {!isPopoverOpen && (
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
              <Link2 className="w-2.5 h-2.5" />
              Editar Link
            </>
          )}
        </span>
      )}

      {/* Popover de Edição com Portal (Renderizado direto no body para nunca cortar) */}
      {isPopoverOpen && popoverCoords && typeof document !== 'undefined' && createPortal(
        <div
          style={{ top: `${popoverCoords.top}px`, left: `${popoverCoords.left}px` }}
          className="fixed w-76 bg-white rounded-xl shadow-2xl border border-slate-200 z-[9999999] p-4 flex flex-col gap-3 font-sans animate-in fade-in duration-100"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-0.5">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-sky-600" />
              Editar Link / Botão
            </span>
            <button
              onClick={handleClosePopover}
              className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600">Texto do Botão / Link</label>
            <input 
              type="text" 
              value={editLabel} 
              onChange={(e) => setEditLabel(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none text-slate-800"
              placeholder="Ex: Saiba Mais"
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600">Destino (URL ou Rota)</label>
            <div className="relative">
              <input 
                type="text" 
                value={editHref} 
                onChange={(e) => setEditHref(e.target.value)}
                className="w-full text-xs p-2.5 pl-8 border border-slate-300 rounded-lg focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none text-slate-800"
                placeholder="https://wa.me/... ou /contato"
              />
              <ExternalLink className="absolute left-2.5 top-3 w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-1 pt-1 border-t border-slate-100">
            <button 
              type="button"
              onClick={handleClosePopover}
              className="text-xs px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="text-xs px-4 py-1.5 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-500 transition-colors flex items-center gap-1.5 disabled:opacity-70 shadow"
            >
              {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
