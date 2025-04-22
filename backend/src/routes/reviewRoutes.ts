import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  getProductReviewsController,
  getUserReviewsController,
  createReviewController,
  updateReviewController,
  deleteReviewController
} from '../controllers/reviewController';

const router = express.Router();

// Lấy tất cả đánh giá của sản phẩm
router.get('/product/:productId', getProductReviewsController);

// Lấy tất cả đánh giá của người dùng
router.get('/user/:userId', getUserReviewsController);

// Tạo đánh giá mới
router.post('/', authenticate, createReviewController);

// Cập nhật đánh giá
router.put('/:id', authenticate, updateReviewController);

// Xóa đánh giá
router.delete('/:id', authenticate, deleteReviewController);

export default router; 