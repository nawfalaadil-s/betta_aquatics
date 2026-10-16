import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Grid, Heart, Package, User } from 'lucide-react';
import { useWishlist } from '../../contexts/WishlistContext';

export const MobileBottomNav: React.FC = () => {
  const { wishlistCount } = useWishlist();
  const location = useLocation();

  // Hide bottom nav on specific checkout, admin, or product detail views to prevent UI collisions
  if (
    location.pathname.startsWith('/admin') || 
    location.pathname === '/checkout' || 
    location.pathname.startsWith('/product/')
  ) {
    return null;
  }

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Shop', path: '/shop', icon: Grid },
    { label: 'Wishlist', path: '/account/wishlist', icon: Heart, badge: wishlistCount },
    { label: 'Orders', path: '/account/orders', icon: Package },
    { label: 'Account', path: '/account', icon: User },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-ocean-950/95 backdrop-blur-lg border-t border-ocean-800 pb-[env(safe-area-inset-bottom,0px)] shadow-2xl"
    >
      <div className="flex items-center justify-around h-16 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);

          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={`flex-1 flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] transition-colors relative ${
                isActive ? 'text-aqua-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 font-medium tracking-tight ${isActive ? 'font-bold' : ''}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-aqua-400 shadow-glow-aqua" />
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
