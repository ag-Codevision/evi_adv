'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAdminEditor } from './AdminAuthProvider';
import { useSiteContent } from './SiteContentProvider';
import { saveSiteContent } from '../../lib/site-content';
import { Plus, Edit2, Trash2, Check, Bold, X, AlertCircle } from 'lucide-react';
import ConfirmModal from './ConfirmModal';

export interface CredentialItem {
  id: string;
  text: string;
}

interface EditableCredentialsListProps {
  page: string;
  section: string;
  fieldKey: string;
  defaultItems: CredentialItem[];
  addButtonLabel?: string;
  className?: string;
}

/**
 * Renderiza o texto com formatação inteligente de negrito (**texto** ou <strong>texto</strong>)
 */
export function renderFormattedCredential(text: string) {
  if (!text) return null;

  // Regex para capturar marcações de negrito (**...** ou <strong>...</strong>)
  const regex = /(\*\*.*?\*\*|<strong>.*?<\/strong>)/gs;
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
          return (
            <strong key={i} className="font-bold text-evi-deep">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith('<strong>') && part.endsWith('</strong>')) {
          const content = part.replace(/^<strong>|<\/strong>$/gi, '');
          return (
            <strong key={i} className="font-bold text-evi-deep">
              {content}
            </strong>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

export default function EditableCredentialsList({
  page,
  section,
  fieldKey,
  defaultItems,
  addButtonLabel = 'Adicionar Novo Item',
  className = '',
}: EditableCredentialsListProps) {
  const { isAdmin, isEditing, setStatusMessage } = useAdminEditor();
  const { getContentItem, updateContent } = useSiteContent();

  const item = getContentItem(page, section, fieldKey);

  const getInitialItems = (): CredentialItem[] => {
    if (item?.value) {
      try {
        const parsed = JSON.parse(item.value);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((it: any, idx: number) => {
            if (typeof it === 'string') {
              return { id: String(idx + 1), text: it };
            }
            return {
              id: it.id || String(idx + 1),
              text: it.text || '',
            };
          });
        }
      } catch {}
    }
    return defaultItems;
  };

  const [items, setItems] = useState<CredentialItem[]>(getInitialItems);
  const [isSaving, setIsSaving] = useState(false);

  // Estados de Edição Inline
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Estados de Criação (Add Novo Item)
  const [isAdding, setIsAdding] = useState(false);
  const [newText, setNewText] = useState('');
  const addTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Exclusão com Modal
  const [idToDelete, setIdToDelete] = useState<string | null>(null);

  useEffect(() => {
    setItems(getInitialItems());
  }, [item?.value, defaultItems]);

  const saveItems = async (newItems: CredentialItem[]) => {
    setIsSaving(true);
    setStatusMessage('Salvando lista...');

    const jsonValue = JSON.stringify(newItems);
    const res = await saveSiteContent({
      page,
      section,
      fieldKey,
      value: jsonValue,
      contentType: 'list',
    });

    setIsSaving(false);

    if (res.success) {
      setItems(newItems);
      updateContent(page, section, fieldKey, jsonValue, undefined, 'list');
      setStatusMessage('Item salvo no banco de dados!');
      setTimeout(() => setStatusMessage(null), 2000);
    } else {
      setStatusMessage(`Erro ao salvar: ${res.error || 'Falha no banco de dados'}`);
      setTimeout(() => setStatusMessage(null), 3500);
    }
  };

  // Função para envolver o texto selecionado com **negrito**
  const applyBoldToSelection = (
    textareaRef: React.RefObject<HTMLTextAreaElement | null>,
    currentText: string,
    setTextFn: (t: string) => void
  ) => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;

    if (start === end) {
      // Nenhum texto selecionado: insere placeholder de negrito na posição do cursor
      const before = currentText.substring(0, start);
      const after = currentText.substring(end);
      const inserted = '**texto em negrito**';
      const updated = `${before}${inserted}${after}`;
      setTextFn(updated);
      setTimeout(() => {
        el.focus();
        el.setSelectionRange(start + 2, start + 17);
      }, 10);
      return;
    }

    const selected = currentText.substring(start, end);

    // Se já estiver com **, remove o negrito (toggle)
    let replacement = '';
    if (selected.startsWith('**') && selected.endsWith('**') && selected.length >= 4) {
      replacement = selected.slice(2, -2);
    } else {
      replacement = `**${selected}**`;
    }

    const before = currentText.substring(0, start);
    const after = currentText.substring(end);
    const updated = `${before}${replacement}${after}`;
    setTextFn(updated);

    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start, start + replacement.length);
    }, 10);
  };

  // Trata atalho de teclado Ctrl+B / Cmd+B no textarea
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    textareaRef: React.RefObject<HTMLTextAreaElement | null>,
    currentText: string,
    setTextFn: (t: string) => void
  ) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'b' || e.key === 'B')) {
      e.preventDefault();
      applyBoldToSelection(textareaRef, currentText, setTextFn);
    }
  };

  // Iniciar edição de um item
  const handleStartEdit = (it: CredentialItem) => {
    setEditingId(it.id);
    setEditText(it.text);
    setIsAdding(false);
    setTimeout(() => {
      if (editTextareaRef.current) {
        editTextareaRef.current.focus();
      }
    }, 50);
  };

  // Salvar item editado
  const handleSaveEdit = (id: string) => {
    if (!editText.trim()) return;
    const updated = items.map((it) => (it.id === id ? { ...it, text: editText.trim() } : it));
    saveItems(updated);
    setEditingId(null);
    setEditText('');
  };

  // Cancelar edição
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  // Adicionar novo item
  const handleConfirmAdd = () => {
    if (!newText.trim()) return;
    const newItem: CredentialItem = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      text: newText.trim(),
    };
    const updated = [...items, newItem];
    saveItems(updated);
    setIsAdding(false);
    setNewText('');
  };

  // Confirmar exclusão
  const handleConfirmDelete = () => {
    if (!idToDelete) return;
    const updated = items.filter((it) => it.id !== idToDelete);
    saveItems(updated);
    setIdToDelete(null);
  };

  const showEditUI = isAdmin && isEditing;

  return (
    <div className={`space-y-3.5 ${className}`}>
      <ul className="space-y-3.5 text-sm text-evi-text">
        {items.map((it) => {
          const isBeingEdited = editingId === it.id;

          if (isBeingEdited && showEditUI) {
            return (
              <li
                key={it.id}
                className="p-4 bg-sky-50/70 border-2 border-dashed border-sky-400 rounded-2xl space-y-3 shadow-sm transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Edit2 className="w-3.5 h-3.5 text-sky-600" />
                    Editar Credencial / Frase
                  </span>

                  <button
                    type="button"
                    onClick={() => applyBoldToSelection(editTextareaRef, editText, setEditText)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-100 text-evi-deep border border-slate-300 rounded-lg text-xs font-bold shadow-sm transition-all active:scale-95"
                    title="Selecione uma parte do texto com o mouse e clique aqui (ou pressione Ctrl+B)"
                  >
                    <Bold className="w-3.5 h-3.5 text-evi-accent" />
                    <span>Colocar Seleção em Negrito</span>
                  </button>
                </div>

                <textarea
                  ref={editTextareaRef}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, editTextareaRef, editText, setEditText)}
                  rows={3}
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl bg-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-slate-800 leading-relaxed font-sans"
                  placeholder="Escreva a frase. Dica: selecione o texto que deseja destacar e clique no botão 'Colocar Seleção em Negrito'."
                />

                {/* Preview em tempo real com o check */}
                <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Como será exibido no site:
                  </span>
                  <div className="flex items-start gap-2.5 text-xs text-evi-text">
                    <span className="text-evi-accent font-bold mt-0.5">✔</span>
                    <div className="leading-relaxed">
                      {renderFormattedCredential(editText || '(Digite a frase acima...)')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                    className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveEdit(it.id)}
                    disabled={isSaving || !editText.trim()}
                    className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Salvar Alterações</span>
                  </button>
                </div>
              </li>
            );
          }

          return (
            <li
              key={it.id}
              className={`group relative flex items-start gap-3 transition-colors ${
                showEditUI ? 'p-2 -mx-2 rounded-xl hover:bg-slate-50/80 border border-transparent hover:border-slate-200/80' : ''
              }`}
            >
              {/* Check fixo elegante */}
              <span className="text-evi-accent font-bold mt-1 shrink-0 text-base leading-none">✔</span>

              {/* Frase formatada com negrito */}
              <div className="leading-relaxed flex-1 text-sm text-evi-text">
                {renderFormattedCredential(it.text)}
              </div>

              {/* Controles CRUD visíveis apenas no modo edição */}
              {showEditUI && (
                <div className="shrink-0 flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(it)}
                    className="p-1.5 text-slate-500 hover:text-sky-600 bg-white hover:bg-sky-50 border border-slate-200 rounded-lg transition-colors shadow-xs"
                    title="Editar frase / destaques em negrito"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIdToDelete(it.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 bg-white hover:bg-red-50 border border-slate-200 rounded-lg transition-colors shadow-xs"
                    title="Remover este item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {/* Formulário de Adição de Novo Item */}
      {showEditUI && (
        <div className="pt-2">
          {isAdding ? (
            <div className="p-4 bg-emerald-50/60 border-2 border-dashed border-emerald-400 rounded-2xl space-y-3 shadow-sm animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-emerald-600" />
                  Novo Item com Check
                </span>

                <button
                  type="button"
                  onClick={() => applyBoldToSelection(addTextareaRef, newText, setNewText)}
                  className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-100 text-evi-deep border border-slate-300 rounded-lg text-xs font-bold shadow-sm transition-all active:scale-95"
                  title="Selecione a parte do texto com o mouse e clique aqui para aplicar negrito (ou use Ctrl+B)"
                >
                  <Bold className="w-3.5 h-3.5 text-evi-accent" />
                  <span>Colocar Seleção em Negrito</span>
                </button>
              </div>

              <textarea
                ref={addTextareaRef}
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, addTextareaRef, newText, setNewText)}
                rows={3}
                autoFocus
                className="w-full text-xs p-3 border border-slate-300 rounded-xl bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-800 leading-relaxed font-sans"
                placeholder="Ex: Pós-graduado em Direito Processual Civil pela PUC/SP, com ampla atuação em tribunais superiores."
              />

              {/* Preview em tempo real com o check */}
              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Prévia em Tempo Real (já vem com o check):
                </span>
                <div className="flex items-start gap-2.5 text-xs text-evi-text">
                  <span className="text-evi-accent font-bold mt-0.5">✔</span>
                  <div className="leading-relaxed">
                    {renderFormattedCredential(newText || '(Escreva acima para ver a prévia com o check...)')}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setNewText('');
                  }}
                  disabled={isSaving}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAdd}
                  disabled={isSaving || !newText.trim()}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Adicionar à Lista</span>
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setIsAdding(true);
                setEditingId(null);
                setTimeout(() => {
                  if (addTextareaRef.current) addTextareaRef.current.focus();
                }, 50);
              }}
              disabled={isSaving}
              className="flex items-center justify-center w-full gap-2 py-3 px-4 border-2 border-dashed border-slate-300 hover:border-evi-accent/60 rounded-2xl text-slate-600 hover:text-evi-deep bg-slate-50/60 hover:bg-amber-50/40 transition-all font-semibold text-xs shadow-xs"
            >
              <Plus className="w-4 h-4 text-evi-accent" />
              <span>{addButtonLabel}</span>
            </button>
          )}
        </div>
      )}

      {/* Modal de Confirmação para Remover Item */}
      <ConfirmModal
        isOpen={idToDelete !== null}
        title="Remover Item"
        message="Tem certeza que deseja remover este item da lista? Essa alteração será salva no banco de dados imediatamente."
        confirmLabel="Sim, Remover Item"
        cancelLabel="Cancelar"
        variant="danger"
        isLoading={isSaving}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIdToDelete(null)}
      />
    </div>
  );
}
