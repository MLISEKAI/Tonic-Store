import express, { Request, Response } from "express";
import { getAllOrders, createOrder } from "../services/orderService";
import { authenticate } from "../middleware/auth";

const router = express.Router();

router.get("/", authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== "ADMIN") {
      res.status(403).json({ error: "Không có quyền truy cập" });
      return;
    }
    const orders = await getAllOrders();
    res.json(orders);
    return;
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy đơn hàng" });
  }
});

router.post("/", authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, totalPrice, status, items } = req.body;
    const order = await createOrder(userId, totalPrice, status, items);
    res.json(order);
    return;
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi tạo đơn hàng" });
  }
});

export default router;
