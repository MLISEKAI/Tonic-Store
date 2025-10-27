import type { Request, Response } from 'express';
import { createReview, getProductReviews, getUserReviews, updateReview, deleteReview, getAllReviews} from '../services/reviewService';
import { updateProductRating } from '../services/productService';

export const getProductReviewsController = async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.productId);
    const reviews = await getProductReviews(productId);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get product reviews' });
  }
};

export const getUserReviewsController = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const reviews = await getUserReviews(userId);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user reviews' });
  }
};

export const createReviewController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { productId, rating, comment } = req.body;
    
    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const review = await createReview(userId, productId, rating, comment);
    
    // Update product rating
    await updateProductRating(productId);
    
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create review' });
  }
};

export const updateReviewController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { rating, comment } = req.body;
    
    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const review = await updateReview(id, rating, comment);
    
    // Update product rating
    await updateProductRating(review.productId);
    
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update review' });
  }
};

export const deleteReviewController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const review = await deleteReview(id);
    
    // Update product rating
    await updateProductRating(review.productId);
    
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete review' });
  }
};

export const getAllReviewsController = async (req: Request, res: Response) => {
  try {
    const reviews = await getAllReviews();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get all reviews' });
  }
};
