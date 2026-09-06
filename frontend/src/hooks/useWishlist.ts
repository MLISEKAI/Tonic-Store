import { useState, useMemo } from 'react';
import { WishlistService } from '../services/wishlist/wishlistService';
import { useWishlist as useWishlistContext } from '../contexts/WishlistContext';

export function useWishlist(productId: number) {
  const { wishlist, reloadWishlist } = useWishlistContext();
  const [loading, setLoading] = useState(false);

  const isInWishlist = useMemo(() => {
    return wishlist.some(item => item.product.id === productId);
  }, [wishlist, productId]);

  const toggleWishlist = async () => {
    try {
      setLoading(true);
      if (isInWishlist) {
        await WishlistService.removeFromWishlist(productId);
      } else {
        await WishlistService.addToWishlist(productId);
      }
      await reloadWishlist();
      return true;
    } catch {
      throw new Error('Failed to update wishlist');
    } finally {
      setLoading(false);
    }
  };

  return {
    isInWishlist,
    loading,
    toggleWishlist,
  };
} 