import React, { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, ShoppingCart, Package, Palette, 
  Settings, History, LogOut, Menu, X, ArrowLeft, 
  ExternalLink, Bell, Sparkles, ShieldCheck 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { mockDb } from '../../lib/mockDatabase';

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const { user, switchRole, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Count of pending payments
  const pendingPaymentsCount = mockDb.getOrders().filter(o => o.payment_status === 'pending').length;

  const navLinks = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { 
      label: 'Orders & Verification', 
      path: '/admin/orders', 
      icon: ShoppingCart, 
      badge: pendingPaymentsCount > 0 ? pendingPaymentsCount : undefined 
    },
    { label: 'Products & Inventory', path: '/admin/products', icon: Package },
    { label: 'Visual CMS & Pages', path: '/admin/cms', icon: Palette },
    { label: 'Store & UPI Settings', path: '/admin/settings', icon: Settings },
    { label: 'Security & Audit Logs', path: '/admin/audit', icon: History },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
      {/* Admin Top Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 px-4 sm:px-6 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-ocean-950 p-1 flex items-center justify-center shadow-xs">
              <img src="/logo-fish.svg" alt="Betta Aquatics" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-display font-extrabold text-sm sm:text-base tracking-wider text-ocean-950 uppercase">
                BETTA <span className="text-aqua-600">ADMIN</span>
              </span>
              <span className="block text-[9px] uppercase tracking-widest text-slate-400 font-mono -mt-0.5">
                Executive Console & Operations
              </span>
            </div>
          </Link>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2.5">
          {/* Quick Return to Storefront */}
          <Link
            to="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-700 hover:text-ocean-950 font-semibold px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-aqua-600" />
            <span>View Live Store</span>
          </Link>

          {/* Role Toggle Switch */}
          <button
            onClick={() => {
              switchRole('customer');
              navigate('/shop');
            }}
            className="text-xs px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-aqua-600" />
            <span className="hidden sm:inline">Switch to Customer View</span>
            <span className="sm:hidden">Customer</span>
          </button>

          <button
            onClick={logout}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
            title="Log Out"
            aria-label="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar Navigation (Pristine White) */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200/90 p-4 justify-between shrink-0 shadow-2xs">
          <div className="space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
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
                        ? 'bg-ocean-950 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[10px] px-2 py-0.5 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Admin User Card */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-[10px] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Admin Online</span>
            </div>
            <div className="font-bold text-slate-900 truncate">{user?.full_name || 'Aathil (Admin)'}</div>
            <div className="text-[10px] text-slate-500">Super Administrator Access</div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="relative w-4/5 max-w-xs bg-white text-slate-900 h-full p-4 flex flex-col justify-between overflow-y-auto z-10 border-r border-slate-200 shadow-xl">
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="font-bold text-sm text-ocean-950 font-display uppercase tracking-wide">
                    Admin Modules
                  </span>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 rounded-lg hover:bg-slate-100">
                    <X className="w-5 h-5 text-slate-500" />
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
                              ? 'bg-ocean-950 text-white shadow-sm'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                          }`
                        }
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4 shrink-0" />
                          <span>{link.label}</span>
                        </div>
                        {link.badge && (
                          <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[10px] px-2 py-0.5 rounded-full">
                            {link.badge}
                          </span>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <Link
                  to="/"
                  className="block text-center py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl mb-2 transition-colors"
                >
                  View Public Store
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Content Viewport (Clean light backdrop) */}
        <main className="flex-1 overflow-y-auto bg-slate-50/70 p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
