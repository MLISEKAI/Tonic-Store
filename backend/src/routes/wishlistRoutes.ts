import express from 'express';
import { authenticate } from '../middleware/auth';
import { WishlistController } from '../controllers/wishlistController';

const router = express.Router();

// Tất cả các routes đều yêu cầu xác thực
router.use(authenticate);

// Lấy danh sách sản phẩm yêu thích
router.get('/', WishlistController.getUserWishlist);

// Thêm sản phẩm vào wishlist
router.post('/', WishlistController.addToWishlist);

// Xóa sản phẩm khỏi wishlist
router.delete('/:productId', WishlistController.removeFromWishlist);

// Kiểm tra trạng thái sản phẩm trong wishlist
router.get('/check/:productId', WishlistController.checkWishlistStatus);

export default router; 