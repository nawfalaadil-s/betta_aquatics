import React from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign, ShoppingBag, Clock, Package, 
  ArrowRight, ShieldCheck, AlertCircle, Truck, 
  Sparkles, CheckCircle2 
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
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
            Control Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Operations & Orders Dashboard
          </h1>
        </div>

        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-ocean-950 font-bold text-xs shadow-md transition-colors"
        >
          <span>Manage Orders</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Verified Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-display">
            {formatCurrency(totalRevenue)}
          </div>
          <span className="text-[10px] text-emerald-400 mt-1 block">Live Bank Credits</span>
        </div>

        <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-white font-display">
            {orders.length}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Lifetime Customer Consignments</span>
        </div>

        <div className="bg-amber-950/40 rounded-2xl p-5 border border-amber-500/40 shadow-sm">
          <div className="flex items-center justify-between text-amber-300 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Pending UPI Approvals</span>
            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-amber-300 font-display">
            {pendingPayments.length}
          </div>
          <span className="text-[10px] text-amber-300/80 mt-1 block">Requires manual UTR inspection</span>
        </div>

        <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Live Inventory Items</span>
            <Package className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white font-display">
            {products.length}
          </div>
          <span className="text-[10px] text-purple-400 mt-1 block">{lowStockProducts.length} Single Specimens</span>
        </div>
      </div>

      {/* Urgent Payment Approval Queue */}
      {pendingPayments.length > 0 && (
        <div className="bg-amber-950/30 rounded-3xl p-6 border border-amber-500/30 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-amber-300">
                Action Required: {pendingPayments.length} Payment Verification Awaiting Approval
              </h2>
            </div>
            <Link
              to="/admin/orders?payment=pending"
              className="text-xs text-amber-400 hover:text-amber-300 font-bold underline"
            >
              Open Full Review Queue
            </Link>
          </div>

          <div className="divide-y divide-amber-900/40">
            {pendingPayments.slice(0, 3).map((order) => (
              <div key={order.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white text-sm">{order.order_number}</span>
                    <span className="text-slate-400">by {order.customer_name}</span>
                    <span className="text-amber-300 font-bold">• {formatCurrency(order.total_amount)}</span>
                  </div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    Method: {order.payment_details?.method.toUpperCase()} • Submitted UTR: <strong className="font-mono text-slate-200">{order.payment_details?.upi_reference}</strong>
                  </div>
                </div>

                <Link
                  to={`/admin/orders`}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-ocean-950 font-bold text-xs rounded-xl self-start sm:self-auto transition-colors"
                >
                  Verify Transaction
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders Table */}
      <div className="bg-slate-800/80 rounded-3xl p-6 border border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white font-display">
            Recent Orders & Shipments
          </h2>
          <Link to="/admin/orders" className="text-xs text-aqua-400 hover:underline font-semibold">
            View All Orders
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-700 text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="pb-3">Order Number</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Payment Status</th>
                <th className="pb-3">Fulfillment</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-slate-300">
              {orders.slice(0, 5).map((o) => (
                <tr key={o.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="py-3 font-mono font-bold text-white">{o.order_number}</td>
                  <td className="py-3">{o.customer_name}</td>
                  <td className="py-3 text-slate-400">{formatDate(o.created_at)}</td>
                  <td className="py-3 font-bold text-white">{formatCurrency(o.total_amount)}</td>
                  <td className="py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        o.payment_status === 'verified'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : o.payment_status === 'rejected'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      }`}
                    >
                      {o.payment_status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        o.fulfillment_status === 'shipped'
                          ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                          : o.fulfillment_status === 'delivered'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {o.fulfillment_status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <Link
                      to="/admin/orders"
                      className="text-aqua-400 hover:text-aqua-300 font-semibold"
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
