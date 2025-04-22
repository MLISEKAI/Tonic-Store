export interface User {
  id: number;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
  phone?: string;
  address?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
  categoryId: number;
  category?: Category;
  createdAt?: string;
  
  // Thêm các trường mới
  sku?: string;
  barcode?: string;
  weight?: number;
  dimensions?: string;
  material?: string;
  origin?: string;
  warranty?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK' | 'COMING_SOON';
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

export interface Category {
  id: number;
  name: string;
  products?: Product[];
  createdAt?: string;
}

export interface CartItem {
  id: number;
  productId: number;
  product: Product;
  quantity: number;
}

export interface Order {
  id: number;
  userId: number;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  items: OrderItem[];
  createdAt: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  product: Product;
  quantity: number;
  price: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}
