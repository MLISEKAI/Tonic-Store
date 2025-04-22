import express from 'express';
import { createReview, getProductReviews, getUserReviews, updateReview, deleteReview } from '../services/reviewService';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Lấy tất cả đánh giá của sản phẩm
router.get('/product/:productId', async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    const reviews = await getProductReviews(productId);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get product reviews' });
  }
});

// Lấy tất cả đánh giá của người dùng
router.get('/user', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const reviews = await getUserReviews(userId);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user reviews' });
  }
});

// Tạo đánh giá mới
router.post('/', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { productId, rating, comment } = req.body;
    const review = await createReview(userId, productId, rating, comment);
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create review' });
  }
});

// Cập nhật đánh giá
router.put('/:id', authenticateToken, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    const { rating, comment } = req.body;
    const review = await updateReview(id, rating, comment);
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update review' });
  }
});

// Xóa đánh giá
router.delete('/:id', authenticateToken, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    await deleteReview(id);
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

export default router; 