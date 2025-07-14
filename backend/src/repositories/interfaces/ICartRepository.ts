import { Cart, CartItem } from '@prisma/client';

export interface ICartRepository {
  getCart(userId: number): Promise<any>;
  addToCart(userId: number, productId: number, quantity: number): Promise<CartItem>;
  updateCartItem(userId: number, itemId: number, quantity: number): Promise<CartItem>;
  removeFromCart(userId: number, itemId: number): Promise<any>;
  clearCart(userId: number): Promise<any>;
} 