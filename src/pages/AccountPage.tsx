import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, MapPin, Package, Heart, Plus, 
  Trash2, Check, Sparkles, Shield, ShieldCheck, LogOut, 
  FileText, Printer, ArrowRight, Clock, 
  CheckCircle2, AlertCircle, Phone, Mail, Edit3, Save
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { mockDb } from '../lib/mockDatabase';
import { formatCurrency, formatDate } from '../lib/utils';
import { SEO } from '../components/common/SEO';
import { TaxInvoiceModal } from '../components/common/TaxInvoiceModal';
import { Order } from '../lib/types';

export const AccountPage: React.FC = () => {
  const { user, isAdmin, addresses, addAddress, deleteAddress, setDefaultAddress, logout, switchRole } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'orders' | 'billing' | 'addresses' | 'profile'>('orders');

  // Selected Order for Invoice Modal
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  // Address form state
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [state, setState] = useState('Karnataka');
  const [pincode, setPincode] = useState('560038');

  // Profile form state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(user?.full_name || 'Rahul Sharma');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '+91 98450 12345');
  const [profileNotes, setProfileNotes] = useState('Prefer weekend delivery for live fish shipments. Call before arrival.');

  const userOrders = mockDb.getOrdersByUserId(user?.id || 'usr-customer-demo');
  const allOrders = userOrders.length > 0 ? userOrders : mockDb.getOrders();
  const totalSpent = allOrders.reduce((sum, o) => sum + o.total_amount, 0);

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !street || !city || !state || !pincode) {
      showToast('Please fill out all address fields', 'error');
      return;
    }
    addAddress({
      full_name: name,
      phone,
      street_address: street,
      landmark: landmark || undefined,
      city,
      state,
      postal_code: pincode,
      is_default: addresses.length === 0,
    });
    showToast('New delivery address saved!', 'success');
    setName('');
    setPhone('');
    setStreet('');
    setLandmark('');
    setIsAddingAddress(false);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingProfile(false);
    showToast('Profile and dispatch preferences updated successfully!', 'success');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-6 sm:py-10 pb-24 md:pb-12">
      <SEO 
        title="My Account & Billing | Betta Aquatics" 
        description="Manage your Betta Aquatics profile, saved addresses, consignment orders, and GST tax invoices." 
      />

      <div className="max-w-5xl mx-auto px-4">
        {/* Profile Card Header */}
        <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-900 text-white border border-slate-800 flex items-center justify-center text-xl sm:text-2xl font-bold font-display shadow-xs shrink-0">
              {profileName.charAt(0) || 'U'}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg sm:text-2xl font-bold text-ocean-950 font-display">
                  {profileName}
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-aqua-100 text-aqua-800">
                  {user?.role === 'admin' ? 'Store Administrator' : 'Verified Hobbyist'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{user?.email || 'customer@bettaaquatics.in'}</p>
              <p className="text-xs text-slate-400 mt-0.5">{profilePhone}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => switchRole(isAdmin ? 'customer' : 'admin')}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-ocean-900 text-aqua-300 border border-ocean-800 hover:bg-ocean-800 transition-colors"
            >
              {isAdmin ? 'Customer View' : 'Admin Console'}
            </button>
            <button
              onClick={logout}
              className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Account Stat Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] text-slate-400 block font-medium">Consignments</span>
            <strong className="text-lg sm:text-xl text-slate-900 font-display">{allOrders.length} Orders</strong>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] text-slate-400 block font-medium">Total Billed</span>
            <strong className="text-lg sm:text-xl text-ocean-950 font-display">{formatCurrency(totalSpent)}</strong>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] text-slate-400 block font-medium">Saved Addresses</span>
            <strong className="text-lg sm:text-xl text-slate-900 font-display">{addresses.length} Locations</strong>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] text-slate-400 block font-medium">Live Guarantee</span>
            <strong className="text-lg sm:text-xl text-emerald-600 font-display">100% Covered</strong>
          </div>
        </div>

        {/* Tab Navigation Pill Bar (Mobile-first horizontal scroll) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
          <button
            onClick={() => setActiveTab('orders')}
            className={`min-h-[44px] px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-ocean-900 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Package className="w-4 h-4 text-aqua-400" />
            <span>Consignments & Orders ({allOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('billing')}
            className={`min-h-[44px] px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'billing'
                ? 'bg-ocean-900 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-4 h-4 text-aqua-400" />
            <span>Bills & Tax Invoices</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`min-h-[44px] px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'addresses'
                ? 'bg-ocean-900 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <MapPin className="w-4 h-4 text-aqua-400" />
            <span>Saved Addresses ({addresses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`min-h-[44px] px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-ocean-900 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <User className="w-4 h-4 text-aqua-400" />
            <span>Profile & Care Notes</span>
          </button>
        </div>

        {/* TAB CONTENT: 1. ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div>
                  <h2 className="text-base font-bold text-ocean-950 font-display">
                    Your Live Consignment Orders
                  </h2>
                  <p className="text-xs text-slate-500">Live air-transit and payment verification status</p>
                </div>
                <Link
                  to="/shop"
                  className="text-xs font-bold text-aqua-700 hover:underline inline-flex items-center gap-1"
                >
                  <span>Explore Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {allOrders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-xs text-slate-500">You haven't placed any live fish orders yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {allOrders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-aqua-400 transition-all bg-slate-50/50 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/70 text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <strong className="font-mono text-sm text-ocean-950 font-bold">
                              #{order.order_number}
                            </strong>
                            <span className="text-slate-400">&bull;</span>
                            <span className="text-slate-500">{formatDate(order.created_at)}</span>
                          </div>
                          <span className="text-[11px] text-slate-400">
                            {order.items.length} {order.items.length === 1 ? 'Specimen' : 'Specimens'}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase border ${
                            order.payment_status === 'verified'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : order.payment_status === 'rejected'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}>
                            Payment: {order.payment_status}
                          </span>

                          <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase border bg-ocean-950 text-aqua-300 border-ocean-800">
                            Status: {order.fulfillment_status}
                          </span>
                        </div>
                      </div>

                      {/* Items Row */}
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.product_image}
                                alt={item.product_name}
                                className="w-10 h-10 rounded-xl object-cover bg-white border border-slate-200"
                              />
                              <div>
                                <span className="font-semibold text-slate-800 line-clamp-1">{item.product_name}</span>
                                <span className="text-[10px] text-slate-400">Qty: {item.quantity}</span>
                              </div>
                            </div>
                            <span className="font-bold text-slate-900 font-mono">
                              {formatCurrency(item.total_price)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Action Bar */}
                      <div className="pt-3 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="font-bold text-ocean-950">
                          Total Amount: <span className="text-base font-extrabold">{formatCurrency(order.total_amount)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedInvoiceOrder(order)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-white text-slate-700 font-bold transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5 text-aqua-600" />
                            <span>Tax Invoice</span>
                          </button>

                          <Link
                            to={`/account/orders/${order.id}`}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-ocean-900 hover:bg-ocean-800 text-white font-bold transition-colors"
                          >
                            <span>Order & Courier Tracking</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB CONTENT: 2. BILLING & TAX INVOICES */}
        {activeTab === 'billing' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 mb-6">
                <div>
                  <h2 className="text-base font-bold text-ocean-950 font-display">
                    Official GST Tax Invoices & Billing Records
                  </h2>
                  <p className="text-xs text-slate-500">
                    Compliant with Indian Tax Code & Live Stock Exemption Rules (Notification No. 2/2017)
                  </p>
                </div>
                <div className="text-xs font-mono text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 inline-block self-start sm:self-auto">
                  GSTIN: <strong>29AABCB1234F1Z5</strong>
                </div>
              </div>

              {/* Billing Cards list */}
              <div className="space-y-3">
                {allOrders.map((order) => {
                  const invNum = `INV-${order.order_number.replace('BA-', '')}`;
                  return (
                    <div
                      key={order.id}
                      className="p-4 rounded-2xl border border-slate-200 hover:border-aqua-400 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-ocean-950">{invNum}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-emerald-100 text-emerald-800">
                            Tax Paid
                          </span>
                        </div>
                        <div className="text-slate-500">
                          For Order: <strong className="font-mono text-slate-700">{order.order_number}</strong> &bull; {formatDate(order.created_at)}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Payee Ref / UTR: <span className="font-mono text-slate-600">{order.payment_details?.upi_reference || 'N/A'}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                        <div className="sm:text-right">
                          <span className="text-[10px] text-slate-400 block uppercase">Total Invoice Value</span>
                          <span className="font-extrabold text-base text-ocean-950 font-display">
                            {formatCurrency(order.total_amount)}
                          </span>
                        </div>

                        <button
                          onClick={() => setSelectedInvoiceOrder(order)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-ocean-900 hover:bg-ocean-800 text-white rounded-xl font-bold transition-all shadow-sm active:scale-95"
                        >
                          <Printer className="w-3.5 h-3.5 text-aqua-400" />
                          <span>View & Print</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Informative Tax Note */}
              <div className="mt-6 p-4 bg-sky-50/70 rounded-2xl border border-sky-200 text-xs text-sky-950 space-y-1.5">
                <div className="font-bold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-sky-600" />
                  <span>Tax Invoice & Accounting Notes</span>
                </div>
                <p className="text-sky-800 text-[11px] leading-relaxed">
                  All invoices generated above are legally valid under Indian law. Live ornamental fish (HSN 0301) carry 0% GST. Insulated oxygen packing and courier freight are billed transparently on the receipt.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: 3. SAVED ADDRESSES */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div>
                  <h2 className="text-base font-bold text-ocean-950 font-display">
                    Saved Delivery Addresses
                  </h2>
                  <p className="text-xs text-slate-500">Destination addresses for oxygen-insulated consignments</p>
                </div>
                <button
                  onClick={() => setIsAddingAddress(!isAddingAddress)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-ocean-900 text-white font-bold text-xs rounded-xl hover:bg-ocean-800 transition-colors"
                >
                  <Plus className="w-4 h-4 text-aqua-400" />
                  <span>Add New</span>
                </button>
              </div>

              {/* Add Address Form */}
              {isAddingAddress && (
                <form onSubmit={handleAddAddress} className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 mb-6 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Add New Delivery Destination</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-aqua-500"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Mobile Phone (For Air Courier) *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98450 12345"
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-aqua-500"
                      />
                    </div>
                  </div>

                  <div className="text-xs">
                    <label className="block font-semibold text-slate-700 mb-1">Door / Flat / Street Address *</label>
                    <input
                      type="text"
                      required
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="Apartment, building, and street name"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-aqua-500"
                    />
                  </div>

                  <div className="text-xs">
                    <label className="block font-semibold text-slate-700 mb-1">Nearby Landmark (Optional)</label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="e.g. Near Metro Station / Behind Temple"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-aqua-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">City *</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">State *</label>
                      <input
                        type="text"
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">PIN Code *</label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2 bg-ocean-900 text-white font-bold text-xs rounded-xl hover:bg-ocean-800"
                    >
                      Save Address
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="px-4 py-2 border border-slate-300 text-slate-600 font-semibold text-xs rounded-xl"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Addresses Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`p-4 rounded-2xl border text-xs flex flex-col justify-between ${
                      addr.is_default ? 'border-aqua-500 bg-aqua-50/20 ring-1 ring-aqua-500' : 'border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-900 text-sm">{addr.full_name}</span>
                        {addr.is_default && (
                          <span className="text-[10px] font-bold bg-aqua-100 text-aqua-800 px-2 py-0.5 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="text-slate-500 mb-2">Ph: {addr.phone}</div>
                      <p className="text-slate-600 leading-relaxed">
                        {addr.street_address}, {addr.landmark && `${addr.landmark}, `}{addr.city}, {addr.state} - <strong>{addr.postal_code}</strong>
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 mt-4 flex items-center justify-between">
                      {!addr.is_default && (
                        <button
                          onClick={() => setDefaultAddress(addr.id)}
                          className="text-aqua-700 hover:underline font-semibold"
                        >
                          Set as Default
                        </button>
                      )}
                      <button
                        onClick={() => deleteAddress(addr.id)}
                        className="text-slate-400 hover:text-rose-600 ml-auto p-1"
                        title="Delete address"
                        aria-label="Delete address"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: 4. PROFILE & CARE SETTINGS */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div>
                  <h2 className="text-base font-bold text-ocean-950 font-display">
                    Hobbyist Profile & Delivery Preferences
                  </h2>
                  <p className="text-xs text-slate-500">Personalize your customer account details and dispatch notes</p>
                </div>
                <button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <Edit3 className="w-3.5 h-3.5 text-aqua-600" />
                  <span>{isEditingProfile ? 'Cancel' : 'Edit Profile'}</span>
                </button>
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-aqua-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Mobile Phone (For SMS courier alerts)</label>
                    <input
                      type="tel"
                      required
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-aqua-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Special Acclimation & Delivery Instructions</label>
                    <textarea
                      rows={3}
                      value={profileNotes}
                      onChange={(e) => setProfileNotes(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-aqua-500"
                      placeholder="e.g. Ring doorbell twice; I work from home and need to float fish immediately."
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-ocean-900 hover:bg-ocean-800 text-white font-bold rounded-xl text-xs flex items-center gap-2"
                  >
                    <Save className="w-4 h-4 text-aqua-400" />
                    <span>Save Changes</span>
                  </button>
                </form>
              ) : (
                <div className="space-y-4 max-w-xl text-xs">
                  <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Collector Name</span>
                      <strong className="text-slate-900 font-semibold">{profileName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Primary Phone</span>
                      <strong className="text-slate-900 font-semibold">{profilePhone}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Account Email</span>
                      <strong className="text-slate-900 font-semibold">{user?.email || 'customer@bettaaquatics.in'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Membership Status</span>
                      <strong className="text-emerald-700 font-semibold">Active Collector</strong>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-slate-400 block text-[11px] mb-1">Dispatch & Care Instructions on Crate</span>
                    <p className="text-slate-700 italic leading-relaxed">
                      "{profileNotes}"
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Reusable Tax Invoice Modal */}
      <TaxInvoiceModal
        isOpen={Boolean(selectedInvoiceOrder)}
        order={selectedInvoiceOrder}
        onClose={() => setSelectedInvoiceOrder(null)}
      />
    </div>
  );
};
