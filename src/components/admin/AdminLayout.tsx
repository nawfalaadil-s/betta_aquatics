import React, { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, ShoppingCart, Package, Palette, 
  Settings, History, LogOut, Menu, X, ArrowLeft, 
  ExternalLink, Bell, Sparkles, ShieldAlert 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { mockDb } from '../../lib/mockDatabase';

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const { user, switchRole, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Get count of pending payments
  const pendingPaymentsCount = mockDb.getOrders().filter(o => o.payment_status === 'pending').length;

  const navLinks = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { 
      label: 'Orders & Fulfillment', 
      path: '/admin/orders', 
      icon: ShoppingCart, 
      badge: pendingPaymentsCount > 0 ? pendingPaymentsCount : undefined 
    },
    { label: 'Products & Stock', path: '/admin/products', icon: Package },
    { label: 'Visual CMS Builder', path: '/admin/cms', icon: Palette },
    { label: 'Store & UPI Settings', path: '/admin/settings', icon: Settings },
    { label: 'Security & Audit Logs', path: '/admin/audit', icon: History },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Admin Top Header */}
      <header className="sticky top-0 z-40 bg-ocean-950 border-b border-ocean-800 px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-ocean-900"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 p-1 flex items-center justify-center">
              <img src="/logo-fish.svg" alt="Betta Aquatics" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-display font-extrabold text-sm sm:text-base tracking-wider text-white uppercase">
                BETTA <span className="text-amber-400">ADMIN</span>
              </span>
              <span className="block text-[9px] uppercase tracking-widest text-slate-400 font-mono -mt-0.5">
                Operations & CMS Console
              </span>
            </div>
          </Link>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-3">
          {/* Quick Return to Storefront */}
          <Link
            to="/"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-aqua-400 hover:text-aqua-300 font-semibold px-3 py-1.5 rounded-xl bg-ocean-900/80 border border-aqua-400/30 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Public Storefront</span>
          </Link>

          {/* Role Toggle Switch */}
          <button
            onClick={() => {
              switchRole('customer');
              navigate('/shop');
            }}
            className="text-xs px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-aqua-400" />
            <span className="hidden sm:inline">Switch to Customer View</span>
            <span className="sm:hidden">Customer</span>
          </button>

          <button
            onClick={logout}
            className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-xl"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:flex flex-col w-64 bg-ocean-950/70 border-r border-ocean-800/80 p-4 justify-between shrink-0">
          <div className="space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Management Modules
            </div>
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/admin'}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-ocean-900/60'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="bg-amber-500 text-ocean-950 font-black text-[10px] px-2 py-0.5 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Admin User Card */}
          <div className="p-3 bg-ocean-900/60 rounded-2xl border border-ocean-800 text-xs">
            <div className="text-[10px] text-slate-400">Active Officer</div>
            <div className="font-bold text-white truncate">{user?.full_name || 'Aathil (Admin)'}</div>
            <div className="text-[10px] text-amber-400 font-mono mt-0.5">Role: Super Administrator</div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="relative w-4/5 max-w-xs bg-ocean-950 text-white h-full p-4 flex flex-col justify-between overflow-y-auto z-10 border-r border-ocean-800">
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-3 border-b border-ocean-800">
                  <span className="font-bold text-sm text-white">Admin Modules</span>
                  <button onClick={() => setIsMobileMenuOpen(false)}>
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
                <div className="space-y-1 pt-2">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <NavLink
                        key={link.path}
                        to={link.path}
                        end={link.path === '/admin'}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                            isActive
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-ocean-900'
                          }`
                        }
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4 shrink-0" />
                          <span>{link.label}</span>
                        </div>
                        {link.badge && (
                          <span className="bg-amber-500 text-ocean-950 font-black text-[10px] px-2 py-0.5 rounded-full">
                            {link.badge}
                          </span>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-ocean-800">
                <Link
                  to="/"
                  className="block text-center py-2.5 bg-aqua-500/20 border border-aqua-400/30 text-aqua-300 text-xs font-bold rounded-xl mb-2"
                >
                  View Public Store
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto bg-slate-900 p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
