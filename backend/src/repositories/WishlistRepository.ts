import { PrismaClient } from '@prisma/client';
import { IWishlistRepository } from './interfaces/IWishlistRepository';

export class WishlistRepository implements IWishlistRepository {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }
  async getUserWishlist(userId: number): Promise<any[]> {
    return this.prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: { include: { category: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
  async addToWishlist(userId: number, productId: number): Promise<any> {
    return this.prisma.wishlist.create({
      data: { userId, productId },
      include: { product: { include: { category: true } } }
    });
  }
  async removeFromWishlist(userId: number, productId: number): Promise<any> {
    return this.prisma.wishlist.delete({
      where: { userId_productId: { userId, productId } }
    });
  }
  async isInWishlist(userId: number, productId: number): Promise<boolean> {
    const wishlistItem = await this.prisma.wishlist.findUnique({
      where: { userId_productId: { userId, productId } }
    });
    return !!wishlistItem;
  }
} 