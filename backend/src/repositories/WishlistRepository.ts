import { prisma } from '../prisma';
import { BaseRepository } from './BaseRepository';

const productSelect = {
  id: true,
  name: true,
  imageUrl: true,
  price: true,
  promotionalPrice: true,
  stock: true,
  status: true,
  rating: true,
  soldCount: true,
  seoUrl: true,
  category: {
    select: {
      id: true,
      name: true,
    }
  }
};

const wishlistSelect = {
  id: true,
  productId: true,
  createdAt: true,
  product: {
    select: productSelect
  }
};

export class WishlistRepository extends BaseRepository<any> {
  constructor() {
    super(prisma.wishlist);
  }

  async getUserWishlist(userId: number, skip?: number, take?: number) {
    const query: any = {
      where: { userId },
      select: wishlistSelect,
      orderBy: { createdAt: 'desc' },
    };
    if (skip !== undefined) query.skip = skip;
    if (take !== undefined) query.take = take;
    return this.model.findMany(query);
  }

  async getUserWishlistCount(userId: number) {
    return this.model.count({ where: { userId } });
  }

  async addToWishlist(userId: number, productId: number) {
    return this.model.create({
      data: { userId, productId },
      select: wishlistSelect
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
