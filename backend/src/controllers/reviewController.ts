import type { Request, Response } from 'express';
import { prisma } from '../prisma';
import { createReview, getProductReviews, getUserReviews, updateReview, deleteReview, getAllReviews} from '../services/reviewService';
import { updateProductRating } from '../services/productService';
import { handleControllerError, ErrorCodes } from '../common/types/api-response';
import { parsePageOptions, calculatePagination } from '../common/types/pagination';

export const getProductReviewsController = async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.productId);
    const pagination = parsePageOptions(req.query);

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { productId },
        include: { user: { select: { id: true, name: true, avatarUrl: true } } },
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.review.count({ where: { productId } }),
    ]);

    const paginationMeta = calculatePagination(total, pagination.limit, pagination.page);
    res.apiSuccess(reviews, "Lấy đánh giá sản phẩm thành công", 200, paginationMeta);
  } catch (error) {
    handleControllerError(res, error, "getProductReviewsController");
  }
};

export const getUserReviewsController = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const pagination = parsePageOptions(req.query);

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { userId },
        include: { product: { select: { id: true, name: true, imageUrl: true } } },
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.review.count({ where: { userId } }),
    ]);

    const paginationMeta = calculatePagination(total, pagination.limit, pagination.page);
    res.apiSuccess(reviews, "Lấy đánh giá người dùng thành công", 200, paginationMeta);
  } catch (error) {
    handleControllerError(res, error, "getUserReviewsController");
  }
};

export const createReviewController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { productId, rating, comment } = req.body;
    
    if (rating < 1 || rating > 5) {
      res.apiError('Rating must be between 1 and 5', ErrorCodes.BAD_REQUEST);
      return;
    }

    const review = await createReview(userId, productId, rating, comment);
    await updateProductRating(productId);
    
    res.apiSuccess(review, "Tạo đánh giá thành công", 201);
  } catch (error) {
    handleControllerError(res, error, "createReviewController");
  }
};

export const updateReviewController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { rating, comment } = req.body;
    
    if (rating < 1 || rating > 5) {
      res.apiError('Rating must be between 1 and 5', ErrorCodes.BAD_REQUEST);
      return;
    }

    const review = await updateReview(id, rating, comment);
    await updateProductRating(review.productId);
    
    res.apiSuccess(review, "Cập nhật đánh giá thành công");
  } catch (error) {
    handleControllerError(res, error, "updateReviewController");
  }
};

export const deleteReviewController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const review = await deleteReview(id);
    await updateProductRating(review.productId);
    
    res.apiSuccess(null, "Xóa đánh giá thành công");
  } catch (error) {
    handleControllerError(res, error, "deleteReviewController");
  }
};

export const getAllReviewsController = async (req: Request, res: Response) => {
  try {
    const pagination = parsePageOptions(req.query);

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        include: {
          user: { select: { id: true, name: true, avatarUrl: true } },
          product: { select: { id: true, name: true, imageUrl: true } },
        },
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.review.count(),
    ]);

    const paginationMeta = calculatePagination(total, pagination.limit, pagination.page);
    res.apiSuccess(reviews, "Lấy tất cả đánh giá thành công", 200, paginationMeta);
  } catch (error) {
    handleControllerError(res, error, "getAllReviewsController");
  }
};
