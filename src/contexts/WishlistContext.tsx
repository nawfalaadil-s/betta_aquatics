import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

interface WishlistContextType {
  wishlistIds: string[];
  wishlistCount: number;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('ba_wishlist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return ['prod-002', 'prod-004'];
      }
    }
    return ['prod-002', 'prod-004'];
  });

  useEffect(() => {
    localStorage.setItem('ba_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  const isInWishlist = (productId: string): boolean => {
    return wishlistIds.includes(productId);
  };

  const toggleWishlist = (productId: string) => {
    if (wishlistIds.includes(productId)) {
      setWishlistIds(prev => prev.filter(id => id !== productId));
      showToast('Removed from Wishlist', 'info');
    } else {
      setWishlistIds(prev => [...prev, productId]);
      showToast('Saved to Wishlist!', 'success');
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistCount: wishlistIds.length,
        isInWishlist,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
