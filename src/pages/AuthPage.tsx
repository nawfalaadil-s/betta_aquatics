import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, User, Phone, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, register, switchRole } = useAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      if (!email) {
        showToast('Please enter your email', 'error');
        return;
      }
      await login(email, password);
      showToast('Logged in successfully!', 'success');
      navigate(-1);
    } else {
      if (!name || !email) {
        showToast('Please enter your name and email', 'error');
        return;
      }
      await register(name, email, password, phone);
      showToast('Account created successfully!', 'success');
      navigate('/');
    }
  };

  const handleDemoCustomer = () => {
    switchRole('customer');
    showToast('Switched to Demo Customer (Rahul Sharma)', 'success');
    navigate('/shop');
  };

  const handleDemoAdmin = () => {
    switchRole('admin');
    showToast('Switched to Store Administrator Console', 'success');
    navigate('/admin');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-11 h-11 rounded-xl bg-slate-900 p-2 mx-auto flex items-center justify-center shadow-xs mb-3">
            <img src="/logo-fish.svg" alt="Betta Aquatics" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-display">
            BETTA AQUATICS
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Live Fish & Aquarium Store
          </p>
        </div>

        {/* Quick Demo Switcher Bar */}
        <div className="bg-ocean-950 text-white rounded-2xl p-4 border border-ocean-800 shadow-md mb-6 space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-aqua-400 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Pair-Programming / Testing Logins:</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleDemoCustomer}
              className="py-2 px-3 rounded-xl bg-ocean-900 hover:bg-ocean-800 border border-ocean-700 text-xs font-semibold text-slate-200 hover:text-white transition-colors text-left"
            >
              <span className="block font-bold text-aqua-300">Customer Mode</span>
              <span className="text-[10px] text-slate-400">Cart, Orders & Tracking</span>
            </button>
            <button
              type="button"
              onClick={handleDemoAdmin}
              className="py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-xs font-semibold text-amber-200 transition-colors text-left"
            >
              <span className="block font-bold text-amber-300">Admin Mode</span>
              <span className="text-[10px] text-amber-400">Verify UPI & Dispatch</span>
            </button>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl">
          {/* Mode Switcher */}
          <div className="flex border-b border-slate-100 mb-6">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 pb-3 text-xs sm:text-sm font-bold transition-colors relative ${
                mode === 'login' ? 'text-ocean-950' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Customer Sign In
              {mode === 'login' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-aqua-500 rounded-full" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 pb-3 text-xs sm:text-sm font-bold transition-colors relative ${
                mode === 'register' ? 'text-ocean-950' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Create Account
              {mode === 'register' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-aqua-500 rounded-full" />
              )}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 outline-none focus:border-aqua-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 outline-none focus:border-aqua-500"
                />
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number (For Courier)</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98450 12345"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 outline-none focus:border-aqua-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 outline-none focus:border-aqua-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-ocean-900 hover:bg-ocean-800 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 mt-2"
            >
              <span>{mode === 'login' ? 'Sign In to Account' : 'Register Account'}</span>
              <ArrowRight className="w-4 h-4 text-aqua-400" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
