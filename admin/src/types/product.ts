export interface Category {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  promotionalPrice?: number;
  stock: number;
  imageUrl: string;
  category: Category;
  createdAt: string;
  updatedAt: string;
  sku?: string;
  barcode?: string;
  weight?: number;
  dimensions?: string;
  material?: string;
  origin?: string;
  warranty?: string;
  status?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoUrl?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  rating?: number;
  reviewCount?: number;
  viewCount?: number;
  soldCount?: number;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  promotionalPrice?: number;
  stock: number;
  imageUrl: string;
  categoryId: number;
  sku?: string;
  barcode?: string;
  weight?: number;
  dimensions?: string;
  material?: string;
  origin?: string;
  warranty?: string;
  status?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoUrl?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  promotionalPrice?: number;
  stock?: number;
  imageUrl?: string;
  categoryId?: number;
  sku?: string;
  barcode?: string;
  weight?: number;
  dimensions?: string;
  material?: string;
  origin?: string;
  warranty?: string;
  status?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoUrl?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
} 