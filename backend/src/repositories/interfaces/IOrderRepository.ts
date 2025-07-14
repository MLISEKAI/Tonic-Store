import { Order, OrderStatus, PaymentStatus } from '@prisma/client';

export interface IOrderRepository {
  findAll(): Promise<Order[]>;
  findById(id: number): Promise<Order | null>;
  create(data: any): Promise<Order>;
  update(id: number, data: Partial<Order>): Promise<Order>;
  delete(id: number): Promise<Order>;
  updateStatus(id: number, status: OrderStatus): Promise<Order>;
  findOrdersWithRelations(include: any): Promise<any[]>;
  findOrderByIdWithRelations(id: number, include: any): Promise<any | null>;
  createOrderWithItems(orderData: any, include: any): Promise<any>;
  updateOrderWithRelations(id: number, data: any, include: any): Promise<any>;
  createNotification(userId: number, message: string): Promise<any>;
  createDeliveryLog(orderId: number, deliveryId: number, status: OrderStatus, note: string): Promise<any>;
  updatePaymentStatus(orderId: number, status: PaymentStatus): Promise<any>;
  findOrderWithPayment(orderId: number): Promise<any | null>;
} 