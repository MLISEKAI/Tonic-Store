import { CartRepository } from '../repositories';

const cartRepository = new CartRepository();

export const getCart = async (userId: number) => {
  return cartRepository.getCart(userId);
};

export const addToCart = async (userId: number, productId: number, quantity: number) => {
  return cartRepository.addToCart(userId, productId, quantity);
};

export const updateCartItem = async (userId: number, itemId: number, quantity: number) => {
  return cartRepository.updateCartItem(userId, itemId, quantity);
};

export const removeFromCart = async (userId: number, itemId: number) => {
  return cartRepository.removeFromCart(userId, itemId);
};

export const clearCart = async (userId: number) => {
  return cartRepository.clearCart(userId);
};
