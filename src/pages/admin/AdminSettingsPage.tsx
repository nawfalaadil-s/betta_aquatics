import React, { useState } from 'react';
import { Settings, Save, QrCode, Truck, Bell, AlertTriangle, ShieldCheck, Check } from 'lucide-react';
import { useStoreSettings } from '../../contexts/StoreSettingsContext';
import { useToast } from '../../contexts/ToastContext';

export const AdminSettingsPage: React.FC = () => {
  const { settings, updateSettings } = useStoreSettings();
  const { showToast } = useToast();

  const [form, setForm] = useState({ ...settings });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setForm((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    showToast('Store settings updated and applied across the storefront!', 'success');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
            Configuration
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Global Store & UPI Payment Settings
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Changes made here take effect immediately on the live storefront.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs text-slate-200">
        {/* UPI & Bank Transfer Settings */}
        <div className="bg-slate-800/80 rounded-3xl p-6 border border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-700">
            <QrCode className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              UPI & Manual Payment Coordinates
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Store UPI ID *</label>
              <input
                type="text"
                required
                name="upi_id"
                value={form.upi_id}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 font-mono text-white outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">UPI Payee Official Name *</label>
              <input
                type="text"
                required
                name="upi_payee_name"
                value={form.upi_payee_name}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Bank Name</label>
              <input
                type="text"
                name="bank_name"
                value={form.bank_name}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Account Number</label>
              <input
                type="text"
                name="bank_account_no"
                value={form.bank_account_no}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 font-mono text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">IFSC Code</label>
              <input
                type="text"
                name="bank_ifsc"
                value={form.bank_ifsc}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 font-mono text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Account Holder Name</label>
              <input
                type="text"
                name="bank_account_holder"
                value={form.bank_account_holder}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white outline-none"
              />
            </div>
          </div>
        </div>

        {/* Shipping & Packaging Rules */}
        <div className="bg-slate-800/80 rounded-3xl p-6 border border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-700">
            <Truck className="w-5 h-5 text-sky-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Shipping & Live Packing Rules
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Free Delivery Order Threshold (₹)</label>
              <input
                type="number"
                name="free_shipping_threshold"
                value={form.free_shipping_threshold}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Standard Air Cargo Fee (₹)</label>
              <input
                type="number"
                name="standard_shipping_rate"
                value={form.standard_shipping_rate}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Medical Oxygen Packing Charge (₹)</label>
              <input
                type="number"
                name="live_packing_charge"
                value={form.live_packing_charge}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Top Announcement Bar */}
        <div className="bg-slate-800/80 rounded-3xl p-6 border border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Storefront Announcement Bar
              </h2>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="announcement_active"
                checked={form.announcement_active}
                onChange={(e) => setForm(prev => ({ ...prev, announcement_active: e.target.checked }))}
                className="accent-amber-500 w-4 h-4 rounded"
              />
              <span className="font-semibold text-white">Enable Bar</span>
            </label>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Promotional Announcement Text</label>
            <textarea
              rows={2}
              name="announcement_text"
              value={form.announcement_text}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Promo Code Pill (Optional)</label>
              <input
                type="text"
                name="announcement_code"
                value={form.announcement_code || ''}
                onChange={handleChange}
                placeholder="e.g. AQUA10"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 font-mono text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Target Route Link</label>
              <input
                type="text"
                name="announcement_link"
                value={form.announcement_link || ''}
                onChange={handleChange}
                placeholder="/shop?cat=cat-betta"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white outline-none"
              />
            </div>
          </div>
        </div>

        {/* Brand Contact Coordinates */}
        <div className="bg-slate-800/80 rounded-3xl p-6 border border-slate-700 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-slate-700">
            Brand Identity & Support Lines
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Brand Name</label>
              <input
                type="text"
                name="brand_name"
                value={form.brand_name}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Support Email</label>
              <input
                type="email"
                name="contact_email"
                value={form.contact_email}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">WhatsApp Number</label>
              <input
                type="text"
                name="whatsapp_number"
                value={form.whatsapp_number}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-ocean-950 font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Store Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
