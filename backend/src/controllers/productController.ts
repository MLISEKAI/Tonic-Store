import type { Request, Response } from "express";
import { prisma } from '../prisma';
import * as productService from "../services/productService";
import logger from "../config/logger";
import { parsePageOptions, calculatePagination } from '../common/types/pagination';

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const pagination = parsePageOptions(req.query);
    const category = req.query.category as string;

    const where = category ? { categoryId: parseInt(category) } : {};

      const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, name: true, description: true, price: true, promotionalPrice: true,
          imageUrl: true, status: true, stock: true, isFeatured: true, isNew: true,
          isBestSeller: true, rating: true, reviewCount: true, soldCount: true, viewCount: true,
          seoUrl: true, createdAt: true, updatedAt: true, categoryId: true,
          category: { select: { id: true, name: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    const paginationMeta = calculatePagination(total, pagination.limit, pagination.page);
    res.apiSuccess(products, "Lấy danh sách sản phẩm thành công", 200, paginationMeta);
  } catch (error) { logger.error('Error', { err: (error as Error).message }); res.status(500).json({ message: "Error fetching products" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await productService.getProductById(Number(req.params.id));
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.json(product);
  } catch (error) { logger.error('Error', { err: (error as Error).message }); res.status(500).json({ message: "Error fetching product" });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { 
      name, 
      description, 
      price, 
      stock, 
      imageUrl, 
      categoryId,
      sku,
      barcode,
      weight,
      dimensions,
      material,
      origin,
      warranty,
      status,
      seoTitle,
      seoDescription,
      seoUrl,
      isFeatured,
      isNew,
      isBestSeller
    } = req.body;

    const product = await productService.createProduct({
      name,
      description,
      price,
      stock,
      categoryId,
      imageUrl,
      sku,
      barcode,
      weight,
      dimensions,
      material,
      origin,
      warranty,
      status,
      seoTitle,
      seoDescription,
      seoUrl,
      isFeatured,
      isNew,
      isBestSeller
    });
    res.status(201).json(product);
  } catch (error) { logger.error('Error', { err: (error as Error).message }); res.status(500).json({ message: "Error creating product" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      description, 
      price,
      promotionalPrice,
      stock, 
      imageUrl, 
      categoryId,
      sku,
      barcode,
      weight,
      dimensions,
      material,
      origin,
      warranty,
      status,
      seoTitle,
      seoDescription,
      seoUrl,
      isFeatured,
      isNew,
      isBestSeller
    } = req.body;

    const product = await productService.updateProduct(Number(id), {
      name,
      description,
      price,
      promotionalPrice,
      stock,
      categoryId,
      imageUrl,
      sku,
      barcode,
      weight,
      dimensions,
      material,
      origin,
      warranty,
      status,
      seoTitle,
      seoDescription,
      seoUrl,
      isFeatured,
      isNew,
      isBestSeller
    });
    res.json(product);
  } catch (error) { logger.error('Error', { err: (error as Error).message }); res.status(500).json({ message: "Error updating product" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await productService.deleteProduct(Number(id));
    res.json({ message: "Product deleted successfully" });
  } catch (error) { logger.error('Error', { err: (error as Error).message }); res.status(500).json({ message: "Error deleting product" });
  }
};

export const incrementProductView = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await productService.incrementViewCount(Number(id));
    res.json(product);
  } catch (error) { logger.error('Error', { err: (error as Error).message }); res.status(500).json({ message: "Error updating product view count" });
  }
}; 