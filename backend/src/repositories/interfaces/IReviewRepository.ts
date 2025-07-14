import { Review } from '@prisma/client';

export interface IReviewRepository {
  createReview(userId: number, productId: number, rating: number, comment?: string): Promise<any>;
  getProductReviews(productId: number): Promise<any[]>;
  getUserReviews(userId: number): Promise<any[]>;
  updateReview(id: number, rating: number, comment?: string): Promise<any>;
  deleteReview(id: number): Promise<any>;
  getAllReviews(): Promise<any[]>;
} 