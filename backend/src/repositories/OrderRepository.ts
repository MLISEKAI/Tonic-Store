import { prisma } from '../prisma';
import { BaseRepository } from './BaseRepository';
import { OrderStatus, PaymentStatus } from '@prisma/client';

export class OrderRepository extends BaseRepository<any> {
  constructor() {
    super(prisma.order);
  }

  async updateStatus(id: number, status: OrderStatus) {
    return this.model.update({ where: { id }, data: { status } });
  }

  async findOrdersWithRelations(include: any) {
    return this.model.findMany({ include });
  }

  async findOrderByIdWithRelations(id: number, include: any) {
    return this.model.findUnique({ where: { id }, include });
  }

  async createOrderWithItems(orderData: any, include: any) {
    return this.model.create({ data: orderData, include });
  }

  async updateOrderWithRelations(id: number, data: any, include: any) {
    return this.model.update({ where: { id }, data, include });
  }

  async createNotification(userId: number, message: string) {
    return prisma.notification.create({
      data: { userId, message, isRead: false },
    });
  }

  async createDeliveryLog(orderId: number, deliveryId: number, status: OrderStatus, note: string) {
    return prisma.deliveryLog.create({
      data: { orderId, deliveryId, status, note }
    });
  }

  async updatePaymentStatus(orderId: number, status: PaymentStatus) {
    return prisma.payment.update({ where: { orderId }, data: { status } });
  }

  async findOrderWithPayment(orderId: number) {
    return this.model.findUnique({ where: { id: orderId }, include: { payment: true } });
  }

  async cancelOrderWithPayment(orderId: number, orderStatus: OrderStatus, paymentStatus: PaymentStatus) {
    return prisma.$transaction([
      this.model.update({ where: { id: orderId }, data: { status: orderStatus } }),
      prisma.payment.update({ where: { orderId }, data: { status: paymentStatus } })
    ]);
  }
} 