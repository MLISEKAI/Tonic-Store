import { PrismaClient, Product, ProductStatus } from '@prisma/client';
import { IProductRepository } from './interfaces/IProductRepository';

export class ProductRepository implements IProductRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }

  async findById(id: number): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { id }
    });
  }

  async findBySeoUrl(seoUrl: string): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { seoUrl }
    });
  }

  async create(data: Partial<Product>): Promise<Product> {
    return this.prisma.product.create({
      data: data as any
    });
  }

  async update(id: number, data: Partial<Product>): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data
    });
  }

  async delete(id: number): Promise<Product> {
    return this.prisma.product.delete({
      where: { id }
    });
  }

  async updateStatus(id: number, status: ProductStatus): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data: { status }
    });
  }

  async search(query: string): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
          { sku: { contains: query } },
        ],
      },
    });
  }

  async findByCategory(categoryName: string): Promise<Product[]> {
    const category = await this.prisma.category.findFirst({
      where: { name: categoryName }
    });
    
    if (!category) return [];

    return this.prisma.product.findMany({
      where: { categoryId: category.id }
    });
  }

  async findByFilters(filters: any): Promise<Product[]> {
    const where: any = {};

    if (filters.status) where.status = filters.status;
    if (filters.isFeatured !== undefined) where.isFeatured = filters.isFeatured;
    if (filters.isNew !== undefined) where.isNew = filters.isNew;
    if (filters.isBestSeller !== undefined) where.isBestSeller = filters.isBestSeller;
    if (filters.minPrice !== undefined) where.price = { gte: filters.minPrice };
    if (filters.maxPrice !== undefined) where.price = { ...where.price, lte: filters.maxPrice };

    return this.prisma.product.findMany({ where });
  }

  async incrementViewCount(id: number): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1
        }
      }
    });
  }

  async updateStock(id: number, quantity: number): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data: {
        stock: {
          decrement: quantity
        }
      }
    });
  }

  async updateSoldCount(id: number, quantity: number): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data: {
        soldCount: {
          increment: quantity
        }
      }
    });
  }

  async getFlashSaleProducts(): Promise<Product[]> {
    const now = new Date();
    return this.prisma.product.findMany({
      where: {
        AND: [
          { promotionalPrice: { not: null } },
          { promotionalPrice: { gt: 0 } },
          { status: 'ACTIVE' },
          { stock: { gt: 0 } }
        ]
      },
      orderBy: {
        promotionalPrice: 'asc'
      },
      take: 10
    });
  }

  async getNewestProducts(limit: number): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: {
        status: 'ACTIVE',
        stock: { gt: 0 }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    });
  }

  async getBestSellingProducts(limit: number): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: {
        status: 'ACTIVE',
        stock: { gt: 0 }
      },
      orderBy: {
        soldCount: 'desc'
      },
      take: limit
    });
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: {
        isFeatured: true,
        status: 'ACTIVE',
        stock: { gt: 0 }
      }
    });
  }

  async findProductsWithRelations(where: any, include: any): Promise<any[]> {
    return this.prisma.product.findMany({
      where,
      include
    });
  }

  async findProductByIdWithRelations(id: number, include: any): Promise<any | null> {
    return this.prisma.product.findUnique({
      where: { id },
      include
    });
  }

  async createProductWithRelations(data: any, include: any): Promise<any> {
    return this.prisma.product.create({
      data,
      include
    });
  }

  async updateProductWithRelations(id: number, data: any, include: any): Promise<any> {
    return this.prisma.product.update({
      where: { id },
      data,
      include
    });
  }

  async deleteProductWithRelations(id: number): Promise<any> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        reviews: true,
        orderItems: true,
        wishlist: true,
        cartItems: true
      }
    });

    if (!product) {
      throw new Error('Product not found');
    }

    await this.prisma.$transaction([
      this.prisma.cartItem.deleteMany({
        where: { productId: id }
      }),
      this.prisma.review.deleteMany({
        where: { productId: id }
      }),
      this.prisma.orderItem.deleteMany({
        where: { productId: id }
      }),
      this.prisma.wishlist.deleteMany({
        where: { productId: id }
      }),
      this.prisma.product.delete({
        where: { id }
      })
    ]);

    return product;
  }

  async findCategoryByName(name: string): Promise<any | null> {
    return this.prisma.category.findFirst({
      where: { name }
    });
  }

  async updateProductRating(productId: number): Promise<Product> {
    const reviews = await this.prisma.review.findMany({ where: { productId } });
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
    return this.prisma.product.update({
      where: { id: productId },
      data: {
        rating: averageRating,
        reviewCount: reviews.length
      }
    });
  }
} 