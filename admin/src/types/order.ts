export type PaymentMethod = 'COD' | 'BANK_TRANSFER' | 'VNPAY';
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export interface Order {
  id: string;
  userId: string;
  status: string;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  user: {
    name: string;
    email: string;
  };
  items: {
    id: string;
    productId: string;
    quantity: number;
    price: number;
    product: {
      name: string;
      image: string;
    };
  }[];
  payment?: {
    method: string;
    status: string;
    transactionId?: string;
    paymentDate?: string;
  };
}

export interface OrderDetail extends Omit<Order, 'status' | 'items'> {
  status: OrderStatus;
  items: Array<{
    id: string;
    productId: string;
    quantity: number;
    price: number;
    product: {
      name: string;
      image: string;
    };
  }>;
  shippingAddress: string;
  shippingPhone: string;
  shippingName: string;
  shipper?: {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  promotionCode?: string;
  discount: number;
}

export interface OrderResponse {
  orders: Order[];
  totalPages: number;
}

export interface CreateOrderData {
  userId: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  shippingAddress: string;
  shippingPhone: string;
  shippingName: string;
  paymentMethod: PaymentMethod;
  promotionCode?: string;
} 