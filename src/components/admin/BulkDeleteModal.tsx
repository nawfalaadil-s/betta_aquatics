import React, { useEffect, useState } from 'react';
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { mockDb } from '../../lib/mockDatabase';
import { deleteSupabaseProducts } from '../../lib/supabaseSync';
import { useToast } from '../../contexts/ToastContext';

export interface BulkDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProductIds: string[];
  onSuccess: () => void;
}

export const BulkDeleteModal: React.FC<BulkDeleteModalProps> = ({
  isOpen,
  onClose,
  selectedProductIds,
  onSuccess,
}) => {
  const { showToast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isDeleting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isDeleting]);

  if (!isOpen) return null;

  // Retrieve products to match SKUs for Supabase
  const allProducts = mockDb.getProducts();
  const targetProducts = allProducts.filter(p => selectedProductIds.includes(p.id));
  const skus = targetProducts.map(p => p.sku).filter(Boolean);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      // 1. Delete from local storage & memory state
      mockDb.bulkDeleteProducts(selectedProductIds, { force: true });

      // 2. Delete from live Supabase PostgreSQL database
      await deleteSupabaseProducts(selectedProductIds, skus);

      showToast(
        `Successfully deleted ${selectedProductIds.length} specimens permanently.`,
        'success'
      );
      onSuccess();
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Error executing bulk deletion', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="bulk-delete-title"
      aria-describedby="bulk-delete-desc"
    >
      <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h2 id="bulk-delete-title" className="text-base font-extrabold text-slate-900 font-display">
              Confirm Permanent Bulk Deletion
            </h2>
            <span className="text-[11px] text-slate-500 font-medium">
              Targeting <strong className="text-slate-800 font-bold">{selectedProductIds.length}</strong> selected specimens
            </span>
          </div>
        </div>

        {/* Body */}
        <div id="bulk-delete-desc" className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <div className="p-3.5 bg-red-50/80 border border-red-200 rounded-2xl space-y-1.5">
            <div className="flex items-center gap-2 text-red-800 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 text-red-700 shrink-0" />
              <span>Permanent Deletion Notice</span>
            </div>
            <p className="text-[11px] text-red-900">
              All <strong>{selectedProductIds.length}</strong> selected products will be permanently removed from your catalog and deleted from the live Supabase database.
            </p>
          </div>

          <p className="text-[11px] text-slate-500">
            This action cannot be undone. Are you sure you wish to proceed?
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm inline-flex items-center gap-1.5 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Confirm & Delete</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
