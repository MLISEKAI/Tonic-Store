import { WishlistRepository } from '../repositories';
import { CacheService, CacheKeys } from './cache.service';

const wishlistRepository = new WishlistRepository();

export const getUserWishlist = async (userId: number) => {
  const cacheKey = CacheKeys.WISHLIST(userId);
  const cached = await CacheService.get(cacheKey);
  if (cached) return cached;

  const wishlist = await wishlistRepository.getUserWishlist(userId);
  await CacheService.set(cacheKey, wishlist, 300);
  return wishlist;
};

export const addToWishlist = async (userId: number, productId: number) => {
  const result = await wishlistRepository.addToWishlist(userId, productId);
  await CacheService.delete(CacheKeys.WISHLIST(userId));
  return result;
};

export const removeFromWishlist = async (userId: number, productId: number) => {
  const result = await wishlistRepository.removeFromWishlist(userId, productId);
  await CacheService.delete(CacheKeys.WISHLIST(userId));
  return result;
};

export const isInWishlist = async (userId: number, productId: number) => {
  return wishlistRepository.isInWishlist(userId, productId);
};