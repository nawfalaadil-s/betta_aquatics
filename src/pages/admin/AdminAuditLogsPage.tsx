import React, { useState } from 'react';
import { History, Shield, Search, ArrowRight } from 'lucide-react';
import { mockDb } from '../../lib/mockDatabase';
import { formatDate } from '../../lib/utils';

export const AdminAuditLogsPage: React.FC = () => {
  const [logs] = useState(() => mockDb.getAuditLogs());
  const [filterType, setFilterType] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = logs.filter((log) => {
    if (filterType !== 'all' && log.entity_type !== filterType) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return log.action.toLowerCase().includes(q) || log.details.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-blue-900 font-mono">
          Security & Compliance
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
          Administrative Audit Logs
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Immutable ledger of payment approvals, consignment dispatches, and catalog updates.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search action or details..."
            aria-label="Search action or details"
            className="w-full bg-transparent text-slate-900 placeholder-slate-400 outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="audit-filter-entity" className="text-slate-500 font-medium">Entity:</label>
          <select
            id="audit-filter-entity"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-2.5 py-1.5 outline-none cursor-pointer text-xs focus:ring-1 focus:ring-blue-600"
          >
            <option value="all">All Operations</option>
            <option value="order">Orders & Payments</option>
            <option value="shipment">Courier Shipments</option>
            <option value="product">Products & Stock</option>
            <option value="settings">Store Settings</option>
            <option value="cms">CMS Edits</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <caption className="sr-only">Administrative Audit and Security Ledger</caption>
            <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-200">
              <tr>
                <th scope="col" className="p-4">Timestamp</th>
                <th scope="col" className="p-4">Officer</th>
                <th scope="col" className="p-4">Category</th>
                <th scope="col" className="p-4">Action Recorded</th>
                <th scope="col" className="p-4">Operational Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-4 font-mono text-slate-500 whitespace-nowrap">
                    {formatDate(log.created_at)}
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-slate-900">{log.admin_email}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-900">
                      {log.entity_type}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-slate-800">
                    {log.action}
                  </td>
                  <td className="p-4 text-slate-500 font-mono text-[11px]">
                    {log.details}
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
