import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, MapPin, Package, Heart, Plus, 
  Trash2, Check, Sparkles, Shield, LogOut 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { mockDb } from '../lib/mockDatabase';

export const AccountPage: React.FC = () => {
  const { user, isAdmin, addresses, addAddress, deleteAddress, setDefaultAddress, logout, switchRole } = useAuth();
  const { showToast } = useToast();

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  const ordersCount = mockDb.getOrders().length;

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
      city,
      state,
      postal_code: pincode,
      is_default: addresses.length === 0,
    });
    showToast('New address saved!', 'success');
    setName('');
    setPhone('');
    setStreet('');
    setCity('');
    setState('');
    setPincode('');
    setIsAddingAddress(false);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-6 sm:py-10">
      <div className="max-w-5xl mx-auto px-4">
        {/* Profile Card Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-ocean-950 text-aqua-400 border border-ocean-800 flex items-center justify-center text-2xl font-bold font-display shadow-glow-aqua shrink-0">
              {user?.full_name?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-ocean-950 font-display">
                  {user?.full_name || 'Collector Guest'}
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-aqua-100 text-aqua-800">
                  {user?.role === 'admin' ? 'Store Administrator' : 'Verified Member'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{user?.email || 'guest@bettaaquatics.in'}</p>
              {user?.phone && (
                <p className="text-xs text-slate-400 mt-0.5">{user.phone}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => switchRole(isAdmin ? 'customer' : 'admin')}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-ocean-900 text-aqua-300 border border-ocean-800 hover:bg-ocean-800 transition-colors"
            >
              {isAdmin ? 'Switch to Customer View' : 'Switch to Admin Console'}
            </button>
            <button
              onClick={logout}
              className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Links Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <Link
            to="/account/orders"
            className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-aqua-400 transition-all flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-aqua-50 text-aqua-700 flex items-center justify-center shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Consignments</span>
              <strong className="text-sm text-slate-900 font-display">Orders History</strong>
            </div>
          </Link>

          <Link
            to="/account/wishlist"
            className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-aqua-400 transition-all flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Saved Fish</span>
              <strong className="text-sm text-slate-900 font-display">My Wishlist</strong>
            </div>
          </Link>

          <Link
            to="/page/shipping-acclimation"
            className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-aqua-400 transition-all flex items-center gap-4 col-span-2 sm:col-span-1"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Acclimation</span>
              <strong className="text-sm text-slate-900 font-display">DOA Cover Guide</strong>
            </div>
          </Link>
        </div>

        {/* Saved Addresses Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div>
              <h2 className="text-lg font-bold text-ocean-950 font-display">
                Saved Delivery Addresses
              </h2>
              <p className="text-xs text-slate-500">Manage destinations for live oxygen transport</p>
            </div>
            <button
              onClick={() => setIsAddingAddress(!isAddingAddress)}
              className="flex items-center gap-1.5 px-4 py-2 bg-ocean-900 text-white font-bold text-xs rounded-xl hover:bg-ocean-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Address</span>
            </button>
          </div>

          {/* New Address Form */}
          {isAddingAddress && (
            <form onSubmit={handleAddAddress} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 mb-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Add Address Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                  />
                </div>
              </div>
              <div className="text-xs">
                <label className="block text-slate-600 mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">PIN Code</label>
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
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
