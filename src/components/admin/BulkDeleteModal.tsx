import React, { useEffect } from 'react';
import { X, Trash2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { mockDb } from '../../lib/mockDatabase';
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

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Inspect order references
  const orders = mockDb.getOrders();
  const orderedProductIds = new Set<string>();
  for (const o of orders) {
    for (const it of o.items || []) {
      if (it.product_id) orderedProductIds.add(it.product_id);
    }
  }

  const inOrderCount = selectedProductIds.filter(id => orderedProductIds.has(id)).length;
  const hardDeleteCount = selectedProductIds.length - inOrderCount;

  const handleConfirm = () => {
    try {
      const result = mockDb.bulkDeleteProducts(selectedProductIds, { archiveIfInOrders: true });
      showToast(
        `Bulk operation complete: ${result.deletedIds.length} deleted, ${result.archivedIds.length} archived (order protection)`,
        'info'
      );
      onSuccess();
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Error executing bulk deletion', 'error');
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
              Confirm Bulk Deletion
            </h2>
            <span className="text-[11px] text-slate-500 font-medium">
              Targeting <strong className="text-slate-800 font-bold">{selectedProductIds.length}</strong> selected specimens
            </span>
          </div>
        </div>

        {/* Body & Legal GST Protection Warning */}
        <div id="bulk-delete-desc" className="space-y-3 text-xs text-slate-600 leading-relaxed">
          {inOrderCount > 0 ? (
            <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Active Order History & Tax Invoice Protection</span>
              </div>
              <p className="text-[11px] text-amber-900">
                <strong className="text-amber-950 font-bold">{inOrderCount} of {selectedProductIds.length}</strong> selected specimens are referenced in historical customer orders and GST tax invoices.
              </p>
              <p className="text-[11px] text-amber-800">
                To prevent corrupted receipts or broken tracking links, those {inOrderCount} items will be <strong>safely archived</strong> (hidden from catalog and set inactive). The remaining <strong>{hardDeleteCount}</strong> items will be permanently removed.
              </p>
            </div>
          ) : (
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] text-slate-600">
              None of the selected products have been ordered by customers. All <strong>{selectedProductIds.length}</strong> items will be permanently removed from inventory.
            </div>
          )}

          <p className="text-[11px] text-slate-500">
            This operation will be recorded in the security audit log. Are you sure you wish to proceed?
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
          >
            Confirm & Proceed
          </button>
        </div>
      </div>
    </div>
  );
};
