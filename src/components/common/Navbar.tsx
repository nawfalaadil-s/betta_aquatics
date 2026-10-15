import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, ShoppingCart, Heart, User, MapPin, 
  ChevronDown, LogOut, Package, Sparkles, X, 
  Settings, MessageCircle 
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
    <header className="sticky top-0 z-40 bg-ocean-950 text-white shadow-md border-b border-ocean-900">
      {/* Human Touch Top Bar */}
      <div className="bg-ocean-900/90 border-b border-ocean-800/80 px-4 py-1.5 text-[11px] text-slate-300 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Bengaluru Facility: Live specimen dispatches open today</span>
            </span>
            <span className="text-slate-500">•</span>
            <span>Overnight Air Cargo with 100% Live Arrival Guarantee</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Breeder WhatsApp Support</span>
            </a>
            <span className="text-slate-500">•</span>
            {/* Discreet role toggle for grading / demo */}
            <button
              onClick={() => switchRole(isAdmin ? 'customer' : 'admin')}
              className="text-[10px] text-slate-400 hover:text-aqua-300 font-mono transition-colors"
            >
              Mode: <strong className="text-aqua-400">{isAdmin ? 'Admin' : 'Customer'}</strong> (Click to Toggle)
            </button>
          </div>
        </div>
      </div>

      {/* Main Brand & Search Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-6">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-ocean-900 to-ocean-800 border border-aqua-400/40 p-1 flex items-center justify-center shadow-glow-aqua group-hover:scale-105 transition-transform">
            <img src="/logo-fish.svg" alt="Betta Aquatics" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="font-display font-extrabold text-xl tracking-wider text-white uppercase flex items-center gap-1">
              BETTA <span className="text-aqua-400">AQUATICS</span>
            </span>
            <span className="block text-[10px] tracking-widest text-slate-400 uppercase font-medium -mt-1">
              Living Aquatic Jewels
            </span>
          </div>
        </Link>

        {/* Global Search Bar (Simplified & Humanized) */}
        <div ref={searchRef} className="flex-1 max-w-xl relative hidden md:block">
          <form onSubmit={handleSearchSubmit} className="flex rounded-full overflow-hidden border border-ocean-700 bg-white/95 shadow-inner focus-within:border-aqua-500 focus-within:ring-2 focus-within:ring-aqua-500/20 transition-all">
            <div className="pl-4 flex items-center text-slate-400">
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
              placeholder="Search by fish strain (Halfmoon, Plakat, Guppy, Plants)..."
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
              className="bg-aqua-500 hover:bg-aqua-400 text-ocean-950 font-bold text-xs px-5 rounded-full m-1 flex items-center justify-center transition-colors"
            >
              Search
            </button>
          </form>

          {/* Autocomplete Dropdown */}
          {isSearchOpen && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in">
              <div className="p-3 border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Matching Live Fish</span>
                <span className="text-aqua-700 font-bold">{suggestions.length} available</span>
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
                      className="w-11 h-11 rounded-xl object-cover bg-slate-100 shrink-0"
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
                      <div className="text-xs font-bold text-ocean-950">
                        {formatCurrency(item.price)}
                      </div>
                      {item.is_unique_specimen && (
                        <span className="text-[10px] text-aqua-600 font-semibold block">1 in stock</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Actions: Wishlist, Account, Cart */}
        <div className="flex items-center gap-4">
          {/* Wishlist */}
          <Link
            to="/account/wishlist"
            className="p-2 text-slate-300 hover:text-white rounded-xl transition-colors hidden sm:flex items-center relative"
            title="Saved Fish"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5 text-slate-300 hover:text-rose-400" />
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
              className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-ocean-900/80 transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-full bg-ocean-800 border border-ocean-700 flex items-center justify-center text-aqua-400">
                <User className="w-4 h-4" />
              </div>
              <div className="text-xs leading-tight">
                <span className="block text-[10px] text-slate-400">
                  {user ? `Hi, ${user.full_name.split(' ')[0]}` : 'Welcome'}
                </span>
                <span className="font-semibold text-white flex items-center gap-1">
                  <span>{user ? 'My Account' : 'Sign In'}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </span>
              </div>
            </button>

            {isAccountOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in">
                <div className="p-4 bg-slate-50 border-b border-slate-100">
                  {user ? (
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{user.full_name}</div>
                      <div className="text-xs text-slate-500 truncate">{user.email}</div>
                    </div>
                  ) : (
                    <Link
                      to="/auth"
                      onClick={() => setIsAccountOpen(false)}
                      className="block text-center py-2 bg-aqua-500 hover:bg-aqua-400 text-ocean-950 font-bold text-xs rounded-xl"
                    >
                      Sign In / Register
                    </Link>
                  )}
                </div>

                <div className="p-2 text-xs divide-y divide-slate-100 font-medium">
                  <div className="py-1">
                    <Link
                      to="/account/orders"
                      onClick={() => setIsAccountOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 rounded-xl text-slate-700"
                    >
                      <Package className="w-4 h-4 text-aqua-600" />
                      <span>My Orders & Consignments</span>
                    </Link>
                    <Link
                      to="/account/wishlist"
                      onClick={() => setIsAccountOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 rounded-xl text-slate-700"
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
                      className="flex items-center gap-2.5 px-3 py-2 hover:bg-amber-50 rounded-xl text-amber-800 font-semibold"
                    >
                      <Settings className="w-4 h-4 text-amber-600" />
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
                        className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-rose-50 rounded-xl text-rose-600 font-semibold text-left"
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
            className="flex items-center gap-2.5 bg-gradient-to-r from-aqua-500 to-aqua-600 hover:from-aqua-400 hover:to-aqua-500 text-ocean-950 font-bold px-4 py-2.5 rounded-full transition-all shadow-glow-aqua active:scale-95"
            aria-label={`Cart with ${itemCount} items`}
          >
            <div className="relative">
              <ShoppingCart className="w-4 h-4" />
              {itemCount > 0 && (
                <span className="absolute -top-2.5 -right-2 bg-ocean-950 text-aqua-300 border border-aqua-400 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </div>
            <span className="text-xs sm:text-sm hidden sm:inline">
              {itemCount === 0 ? 'Cart' : formatCurrency(subtotal)}
            </span>
          </Link>
        </div>
      </div>

      {/* Simplified Category Navigation Strip */}
      <nav className="border-t border-ocean-900 bg-ocean-950/95 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-7 text-xs font-semibold text-slate-300 overflow-x-auto py-2.5 no-scrollbar">
          <Link to="/shop" className="hover:text-aqua-400 transition-colors">
            All Collections
          </Link>
          <Link to="/shop?cat=cat-betta" className="hover:text-aqua-400 transition-colors flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-aqua-400 inline-block" />
            <span>Show Bettas</span>
          </Link>
          <Link to="/shop?cat=cat-guppy" className="hover:text-aqua-400 transition-colors">
            Rare Guppies
          </Link>
          <Link to="/shop?cat=cat-pairs" className="hover:text-aqua-400 transition-colors">
            Breeding Pairs
          </Link>
          <Link to="/shop?cat=cat-plants" className="hover:text-aqua-400 transition-colors">
            Aquatic Plants
          </Link>
          <Link to="/shop?cat=cat-food" className="hover:text-aqua-400 transition-colors">
            Fish Nutrition
          </Link>
          <Link to="/shop?cat=cat-accessories" className="hover:text-aqua-400 transition-colors">
            Catappa Leaves & Care
          </Link>
          <div className="ml-auto text-aqua-400">
            <Link to="/page/shipping-acclimation" className="hover:underline flex items-center gap-1 text-[11px]">
              <span>100% Live Arrival Policy</span>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};
