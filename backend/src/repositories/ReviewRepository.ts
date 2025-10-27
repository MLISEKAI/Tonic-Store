import { PrismaClient } from '@prisma/client';
import type { IReviewRepository } from './interfaces/IReviewRepository';

export class ReviewRepository implements IReviewRepository {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }
  async createReview(userId: number, productId: number, rating: number, comment?: string): Promise<any> {
    const review = await this.prisma.review.create({
      data: { userId, productId, rating, comment },
      include: {
        user: { select: { id: true, name: true, email: true } },
        product: { select: { id: true, name: true } }
      }
    });
    await this.prisma.notification.create({
      data: {
        userId,
        message: `Cảm ơn bạn đã đánh giá sản phẩm ${review.product.name}.`,
        isRead: false,
      },
    });
    return review;
  }
  async getProductReviews(productId: number): Promise<any[]> {
    return this.prisma.review.findMany({
      where: { productId },
      include: {
        user: { select: { id: true, name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
  async getUserReviews(userId: number): Promise<any[]> {
    return this.prisma.review.findMany({
      where: { userId },
      include: {
        product: { select: { id: true, name: true, imageUrl: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
  async updateReview(id: number, rating: number, comment?: string): Promise<any> {
    return this.prisma.review.update({
      where: { id },
      data: { rating, comment },
      include: {
        user: { select: { id: true, name: true, email: true } },
        product: { select: { id: true, name: true } }
      }
    });
  }
  async deleteReview(id: number): Promise<any> {
    return this.prisma.review.delete({ where: { id } });
  }
  async getAllReviews(): Promise<any[]> {
    return this.prisma.review.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        product: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
} 