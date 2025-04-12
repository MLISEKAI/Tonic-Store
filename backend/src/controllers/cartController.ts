import { Request, Response } from 'express';
import * as cartService from '../services/cartService';
import prisma from '../prisma';

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
    if (!quantity) {
      return res.status(400).json({ message: 'Missing quantity' });
    }

    const cartItem = await cartService.updateCartItem(userId, parseInt(itemId), quantity);
    res.json(cartItem);
  } catch (error) {
    console.error('Error in updateCartItem controller:', error);
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
    await cartService.removeFromCart(userId, parseInt(itemId));
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error in removeFromCart controller:', error);
    res.status(500).json({ message: 'Error removing from cart' });
  }
}; 