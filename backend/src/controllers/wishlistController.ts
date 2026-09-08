import type { Request, Response } from 'express';
import * as wishlistService from '../services/wishlistService';
import { handleControllerError, ErrorCodes } from '../common/types/api-response';
import { parsePageOptions, calculatePagination } from '../common/types/pagination';

export const WishlistController = {
  async getUserWishlist(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const pagination = parsePageOptions(req.query);

      const { items, pagination: paginationMeta } = await wishlistService.getUserWishlist(userId, {
        page: pagination.page,
        limit: pagination.limit,
      });

      res.apiSuccess(items, "Lấy danh sách yêu thích thành công", 200, paginationMeta);
    } catch (error) {
      handleControllerError(res, error, "getUserWishlist");
    }
  },

  async addToWishlist(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { productId } = req.body;

      if (!productId) {
        res.apiError('Product ID is required', ErrorCodes.BAD_REQUEST);
        return;
      }

      const wishlistItem = await wishlistService.addToWishlist(userId, Number(productId));
      res.apiSuccess(wishlistItem, "Thêm vào danh sách yêu thích thành công");
    } catch (error) {
      handleControllerError(res, error, "addToWishlist");
    }
  },

  async removeFromWishlist(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { productId } = req.params;

      await wishlistService.removeFromWishlist(userId, Number(productId));
      res.apiSuccess(null, "Xóa khỏi danh sách yêu thích thành công");
    } catch (error) {
      handleControllerError(res, error, "removeFromWishlist");
    }
  },

  async checkWishlistStatus(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { productId } = req.params;

      const isInWishlist = await wishlistService.isInWishlist(userId, Number(productId));
      res.apiSuccess({ isInWishlist }, "Kiểm tra trạng thái thành công");
    } catch (error) {
      handleControllerError(res, error, "checkWishlistStatus");
    }
  }
};
