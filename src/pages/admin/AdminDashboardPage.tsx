import React from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign, ShoppingBag, Clock, Package, 
  ArrowRight, ShieldCheck, AlertCircle, Truck, 
  Sparkles, CheckCircle2, ChevronRight, Eye 
} from 'lucide-react';
import { mockDb } from '../../lib/mockDatabase';
import { formatCurrency, formatDate } from '../../lib/utils';

export const AdminDashboardPage: React.FC = () => {
  const orders = mockDb.getOrders();
  const products = mockDb.getProducts();

  const totalRevenue = orders
    .filter(o => o.payment_status === 'verified')
    .reduce((acc, o) => acc + o.total_amount, 0);

  const pendingPayments = orders.filter(o => o.payment_status === 'pending');
  const lowStockProducts = products.filter(p => p.stock_quantity <= 1);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Welcome Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-aqua-700 font-mono">
            Control Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Operations & Orders Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time telemetry, payment verification queues, and live specimen inventory status.
          </p>
        </div>

        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ocean-900 hover:bg-ocean-800 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
        >
          <span>Manage Orders Queue</span>
          <ArrowRight className="w-4 h-4 text-aqua-400" />
        </Link>
      </div>

      {/* KPI Cards (Clean White Theme) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Verified Bank Credit</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-display">
            {formatCurrency(totalRevenue)}
          </div>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">Live Verified Payments</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Total Consignments</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-display">
            {orders.length}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Lifetime Customer Orders</span>
        </div>

        <div className="bg-amber-50/70 rounded-2xl p-5 border border-amber-200 shadow-xs">
          <div className="flex items-center justify-between text-amber-900 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Verification</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4 animate-pulse" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-950 font-display">
            {pendingPayments.length}
          </div>
          <span className="text-[11px] text-amber-800 font-medium mt-1 block">Requires UTR verification</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Live Specimen Catalog</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-display">
            {products.length}
          </div>
          <span className="text-[11px] text-purple-700 font-medium mt-1 block">{lowStockProducts.length} 1-of-1 Specimens</span>
        </div>
      </div>

      {/* Urgent Payment Approval Queue */}
      {pendingPayments.length > 0 && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-amber-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-amber-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900">
                  Payment Verification Desk ({pendingPayments.length} Orders Awaiting Review)
                </h2>
                <p className="text-xs text-slate-500">
                  Check bank transfer credit and approve before packing living specimens.
                </p>
              </div>
            </div>
            <Link
              to="/admin/orders?payment=pending"
              className="text-xs text-aqua-700 hover:text-aqua-800 font-bold underline self-start sm:self-auto"
            >
              Open Full Review Queue
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {pendingPayments.slice(0, 3).map((order) => (
              <div key={order.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 text-sm">{order.order_number}</span>
                    <span className="text-slate-400">&bull;</span>
                    <span className="text-slate-600 font-semibold">{order.customer_name}</span>
                    <span className="font-bold text-slate-900">&bull; {formatCurrency(order.total_amount)}</span>
                  </div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    Method: <strong className="uppercase">{order.payment_details?.method}</strong> &bull; Submitted UTR: <strong className="font-mono text-slate-800">{order.payment_details?.upi_reference || 'N/A'}</strong>
                  </div>
                </div>

                <Link
                  to={`/admin/orders`}
                  className="px-4 py-2 bg-ocean-900 hover:bg-ocean-800 text-white font-bold text-xs rounded-xl self-start sm:self-auto transition-colors shadow-xs"
                >
                  Verify Transaction
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders Table (Clean White) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-display">
              Recent Orders & Live Shipments
            </h2>
            <p className="text-xs text-slate-500">Latest orders placed on Betta Aquatics</p>
          </div>
          <Link to="/admin/orders" className="text-xs text-aqua-700 hover:underline font-bold inline-flex items-center gap-1">
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-y border-slate-200 text-slate-500 text-[10px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-2.5 px-3">Order Number</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Payment</th>
                <th className="py-2.5 px-3">Fulfillment</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {orders.slice(0, 5).map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">{o.order_number}</td>
                  <td className="py-3 px-3 font-medium text-slate-800">{o.customer_name}</td>
                  <td className="py-3 px-3 text-slate-500">{formatDate(o.created_at)}</td>
                  <td className="py-3 px-3 font-bold text-slate-900 font-mono">{formatCurrency(o.total_amount)}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                        o.payment_status === 'verified'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : o.payment_status === 'rejected'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {o.payment_status}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                        o.fulfillment_status === 'shipped'
                          ? 'bg-sky-50 text-sky-800 border-sky-200'
                          : o.fulfillment_status === 'delivered'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {o.fulfillment_status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Link
                      to="/admin/orders"
                      className="text-aqua-700 hover:text-aqua-800 font-bold hover:underline"
                    >
                      Inspect
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
