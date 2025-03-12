import express, { Request, Response } from "express";
import { getAllProducts, createProduct } from "../services/productService";
import { authenticate } from "../middleware/auth";

const router = express.Router();

router.get("/", async (_req: Request, res: Response): Promise<void> => {
  try {
    const products = await getAllProducts();
    res.json(products);
    return;
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy sản phẩm" });
  }
});

router.post("/", authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== "ADMIN") {
      res.status(403).json({ error: "Không có quyền thêm sản phẩm" });
      return;
    }
    const { name, description, price, stock, imageUrl, category } = req.body;
    const product = await createProduct(name, description, price, stock, imageUrl, category);
    res.json(product);
    return;
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi thêm sản phẩm" });
  }
});

export default router;
