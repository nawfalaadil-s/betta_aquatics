import React, { useState } from 'react';
import { 
  Search, Filter, CheckCircle2, AlertCircle, 
  Clock, Truck, Package, X, Copy, ExternalLink, 
  ShieldCheck, ArrowRight, Eye, ChevronDown, 
  FileText, ZoomIn, Download, Smartphone, Check 
} from 'lucide-react';
import { mockDb } from '../../lib/mockDatabase';
import { useToast } from '../../contexts/ToastContext';
import { Order, PaymentStatus, FulfillmentStatus } from '../../lib/types';
import { formatCurrency, formatDate, buildTrackingUrl } from '../../lib/utils';
import { COURIER_PRESETS } from '../../lib/constants';
import { TaxInvoiceModal } from '../../components/common/TaxInvoiceModal';

export const AdminOrdersPage: React.FC = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>(() => mockDb.getOrders());

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [fulfillmentFilter, setFulfillmentFilter] = useState<string>('all');

  // Selected Order for Inspection Drawer / Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Rejection modal
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('Payment not credited to ICICI account. Please share valid UTR or banking screenshot.');

  // Shipment fulfillment modal state
  const [isShipModalOpen, setIsShipModalOpen] = useState(false);
  const [selectedCourierIndex, setSelectedCourierIndex] = useState(0);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [customTrackingUrl, setCustomTrackingUrl] = useState('');
  const [estimatedDelivery, setEstimatedDelivery] = useState('');
  const [shipmentNotes, setShipmentNotes] = useState('Live ornamental fish in oxygen-pressurized insulated EPS thermocol box. Handle with extreme care.');

  // Zoomed Screenshot Lightbox
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // Tax invoice preview
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  const refreshOrders = () => {
    setOrders(mockDb.getOrders());
    if (selectedOrder) {
      setSelectedOrder(mockDb.getOrderById(selectedOrder.id) || null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (paymentFilter !== 'all' && order.payment_status !== paymentFilter) return false;
    if (fulfillmentFilter !== 'all' && order.fulfillment_status !== fulfillmentFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = order.order_number.toLowerCase().includes(q);
      const matchName = order.customer_name.toLowerCase().includes(q);
      const matchPhone = order.customer_phone.toLowerCase().includes(q);
      const matchUtr = order.payment_details?.upi_reference?.toLowerCase().includes(q);
      if (!matchNum && !matchName && !matchPhone && !matchUtr) return false;
    }
    return true;
  });

  // Action: Approve Payment
  const handleApprovePayment = (orderId: string) => {
    const updated = mockDb.updateOrderPayment(orderId, 'verified', {
      verified_by: 'Super Admin',
    });
    if (updated) {
      refreshOrders();
      showToast(`Payment approved for order ${updated.order_number}!`, 'success');
    }
  };

  // Action: Reject Payment
  const handleConfirmReject = () => {
    if (!selectedOrder) return;
    const updated = mockDb.updateOrderPayment(selectedOrder.id, 'rejected', {
      rejection_reason: rejectionReason,
    });
    if (updated) {
      refreshOrders();
      setIsRejectModalOpen(false);
      showToast(`Payment rejected for order ${updated.order_number}.`, 'info');
    }
  };

  // Action: Dispatch Shipment & Set Tracking
  const handleConfirmShipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    if (!trackingNumber.trim()) {
      showToast('Please enter an AWB / Tracking ID', 'error');
      return;
    }

    const preset = COURIER_PRESETS[selectedCourierIndex];
    const finalTrackingUrl = customTrackingUrl.trim() 
      ? customTrackingUrl.trim() 
      : buildTrackingUrl(preset.urlTemplate, trackingNumber.trim());

    const updated = mockDb.updateOrderShipment(
      selectedOrder.id,
      preset.name,
      trackingNumber.trim(),
      finalTrackingUrl,
      estimatedDelivery,
      shipmentNotes
    );

    if (updated) {
      refreshOrders();
      setIsShipModalOpen(false);
      showToast(`Tracking assigned for order ${updated.order_number}!`, 'success');
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard!`, 'success');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      {/* Page Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-aqua-700 font-mono">
            Fulfillment & Verification
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Orders & Live Consignment Desk
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit customer UPI payment proofs, verify 12-digit UTR references, and generate external courier tracking links.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200">
            {orders.filter(o => o.payment_status === 'pending').length} Pending Review
          </span>
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 border border-slate-200">
            Total {orders.length} Consignments
          </span>
        </div>
      </div>

      {/* Filter and Search Bar (Clean White) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order #, Customer, Phone, or UTR..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-aqua-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <span className="text-slate-500 font-semibold text-[11px]">Payment:</span>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="bg-transparent text-slate-900 font-bold outline-none cursor-pointer text-xs"
            >
              <option value="all">All ({orders.length})</option>
              <option value="pending">Pending ({orders.filter(o => o.payment_status === 'pending').length})</option>
              <option value="verified">Verified ({orders.filter(o => o.payment_status === 'verified').length})</option>
              <option value="rejected">Rejected ({orders.filter(o => o.payment_status === 'rejected').length})</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <span className="text-slate-500 font-semibold text-[11px]">Fulfillment:</span>
            <select
              value={fulfillmentFilter}
              onChange={(e) => setFulfillmentFilter(e.target.value)}
              className="bg-transparent text-slate-900 font-bold outline-none cursor-pointer text-xs"
            >
              <option value="all">All</option>
              <option value="unfulfilled">Unfulfilled</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Data Table (Pristine White) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Desktop Data Table (hidden on mobile) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Payment Method & UTR</th>
                <th className="py-3 px-4">Proof</th>
                <th className="py-3 px-4">Pay Status</th>
                <th className="py-3 px-4">Fulfillment</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No matching consignment orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isPending = order.payment_status === 'pending';
                  const hasProof = Boolean(order.payment_details?.proof_image_url);

                  return (
                    <tr 
                      key={order.id} 
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isPending ? 'bg-amber-50/30' : ''
                      }`}
                    >
                      {/* Order Number */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-slate-900 block text-xs">{order.order_number}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{formatDate(order.created_at)}</span>
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-4">
                        <strong className="text-slate-900 block font-semibold">{order.customer_name}</strong>
                        <span className="text-[11px] text-slate-500">{order.customer_phone}</span>
                        <span className="text-[10px] text-slate-400 block">{order.shipping_address.city}, {order.shipping_address.state}</span>
                      </td>

                      {/* Payment Method & UTR */}
                      <td className="py-3.5 px-4 font-mono">
                        <span className="uppercase text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 inline-block mb-1">
                          {order.payment_details?.method || 'UPI'}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-slate-900 font-bold text-[11px]">
                            {order.payment_details?.upi_reference || 'N/A'}
                          </span>
                          {order.payment_details?.upi_reference && (
                            <button
                              onClick={() => handleCopy(order.payment_details!.upi_reference!, 'UTR')}
                              className="text-slate-400 hover:text-aqua-700"
                              title="Copy UTR"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Screenshot Proof Thumbnail */}
                      <td className="py-3.5 px-4">
                        {hasProof ? (
                          <button
                            type="button"
                            onClick={() => setZoomedImage(order.payment_details!.proof_image_url!)}
                            className="relative group block rounded-lg overflow-hidden border border-slate-200 shadow-xs hover:border-aqua-500 transition-colors"
                            title="Click to zoom screenshot"
                          >
                            <img
                              src={order.payment_details!.proof_image_url!}
                              alt="Proof"
                              className="w-10 h-10 object-cover"
                            />
                            <div className="absolute inset-0 bg-ocean-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                              <ZoomIn className="w-3.5 h-3.5" />
                            </div>
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">None</span>
                        )}
                      </td>

                      {/* Payment Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                            order.payment_status === 'verified'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : order.payment_status === 'rejected'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {order.payment_status}
                        </span>
                      </td>

                      {/* Fulfillment Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                            order.fulfillment_status === 'shipped'
                              ? 'bg-sky-50 text-sky-800 border-sky-200'
                              : order.fulfillment_status === 'delivered'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {order.fulfillment_status}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 font-bold text-slate-900 font-mono text-xs">
                        {formatCurrency(order.total_amount)}
                      </td>

                      {/* Action Tools */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isPending && (
                            <button
                              onClick={() => handleApprovePayment(order.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs"
                              title="Approve Bank Credit"
                            >
                              Approve
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 text-slate-600 hover:text-ocean-950 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Inspect Consignment"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card List View (Phones & Small Devices) */}
        <div className="md:hidden divide-y divide-slate-100">
          {filteredOrders.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No matching consignment orders found.
            </div>
          ) : (
            filteredOrders.map((order) => {
              const isPending = order.payment_status === 'pending';
              const hasProof = Boolean(order.payment_details?.proof_image_url);

              return (
                <div
                  key={order.id}
                  className={`p-4 space-y-3 transition-colors ${
                    isPending ? 'bg-amber-50/30' : 'bg-white'
                  }`}
                >
                  {/* Top Bar: Order ID, Date, Amount */}
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono font-bold text-slate-900 text-sm block">
                        {order.order_number}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {formatDate(order.created_at)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-slate-900 font-display text-base">
                        {formatCurrency(order.total_amount)}
                      </span>
                      <div className="text-[10px] text-slate-500 font-medium">
                        {order.items.length} {order.items.length === 1 ? 'Specimen' : 'Specimens'}
                      </div>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <strong className="text-slate-900 block font-semibold">{order.customer_name}</strong>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-0.5">
                      <span>{order.customer_phone}</span>
                      <span>{order.shipping_address.city}, {order.shipping_address.state}</span>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                        order.payment_status === 'verified'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : order.payment_status === 'rejected'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      Pay: {order.payment_status}
                    </span>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                        order.fulfillment_status === 'shipped'
                          ? 'bg-sky-50 text-sky-800 border-sky-200'
                          : order.fulfillment_status === 'delivered'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      Ship: {order.fulfillment_status}
                    </span>
                  </div>

                  {/* UTR & Proof Preview */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="font-mono text-[11px]">
                      <span className="text-slate-400 block text-[10px]">UTR / Ref:</span>
                      <div className="flex items-center gap-1 font-bold text-slate-800">
                        <span>{order.payment_details?.upi_reference || 'N/A'}</span>
                        {order.payment_details?.upi_reference && (
                          <button
                            onClick={() => handleCopy(order.payment_details!.upi_reference!, 'UTR')}
                            className="text-slate-400 hover:text-aqua-700 p-1"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {hasProof && (
                      <button
                        type="button"
                        onClick={() => setZoomedImage(order.payment_details!.proof_image_url!)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700"
                      >
                        <img
                          src={order.payment_details!.proof_image_url!}
                          alt="Proof"
                          className="w-5 h-5 rounded object-cover"
                        />
                        <span>View Proof</span>
                        <ZoomIn className="w-3 h-3 text-slate-400" />
                      </button>
                    )}
                  </div>

                  {/* Mobile Action Controls */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    {isPending && (
                      <button
                        onClick={() => handleApprovePayment(order.id)}
                        className="flex-1 min-h-[40px] py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs flex items-center justify-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>Approve Payment</span>
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="flex-1 min-h-[40px] py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Manage Order</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* INSPECTION DRAWER (Clean White Modal / Panel) */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs transition-opacity"
            onClick={() => setSelectedOrder(null)}
          />

          <div className="relative w-full max-w-xl bg-white h-full shadow-2xl overflow-y-auto z-10 flex flex-col justify-between border-l border-slate-200 text-slate-900">
            {/* Drawer Top Header */}
            <div>
              <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                    Consignment Inspection
                  </span>
                  <h2 className="text-xl font-black text-slate-900 font-display">
                    Order #{selectedOrder.order_number}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsInvoiceOpen(true)}
                    className="p-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-xl border border-slate-200 transition-colors shadow-2xs"
                    title="View & Print Tax Invoice"
                  >
                    <FileText className="w-4 h-4 text-aqua-600" />
                  </button>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Drawer Content */}
              <div className="p-5 space-y-6 text-xs">
                {/* PAYMENT VERIFICATION MODULE */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                      <ShieldCheck className="w-5 h-5 text-aqua-600" />
                      <span>Payment Verification Desk</span>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                        selectedOrder.payment_status === 'verified'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : selectedOrder.payment_status === 'rejected'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {selectedOrder.payment_status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Submitted UTR / Transaction ID:</span>
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {selectedOrder.payment_details?.upi_reference || 'No UTR submitted'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Payable Order Total:</span>
                      <span className="font-display font-bold text-slate-900 text-sm">
                        {formatCurrency(selectedOrder.total_amount)}
                      </span>
                    </div>
                  </div>

                  {/* Uploaded Screenshot Proof */}
                  {selectedOrder.payment_details?.proof_image_url && (
                    <div className="pt-2">
                      <span className="text-slate-600 font-semibold block text-[11px] mb-1.5">
                        Customer Uploaded Payment Proof:
                      </span>
                      <div className="relative group max-w-sm rounded-xl overflow-hidden border border-slate-300 bg-white p-1">
                        <img
                          src={selectedOrder.payment_details.proof_image_url}
                          alt="Payment Proof"
                          className="w-full h-auto rounded-lg max-h-56 object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => setZoomedImage(selectedOrder.payment_details!.proof_image_url!)}
                          className="absolute inset-0 bg-ocean-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity gap-1.5 text-xs font-bold"
                        >
                          <ZoomIn className="w-4 h-4" />
                          <span>Click to Zoom & Inspect</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Verification Actions */}
                  {selectedOrder.payment_status === 'pending' && (
                    <div className="pt-2 flex flex-wrap gap-2">
                      <button
                        onClick={() => handleApprovePayment(selectedOrder.id)}
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve Payment & Credit</span>
                      </button>
                      <button
                        onClick={() => setIsRejectModalOpen(true)}
                        className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span>Reject Payment</span>
                      </button>
                    </div>
                  )}

                  {selectedOrder.payment_status === 'rejected' && selectedOrder.payment_details?.rejection_reason && (
                    <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-800">
                      <strong>Rejection Note:</strong> {selectedOrder.payment_details.rejection_reason}
                    </div>
                  )}
                </div>

                {/* COURIER & SHIPMENT FULFILLMENT MODULE */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                      <Truck className="w-5 h-5 text-sky-600" />
                      <span>Courier & Air Cargo Dispatch</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-200 text-slate-800">
                      {selectedOrder.fulfillment_status}
                    </span>
                  </div>

                  {selectedOrder.shipment_details ? (
                    <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-slate-400 block text-[11px]">Courier Partner:</span>
                          <strong className="text-slate-900">{selectedOrder.shipment_details.courier_name}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">Tracking AWB:</span>
                          <strong className="font-mono text-sky-800">{selectedOrder.shipment_details.tracking_number}</strong>
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">External Tracking Link:</span>
                        <a
                          href={selectedOrder.shipment_details.tracking_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-aqua-700 hover:underline flex items-center gap-1 mt-0.5"
                        >
                          <span className="truncate">{selectedOrder.shipment_details.tracking_url}</span>
                          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        </a>
                      </div>
                      <button
                        onClick={() => setIsShipModalOpen(true)}
                        className="text-xs text-sky-700 hover:underline font-semibold"
                      >
                        Edit Tracking Information
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-slate-600 text-xs mb-3 leading-relaxed">
                        Assign an Air Cargo courier partner and AWB number to notify the customer with an active tracking link.
                      </p>
                      <button
                        onClick={() => setIsShipModalOpen(true)}
                        className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-colors shadow-xs"
                      >
                        <Truck className="w-4 h-4" />
                        <span>Enter Courier Tracking & Mark Shipped</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* ORDER ITEMS LIST */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                    Consignment Items ({selectedOrder.items.length})
                  </h3>
                  <div className="divide-y divide-slate-200">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img src={item.product_image} alt="" className="w-10 h-10 rounded-lg object-cover bg-white border border-slate-200" />
                          <div>
                            <div className="font-bold text-slate-900">{item.product_name}</div>
                            <div className="text-[11px] text-slate-500 font-mono">SKU: {item.product_sku} &bull; Qty: {item.quantity}</div>
                          </div>
                        </div>
                        <span className="font-bold text-slate-900 font-mono">
                          {formatCurrency(item.total_price)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-200 space-y-1 text-[11px] text-slate-600">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="font-semibold text-slate-900">{formatCurrency(selectedOrder.subtotal)}</span>
                    </div>
                    {selectedOrder.packing_charge > 0 && (
                      <div className="flex justify-between">
                        <span>Medical Oxygen Packing:</span>
                        <span className="font-semibold text-slate-900">{formatCurrency(selectedOrder.packing_charge)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Air Express Freight:</span>
                      <span className="font-semibold text-slate-900">{formatCurrency(selectedOrder.delivery_fee)}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-300 flex justify-between font-bold text-xs text-slate-900">
                      <span>Net Total:</span>
                      <span className="font-extrabold text-sm">{formatCurrency(selectedOrder.total_amount)}</span>
                    </div>
                  </div>
                </div>

                {/* DESTINATION ADDRESS */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                    Delivery Address & Acclimation Destination
                  </h3>
                  <div className="font-bold text-slate-900">{selectedOrder.shipping_address.full_name}</div>
                  <div className="text-slate-600 leading-relaxed">
                    {selectedOrder.shipping_address.street_address}, {selectedOrder.shipping_address.landmark && `${selectedOrder.shipping_address.landmark}, `}
                    {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} - <strong>{selectedOrder.shipping_address.postal_code}</strong>
                  </div>
                  <div className="text-slate-500">Contact: {selectedOrder.shipping_address.phone}</div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setIsInvoiceOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors shadow-2xs"
              >
                <FileText className="w-3.5 h-3.5 text-aqua-600" />
                <span>View GST Tax Invoice</span>
              </button>

              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-ocean-900 text-white rounded-xl text-xs font-bold hover:bg-ocean-800"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECTION REASON MODAL */}
      {isRejectModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                <AlertCircle className="w-5 h-5" />
                <span>Reject Payment Verification</span>
              </div>
              <button onClick={() => setIsRejectModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Order <strong>#{selectedOrder.order_number}</strong> will be marked as <strong>Rejected</strong>. The customer will see this reason in their account and can submit a corrected UTR reference.
            </p>

            <div>
              <label className="block text-slate-700 font-semibold mb-1 text-xs">Rejection Note to Customer:</label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleConfirmReject}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                Confirm Rejection
              </button>
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DISPATCH / FULFILLMENT MODAL */}
      {isShipModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-sky-800 font-bold text-sm">
                <Truck className="w-5 h-5 text-sky-600" />
                <span>Assign Air Courier Tracking</span>
              </div>
              <button onClick={() => setIsShipModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleConfirmShipment} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Courier Partner</label>
                <select
                  value={selectedCourierIndex}
                  onChange={(e) => setSelectedCourierIndex(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                >
                  {COURIER_PRESETS.map((p, idx) => (
                    <option key={p.name} value={idx}>{p.name}</option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">{COURIER_PRESETS[selectedCourierIndex].description}</p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">AWB / Air Tracking Number *</label>
                <input
                  type="text"
                  required
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. BLUEDART-98472918"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Estimated Arrival Date (Optional)</label>
                <input
                  type="date"
                  value={estimatedDelivery}
                  onChange={(e) => setEstimatedDelivery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Special Package Handling Notes</label>
                <textarea
                  rows={2}
                  value={shipmentNotes}
                  onChange={(e) => setShipmentNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  Save Dispatch & Notify Customer
                </button>
                <button
                  type="button"
                  onClick={() => setIsShipModalOpen(false)}
                  className="px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SCREENSHOT FULL-RESOLUTION LIGHTBOX */}
      {zoomedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative max-w-2xl w-full bg-white rounded-3xl p-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <span className="font-bold text-sm text-slate-900">Payment Screenshot Inspection</span>
              <button
                type="button"
                onClick={() => setZoomedImage(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-auto max-h-[75vh] flex items-center justify-center bg-slate-50 rounded-2xl p-2">
              <img
                src={zoomedImage}
                alt="Enlarged Payment Proof"
                className="max-w-full max-h-full object-contain rounded-xl shadow-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* REUSABLE TAX INVOICE MODAL */}
      <TaxInvoiceModal
        isOpen={isInvoiceOpen}
        order={selectedOrder}
        onClose={() => setIsInvoiceOpen(false)}
      />
    </div>
  );
};
