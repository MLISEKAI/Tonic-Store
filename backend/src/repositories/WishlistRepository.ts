import { prisma } from '../prisma';
import { BaseRepository } from './BaseRepository';

export class WishlistRepository extends BaseRepository<any> {
  constructor() {
    super(prisma.wishlist);
  }

  async getUserWishlist(userId: number) {
    return this.model.findMany({
      where: { userId },
      include: { product: { include: { category: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  async addToWishlist(userId: number, productId: number) {
    return this.model.create({
      data: { userId, productId },
      include: { product: { include: { category: true } } }
    });
  }

  async removeFromWishlist(userId: number, productId: number) {
    return this.model.delete({ where: { userId_productId: { userId, productId } } });
  }

  async isInWishlist(userId: number, productId: number) {
    const wishlistItem = await this.model.findUnique({ where: { userId_productId: { userId, productId } } });
    return !!wishlistItem;
  }
} 