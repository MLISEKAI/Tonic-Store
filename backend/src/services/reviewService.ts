import { ReviewRepository } from '../repositories';
import { CacheService, CacheKeys } from './cache.service';

const reviewRepository = new ReviewRepository();

export const createReview = async (userId: number, productId: number, rating: number, comment?: string) => {
  const review = await reviewRepository.createReview(userId, productId, rating, comment);
  await CacheService.delete(CacheKeys.REVIEW_PRODUCT(productId));
  await CacheService.delete(CacheKeys.REVIEW_ALL());
  await CacheService.delete(CacheKeys.REVIEW_USER(userId));
  return review;
};

export const getProductReviews = async (productId: number) => {
  const cacheKey = CacheKeys.REVIEW_PRODUCT(productId);
  const cached = await CacheService.get(cacheKey);
  if (cached) return cached;

  const reviews = await reviewRepository.getProductReviews(productId);
  await CacheService.set(cacheKey, reviews, 300);
  return reviews;
};

export const getUserReviews = async (userId: number) => {
  const cacheKey = CacheKeys.REVIEW_USER(userId);
  const cached = await CacheService.get(cacheKey);
  if (cached) return cached;

  const reviews = await reviewRepository.getUserReviews(userId);
  await CacheService.set(cacheKey, reviews, 300);
  return reviews;
};

export const updateReview = async (id: number, rating: number, comment?: string) => {
  const review = await reviewRepository.updateReview(id, rating, comment);
  await CacheService.delete(CacheKeys.REVIEW_PRODUCT(review.productId));
  await CacheService.delete(CacheKeys.REVIEW_ALL());
  await CacheService.delete(CacheKeys.REVIEW_USER(review.userId));
  return review;
};

export const deleteReview = async (id: number) => {
  const review = await reviewRepository.deleteReview(id);
  await CacheService.delete(CacheKeys.REVIEW_PRODUCT(review.productId));
  await CacheService.delete(CacheKeys.REVIEW_ALL());
  await CacheService.delete(CacheKeys.REVIEW_USER(review.userId));
  return review;
};

export const getAllReviews = async () => {
  const cacheKey = CacheKeys.REVIEW_ALL();
  const cached = await CacheService.get(cacheKey);
  if (cached) return cached;

  const reviews = await reviewRepository.getAllReviews();
  await CacheService.set(cacheKey, reviews, 300);
  return reviews;
};
