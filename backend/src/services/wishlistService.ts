import { WishlistRepository } from '../repositories';

const wishlistRepository = new WishlistRepository();

export const getUserWishlist = async (userId: number) => {
  return wishlistRepository.getUserWishlist(userId);
};

export const addToWishlist = async (userId: number, productId: number) => {
  return wishlistRepository.addToWishlist(userId, productId);
};

export const removeFromWishlist = async (userId: number, productId: number) => {
  return wishlistRepository.removeFromWishlist(userId, productId);
};

export const isInWishlist = async (userId: number, productId: number) => {
  return wishlistRepository.isInWishlist(userId, productId);
}; 