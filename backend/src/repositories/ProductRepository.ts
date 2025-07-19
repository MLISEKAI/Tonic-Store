import { prisma } from '../prisma';
import { BaseRepository } from './BaseRepository';

export class ProductRepository extends BaseRepository<any> {
  constructor() {
    super(prisma.product);
  }

  async findBySeoUrl(seoUrl: string) {
    return this.model.findUnique({ where: { seoUrl } });
  }

  async updateStatus(id: number, status: string) {
    return this.model.update({ where: { id }, data: { status } });
  }

  async search(query: string) {
    return this.model.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
          { sku: { contains: query } },
        ],
      },
    });
  }

  async findByCategory(categoryName: string) {
    const category = await prisma.category.findFirst({ where: { name: categoryName } });
    if (!category) return [];
    return this.model.findMany({ where: { categoryId: category.id } });
  }

  async findByFilters(filters: any) {
    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.isFeatured !== undefined) where.isFeatured = filters.isFeatured;
    if (filters.isNew !== undefined) where.isNew = filters.isNew;
    if (filters.isBestSeller !== undefined) where.isBestSeller = filters.isBestSeller;
    if (filters.minPrice !== undefined) where.price = { gte: filters.minPrice };
    if (filters.maxPrice !== undefined) where.price = { ...where.price, lte: filters.maxPrice };
    return this.model.findMany({ where });
  }

  async incrementViewCount(id: number) {
    return this.model.update({
      where: { id },
      data: { viewCount: { increment: 1 } }
    });
  }

  async updateStock(id: number, quantity: number) {
    return this.model.update({
      where: { id },
      data: { stock: { decrement: quantity } }
    });
  }

  async updateSoldCount(id: number, quantity: number) {
    return this.model.update({
      where: { id },
      data: { soldCount: { increment: quantity } }
    });
  }

  async getFlashSaleProducts() {
    return this.model.findMany({
      where: {
        AND: [
          { promotionalPrice: { not: null } },
          { promotionalPrice: { gt: 0 } },
          { status: 'ACTIVE' },
          { stock: { gt: 0 } }
        ]
      },
      orderBy: { promotionalPrice: 'asc' },
      take: 10
    });
  }

  async getNewestProducts(limit: number) {
    return this.model.findMany({
      where: { status: 'ACTIVE', stock: { gt: 0 } },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  }

  async getBestSellingProducts(limit: number) {
    return this.model.findMany({
      where: { status: 'ACTIVE', stock: { gt: 0 } },
      orderBy: { soldCount: 'desc' },
      take: limit
    });
  }

  async getFeaturedProducts() {
    return this.model.findMany({
      where: { isFeatured: true, status: 'ACTIVE', stock: { gt: 0 } }
    });
  }

  async findProductsWithRelations(where: any, include: any) {
    return this.model.findMany({ where, include });
  }

  async findProductByIdWithRelations(id: number, include: any) {
    return this.model.findUnique({ where: { id }, include });
  }

  async createProductWithRelations(data: any, include: any) {
    return this.model.create({ data, include });
  }

  async updateProductWithRelations(id: number, data: any, include: any) {
    return this.model.update({ where: { id }, data, include });
  }

  async deleteProductWithRelations(id: number) {
    const product = await this.model.findUnique({
      where: { id },
      include: {
        reviews: true,
        orderItems: true,
        wishlist: true,
        cartItems: true
      }
    });
    if (!product) throw new Error('Product not found');
    await prisma.$transaction([
      prisma.cartItem.deleteMany({ where: { productId: id } }),
      prisma.review.deleteMany({ where: { productId: id } }),
      prisma.orderItem.deleteMany({ where: { productId: id } }),
      prisma.wishlist.deleteMany({ where: { productId: id } }),
      this.model.delete({ where: { id } })
    ]);
    return product;
  }

  async findCategoryByName(name: string) {
    return prisma.category.findFirst({ where: { name } });
  }

  async updateProductRating(productId: number) {
    const reviews = await prisma.review.findMany({ where: { productId } });
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
    return this.model.update({
      where: { id: productId },
      data: { rating: averageRating, reviewCount: reviews.length }
    });
  }
} 