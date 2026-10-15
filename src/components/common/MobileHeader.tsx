import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Menu, X, Search, ShoppingCart, Heart, 
  User, Package, ShieldCheck, HelpCircle, 
  Phone, Sparkles, ChevronRight, Settings 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { mockDb } from '../../lib/mockDatabase';
import { Product } from '../../lib/types';
import { formatCurrency } from '../../lib/utils';

export const MobileHeader: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAdmin, switchRole, logout } = useAuth();
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(() => {
      const all = mockDb.getProducts();
      const filtered = all.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.strain && p.strain.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setSuggestions(filtered.slice(0, 4));
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearchOpen(false);
    navigate(`/shop?q=${encodeURIComponent(searchQuery)}`);
  };

  const categories = mockDb.getCategories();

  return (
    <div className="md:hidden sticky top-0 z-40 bg-ocean-950 text-white shadow-md border-b border-ocean-900">
      {/* Top Main Mobile Bar */}
      <div className="px-3.5 py-2.5 flex items-center justify-between gap-2">
        {/* Menu Drawer Toggle */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="p-1.5 -ml-1 text-slate-300 hover:text-white rounded-lg active:bg-ocean-900 transition-colors"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Center Logo */}
        <Link to="/" className="flex items-center gap-1.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-ocean-900 to-ocean-800 border border-aqua-400/40 p-0.5 flex items-center justify-center shadow-glow-aqua">
            <img src="/logo-fish.svg" alt="Betta Aquatics" className="w-full h-full object-contain" />
          </div>
          <span className="font-display font-extrabold text-lg tracking-wider text-white uppercase">
            BETTA <span className="text-aqua-400">AQUATICS</span>
          </span>
        </Link>

        {/* Right Action Icons: Search, Wishlist, Cart */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 text-slate-300 hover:text-white rounded-lg active:bg-ocean-900"
            aria-label="Search Store"
          >
            <Search className="w-5 h-5" />
          </button>

          <Link
            to="/cart"
            className="p-2 text-slate-300 hover:text-white rounded-lg active:bg-ocean-900 relative"
            aria-label="Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute 1 top-1 right-1 bg-aqua-400 text-ocean-950 font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Expandable Mobile Search Bar */}
      {isSearchOpen && (
        <div className="p-3 bg-ocean-900 border-t border-ocean-800 animate-in fade-in slide-in-from-top-1">
          <form onSubmit={handleSearchSubmit} className="flex items-center bg-white rounded-xl overflow-hidden px-3 py-1.5 shadow-md">
            <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Bettas, Guppies, Plants..."
              className="w-full text-sm text-slate-900 placeholder-slate-400 outline-none bg-transparent"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="ml-2 bg-aqua-500 text-ocean-950 font-bold text-xs px-3 py-1 rounded-lg shrink-0"
            >
              Go
            </button>
          </form>

          {/* Instant Suggestions on Mobile */}
          {suggestions.length > 0 && (
            <div className="mt-2 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden divide-y divide-slate-100 text-slate-900">
              {suggestions.map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.slug}`}
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="flex items-center gap-2.5 p-2 hover:bg-slate-50"
                >
                  <img src={p.images[0]} alt={p.name} className="w-9 h-9 rounded object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold truncate">{p.name}</div>
                    <div className="text-[10px] text-slate-500">{p.category_name}</div>
                  </div>
                  <div className="text-xs font-bold text-ocean-950">{formatCurrency(p.price)}</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Horizontal Scrollable Category Navigation Strip */}
      <div className="bg-ocean-950/90 border-t border-ocean-900/60 px-2 py-2 overflow-x-auto no-scrollbar flex items-center gap-2">
        <Link
          to="/shop"
          className="whitespace-nowrap text-xs font-semibold px-3 py-1 rounded-full bg-ocean-800 text-slate-200 active:bg-aqua-500 active:text-ocean-950 transition-colors"
        >
          All Items
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            to={`/shop?cat=${c.id}`}
            className="whitespace-nowrap text-xs font-medium px-3 py-1 rounded-full bg-ocean-900/60 text-slate-300 hover:text-white border border-ocean-800 active:bg-aqua-500 active:text-ocean-950 transition-colors"
          >
            {c.name}
          </Link>
        ))}
      </div>

      {/* Accessible Slide-Out Mobile Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-ocean-950/70 backdrop-blur-sm"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-white text-slate-900 h-full shadow-2xl flex flex-col justify-between overflow-y-auto z-10 animate-in slide-in-from-left duration-200">
            {/* Drawer Header */}
            <div>
              <div className="bg-ocean-950 text-white p-4 flex items-center justify-between border-b border-ocean-900">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-ocean-900 border border-aqua-400/40 p-1 flex items-center justify-center">
                    <img src="/logo-fish.svg" alt="Betta Aquatics" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <div className="font-display font-bold text-sm">BETTA AQUATICS</div>
                    <div className="text-[10px] text-aqua-300">Living Aquatic Jewels</div>
                  </div>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1 rounded-lg text-slate-300 hover:text-white"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Greeting Card */}
              <div className="p-4 bg-slate-50 border-b border-slate-200/80">
                {user ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-500">Logged in as</div>
                      <div className="font-bold text-slate-900 text-sm">{user.full_name}</div>
                      <div className="text-[11px] text-slate-500">{user.email}</div>
                    </div>
                    <button
                      onClick={() => switchRole(isAdmin ? 'customer' : 'admin')}
                      className="text-[10px] font-semibold bg-aqua-100 text-aqua-900 px-2 py-1 rounded-lg border border-aqua-200"
                    >
                      {isAdmin ? 'Admin Mode' : 'Customer'}
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setIsDrawerOpen(false)}
                    className="block text-center py-2 bg-ocean-900 text-white font-bold text-xs rounded-xl"
                  >
                    Login / Create Account
                  </Link>
                )}
              </div>

              {/* Navigation Links */}
              <div className="p-3 text-sm divide-y divide-slate-100">
                <div className="py-2">
                  <Link
                    to="/shop"
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 font-semibold text-slate-800"
                  >
                    <span>Browse All Livestock & Tanks</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                  <Link
                    to="/shop?cat=cat-betta"
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700"
                  >
                    <span>Show Bettas (Halfmoon, Plakat)</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                  <Link
                    to="/shop?cat=cat-guppy"
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700"
                  >
                    <span>Rare Guppies & Breeding Pairs</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                  <Link
                    to="/shop?cat=cat-plants"
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700"
                  >
                    <span>Aquatic Plants & Aquascaping</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                </div>

                <div className="py-2">
                  <Link
                    to="/account/orders"
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 text-slate-700"
                  >
                    <Package className="w-4 h-4 text-aqua-600" />
                    <span>My Orders & Live Tracking</span>
                  </Link>
                  <Link
                    to="/account/wishlist"
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 text-slate-700"
                  >
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span>Wishlist ({wishlistCount})</span>
                  </Link>
                  <Link
                    to="/page/shipping-acclimation"
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 text-slate-700"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Live Arrival Guarantee Guide</span>
                  </Link>
                  <Link
                    to="/page/faq"
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 text-slate-700"
                  >
                    <HelpCircle className="w-4 h-4 text-sky-600" />
                    <span>Frequently Asked Questions</span>
                  </Link>
                </div>

                {/* Admin Mode Direct Switcher */}
                <div className="py-2">
                  <Link
                    to="/admin"
                    onClick={() => {
                      setIsDrawerOpen(false);
                      switchRole('admin');
                    }}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-amber-50 text-amber-900 font-semibold"
                  >
                    <Settings className="w-4 h-4 text-amber-700" />
                    <span>Open Admin Management</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200">
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-600 text-white font-semibold text-xs rounded-xl shadow-sm"
              >
                <Phone className="w-4 h-4" />
                <span>Chat On WhatsApp</span>
              </a>
              {user && (
                <button
                  onClick={() => {
                    logout();
                    setIsDrawerOpen(false);
                  }}
                  className="w-full mt-2 text-xs text-rose-600 font-semibold text-center py-1.5"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
