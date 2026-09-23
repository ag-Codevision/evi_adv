'use client';

import React, { useState, useEffect } from 'react';
import { useAdminEditor } from './AdminAuthProvider';
import { useSiteContent } from './SiteContentProvider';
import { saveSiteContent } from '../../lib/site-content';
import { Plus } from 'lucide-react';
import ConfirmModal from './ConfirmModal';

interface EditableListProps<T> {
  page: string;
  section: string;
  fieldKey: string;
  defaultItems: T[];
  renderItem: (item: T, index: number, isEditing: boolean, onUpdate: (updated: T) => void, onDelete: () => void) => React.ReactNode;
  renderAddForm?: (onAdd: (item: T) => void, onCancel: () => void) => React.ReactNode;
  className?: string;
  addButtonLabel?: string;
}

export default function EditableList<T>({
  page,
  section,
  fieldKey,
  defaultItems,
  renderItem,
  renderAddForm,
  className = '',
  addButtonLabel = 'Adicionar Item',
}: EditableListProps<T>) {
  const { isAdmin, isEditing, setStatusMessage } = useAdminEditor();
  const { getContentItem, updateContent } = useSiteContent();

  const item = getContentItem(page, section, fieldKey);
  const getInitialItems = (): T[] => {
    if (item?.value) {
      try {
        const parsed = JSON.parse(item.value);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
    return defaultItems;
  };

  const [items, setItems] = useState<T[]>(getInitialItems);
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [indexToDelete, setIndexToDelete] = useState<number | null>(null);

  useEffect(() => {
    setItems(getInitialItems());
  }, [item?.value, defaultItems]);

  const saveItems = async (newItems: T[]) => {
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
      setStatusMessage('Lista salva com sucesso');
      setTimeout(() => setStatusMessage(null), 2000);
    } else {
      setStatusMessage(`Erro ao salvar lista: ${res.error || 'Falha'}`);
      setTimeout(() => setStatusMessage(null), 3500);
    }
  };

  const handleUpdateItem = (index: number, updatedItem: T) => {
    const newItems = [...items];
    newItems[index] = updatedItem;
    setItems(newItems);
    saveItems(newItems);
  };

  const handleTriggerDelete = (index: number) => {
    setIndexToDelete(index);
  };

  const handleConfirmDelete = () => {
    if (indexToDelete === null) return;
    const newItems = items.filter((_, i) => i !== indexToDelete);
    setItems(newItems);
    saveItems(newItems);
    setIndexToDelete(null);
  };

  const handleAddItem = (newItem: T) => {
    const newItems = [...items, newItem];
    setItems(newItems);
    setIsAdding(false);
    saveItems(newItems);
  };

  const showEditUI = isAdmin && isEditing;

  return (
    <div className={className}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {renderItem(
            item,
            index,
            showEditUI,
            (updated) => handleUpdateItem(index, updated),
            () => handleTriggerDelete(index)
          )}
        </React.Fragment>
      ))}

      {showEditUI && renderAddForm && (
        <div className="mt-4">
          {isAdding ? (
            <div className="border border-dashed border-sky-300 rounded-lg p-4 bg-sky-50">
              {renderAddForm(handleAddItem, () => setIsAdding(false))}
            </div>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              disabled={isSaving}
              className="flex items-center justify-center w-full gap-2 py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-sky-600 hover:border-sky-300 hover:bg-sky-50 transition-colors font-medium text-sm"
            >
              <Plus className="w-4 h-4" />
              {addButtonLabel}
            </button>
          )}
        </div>
      )}

      {/* Modal de Confirmação com Estética do Site */}
      <ConfirmModal
        isOpen={indexToDelete !== null}
        title="Remover Item da Lista"
        message="Tem certeza que deseja remover este item? A alteração será salva imediatamente."
        confirmLabel="Sim, Remover"
        cancelLabel="Cancelar"
        variant="danger"
        isLoading={isSaving}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIndexToDelete(null)}
      />
    </div>
  );
}
