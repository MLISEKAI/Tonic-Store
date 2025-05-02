import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import * as cartService from '../services/cartService';

export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const cart = await cartService.getCart(userId);
    res.json(cart);
  } catch (error) {
    console.error('Error in getCart controller:', error);
    res.status(500).json({ message: 'Error fetching cart' });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { productId, quantity } = req.body;
    
    // Validate input
    if (!productId || !quantity) {
      return res.status(400).json({ message: 'Missing required fields: productId and quantity are required' });
    }

    // Convert to numbers and validate
    const parsedProductId = Number(productId);
    const parsedQuantity = Number(quantity);
    
    if (isNaN(parsedProductId) || isNaN(parsedQuantity)) {
      return res.status(400).json({ message: 'Invalid input: productId and quantity must be numbers' });
    }

    if (parsedQuantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be greater than 0' });
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: parsedProductId }
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if product is in stock
    if (product.stock < parsedQuantity) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    const cartItem = await cartService.addToCart(userId, parsedProductId, parsedQuantity);
    res.json(cartItem);
  } catch (error) {
    console.error('Error in addToCart controller:', error);
    if (error instanceof Error) {
      res.status(500).json({ message: `Error adding to cart: ${error.message}` });
    } else {
      res.status(500).json({ message: 'Error adding to cart' });
    }
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }

    await cartService.updateCartItem(userId, parseInt(itemId), quantity);
    res.json({ message: 'Cart item updated successfully' });
  } catch (error) {
    console.error('Error in updateCartItem controller:', error);
    if (error instanceof Error) {
      if (error.message === 'Cart not found') {
        return res.status(404).json({ message: 'Cart not found' });
      }
      if (error.message === 'Cart item not found') {
        return res.status(404).json({ message: 'Cart item not found' });
      }
    }
    res.status(500).json({ message: 'Error updating cart item' });
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { itemId } = req.params;
    const result = await cartService.removeFromCart(userId, parseInt(itemId));
    res.json(result);
  } catch (error) {
    console.error('Error in removeFromCart controller:', error);
    if (error instanceof Error) {
      if (error.message === 'Cart not found') {
        return res.status(404).json({ message: 'Cart not found' });
      }
      if (error.message === 'Cart item not found') {
        return res.status(404).json({ message: 'Cart item not found' });
      }
    }
    res.status(500).json({ message: 'Error removing from cart' });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await cartService.clearCart(userId);
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error in clearCart controller:', error);
    if (error instanceof Error) {
      if (error.message === 'Cart not found') {
        return res.status(404).json({ message: 'Cart not found' });
      }
    }
    res.status(500).json({ message: 'Error clearing cart' });
  }
}; 