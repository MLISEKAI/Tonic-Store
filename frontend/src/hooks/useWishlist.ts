import { useState, useEffect } from 'react';
import { WishlistService } from '../services/wishlist/wishlistService';
import { useWishlist as useWishlistContext } from '../contexts/WishlistContext';

/**
 * Custom hook to manage wishlist functionality for a product
 * @param productId - The ID of the product to check/manage in wishlist
 * @returns Object containing wishlist state and functions
 */
export function useWishlist(productId: number) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const { reloadWishlist } = useWishlistContext();

  const checkWishlistStatus = async () => {
    try {
      const { isInWishlist } = await WishlistService.checkWishlistStatus(productId);
      setIsInWishlist(isInWishlist);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
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
      console.error('Error updating wishlist:', error);
      throw new Error('Failed to update wishlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkWishlistStatus();
  }, [productId]);

  return {
    isInWishlist,
    loading,
    toggleWishlist,
    checkWishlistStatus
  };
} 