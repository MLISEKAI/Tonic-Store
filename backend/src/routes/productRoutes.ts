import express, { Request, Response } from "express";
import { getAllProducts, createProduct, getProductById, updateProduct, deleteProduct } from "../services/productService";
import { authenticate } from "../middleware/auth";

const router = express.Router();

// Public routes - anyone can view products
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const category = req.query.category as string;
    const products = await getAllProducts(category);
    res.json(products);
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({ error: "Lỗi khi lấy sản phẩm" });
  }
});

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await getProductById(Number(req.params.id));
    if (!product) {
      res.status(404).json({ error: "Sản phẩm không tồn tại" });
      return;
    }
    res.json(product);
  } catch (error) {
    console.error('Error getting product:', error);
    res.status(500).json({ error: "Lỗi khi lấy sản phẩm" });
  }
});

// Admin routes - only ADMIN can manage products
router.post("/", authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== "ADMIN") {
      res.status(403).json({ error: "Không có quyền thêm sản phẩm" });
      return;
    }
    const { name, description, price, stock, imageUrl, categoryId } = req.body;
    const product = await createProduct(name, description, price, stock, imageUrl, categoryId);
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: "Lỗi khi thêm sản phẩm" });
  }
});

router.put("/:id", authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== "ADMIN") {
      res.status(403).json({ error: "Không có quyền cập nhật sản phẩm" });
      return;
    }
    const { name, description, price, stock, imageUrl, categoryId } = req.body;
    const product = await updateProduct(Number(req.params.id), {
      name, description, price, stock, imageUrl, categoryId
    });
    if (!product) {
      res.status(404).json({ error: "Sản phẩm không tồn tại" });
      return;
    }
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: "Lỗi khi cập nhật sản phẩm" });
  }
});

router.delete("/:id", authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== "ADMIN") {
      res.status(403).json({ error: "Không có quyền xóa sản phẩm" });
      return;
    }
    const product = await getProductById(Number(req.params.id));
    if (!product) {
      res.status(404).json({ error: "Sản phẩm không tồn tại" });
      return;
    }
    await deleteProduct(Number(req.params.id));
    res.json({ message: "Xóa sản phẩm thành công" });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: "Lỗi khi xóa sản phẩm" });
  }
});

export default router;
