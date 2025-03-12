import express, { Request, Response } from "express";
import { getCartByUserId, addToCart, updateCartItemQuantity, removeFromCart, clearCart } from "../services/cartService";
import { authenticate } from "../middleware/auth";

const router = express.Router();

router.get("/:userId", authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const cart = await getCartByUserId(Number(req.params.userId));
    res.json(cart);
    return;
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy giỏ hàng" });
  }
});

router.post("/", authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, productId, quantity } = req.body;
    const cartItem = await addToCart(Number(userId), Number(productId), Number(quantity));
    res.json(cartItem);
    return;
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi thêm vào giỏ hàng" });
  }
});

export default router;
