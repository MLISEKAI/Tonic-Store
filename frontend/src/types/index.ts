export enum Role {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED'
}

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  PAYPAL = 'PAYPAL',
  VN_PAY = 'VN_PAY',
  COD = 'COD',
  BANK_TRANSFER = 'BANK_TRANSFER'
}

export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  COMING_SOON = 'COMING_SOON'
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: Role;
  phone?: string;
  address?: string;
  avatar?: string;
  isAdmin?: boolean;
  createdAt: string;
  updatedAt: string;
  cart?: Cart;
  orders?: Order[];
  reviews?: Review[];
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  imageUrl?: string;
  categoryId: number;
  category?: Category;
  status: ProductStatus;
  sku?: string;
  barcode?: string;
  weight?: number;
  dimensions?: string;
  material?: string;
  origin?: string;
  warranty?: string;
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
  createdAt: string;
  updatedAt: string;
  cartItems?: CartItem[];
  orderItems?: OrderItem[];
  reviews?: Review[];
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  parentId?: number;
  products?: Product[];
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  id: number;
  userId: number;
  user?: User;
  items?: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  product?: Product;
  cart?: Cart;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: number;
  userId: number;
  totalPrice: number;
  status: OrderStatus;
  shippingAddress: string;
  shippingPhone: string;
  shippingName: string;
  note?: string;
  user?: User;
  items?: OrderItem[];
  payment?: Payment;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  product?: Product;
  order?: Order;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: number;
  orderId: number;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  currency: string;
  transactionId?: string;
  paymentDate?: string;
  order?: Order;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: number;
  userId: number;
  productId: number;
  rating: number;
  comment?: string;
  user?: User;
  product?: Product;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface PaymentResponse {
  url: string;
  transactionId: string;
}
