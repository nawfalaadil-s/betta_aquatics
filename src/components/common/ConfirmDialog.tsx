import React, { useEffect, useRef } from 'react';
import { AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  description,
  message,
  confirmLabel = 'Confirm Action',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}) => {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const cancelBtnRef = useRef<HTMLButtonElement | null>(null);
  const bodyText = description || message || '';

  useEffect(() => {
    if (!isOpen) return;

    // Focus cancel button on open for safety on destructive actions
    cancelBtnRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
        return;
      }

      // Trap focus inside dialog
      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const iconVariants = {
    danger: <AlertCircle className="w-6 h-6 text-red-600" aria-hidden="true" />,
    warning: <AlertTriangle className="w-6 h-6 text-amber-600" aria-hidden="true" />,
    primary: <Info className="w-6 h-6 text-blue-700" aria-hidden="true" />,
  };

  const confirmBtnVariants = {
    danger: 'bg-red-600 hover:bg-red-700 text-white focus-visible:ring-red-600',
    warning: 'bg-amber-600 hover:bg-amber-700 text-white focus-visible:ring-amber-600',
    primary: 'bg-blue-900 hover:bg-blue-800 text-white focus-visible:ring-blue-900',
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs"
      onClick={onCancel}
    >
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-desc"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-start justify-between gap-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
              variant === 'danger' ? 'bg-red-50' : variant === 'warning' ? 'bg-amber-50' : 'bg-blue-50'
            }`}>
              {iconVariants[variant]}
            </div>
            <h2 id="confirm-dialog-title" className="text-base font-bold text-slate-900 font-display">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close confirmation dialog"
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-900"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <p id="confirm-dialog-desc" className="text-xs text-slate-600 leading-relaxed">
          {bodyText}
        </p>

        <div className="flex gap-2.5 pt-2">
          <button
            ref={cancelBtnRef}
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition-colors focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs shadow-xs transition-colors focus-visible:ring-2 ${confirmBtnVariants[variant]}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
