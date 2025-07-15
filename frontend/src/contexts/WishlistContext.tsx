import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { WishlistService } from '../services/wishlist/wishlistService';

interface WishlistItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    category: {
      name: string;
    };
  };
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  loading: boolean;
  reloadWishlist: () => Promise<void>;
  removeFromWishlist: (productId: number) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && wishlist.length === 0) {
      setLoading(true);
      loadWishlist();
    } else if (!isAuthenticated) {
      setWishlist([]);
    }
  }, [isAuthenticated]);

  const loadWishlist = async () => {
    try {
      const data = await WishlistService.getWishlist();
      setWishlist(data);
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: number) => {
    await WishlistService.removeFromWishlist(productId);
    await loadWishlist();
  };

  return (
    <WishlistContext.Provider value={{ wishlist, loading, reloadWishlist: loadWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}; 