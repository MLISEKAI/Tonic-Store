import { ReviewRepository } from '../repositories';

const reviewRepository = new ReviewRepository();

export const createReview = async (userId: number, productId: number, rating: number, comment?: string) => {
  return reviewRepository.createReview(userId, productId, rating, comment);
};

export const getProductReviews = async (productId: number) => {
  return reviewRepository.getProductReviews(productId);
};

export const getUserReviews = async (userId: number) => {
  return reviewRepository.getUserReviews(userId);
};

export const updateReview = async (id: number, rating: number, comment?: string) => {
  return reviewRepository.updateReview(id, rating, comment);
};

export const deleteReview = async (id: number) => {
  return reviewRepository.deleteReview(id);
};

export const getAllReviews = async () => {
  return reviewRepository.getAllReviews();
};
