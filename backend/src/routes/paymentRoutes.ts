import express, { Request, Response } from "express";
import { getAllPayments, createPayment, updatePaymentStatus } from "../services/paymentService";
import { authenticate } from "../middleware/auth";

const router = express.Router();

router.get("/", authenticate, async (_req: Request, res: Response): Promise<void> => {
  try {
    const payments = await getAllPayments();
    res.json(payments);
    return;
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy danh sách thanh toán" });
  }
});

router.post("/", authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId, method, transactionId } = req.body;
    const payment = await createPayment(Number(orderId), method, transactionId);
    res.json(payment);
    return;
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi tạo thanh toán" });
  }
});

export default router;
