import { PrismaClient, Order, OrderStatus, PaymentStatus } from '@prisma/client';
import { IOrderRepository } from './interfaces/IOrderRepository';

export class OrderRepository implements IOrderRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findAll(): Promise<Order[]> {
    return this.prisma.order.findMany();
  }

  async findById(id: number): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: { id }
    });
  }

  async create(data: any): Promise<Order> {
    return this.prisma.order.create({
      data
    });
  }

  async update(id: number, data: Partial<Order>): Promise<Order> {
    return this.prisma.order.update({
      where: { id },
      data
    });
  }

  async delete(id: number): Promise<Order> {
    return this.prisma.order.delete({
      where: { id }
    });
  }

  async updateStatus(id: number, status: OrderStatus): Promise<Order> {
    return this.prisma.order.update({
      where: { id },
      data: { status }
    });
  }

  async findOrdersWithRelations(include: any): Promise<any[]> {
    return this.prisma.order.findMany({
      include
    });
  }

  async findOrderByIdWithRelations(id: number, include: any): Promise<any | null> {
    return this.prisma.order.findUnique({
      where: { id },
      include
    });
  }

  async createOrderWithItems(orderData: any, include: any): Promise<any> {
    return this.prisma.order.create({
      data: orderData,
      include
    });
  }

  async updateOrderWithRelations(id: number, data: any, include: any): Promise<any> {
    return this.prisma.order.update({
      where: { id },
      data,
      include
    });
  }

  async createNotification(userId: number, message: string): Promise<any> {
    return this.prisma.notification.create({
      data: {
        userId,
        message,
        isRead: false,
      },
    });
  }

  async createDeliveryLog(orderId: number, deliveryId: number, status: OrderStatus, note: string): Promise<any> {
    return this.prisma.deliveryLog.create({
      data: {
        orderId,
        deliveryId,
        status,
        note
      }
    });
  }

  async updatePaymentStatus(orderId: number, status: PaymentStatus): Promise<any> {
    return this.prisma.payment.update({
      where: { orderId },
      data: { status }
    });
  }

  async findOrderWithPayment(orderId: number): Promise<any | null> {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true }
    });
  }

  async cancelOrderWithPayment(orderId: number, orderStatus: OrderStatus, paymentStatus: PaymentStatus): Promise<any> {
    return this.prisma.$transaction([
      this.prisma.order.update({
        where: { id: orderId },
        data: { status: orderStatus }
      }),
      this.prisma.payment.update({
        where: { orderId },
        data: { status: paymentStatus }
      })
    ]);
  }
} 