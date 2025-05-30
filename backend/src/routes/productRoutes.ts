import express, { Request, Response } from "express";
import { getAllProducts, createProduct, getProductById, updateProduct, deleteProduct, searchProducts, updateProductStatus, updateProductRating, getProductBySeoUrl, incrementViewCount, getFlashSaleProducts, getNewestProducts, getBestSellingProducts } from "../services/productService";
import { authenticate } from "../middleware/auth";

const router = express.Router();

// Public routes - anyone can view products
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, status, isFeatured, isNew, isBestSeller, minPrice, maxPrice } = req.query;
    const filters: any = {};
    
    if (status) filters.status = status;
    if (isFeatured !== undefined) filters.isFeatured = isFeatured === 'true';
    if (isNew !== undefined) filters.isNew = isNew === 'true';
    if (isBestSeller !== undefined) filters.isBestSeller = isBestSeller === 'true';
    if (minPrice) filters.minPrice = parseFloat(minPrice as string);
    if (maxPrice) filters.maxPrice = parseFloat(maxPrice as string);

    const products = await getAllProducts(category as string, filters);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get products' });
  }
});

router.get("/search", async (req: Request, res: Response): Promise<void> => {
  try {
    const query = req.query.q as string;
    if (!query) {
      res.status(400).json({ error: "Vui lòng nhập từ khóa tìm kiếm" });
      return;
    }
    const products = await searchProducts(query);
    res.json(products);
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ error: "Lỗi khi tìm kiếm sản phẩm" });
  }
});

// Lấy sản phẩm flash sale
router.get("/flash-sale", async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Received flash sale request');
    const products = await getFlashSaleProducts();
    console.log('Flash sale products count:', products.length);
    res.json(products);
  } catch (error) {
    console.error('Error in flash sale route:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to get flash sale products',
      details: error instanceof Error ? error.stack : undefined
    });
  }
});

// Lấy sản phẩm nổi bật
router.get("/featured", async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 8;
    console.log('Fetching featured products with limit:', limit);
    const products = await getAllProducts(undefined, { isFeatured: true });
    const limitedProducts = products.slice(0, limit);
    console.log('Found featured products:', limitedProducts.length);
    res.json(limitedProducts);
  } catch (error) {
    console.error('Error in featured products route:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to get featured products',
      details: error instanceof Error ? error.stack : undefined
    });
  }
});

// Lấy sản phẩm mới nhất - Di chuyển lên trước /:id
router.get("/newest", async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 8;
    console.log('Fetching newest products with limit:', limit);
    const products = await getNewestProducts(limit);
    console.log('Found newest products:', products.length);
    res.json(products);
  } catch (error) {
    console.error('Error in newest products route:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to get newest products',
      details: error instanceof Error ? error.stack : undefined
    });
  }
});

// Lấy sản phẩm bán chạy - Di chuyển lên trước /:id
router.get("/best-selling", async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 8;
    console.log('Fetching best selling products with limit:', limit);
    const products = await getBestSellingProducts(limit);
    console.log('Found best selling products:', products.length);
    res.json(products);
  } catch (error) {
    console.error('Error in best selling products route:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to get best selling products',
      details: error instanceof Error ? error.stack : undefined
    });
  }
});

// Thêm route mới trước route /:id
router.get("/seo/:seoUrl", async (req: Request, res: Response): Promise<void> => {
  try {
    const { seoUrl } = req.params;
    const product = await getProductBySeoUrl(seoUrl);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get product' });
  }
});

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const product = await getProductById(id);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get product' });
  }
});

// Admin routes - only ADMIN can manage products
router.post("/", authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== "ADMIN") {
      res.status(403).json({ error: "Only admin can create products" });
      return;
    }
    const product = await createProduct(req.body);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

router.put("/:id", authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== "ADMIN") {
      res.status(403).json({ error: "Only admin can update products" });
      return;
    }
    const id = parseInt(req.params.id);
    const product = await updateProduct(id, req.body);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

router.delete("/:id", authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== "ADMIN") {
      res.status(403).json({ error: "Only admin can delete products" });
      return;
    }
    const id = parseInt(req.params.id);
    await deleteProduct(id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Cập nhật trạng thái sản phẩm (chỉ admin)
router.patch("/:id/status", authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== "ADMIN") {
      res.status(403).json({ error: "Only admin can update product status" });
      return;
    }
    const id = parseInt(req.params.id);
    const { status } = req.body;
    const product = await updateProductStatus(id, status);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product status' });
  }
});

// Cập nhật đánh giá sản phẩm
router.patch("/:id/rating", async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const product = await updateProductRating(id);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product rating' });
  }
});

// Cập nhật lượt xem sản phẩm
router.patch("/:id/view", async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const product = await incrementViewCount(id);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product view count' });
  }
});

export default router;
