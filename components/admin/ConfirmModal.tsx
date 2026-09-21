'use client';

import React from 'react';
import { AlertTriangle, Info, CheckCircle2, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'danger',
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          iconBg: 'bg-red-500/10 border-red-500/30 text-red-400',
          confirmBtn: 'bg-red-600 hover:bg-red-500 text-white shadow-red-950/40',
          icon: <AlertTriangle className="w-6 h-6 text-red-400" />,
        };
      case 'warning':
        return {
          iconBg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          confirmBtn: 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-950/40',
          icon: <AlertTriangle className="w-6 h-6 text-amber-400" />,
        };
      case 'info':
      default:
        return {
          iconBg: 'bg-sky-500/10 border-sky-500/30 text-sky-400',
          confirmBtn: 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-950/40',
          icon: <Info className="w-6 h-6 text-sky-400" />,
        };
    }
  };

  const style = getVariantStyles();

  return (
    <div className="fixed inset-0 z-[99999999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="bg-[#0b1320] border border-slate-700/80 text-slate-100 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden p-6 md:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 ${style.iconBg}`}>
            {style.icon}
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-serif font-bold text-white tracking-tight">
              {title}
            </h3>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800/90 hover:bg-slate-800 hover:text-white border border-slate-700 transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center gap-2 ${style.confirmBtn}`}
          >
            {isLoading && (
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
