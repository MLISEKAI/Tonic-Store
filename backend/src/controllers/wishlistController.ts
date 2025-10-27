import type { Request, Response } from 'express';
import * as wishlistService from '../services/wishlistService';

export const WishlistController = {
  // Lấy danh sách sản phẩm yêu thích của user
  async getUserWishlist(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const wishlist = await wishlistService.getUserWishlist(userId);
      res.json(wishlist);
    } catch (error) {
      console.error('Error getting wishlist:', error);
      res.status(500).json({ error: 'Failed to get wishlist' });
    }
  },

  // Thêm sản phẩm vào wishlist
  async addToWishlist(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { productId } = req.body;

      if (!productId) {
        return res.status(400).json({ error: 'Product ID is required' });
      }

      const wishlistItem = await wishlistService.addToWishlist(userId, Number(productId));
      res.json(wishlistItem);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      res.status(500).json({ error: 'Failed to add to wishlist' });
    }
  },

  // Xóa sản phẩm khỏi wishlist
  async removeFromWishlist(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { productId } = req.params;

      await wishlistService.removeFromWishlist(userId, Number(productId));
      res.json({ message: 'Product removed from wishlist' });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      res.status(500).json({ error: 'Failed to remove from wishlist' });
    }
  },

  // Kiểm tra xem sản phẩm có trong wishlist không
  async checkWishlistStatus(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { productId } = req.params;

      const isInWishlist = await wishlistService.isInWishlist(userId, Number(productId));
      res.json({ isInWishlist });
    } catch (error) {
      console.error('Error checking wishlist status:', error);
      res.status(500).json({ error: 'Failed to check wishlist status' });
    }
  }
}; 