import { useState, useEffect } from 'react';
import { WishlistService } from '../services/wishlist/wishlistService';
import { useWishlist as useWishlistContext } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';

export function useWishlist(productId: number) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const { reloadWishlist } = useWishlistContext();
  const { isAuthenticated } = useAuth();

  const checkWishlistStatus = async () => {
    if (!isAuthenticated) return;
    try {
      const { isInWishlist } = await WishlistService.checkWishlistStatus(productId);
      setIsInWishlist(isInWishlist);
    } catch (error) {
      // silent fail
    }
  };

  const toggleWishlist = async () => {
    try {
      setLoading(true);
      if (isInWishlist) {
        await WishlistService.removeFromWishlist(productId);
      } else {
        await WishlistService.addToWishlist(productId);
      }
      setIsInWishlist(!isInWishlist);
      await reloadWishlist();
      return true;
    } catch (error) {
      throw new Error('Failed to update wishlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkWishlistStatus();
  }, [productId, isAuthenticated]);

  return {
    isInWishlist,
    loading,
    toggleWishlist,
    checkWishlistStatus
  };
} 