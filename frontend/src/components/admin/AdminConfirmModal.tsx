'use client';

import { AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';

interface AdminConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  /** Optionele waarschuwingstekst — getoond als amber banner boven de knoppen */
  warning?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  variant?: 'danger' | 'warning';
}

export default function AdminConfirmModal({
  open,
  title,
  message,
  warning,
  confirmLabel = 'Bevestigen',
  onConfirm,
  onCancel,
  loading = false,
  variant = 'danger',
}: AdminConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onCancel}
      />
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <div className="flex items-start gap-4">
          <div
            className={clsx(
              'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
              variant === 'danger' ? 'bg-red-100' : 'bg-amber-100',
            )}
          >
            <AlertTriangle
              className={clsx(
                'w-5 h-5',
                variant === 'danger' ? 'text-red-600' : 'text-amber-600',
              )}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-slate-900">{title}</h3>
            <p className="mt-1 text-sm text-slate-500">{message}</p>
          </div>
        </div>
        {warning && (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-800 text-sm">
            {warning}
          </div>
        )}
        <div className="flex gap-3 mt-4 justify-end">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
          >
            Annuleren
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={clsx(
              'flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-xl transition-colors disabled:opacity-50',
              variant === 'danger'
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-amber-500 hover:bg-amber-600',
            )}
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
