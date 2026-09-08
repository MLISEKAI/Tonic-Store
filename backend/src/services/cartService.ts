import { CartRepository } from '../repositories';
import { CacheService, CacheKeys } from './cache.service';
import logger from '../config/logger';

const cartRepository = new CartRepository();

const CART_CACHE_TTL = 300;

export const getCart = async (userId: number) => {
  const cacheKey = CacheKeys.CART(userId);
  const cached = await CacheService.get(cacheKey);
  if (cached) {
    logger.debug('Cart cache HIT', { userId });
    return cached;
  }

  const cart = await cartRepository.getCart(userId);
  await CacheService.set(cacheKey, cart, CART_CACHE_TTL);
  return cart;
};

export const addToCart = async (userId: number, productId: number, quantity: number) => {
  const result = await cartRepository.addToCart(userId, productId, quantity);
  await CacheService.delete(CacheKeys.CART(userId));
  return result;
};

export const updateCartItem = async (userId: number, itemId: number, quantity: number) => {
  const result = await cartRepository.updateCartItem(userId, itemId, quantity);
  await CacheService.delete(CacheKeys.CART(userId));
  return result;
};

export const removeFromCart = async (userId: number, itemId: number) => {
  const result = await cartRepository.removeFromCart(userId, itemId);
  await CacheService.delete(CacheKeys.CART(userId));
  return result;
};

export const clearCart = async (userId: number) => {
  const result = await cartRepository.clearCart(userId);
  await CacheService.delete(CacheKeys.CART(userId));
  return result;
};
