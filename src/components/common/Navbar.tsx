import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, ShoppingCart, Heart, User, MapPin, 
  ChevronDown, ShieldAlert, LogOut, Package, 
  ExternalLink, Sparkles, X, Settings
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { useStoreSettings } from '../../contexts/StoreSettingsContext';
import { formatCurrency } from '../../lib/utils';
import { mockDb } from '../../lib/mockDatabase';
import { Product } from '../../lib/types';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAdmin, logout, switchRole } = useAuth();
  const { itemCount, subtotal } = useCart();
  const { wishlistCount } = useWishlist();
  const { settings } = useStoreSettings();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
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
        const matchesQuery =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.strain && p.strain.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (p.category_name && p.category_name.toLowerCase().includes(searchQuery.toLowerCase()));

        if (selectedCategory === 'all') return matchesQuery;
        return matchesQuery && p.category_id === selectedCategory;
      });
      setSuggestions(filtered.slice(0, 5));
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory]);

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
    navigate(`/shop?q=${encodeURIComponent(searchQuery)}&cat=${selectedCategory}`);
  };

  const categories = mockDb.getCategories();

  return (
    <header className="sticky top-0 z-40 bg-ocean-950 text-white shadow-lg border-b border-ocean-800">
      {/* Top Branding and Utility Strip */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-ocean-900 to-ocean-800 border border-aqua-400/40 p-1 flex items-center justify-center shadow-glow-aqua group-hover:scale-105 transition-transform">
            <img src="/logo-fish.svg" alt="Betta Aquatics" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="font-display font-extrabold text-xl sm:text-2xl tracking-wider text-white uppercase flex items-center gap-1">
              BETTA <span className="text-aqua-400">AQUATICS</span>
            </span>
            <span className="block text-[10px] tracking-widest text-slate-400 uppercase font-medium -mt-1">
              Living Aquatic Jewels
            </span>
          </div>
        </Link>

        {/* Location Picker */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer border border-ocean-800 hover:border-aqua-500/40 rounded-xl px-3 py-1.5 bg-ocean-900/60">
          <MapPin className="w-4 h-4 text-aqua-400 shrink-0" />
          <div>
            <span className="block text-[10px] text-slate-400">Delivering To</span>
            <span className="font-semibold text-white">Bengaluru 560038</span>
          </div>
        </div>

        {/* Amazon/Flipkart-Style Global Search Bar with Live Suggestions */}
        <div ref={searchRef} className="flex-1 max-w-2xl relative hidden md:block">
          <form onSubmit={handleSearchSubmit} className="flex rounded-xl overflow-hidden border border-ocean-700 bg-white shadow-inner focus-within:border-aqua-500 focus-within:ring-2 focus-within:ring-aqua-500/20">
            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-2 border-r border-slate-200 outline-none cursor-pointer hover:bg-slate-200 transition-colors"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Input field */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Search show Bettas, Albino guppies, plants, pellets..."
              className="flex-1 px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none"
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

            {/* Submit search button */}
            <button
              type="submit"
              className="bg-aqua-500 hover:bg-aqua-400 text-ocean-950 px-5 flex items-center justify-center transition-colors"
              aria-label="Search items"
            >
              <Search className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>

          {/* Autocomplete Dropdown */}
          {isSearchOpen && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50">
              <div className="p-2 border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Matching Live Inventory</span>
                <span className="text-aqua-600 font-bold">{suggestions.length} results</span>
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
                    className="flex items-center gap-3 p-2.5 hover:bg-slate-50 transition-colors"
                  >
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-900 truncate">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2">
                        <span>{item.category_name}</span>
                        {item.strain && <span className="text-aqua-600 font-medium">• {item.strain}</span>}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold text-ocean-950">
                        {formatCurrency(item.price)}
                      </div>
                      {item.is_unique_specimen && (
                        <span className="text-[10px] text-aqua-600 font-semibold">1 in stock</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
              <button
                onClick={handleSearchSubmit}
                className="w-full text-center py-2.5 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-ocean-900 transition-colors block border-t border-slate-100"
              >
                View all results for "{searchQuery}"
              </button>
            </div>
          )}
        </div>

        {/* Action Controls: Role Switcher, Account, Wishlist, Cart */}
        <div className="flex items-center gap-3">
          {/* Quick Demo Switcher (Admin / Customer toggle) */}
          <div className="hidden xl:flex items-center">
            <button
              onClick={() => switchRole(isAdmin ? 'customer' : 'admin')}
              className={`text-xs px-2.5 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 transition-all ${
                isAdmin
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/40 hover:bg-amber-500/30'
                  : 'bg-aqua-500/20 text-aqua-300 border-aqua-400/40 hover:bg-aqua-500/30'
              }`}
              title="Click to toggle between Admin and Customer modes"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAdmin ? 'Admin Mode' : 'Customer Mode'}</span>
            </button>
          </div>

          {/* Account Dropdown */}
          <div ref={accountRef} className="relative hidden md:block">
            <button
              onClick={() => setIsAccountOpen(!isAccountOpen)}
              className="flex items-center gap-2 text-left hover:text-aqua-400 p-1.5 rounded-xl hover:bg-ocean-900/60 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-ocean-800 border border-ocean-700 flex items-center justify-center text-aqua-400">
                <User className="w-4 h-4" />
              </div>
              <div className="text-xs leading-tight">
                <span className="block text-[10px] text-slate-400">
                  {user ? `Hello, ${user.full_name.split(' ')[0]}` : 'Welcome'}
                </span>
                <span className="font-semibold text-white flex items-center gap-1">
                  <span>{user ? 'My Account' : 'Sign In'}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </span>
              </div>
            </button>

            {/* Account Menu Popup */}
            {isAccountOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                <div className="p-4 bg-slate-50 border-b border-slate-100">
                  {user ? (
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{user.full_name}</div>
                      <div className="text-xs text-slate-500 truncate">{user.email}</div>
                      <div className="mt-1.5 inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-aqua-100 text-aqua-800">
                        {user.role === 'admin' ? 'Store Administrator' : 'Verified Member'}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <div className="text-xs text-slate-600 font-medium">Access your orders and wishlist</div>
                      <Link
                        to="/auth"
                        onClick={() => setIsAccountOpen(false)}
                        className="w-full py-2 bg-aqua-500 hover:bg-aqua-400 text-ocean-950 font-bold text-xs rounded-xl text-center transition-colors"
                      >
                        Sign In / Register
                      </Link>
                    </div>
                  )}
                </div>

                <div className="p-2 text-xs divide-y divide-slate-100 font-medium">
                  <div className="py-1">
                    <Link
                      to="/account/orders"
                      onClick={() => setIsAccountOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 rounded-xl text-slate-700 hover:text-ocean-900"
                    >
                      <Package className="w-4 h-4 text-aqua-600" />
                      <span>My Orders & Live Tracking</span>
                    </Link>
                    <Link
                      to="/account/wishlist"
                      onClick={() => setIsAccountOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 rounded-xl text-slate-700 hover:text-ocean-900"
                    >
                      <Heart className="w-4 h-4 text-rose-500" />
                      <span>Saved Wishlist ({wishlistCount})</span>
                    </Link>
                    <Link
                      to="/account"
                      onClick={() => setIsAccountOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 rounded-xl text-slate-700 hover:text-ocean-900"
                    >
                      <User className="w-4 h-4 text-slate-500" />
                      <span>Profile & Saved Addresses</span>
                    </Link>
                  </div>

                  {/* Admin Direct Access */}
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
                      <span>Store Admin Console</span>
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

          {/* Wishlist Button */}
          <Link
            to="/account/wishlist"
            className="relative p-2 text-slate-300 hover:text-white hover:bg-ocean-900 rounded-xl transition-colors hidden sm:flex items-center"
            title="View Wishlist"
            aria-label="View Wishlist"
          >
            <Heart className="w-5 h-5 text-slate-200 hover:text-rose-400" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Button */}
          <Link
            to="/cart"
            className="flex items-center gap-2.5 bg-gradient-to-r from-aqua-500 to-aqua-600 hover:from-aqua-400 hover:to-aqua-500 text-ocean-950 font-bold px-3 sm:px-4 py-2 rounded-xl transition-all shadow-md shadow-aqua-500/20 active:scale-95"
            aria-label={`Shopping Cart with ${itemCount} items`}
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-ocean-950 text-aqua-300 border border-aqua-400 text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
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

      {/* Categories Strip */}
      <nav className="border-t border-ocean-900 bg-ocean-950/80 backdrop-blur-md hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-6 text-xs font-semibold text-slate-300 overflow-x-auto py-2.5 no-scrollbar">
          <Link to="/shop" className="hover:text-aqua-400 whitespace-nowrap transition-colors flex items-center gap-1.5">
            <span>All Livestock & Supplies</span>
          </Link>
          <Link to="/shop?cat=cat-betta" className="hover:text-aqua-400 whitespace-nowrap transition-colors flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-aqua-400 inline-block"></span>
            <span>Show Bettas</span>
          </Link>
          <Link to="/shop?cat=cat-guppy" className="hover:text-aqua-400 whitespace-nowrap transition-colors">
            Rare Guppies
          </Link>
          <Link to="/shop?cat=cat-pairs" className="hover:text-aqua-400 whitespace-nowrap transition-colors">
            Breeding Pairs
          </Link>
          <Link to="/shop?cat=cat-plants" className="hover:text-aqua-400 whitespace-nowrap transition-colors">
            Aquatic Plants
          </Link>
          <Link to="/shop?cat=cat-food" className="hover:text-aqua-400 whitespace-nowrap transition-colors">
            Fish Food & Nutrition
          </Link>
          <Link to="/shop?cat=cat-accessories" className="hover:text-aqua-400 whitespace-nowrap transition-colors">
            Conditioners & Leaves
          </Link>
          <div className="ml-auto flex items-center gap-4 text-aqua-400 text-xs">
            <Link to="/page/shipping-acclimation" className="hover:underline flex items-center gap-1">
              <span>Live Arrival Guarantee</span>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};
