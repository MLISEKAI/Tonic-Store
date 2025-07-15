import { Product, ProductStatus } from '@prisma/client';

export interface IProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: number): Promise<Product | null>;
  findBySeoUrl(seoUrl: string): Promise<Product | null>;
  create(data: Partial<Product>): Promise<Product>;
  update(id: number, data: Partial<Product>): Promise<Product>;
  delete(id: number): Promise<Product>;
  updateStatus(id: number, status: ProductStatus): Promise<Product>;
  search(query: string): Promise<Product[]>;
  findByCategory(categoryName: string): Promise<Product[]>;
  findByFilters(filters: any): Promise<Product[]>;
  incrementViewCount(id: number): Promise<Product>;
  updateStock(id: number, quantity: number): Promise<Product>;
  updateSoldCount(id: number, quantity: number): Promise<Product>;
  getFlashSaleProducts(): Promise<Product[]>;
  getNewestProducts(limit: number): Promise<Product[]>;
  getBestSellingProducts(limit: number): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  findProductsWithRelations(where: any, include: any): Promise<any[]>;
  findProductByIdWithRelations(id: number, include: any): Promise<any | null>;
  updateProductRating(productId: number): Promise<Product>;
} 