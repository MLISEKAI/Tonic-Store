import { ProductStatus } from '@prisma/client';
import { ProductRepository } from '../repositories';

const productRepository = new ProductRepository();

// Cooldown mechanism to prevent spamming flash sale notifications
let lastFlashSaleNotificationSent = 0;
const NOTIFICATION_COOLDOWN = 60 * 60 * 1000; // 1 hour in milliseconds

const productIncludeRelations = {
  category: true,
  reviews: {
    include: {
      user: {
        select: {
          id: true,
          name: true
        }
      }
    }
  }
};

export const getAllProducts = async (categoryName?: string, filters?: {
  status?: ProductStatus;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  minPrice?: number;
  maxPrice?: number;
}) => {
  let where: any = {};

  if (categoryName) {
    const category = await productRepository.findCategoryByName(categoryName);
    if (category) {
      where.categoryId = category.id;
    }
  }

  if (filters) {
    if (filters.status) where.status = filters.status;
    if (filters.isFeatured !== undefined) where.isFeatured = filters.isFeatured;
    if (filters.isNew !== undefined) where.isNew = filters.isNew;
    if (filters.isBestSeller !== undefined) where.isBestSeller = filters.isBestSeller;
    if (filters.minPrice !== undefined) where.price = { gte: filters.minPrice };
    if (filters.maxPrice !== undefined) where.price = { ...where.price, lte: filters.maxPrice };
  }

  return productRepository.findProductsWithRelations(where, productIncludeRelations);
};

export const getProductById = async (id: number) => {
  return productRepository.findProductByIdWithRelations(id, productIncludeRelations);
};

export const createProduct = async (data: {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  imageUrl?: string;
  sku?: string;
  barcode?: string;
  weight?: number;
  dimensions?: string;
  material?: string;
  origin?: string;
  warranty?: string;
  status?: ProductStatus;
  seoTitle?: string;
  seoDescription?: string;
  seoUrl?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
}) => {
  return productRepository.createProductWithRelations(data, { category: true });
};

export const updateProduct = async (id: number, data: {
  name?: string;
  description?: string;
  price?: number;
  promotionalPrice?: number;
  stock?: number;
  categoryId?: number;
  imageUrl?: string;
  sku?: string;
  barcode?: string;
  weight?: number;
  dimensions?: string;
  material?: string;
  origin?: string;
  warranty?: string;
  status?: ProductStatus;
  seoTitle?: string;
  seoDescription?: string;
  seoUrl?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
}) => {
  // If stock is being updated, check if we need to update status
  if (data.stock !== undefined) {
    data.status = data.stock <= 0 ? 'OUT_OF_STOCK' : 'ACTIVE';
  }

  return productRepository.updateProductWithRelations(id, data, { category: true });
};

export const deleteProduct = async (id: number) => {
  try {
    return await productRepository.deleteProductWithRelations(id);
  } catch (error) {
    console.error('Error deleting product:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to delete product');
  }
};

export const updateProductStatus = async (id: number, status: ProductStatus) => {
  return productRepository.updateProductWithRelations(id, { status }, { category: true });
};

export const searchProducts = async (query: string) => {
  return productRepository.search(query);
};

export const getProductBySeoUrl = async (seoUrl: string) => {
  return productRepository.findProductByIdWithRelations(
    (await productRepository.findBySeoUrl(seoUrl))?.id || 0,
    productIncludeRelations
  );
};

export const incrementViewCount = async (productId: number) => {
  return productRepository.incrementViewCount(productId);
};

export const checkAndUpdateStock = async (productId: number, quantity: number) => {
  const product = await productRepository.findById(productId);
  if (!product || product.stock < quantity) {
    throw new Error('Insufficient stock');
  }
  return productRepository.updateStock(productId, quantity);
};

export const updateSoldCount = async (productId: number, quantity: number) => {
  return productRepository.updateSoldCount(productId, quantity);
};

export const getFlashSaleProducts = async () => {
  const products = await productRepository.getFlashSaleProducts();
  
  // Check if we should send notification (cooldown mechanism)
  const now = Date.now();
  if (products.length > 0 && now - lastFlashSaleNotificationSent > NOTIFICATION_COOLDOWN) {
    // Here you could add notification logic
    lastFlashSaleNotificationSent = now;
  }
  
  return products;
};

export const getNewestProducts = async (limit: number = 8) => {
  return productRepository.getNewestProducts(limit);
};

export const getBestSellingProducts = async (limit: number = 8) => {
  return productRepository.getBestSellingProducts(limit);
}; 