import React, { useState } from 'react';
import { 
  Search, Filter, CheckCircle2, AlertCircle, 
  Clock, Truck, Package, X, Copy, ExternalLink, 
  ShieldCheck, ArrowRight, Eye, ChevronDown 
} from 'lucide-react';
import { mockDb } from '../../lib/mockDatabase';
import { useToast } from '../../contexts/ToastContext';
import { Order, PaymentStatus, FulfillmentStatus } from '../../lib/types';
import { formatCurrency, formatDate, buildTrackingUrl } from '../../lib/utils';
import { COURIER_PRESETS } from '../../lib/constants';

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
      shipmentNotes,
      estimatedDelivery || undefined
    );

    if (updated) {
      refreshOrders();
      setIsShipModalOpen(false);
      setTrackingNumber('');
      showToast(`Order ${updated.order_number} marked as Shipped via ${preset.name}!`, 'success');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
            Fulfillment & Audit
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Order Management & Verification
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Verify manual UPI bank payments and record courier AWB tracking links.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Search Input */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order #, customer, phone, UTR..."
            className="w-full bg-transparent text-white placeholder-slate-500 outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Payment:</span>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white rounded-xl px-2.5 py-1.5 outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending Verification</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Fulfillment:</span>
            <select
              value={fulfillmentFilter}
              onChange={(e) => setFulfillmentFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white rounded-xl px-2.5 py-1.5 outline-none cursor-pointer"
            >
              <option value="all">All Stages</option>
              <option value="unfulfilled">Unfulfilled</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Grid / Table */}
      <div className="bg-slate-800/80 rounded-3xl border border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-700">
              <tr>
                <th className="p-4">Order ID & Date</th>
                <th className="p-4">Customer & City</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Submitted UTR / Proof</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Fulfillment</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-slate-300">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No orders found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="p-4">
                      <div className="font-mono font-bold text-white text-sm">{order.order_number}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{formatDate(order.created_at)}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-white">{order.customer_name}</div>
                      <div className="text-slate-400 text-[11px]">{order.shipping_address.city} - {order.shipping_address.postal_code}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-white font-display text-sm">{formatCurrency(order.total_amount)}</div>
                      <div className="text-[10px] text-slate-400">{order.items.length} items</div>
                    </td>
                    <td className="p-4">
                      <div className="font-mono text-slate-200">
                        {order.payment_details?.upi_reference || 'Not submitted'}
                      </div>
                      {order.payment_details?.proof_image_url && (
                        <span className="text-[10px] text-aqua-400 font-semibold flex items-center gap-1 mt-0.5">
                          <span>[Screenshot Uploaded]</span>
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          order.payment_status === 'verified'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : order.payment_status === 'rejected'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {order.payment_status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          order.fulfillment_status === 'shipped'
                            ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                            : order.fulfillment_status === 'processing'
                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                            : order.fulfillment_status === 'delivered'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {order.fulfillment_status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl text-xs transition-colors"
                      >
                        Inspect & Process
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* INSPECTION MODAL / DRAWER */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}
          />
          <div className="relative bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl max-w-3xl w-full p-6 sm:p-8 z-10 my-auto text-xs text-slate-200 max-h-[90vh] overflow-y-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                  Consignment Processing Desk
                </span>
                <h2 className="text-xl font-black text-white font-display">
                  Order #{selectedOrder.order_number}
                </h2>
                <div className="text-slate-400 text-xs mt-0.5">
                  Placed by {selectedOrder.customer_name} ({selectedOrder.customer_email}) on {formatDate(selectedOrder.created_at)}
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* PAYMENT VERIFICATION MODULE */}
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  <span>Payment Verification Desk</span>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    selectedOrder.payment_status === 'verified'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : selectedOrder.payment_status === 'rejected'
                      ? 'bg-rose-500/20 text-rose-400'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}
                >
                  {selectedOrder.payment_status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 block text-[11px]">Submitted UTR / Transaction ID:</span>
                  <span className="font-mono font-bold text-white text-sm">
                    {selectedOrder.payment_details?.upi_reference || 'No UTR submitted'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Payable Order Total:</span>
                  <span className="font-display font-bold text-white text-sm">
                    {formatCurrency(selectedOrder.total_amount)}
                  </span>
                </div>
              </div>

              {/* Uploaded Screenshot Proof */}
              {selectedOrder.payment_details?.proof_image_url && (
                <div>
                  <span className="text-slate-400 block text-[11px] mb-1">Attached Payment Screenshot:</span>
                  <div className="max-w-xs rounded-xl overflow-hidden border border-slate-700 bg-slate-950 p-1">
                    <img
                      src={selectedOrder.payment_details.proof_image_url}
                      alt="Payment Proof"
                      className="w-full h-auto rounded-lg max-h-48 object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Verification Actions */}
              {selectedOrder.payment_status === 'pending' && (
                <div className="pt-2 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleApprovePayment(selectedOrder.id)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve Payment & Credit</span>
                  </button>
                  <button
                    onClick={() => setIsRejectModalOpen(true)}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>Reject Payment</span>
                  </button>
                </div>
              )}

              {selectedOrder.payment_status === 'rejected' && selectedOrder.payment_details?.rejection_reason && (
                <div className="p-3 bg-rose-950/40 rounded-xl border border-rose-500/40 text-rose-300">
                  <strong>Rejection Note:</strong> {selectedOrder.payment_details.rejection_reason}
                </div>
              )}
            </div>

            {/* COURIER & SHIPMENT FULFILLMENT MODULE */}
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <Truck className="w-5 h-5 text-sky-400" />
                  <span>Courier & Shipment Fulfillment</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-700 text-slate-200">
                  {selectedOrder.fulfillment_status}
                </span>
              </div>

              {selectedOrder.shipment_details ? (
                <div className="space-y-3 bg-slate-900/60 p-4 rounded-xl border border-slate-700">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Courier Partner:</span>
                      <strong className="text-white">{selectedOrder.shipment_details.courier_name}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Tracking AWB:</span>
                      <strong className="font-mono text-white">{selectedOrder.shipment_details.tracking_number}</strong>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">External Tracking Link:</span>
                    <a
                      href={selectedOrder.shipment_details.tracking_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-aqua-400 hover:underline flex items-center gap-1 mt-0.5"
                    >
                      <span className="truncate">{selectedOrder.shipment_details.tracking_url}</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  </div>
                  <button
                    onClick={() => setIsShipModalOpen(true)}
                    className="text-xs text-sky-400 hover:underline font-semibold"
                  >
                    Edit Tracking Information
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-slate-400 text-xs mb-3">
                    Assign a courier partner and AWB number to notify the customer with an active tracking link.
                  </p>
                  <button
                    onClick={() => setIsShipModalOpen(true)}
                    className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-colors shadow-md"
                  >
                    <Truck className="w-4 h-4" />
                    <span>Enter Courier Tracking & Mark Shipped</span>
                  </button>
                </div>
              )}
            </div>

            {/* ORDER ITEMS LIST */}
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-3">
              <h3 className="font-bold text-white text-xs uppercase tracking-wider">
                Consignment Items ({selectedOrder.items.length})
              </h3>
              <div className="divide-y divide-slate-700/60">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={item.product_image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <div className="font-bold text-white">{item.product_name}</div>
                        <div className="text-[11px] text-slate-400">SKU: {item.product_sku} • Qty: {item.quantity}</div>
                      </div>
                    </div>
                    <div className="font-bold text-white font-display">
                      {formatCurrency(item.total_price)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SHIPPING DESTINATION */}
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 text-xs">
              <h3 className="font-bold text-white text-xs uppercase tracking-wider mb-2">Destination Address</h3>
              <div className="text-white font-bold">{selectedOrder.shipping_address.full_name} ({selectedOrder.shipping_address.phone})</div>
              <div className="text-slate-300 mt-1">
                {selectedOrder.shipping_address.street_address}, {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} - {selectedOrder.shipping_address.postal_code}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REJECT PAYMENT MODAL */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80" onClick={() => setIsRejectModalOpen(false)} />
          <div className="relative bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full z-10 space-y-4">
            <h3 className="font-bold text-white text-base">Reject Payment Submission</h3>
            <p className="text-xs text-slate-400">
              Provide a clear reason so the customer can correct the payment or resubmit the valid UTR.
            </p>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white outline-none focus:border-rose-500"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="px-4 py-2 border border-slate-700 rounded-xl text-xs text-slate-300 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SHIPMENT & TRACKING ENTRY MODAL */}
      {isShipModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80" onClick={() => setIsShipModalOpen(false)} />
          <div className="relative bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full z-10 space-y-5 text-xs text-slate-300">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 font-bold text-white text-base">
                <Truck className="w-5 h-5 text-sky-400" />
                <span>Courier Dispatch & Tracking</span>
              </div>
              <button onClick={() => setIsShipModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleConfirmShipment} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Select Courier Partner</label>
                <select
                  value={selectedCourierIndex}
                  onChange={(e) => setSelectedCourierIndex(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white outline-none"
                >
                  {COURIER_PRESETS.map((p, idx) => (
                    <option key={idx} value={idx}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  {COURIER_PRESETS[selectedCourierIndex].description}
                </span>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">AWB / Consignment Tracking Number *</label>
                <input
                  type="text"
                  required
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. BLUEDART-882947192 or DTDC981245"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-mono outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Estimated Arrival Date (Optional)</label>
                <input
                  type="date"
                  value={estimatedDelivery}
                  onChange={(e) => setEstimatedDelivery(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Handling & Transport Notes</label>
                <textarea
                  rows={2}
                  value={shipmentNotes}
                  onChange={(e) => setShipmentNotes(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white outline-none"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setIsShipModalOpen(false)}
                  className="px-4 py-2 border border-slate-700 rounded-xl text-xs text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Confirm Dispatch & Notify Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
