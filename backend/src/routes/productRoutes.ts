import express from "express";
import type { Request, Response } from "express";
import { getAllProducts, createProduct, getProductById, updateProduct, deleteProduct, searchProducts, updateProductStatus, updateProductRating, getProductBySeoUrl, incrementViewCount, getFlashSaleProducts, getNewestProducts, getBestSellingProducts } from "../services/productService";
import { authenticate } from "../middleware/auth";
import { cacheMiddleware } from "../services/cache-middleware";
import { CacheKeys } from "../services/cache.service";
import { handleControllerError, ErrorCodes } from "../common/types/api-response";
import { parsePageOptions, sendPaginated } from "../common/types/pagination";
import logger from "../config/logger";

const router = express.Router();

router.get("/", cacheMiddleware({
  ttl: 300,
  keyGenerator: (req) => `cache:${CacheKeys.PRODUCT_LIST(req.query.category as string, JSON.stringify(req.query))}`,
}), async (req: Request, res: Response): Promise<void> => {
  try {
    const pageOptions = parsePageOptions(req.query);
    const { search_text } = pageOptions;
    const { category, status, isFeatured, isNew, isBestSeller, minPrice, maxPrice } = req.query;

    const filters: any = {};
    if (category) filters.categoryName = category as string;
    if (status) filters.status = status;
    if (isFeatured !== undefined) filters.isFeatured = isFeatured === 'true';
    if (isNew !== undefined) filters.isNew = isNew === 'true';
    if (isBestSeller !== undefined) filters.isBestSeller = isBestSeller === 'true';
    if (minPrice) filters.minPrice = parseFloat(minPrice as string);
    if (maxPrice) filters.maxPrice = parseFloat(maxPrice as string);

    const products = await getAllProducts(filters.categoryName, filters);
    const total = products.length;
    const skip = (pageOptions.page - 1) * pageOptions.limit;
    const paginatedProducts = products.slice(skip, skip + pageOptions.limit);

    const pagination = {
      item_count: paginatedProducts.length,
      total_items: total,
      items_per_page: pageOptions.limit,
      total_pages: Math.ceil(total / pageOptions.limit),
      current_page: pageOptions.page,
    };

    sendPaginated(res, { items: paginatedProducts, pagination }, "Lấy danh sách sản phẩm thành công");
  } catch (error) {
    handleControllerError(res, error, "GET /api/products");
  }
});

router.get("/search", async (req: Request, res: Response): Promise<void> => {
  try {
    const query = req.query.q as string;
    if (!query) {
      res.apiError("Vui lòng nhập từ khóa tìm kiếm", ErrorCodes.BAD_REQUEST);
      return;
    }
    const products = await searchProducts(query);
    res.apiSuccess(products, "Tìm kiếm thành công");
  } catch (error) {
    handleControllerError(res, error, "GET /api/products/search");
  }
});

router.get("/flash-sale", cacheMiddleware({ ttl: 60, keyGenerator: () => `cache:${CacheKeys.PRODUCT_FLASH_SALE()}` }), async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await getFlashSaleProducts();
    res.apiSuccess(products, "Lấy sản phẩm flash sale thành công");
  } catch (error) {
    handleControllerError(res, error, "GET /api/products/flash-sale");
  }
});

router.get("/featured", cacheMiddleware({
  ttl: 300,
  keyGenerator: (req) => `cache:${CacheKeys.PRODUCT_LIST(undefined, JSON.stringify({ isFeatured: true, limit: req.query.limit }))}`,
}), async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 8;
    const products = await getAllProducts(undefined, { isFeatured: true });
    const limitedProducts = products.slice(0, limit);
    res.apiSuccess(limitedProducts, "Lấy sản phẩm nổi bật thành công");
  } catch (error) {
    handleControllerError(res, error, "GET /api/products/featured");
  }
});

router.get("/newest", cacheMiddleware({
  ttl: 300,
  keyGenerator: (req) => `cache:${CacheKeys.PRODUCT_NEWEST(req.query.limit ? parseInt(req.query.limit as string) : 8)}`,
}), async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 8;
    const products = await getNewestProducts(limit);
    res.apiSuccess(products, "Lấy sản phẩm mới nhất thành công");
  } catch (error) {
    handleControllerError(res, error, "GET /api/products/newest");
  }
});

router.get("/best-selling", cacheMiddleware({
  ttl: 300,
  keyGenerator: (req) => `cache:${CacheKeys.PRODUCT_BEST_SELLING(req.query.limit ? parseInt(req.query.limit as string) : 8)}`,
}), async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 8;
    const products = await getBestSellingProducts(limit);
    res.apiSuccess(products, "Lấy sản phẩm bán chạy thành công");
  } catch (error) {
    handleControllerError(res, error, "GET /api/products/best-selling");
  }
});

router.get("/seo/:seoUrl", async (req: Request, res: Response): Promise<void> => {
  try {
    const { seoUrl } = req.params;
    const product = await getProductBySeoUrl(seoUrl);
    if (!product) {
      res.apiError('Sản phẩm không tồn tại', ErrorCodes.NOT_FOUND);
      return;
    }
    res.apiSuccess(product, "Lấy sản phẩm thành công");
  } catch (error) {
    handleControllerError(res, error, "GET /api/products/seo/:seoUrl");
  }
});

router.get("/:id", cacheMiddleware({
  ttl: 600,
  keyGenerator: (req) => `cache:${CacheKeys.PRODUCT_DETAIL(Number(req.params.id))}`,
}), async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const product = await getProductById(id);
    if (!product) {
      res.apiError('Sản phẩm không tồn tại', ErrorCodes.NOT_FOUND);
      return;
    }
    res.apiSuccess(product, "Lấy sản phẩm thành công");
  } catch (error) {
    handleControllerError(res, error, "GET /api/products/:id");
  }
});

router.post("/", authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== "ADMIN") {
      res.apiError("Chỉ admin mới có quyền tạo sản phẩm", ErrorCodes.FORBIDDEN);
      return;
    }
    const product = await createProduct(req.body);
    res.apiSuccess(product, "Tạo sản phẩm thành công", 201);
  } catch (error) {
    handleControllerError(res, error, "POST /api/products");
  }
});

router.put("/:id", authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== "ADMIN") {
      res.apiError("Chỉ admin mới có quyền cập nhật sản phẩm", ErrorCodes.FORBIDDEN);
      return;
    }
    const id = parseInt(req.params.id);
    const product = await updateProduct(id, req.body);
    res.apiSuccess(product, "Cập nhật sản phẩm thành công");
  } catch (error) {
    handleControllerError(res, error, "PUT /api/products/:id");
  }
});

router.delete("/:id", authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== "ADMIN") {
      res.apiError("Chỉ admin mới có quyền xóa sản phẩm", ErrorCodes.FORBIDDEN);
      return;
    }
    const id = parseInt(req.params.id);
    await deleteProduct(id);
    res.apiSuccess(null, 'Xóa sản phẩm thành công');
  } catch (error) {
    handleControllerError(res, error, "DELETE /api/products/:id");
  }
});

router.patch("/:id/status", authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== "ADMIN") {
      res.apiError("Chỉ admin mới có quyền cập nhật trạng thái sản phẩm", ErrorCodes.FORBIDDEN);
      return;
    }
    const id = parseInt(req.params.id);
    const { status } = req.body;
    const product = await updateProductStatus(id, status);
    res.apiSuccess(product, "Cập nhật trạng thái sản phẩm thành công");
  } catch (error) {
    handleControllerError(res, error, "PATCH /api/products/:id/status");
  }
});

router.patch("/:id/rating", async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const product = await updateProductRating(id);
    res.apiSuccess(product, "Cập nhật đánh giá sản phẩm thành công");
  } catch (error) {
    handleControllerError(res, error, "PATCH /api/products/:id/rating");
  }
});

router.patch("/:id/view", async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const product = await incrementViewCount(id);
    res.apiSuccess(product, "Cập nhật lượt xem sản phẩm thành công");
  } catch (error) {
    handleControllerError(res, error, "PATCH /api/products/:id/view");
  }
});

export default router;
