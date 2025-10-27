import { PrismaClient, CartItem } from '@prisma/client';
import type { ICartRepository } from './interfaces/ICartRepository';

export class CartRepository implements ICartRepository {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }
  async getCart(userId: number): Promise<any> {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { 
        items: { 
          include: { 
            product: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                stock: true,
                status: true,
                price: true,
                promotionalPrice: true
              }
            } 
          } 
        } 
      }
    });
    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: { 
          items: { 
            include: { 
              product: {
                select: {
                  id: true,
                  name: true,
                  imageUrl: true,
                  stock: true,
                  status: true,
                  price: true,
                  promotionalPrice: true
                }
              } 
            } 
          } 
        }
      });
    }
    return cart;
  }
  async addToCart(userId: number, productId: number, quantity: number): Promise<CartItem> {
    let cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await this.prisma.cart.create({ data: { userId } });
    }
    
    // Get product to determine the correct price (promotional or regular)
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw new Error('Product not found');
    }
    
    // Use promotional price if available and valid, otherwise use regular price
    const regularPrice = Number(product.price);
    const promotionalPrice = product.promotionalPrice ? Number(product.promotionalPrice) : null;
    
    const price = (promotionalPrice && promotionalPrice > 0 && promotionalPrice < regularPrice) 
      ? promotionalPrice 
      : regularPrice;
    
    const existingItem = await this.prisma.cartItem.findFirst({ where: { cartId: cart.id, productId } });
    if (existingItem) {
      return this.prisma.cartItem.update({ 
        where: { id: existingItem.id }, 
        data: { 
          quantity: existingItem.quantity + quantity,
          price: price // Update price to current price
        } 
      });
    }
    return this.prisma.cartItem.create({ 
      data: { 
        cartId: cart.id, 
        productId, 
        quantity,
        price: price
      } 
    });
  }
  async updateCartItem(userId: number, itemId: number, quantity: number): Promise<CartItem> {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new Error('Cart not found');
    const cartItem = await this.prisma.cartItem.findUnique({ where: { id: itemId, cartId: cart.id } });
    if (!cartItem) throw new Error('Cart item not found');
    return this.prisma.cartItem.update({ where: { id: itemId, cartId: cart.id }, data: { quantity } });
  }
  async removeFromCart(userId: number, itemId: number): Promise<any> {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new Error('Cart not found');
    const cartItem = await this.prisma.cartItem.findUnique({ where: { id: itemId, cartId: cart.id } });
    if (!cartItem) throw new Error('Cart item not found');
    await this.prisma.cartItem.delete({ where: { id: itemId, cartId: cart.id } });
    return { success: true, message: 'Item removed from cart successfully' };
  }
  async clearCart(userId: number): Promise<any> {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new Error('Cart not found');
    return this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }
} 