import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, ShoppingCart, Heart, User, 
  ChevronDown, LogOut, Package, X, 
  Settings, MessageCircle, ShieldCheck 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { formatCurrency } from '../../lib/utils';
import { mockDb } from '../../lib/mockDatabase';
import { Product } from '../../lib/types';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAdmin, logout, switchRole } = useAuth();
  const { itemCount, subtotal } = useCart();
  const { wishlistCount } = useWishlist();

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  // Debounced search autocomplete
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      const allProducts = mockDb.getProducts();
      const filtered = allProducts.filter((p) => {
        return (
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.strain && p.strain.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (p.category_name && p.category_name.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      });
      setSuggestions(filtered.slice(0, 5));
    }, 180);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setIsAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearchOpen(false);
    navigate(`/shop?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-white text-slate-900 border-b border-slate-200 shadow-xs">
      {/* Top Notification & Trust Bar */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-1.5 text-[11px] text-slate-600 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Bengaluru Quarantine Facility • Daily Live Dispatches</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Overnight Air Cargo with 100% Live Arrival Guarantee</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-slate-700 hover:text-teal-700 transition-colors font-medium"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp: +91 98765 43210</span>
            </a>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => switchRole(isAdmin ? 'customer' : 'admin')}
              className="text-[10px] text-slate-500 hover:text-slate-800 font-mono transition-colors"
            >
              Role: <strong className="text-slate-900 font-semibold">{isAdmin ? 'Admin' : 'Customer'}</strong>
            </button>
          </div>
        </div>
      </div>

      {/* Main Brand & Search Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-6">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-9 h-9 rounded-xl bg-slate-900 p-1 flex items-center justify-center shadow-xs">
            <img src="/logo-fish.svg" alt="Betta Aquatics" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="font-display font-extrabold text-xl tracking-tight text-slate-950 uppercase">
              BETTA <span className="text-teal-600">AQUATICS</span>
            </span>
            <span className="block text-[10px] tracking-wider text-slate-500 uppercase font-medium -mt-1">
              Live Fish & Aquarium Store
            </span>
          </div>
        </Link>

        {/* Global Search Bar */}
        <div ref={searchRef} className="flex-1 max-w-xl relative hidden md:block">
          <form onSubmit={handleSearchSubmit} className="flex items-center rounded-xl overflow-hidden border border-slate-300 bg-slate-50/50 hover:bg-white focus-within:bg-white focus-within:border-slate-800 transition-all">
            <div className="pl-3.5 flex items-center text-slate-400">
              <Search className="w-4 h-4" />
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Search Bettas, Guppies, Live Plants, Tank Supplies..."
              className="flex-1 px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none bg-transparent"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSuggestions([]);
                }}
                className="px-2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2 m-1 rounded-lg transition-colors"
            >
              Search
            </button>
          </form>

          {/* Autocomplete Dropdown */}
          {isSearchOpen && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50">
              <div className="p-2.5 border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Matching Live Specimens</span>
                <span className="text-teal-700 font-bold">{suggestions.length} found</span>
              </div>
              <div className="divide-y divide-slate-100">
                {suggestions.map((item) => (
                  <Link
                    key={item.id}
                    to={`/product/${item.slug}`}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors"
                  >
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-100"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-900 truncate">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {item.category_name} {item.strain && `• ${item.strain}`}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold text-slate-900">
                        {formatCurrency(item.price)}
                      </div>
                      {item.is_unique_specimen && (
                        <span className="text-[10px] text-teal-700 font-semibold block">1 in stock</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Actions: Wishlist, Account, Cart */}
        <div className="flex items-center gap-3">
          {/* Wishlist */}
          <Link
            to="/account/wishlist"
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors hidden sm:flex items-center relative"
            title="Wishlist"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute 1 top-1 right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Account Menu */}
          <div ref={accountRef} className="relative hidden md:block">
            <button
              onClick={() => setIsAccountOpen(!isAccountOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                <User className="w-4 h-4" />
              </div>
              <div className="text-xs leading-tight">
                <span className="block text-[10px] text-slate-400">
                  {user ? `Hi, ${user.full_name.split(' ')[0]}` : 'Welcome'}
                </span>
                <span className="font-semibold text-slate-900 flex items-center gap-1">
                  <span>{user ? 'My Account' : 'Sign In'}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </span>
              </div>
            </button>

            {isAccountOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50">
                <div className="p-3.5 bg-slate-50 border-b border-slate-100">
                  {user ? (
                    <div>
                      <div className="font-bold text-slate-900 text-xs">{user.full_name}</div>
                      <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                    </div>
                  ) : (
                    <Link
                      to="/auth"
                      onClick={() => setIsAccountOpen(false)}
                      className="block text-center py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
                    >
                      Sign In / Register
                    </Link>
                  )}
                </div>

                <div className="p-1.5 text-xs divide-y divide-slate-100 font-medium">
                  <div className="py-1">
                    <Link
                      to="/account/orders"
                      onClick={() => setIsAccountOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 rounded-lg text-slate-700"
                    >
                      <Package className="w-4 h-4 text-slate-500" />
                      <span>My Orders & Consignments</span>
                    </Link>
                    <Link
                      to="/account/wishlist"
                      onClick={() => setIsAccountOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 rounded-lg text-slate-700"
                    >
                      <Heart className="w-4 h-4 text-rose-500" />
                      <span>Saved Fish ({wishlistCount})</span>
                    </Link>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/admin"
                      onClick={() => {
                        setIsAccountOpen(false);
                        switchRole('admin');
                      }}
                      className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 rounded-lg text-slate-800 font-semibold"
                    >
                      <Settings className="w-4 h-4 text-slate-500" />
                      <span>Store Admin Operations</span>
                    </Link>
                  </div>

                  {user && (
                    <div className="py-1">
                      <button
                        onClick={() => {
                          logout();
                          setIsAccountOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-rose-50 rounded-lg text-rose-600 font-semibold text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Cart Button */}
          <Link
            to="/cart"
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-3.5 py-2 rounded-xl transition-colors shadow-xs active:scale-95"
            aria-label={`Cart with ${itemCount} items`}
          >
            <div className="relative">
              <ShoppingCart className="w-4 h-4" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-teal-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </div>
            <span className="text-xs hidden sm:inline">
              {itemCount === 0 ? 'Cart' : formatCurrency(subtotal)}
            </span>
          </Link>
        </div>
      </div>

      {/* Simplified Category Navigation Strip */}
      <nav className="border-t border-slate-100 bg-white hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-6 text-xs font-semibold text-slate-600 overflow-x-auto py-2.5 no-scrollbar">
          <Link to="/shop" className="hover:text-slate-900 transition-colors">
            All Fish & Supplies
          </Link>
          <Link to="/shop?cat=cat-betta" className="hover:text-slate-900 transition-colors flex items-center gap-1.5 text-slate-900 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-600 inline-block" />
            <span>Show Bettas</span>
          </Link>
          <Link to="/shop?cat=cat-guppy" className="hover:text-slate-900 transition-colors">
            Exotic Guppies
          </Link>
          <Link to="/shop?cat=cat-pairs" className="hover:text-slate-900 transition-colors">
            Breeding Pairs
          </Link>
          <Link to="/shop?cat=cat-plants" className="hover:text-slate-900 transition-colors">
            Aquarium Plants
          </Link>
          <Link to="/shop?cat=cat-food" className="hover:text-slate-900 transition-colors">
            Fish Food & Nutrition
          </Link>
          <Link to="/shop?cat=cat-accessories" className="hover:text-slate-900 transition-colors">
            Tank Accessories
          </Link>
          <div className="ml-auto">
            <Link to="/page/shipping-acclimation" className="text-teal-700 hover:underline flex items-center gap-1 text-[11px] font-medium">
              <span>Live Arrival Guarantee Details</span>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};
