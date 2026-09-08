import { WishlistRepository } from '../repositories';
import { CacheService, CacheKeys } from './cache.service';
import { parsePageOptions, calculatePagination, PaginationMeta } from '../common/types/pagination';
import logger from '../config/logger';

const wishlistRepository = new WishlistRepository();

const WISHLIST_CACHE_TTL = 300;

export const getUserWishlist = async (userId: number, pageOptions?: { page: number; limit: number }) => {
  if (pageOptions) {
    return getUserWishlistPaginated(userId, pageOptions.page, pageOptions.limit);
  }

  const cached = await CacheService.get(CacheKeys.WISHLIST(userId));
  if (cached) {
    logger.debug('Wishlist cache HIT', { userId });
    return cached;
  }

  const wishlist = await wishlistRepository.getUserWishlist(userId);
  await CacheService.set(CacheKeys.WISHLIST(userId), wishlist, WISHLIST_CACHE_TTL);
  return wishlist;
};

export const getUserWishlistPaginated = async (
  userId: number,
  page: number,
  limit: number
): Promise<{ items: any[]; pagination: PaginationMeta }> => {
  const cacheKey = CacheKeys.WISHLIST_PAGED(userId, page, limit);

  const cached = await CacheService.get(cacheKey);
  if (cached && typeof cached === 'object' && 'items' in cached) {
    logger.debug('Wishlist paginated cache HIT', { userId, page, limit });
    return cached;
  }

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    wishlistRepository.getUserWishlist(userId, skip, limit),
    wishlistRepository.getUserWishlistCount(userId),
  ]);

  const pagination = calculatePagination(total, limit, page);
  const result = { items, pagination };
  await CacheService.set(cacheKey, result, WISHLIST_CACHE_TTL);
  return result;
};

export const addToWishlist = async (userId: number, productId: number) => {
  const result = await wishlistRepository.addToWishlist(userId, productId);
  await CacheService.delete(CacheKeys.WISHLIST(userId));
  await CacheService.deletePattern(`wishlist:${userId}:*`);
  return result;
};

export const removeFromWishlist = async (userId: number, productId: number) => {
  const result = await wishlistRepository.removeFromWishlist(userId, productId);
  await CacheService.delete(CacheKeys.WISHLIST(userId));
  await CacheService.deletePattern(`wishlist:${userId}:*`);
  return result;
};

export const isInWishlist = async (userId: number, productId: number) => {
  return wishlistRepository.isInWishlist(userId, productId);
};
