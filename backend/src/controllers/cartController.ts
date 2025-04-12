import { Request, Response } from 'express';
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
    if (!productId || !quantity) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const cartItem = await cartService.addToCart(userId, productId, quantity);
    res.json(cartItem);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to cart' });
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
    res.status(500).json({ message: 'Error removing from cart' });
  }
}; 