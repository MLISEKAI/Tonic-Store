import { ProductStatus } from '@prisma/client';
import { ProductRepository } from '../repositories';
import { CacheService, CacheKeys } from './cache.service';
import logger from '../config/logger';
import { QueueService } from './queue.service';

const productRepository = new ProductRepository();
let lastFlashSaleNotificationSent = 0;
const NOTIFICATION_COOLDOWN = 60 * 60 * 1000;

const productListSelect = {
  id: true,
  name: true,
  description: true,
  price: true,
  promotionalPrice: true,
  imageUrl: true,
  status: true,
  stock: true,
  isFeatured: true,
  isNew: true,
  isBestSeller: true,
  rating: true,
  reviewCount: true,
  soldCount: true,
  viewCount: true,
  seoUrl: true,
  createdAt: true,
  updatedAt: true,
  category: {
    select: {
      id: true,
      name: true,
    }
  },
};

const productDetailInclude = {
  category: { select: { id: true, name: true } },
  reviews: {
    select: {
      id: true, rating: true, comment: true, createdAt: true,
      user: { select: { id: true, name: true, avatarUrl: true } },
    },
    orderBy: { createdAt: 'desc' as const },
    take: 10,
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
  const filterKey = filters ? JSON.stringify(filters) : 'default';
  const cacheKey = CacheKeys.PRODUCT_LIST(categoryName, filterKey);

  const cached = await CacheService.get(cacheKey);
  if (cached) {
    logger.debug('Product list cache HIT', { categoryName, filterKey });
    return cached;
  }

  const where: any = {};

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

  const products = await productRepository.findProductsWithRelations(where, undefined, productListSelect);
  await CacheService.set(cacheKey, products, 300);
  return products;
};

export const getProductById = async (id: number) => {
  const cacheKey = CacheKeys.PRODUCT_DETAIL(id);

  const cached = await CacheService.get(cacheKey);
  if (cached) {
    logger.debug('Product detail cache HIT', { id });
    return cached;
  }

  const product = await productRepository.findProductByIdWithRelations(id, productDetailInclude);
  if (product) {
    await CacheService.set(cacheKey, product, 600);
  }
  return product;
};

export const createProduct = async (data) => {
  const product = await productRepository.createProductWithRelations(data, { category: true });
  await CacheService.deletePattern('products:*');
  await QueueService.addProductIndexJob({ productId: product.id, action: 'index' });
  return product;
};

export const updateProduct = async (id: number, data) => {
  if (data.stock !== undefined) {
    data.status = data.stock <= 0 ? 'OUT_OF_STOCK' : 'ACTIVE';
  }

  const product = await productRepository.updateProductWithRelations(id, data, { category: true });
  await CacheService.delete(CacheKeys.PRODUCT_DETAIL(id));
  await CacheService.deletePattern('products:*');
  await QueueService.addProductIndexJob({ productId: id, action: 'update' });
  return product;
};

export const deleteProduct = async (id: number) => {
  try {
    const result = await productRepository.deleteProductWithRelations(id);
    await CacheService.delete(CacheKeys.PRODUCT_DETAIL(id));
    await CacheService.deletePattern('products:*');
    await QueueService.addProductIndexJob({ productId: id, action: 'delete' });
    return result;
  } catch (error) {
    console.error('Error deleting product:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to delete product');
  }
};

export const updateProductStatus = async (id: number, status: ProductStatus) => {
  const product = await productRepository.updateProductWithRelations(id, { status }, { category: true });
  await CacheService.delete(CacheKeys.PRODUCT_DETAIL(id));
  await CacheService.deletePattern('products:*');
  return product;
};

export const searchProducts = async (query: string) => {
  const cacheKey = CacheKeys.PRODUCT_SEARCH(query);
  const cached = await CacheService.get(cacheKey);
  if (cached) {
    logger.debug('Product search cache HIT', { query });
    return cached;
  }

  const products = await productRepository.search(query);
  await CacheService.set(cacheKey, products, 120);
  return products;
};

export const getProductBySeoUrl = async (seoUrl: string) => {
  const cacheKey = CacheKeys.PRODUCT_BY_SEO(seoUrl);
  const cached = await CacheService.get(cacheKey);
  if (cached) {
    logger.debug('Product by SEO cache HIT', { seoUrl });
    return cached;
  }

  const product = await productRepository.findBySeoUrl(seoUrl, productDetailInclude);
  if (product) {
    await CacheService.set(cacheKey, product, 600);
  }
  return product;
};

export const incrementViewCount = async (productId: number) => {
  await CacheService.delete(CacheKeys.PRODUCT_DETAIL(productId));
  return productRepository.incrementViewCount(productId);
};

export const updateProductRating = async (productId: number) => {
  await CacheService.delete(CacheKeys.PRODUCT_DETAIL(productId));
  return productRepository.updateProductRating(productId);
};

export const checkAndUpdateStock = async (productId: number, quantity: number) => {
  const product = await productRepository.findById(productId);
  if (!product || product.stock < quantity) {
    throw new Error('Insufficient stock');
  }
  const result = await productRepository.updateStock(productId, quantity);
  await CacheService.delete(CacheKeys.PRODUCT_DETAIL(productId));
  return result;
};

export const updateSoldCount = async (productId: number, quantity: number) => {
  const result = await productRepository.updateSoldCount(productId, quantity);
  await CacheService.delete(CacheKeys.PRODUCT_DETAIL(productId));
  await CacheService.deletePattern('products:*');
  return result;
};

export const getFlashSaleProducts = async () => {
  const cacheKey = CacheKeys.PRODUCT_FLASH_SALE();
  const cached = await CacheService.get(cacheKey);
  if (cached) {
    logger.debug('Flash sale products cache HIT');
    return cached;
  }

  const products = await productRepository.getFlashSaleProducts();
  await CacheService.set(cacheKey, products, 60);

  const now = Date.now();
  if (products.length > 0 && now - lastFlashSaleNotificationSent > NOTIFICATION_COOLDOWN) {
    lastFlashSaleNotificationSent = now;
  }

  return products;
};

export const getNewestProducts = async (limit: number = 8) => {
  const cacheKey = CacheKeys.PRODUCT_NEWEST(limit);
  const cached = await CacheService.get(cacheKey);
  if (cached) {
    logger.debug('Newest products cache HIT', { limit });
    return cached;
  }

  const products = await productRepository.getNewestProducts(limit);
  await CacheService.set(cacheKey, products, 300);
  return products;
};

export const getBestSellingProducts = async (limit: number = 8) => {
  const cacheKey = CacheKeys.PRODUCT_BEST_SELLING(limit);
  const cached = await CacheService.get(cacheKey);
  if (cached) {
    logger.debug('Best selling products cache HIT', { limit });
    return cached;
  }

  const products = await productRepository.getBestSellingProducts(limit);
  await CacheService.set(cacheKey, products, 300);
  return products;
};
