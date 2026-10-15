import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Package, Truck, ArrowLeft, Copy, ExternalLink, 
  CheckCircle2, Clock, AlertCircle, ShieldCheck, 
  Upload, Check 
} from 'lucide-react';
import { mockDb } from '../lib/mockDatabase';
import { formatCurrency, formatDate } from '../lib/utils';
import { useToast } from '../contexts/ToastContext';

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();

  const [order, setOrder] = useState(() => mockDb.getOrderById(id || ''));
  const [resubmitUtr, setResubmitUtr] = useState('');
  const [resubmitProof, setResubmitProof] = useState<string | null>(null);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Order Not Found</h2>
        <Link to="/account/orders" className="text-xs font-bold text-aqua-700 underline">
          Return to Orders
        </Link>
      </div>
    );
  }

  const handleCopyAWB = () => {
    if (order.shipment_details?.tracking_number) {
      navigator.clipboard.writeText(order.shipment_details.tracking_number);
      showToast('Tracking ID copied!', 'success');
    }
  };

  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setResubmitProof(reader.result as string);
        showToast('Proof screenshot attached!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resubmitUtr.trim()) {
      showToast('Please provide the corrected 12-digit UTR', 'error');
      return;
    }
    const updated = mockDb.updateOrderPayment(order.id, 'pending', {
      upi_reference: resubmitUtr.trim(),
      proof_image_url: resubmitProof || undefined,
    });
    if (updated) {
      setOrder({ ...updated });
      showToast('Payment details re-submitted for verification!', 'success');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-6 sm:py-10">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Link */}
        <Link
          to="/account/orders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-ocean-950 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Orders</span>
        </Link>

        {/* Top Header Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">
              Consignment Invoice
            </span>
            <h1 className="text-2xl font-black text-ocean-950 font-display">
              Order #{order.order_number}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Placed on {formatDate(order.created_at)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full border bg-slate-100 text-slate-800">
              Payment: {order.payment_status.toUpperCase()}
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded-full border bg-ocean-950 text-aqua-300 border-ocean-800">
              Fulfillment: {order.fulfillment_status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Courier Tracking Status (If Shipped) */}
        {order.shipment_details && (
          <div className="bg-sky-50 rounded-3xl p-6 border border-sky-200 shadow-sm mb-6">
            <div className="flex items-center justify-between pb-3 border-b border-sky-200/80 mb-4">
              <div className="flex items-center gap-2 font-bold text-sm text-sky-900">
                <Truck className="w-5 h-5 text-sky-600" />
                <span>Consignment Air Transit Details</span>
              </div>
              <span className="text-xs font-bold text-sky-700 bg-sky-100 px-2.5 py-0.5 rounded-full">
                Active Airway Bill
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs mb-4">
              <div>
                <span className="text-slate-500 block">Courier Partner:</span>
                <strong className="text-slate-900">{order.shipment_details.courier_name}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">AWB / Tracking Number:</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <strong className="font-mono text-slate-900">{order.shipment_details.tracking_number}</strong>
                  <button onClick={handleCopyAWB} className="text-sky-700 hover:text-sky-900 p-0.5">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div>
                <span className="text-slate-500 block">Dispatch Date:</span>
                <strong className="text-slate-900">{formatDate(order.shipment_details.shipped_at)}</strong>
              </div>
            </div>

            {order.shipment_details.notes && (
              <div className="p-3 bg-white/80 rounded-xl border border-sky-200 text-xs text-slate-600 mb-4">
                <strong>Handling Instructions:</strong> {order.shipment_details.notes}
              </div>
            )}

            <a
              href={order.shipment_details.tracking_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
            >
              <span>Track Live Consignment On Courier Portal</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}

        {/* Payment Verification Status Box */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100 mb-4">
            Payment Verification Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-4">
            <div>
              <span className="text-slate-400 block">Payment Method:</span>
              <span className="font-semibold text-slate-800 uppercase">{order.payment_details?.method || 'UPI'}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Submitted UTR Reference:</span>
              <span className="font-mono font-bold text-slate-900">{order.payment_details?.upi_reference || 'N/A'}</span>
            </div>
          </div>

          {order.payment_status === 'verified' && (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 text-xs flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold block">Payment Successfully Verified</span>
                <span>Verified by {order.payment_details?.verified_by || 'Admin Office'} on {formatDate(order.payment_details?.verified_at || order.updated_at)}.</span>
              </div>
            </div>
          )}

          {order.payment_status === 'pending' && (
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <span className="font-bold block">Pending Admin Verification</span>
                <span>Our desk verifies transactions within 2-4 hours before oxygen crate assembly.</span>
              </div>
            </div>
          )}

          {order.payment_status === 'rejected' && (
            <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-rose-900 text-xs space-y-3">
              <div className="flex items-center gap-2 font-bold text-rose-800">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>Payment Verification Rejected</span>
              </div>
              <p className="text-rose-700 leading-relaxed">
                <strong>Reason from Admin:</strong> {order.payment_details?.rejection_reason || 'Could not verify transaction reference.'}
              </p>

              {/* Resubmit form */}
              <form onSubmit={handleResubmitPayment} className="pt-2 border-t border-rose-200 space-y-3">
                <span className="font-bold text-rose-900 block">Resubmit Correct Transaction Reference:</span>
                <input
                  type="text"
                  required
                  value={resubmitUtr}
                  onChange={(e) => setResubmitUtr(e.target.value)}
                  placeholder="Enter 12-digit UTR reference"
                  className="w-full bg-white border border-rose-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-colors"
                >
                  Resubmit For Verification
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Ordered Items List */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 pb-3 border-b border-slate-100 mb-4">
            Items in Consignment ({order.items.length})
          </h2>

          <div className="divide-y divide-slate-100">
            {order.items.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={item.product_image}
                    alt={item.product_name}
                    className="w-14 h-14 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-100"
                  />
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-slate-900">{item.product_name}</div>
                    <div className="text-slate-400 text-xs">
                      Qty: {item.quantity} × {formatCurrency(item.unit_price)}
                    </div>
                  </div>
                </div>
                <div className="font-bold text-xs sm:text-sm text-ocean-950 font-display">
                  {formatCurrency(item.total_price)}
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-semibold text-slate-900">{formatCurrency(order.subtotal)}</span>
            </div>
            {order.packing_charge > 0 && (
              <div className="flex justify-between">
                <span>Medical Oxygen Insulated Packing:</span>
                <span className="font-semibold text-slate-900">{formatCurrency(order.packing_charge)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Express Delivery Charge:</span>
              <span className="font-semibold text-slate-900">
                {order.delivery_fee === 0 ? 'FREE' : formatCurrency(order.delivery_fee)}
              </span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Coupon Discount ({order.coupon_code}):</span>
                <span>-{formatCurrency(order.discount_amount)}</span>
              </div>
            )}
            <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline font-bold text-sm text-slate-900">
              <span>Total Paid / Payable:</span>
              <span className="font-extrabold text-xl text-ocean-950 font-display">
                {formatCurrency(order.total_amount)}
              </span>
            </div>
          </div>
        </div>

        {/* Shipping Address Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-xs text-slate-600">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100 mb-3">
            Destination Address
          </h2>
          <div className="font-bold text-slate-900 text-sm">{order.shipping_address.full_name}</div>
          <div>Mobile: {order.shipping_address.phone}</div>
          <div className="mt-1">
            {order.shipping_address.street_address}, {order.shipping_address.landmark && `${order.shipping_address.landmark}, `}
            {order.shipping_address.city}, {order.shipping_address.state} - <strong>{order.shipping_address.postal_code}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
