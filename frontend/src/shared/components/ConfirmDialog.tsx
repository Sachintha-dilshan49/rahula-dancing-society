'use client';

import { ReactNode } from 'react';
import { X, AlertTriangle } from 'lucide-react';

type ConfirmVariant = 'danger' | 'warning' | 'primary';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const VARIANT_STYLES: Record<ConfirmVariant, { icon: string; confirmBtn: string }> = {
  danger: {
    icon: 'text-red-500 bg-red-50',
    confirmBtn: 'bg-red-500 hover:bg-red-600 focus:ring-red-500',
  },
  warning: {
    icon: 'text-amber-500 bg-amber-50',
    confirmBtn: 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-500',
  },
  primary: {
    icon: 'text-rahula-blue bg-blue-50',
    confirmBtn: 'bg-rahula-blue hover:bg-blue-900 focus:ring-rahula-blue',
  },
};

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const styles = VARIANT_STYLES[variant];

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={() => !isLoading && onCancel()}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 flex justify-between items-center border-b border-slate-100">
          <h2 className="text-lg font-bold flex items-center gap-2.5 text-slate-800">
            <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${styles.icon}`}>
              <AlertTriangle size={20} />
            </span>
            {title}
          </h2>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <div className="text-slate-600 text-sm leading-relaxed">{message}</div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-lg font-medium text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 py-2.5 rounded-lg font-medium text-white transition-colors shadow-sm focus:ring-2 focus:ring-offset-2 disabled:opacity-75 disabled:cursor-not-allowed flex items-center gap-2 ${styles.confirmBtn}`}
          >
            {isLoading && (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
