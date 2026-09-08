import { prisma } from '../prisma';
import type { Request, Response } from 'express';
import * as cartService from '../services/cartService';
import { handleControllerError, ErrorCodes } from '../common/types/api-response';

export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.apiError('Unauthorized', ErrorCodes.UNAUTHORIZED);
      return;
    }

    const cart = await cartService.getCart(userId);
    res.apiSuccess(cart, "Lấy giỏ hàng thành công");
  } catch (error) {
    handleControllerError(res, error, "getCart");
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.apiError('Unauthorized', ErrorCodes.UNAUTHORIZED);
      return;
    }

    const { productId, quantity } = req.body;
    
    if (!productId || !quantity) {
      res.apiError('Missing required fields: productId and quantity are required', ErrorCodes.BAD_REQUEST);
      return;
    }

    const parsedProductId = Number(productId);
    const parsedQuantity = Number(quantity);
    
    if (isNaN(parsedProductId) || isNaN(parsedQuantity)) {
      res.apiError('Invalid input: productId and quantity must be numbers', ErrorCodes.BAD_REQUEST);
      return;
    }

    if (parsedQuantity <= 0) {
      res.apiError('Quantity must be greater than 0', ErrorCodes.BAD_REQUEST);
      return;
    }

    const product = await prisma.product.findUnique({
      where: { id: parsedProductId }
    });

    if (!product) {
      res.apiError('Product not found', ErrorCodes.NOT_FOUND);
      return;
    }

    if (product.stock < parsedQuantity) {
      res.apiError('Not enough stock available', ErrorCodes.BAD_REQUEST);
      return;
    }

    const cartItem = await cartService.addToCart(userId, parsedProductId, parsedQuantity);
    res.apiSuccess(cartItem, "Thêm vào giỏ hàng thành công");
  } catch (error) {
    handleControllerError(res, error, "addToCart");
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.apiError('Unauthorized', ErrorCodes.UNAUTHORIZED);
      return;
    }

    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      res.apiError('Invalid quantity', ErrorCodes.BAD_REQUEST);
      return;
    }

    await cartService.updateCartItem(userId, parseInt(itemId), quantity);
    res.apiSuccess(null, "Cập nhật giỏ hàng thành công");
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Cart not found' || error.message === 'Cart item not found') {
        res.apiError(error.message, ErrorCodes.NOT_FOUND);
        return;
      }
    }
    handleControllerError(res, error, "updateCartItem");
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.apiError('Unauthorized', ErrorCodes.UNAUTHORIZED);
      return;
    }

    const { itemId } = req.params;
    await cartService.removeFromCart(userId, parseInt(itemId));
    res.apiSuccess(null, "Xóa khỏi giỏ hàng thành công");
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Cart not found' || error.message === 'Cart item not found') {
        res.apiError(error.message, ErrorCodes.NOT_FOUND);
        return;
      }
    }
    handleControllerError(res, error, "removeFromCart");
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.apiError('Unauthorized', ErrorCodes.UNAUTHORIZED);
      return;
    }

    await cartService.clearCart(userId);
    res.apiSuccess(null, "Xóa giỏ hàng thành công");
  } catch (error) {
    if (error instanceof Error && error.message === 'Cart not found') {
      res.apiError(error.message, ErrorCodes.NOT_FOUND);
      return;
    }
    handleControllerError(res, error, "clearCart");
  }
};
