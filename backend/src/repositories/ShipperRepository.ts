import { PrismaClient, OrderStatus } from '@prisma/client';
import type { IShipperRepository } from './interfaces/IShipperRepository';

export class ShipperRepository implements IShipperRepository {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }
  async getAllShippers(): Promise<any[]> {
    return this.prisma.user.findMany({
      where: { role: 'DELIVERY' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }
  async assignShipperToOrder(orderId: number, shipperId: number): Promise<any> {
    const shipper = await this.prisma.user.findFirst({ where: { id: shipperId, role: 'DELIVERY' } });
    if (!shipper) throw new Error('Shipper not found or not a delivery person');
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new Error('Order not found');
    return this.prisma.order.update({
      where: { id: orderId },
      data: { shipperId, status: OrderStatus.PROCESSING },
      include: {
        items: { include: { product: true } },
        shipper: true
      }
    });
  }
  async createDeliveryLog(orderId: number, shipperId: number, status: any, note?: string): Promise<any> {
    return this.prisma.deliveryLog.create({
      data: { orderId, deliveryId: shipperId, status, note }
    });
  }
  async updateOrderStatus(orderId: number, status: any): Promise<any> {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        items: { include: { product: true } },
        shipper: true
      }
    });
  }
  async getShipperOrders(shipperId: number, status?: any): Promise<any[]> {
    return this.prisma.order.findMany({
      where: { shipperId, ...(status && { status }) },
      include: {
        items: { include: { product: true } },
        user: true,
        payment: { select: { method: true, status: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
  async getOrderDeliveryLogs(orderId: number): Promise<any[]> {
    return this.prisma.deliveryLog.findMany({
      where: { orderId },
      include: {
        delivery: { select: { id: true, name: true, email: true, phone: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
  async findOrderById(orderId: number): Promise<any> {
    return this.prisma.order.findUnique({ where: { id: orderId } });
  }
  async findDeliveryRating(orderId: number): Promise<any> {
    return this.prisma.deliveryRating.findUnique({
      where: { orderId },
      include: {
        user: { select: { id: true, name: true, email: true } }
      }
    });
  }
  async createDeliveryRating(orderId: number, userId: number, rating: number, comment?: string): Promise<any> {
    return this.prisma.deliveryRating.create({
      data: { orderId, userId, rating, comment },
      include: {
        user: { select: { id: true, name: true, email: true } }
      }
    });
  }
  async getShipperById(id: number): Promise<any> {
    return this.prisma.user.findFirst({
      where: { id, role: 'DELIVERY' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        createdAt: true,
        updatedAt: true,
        shipperOrders: {
          include: {
            items: { include: { product: true } },
            user: true
          }
        }
      }
    });
  }
} 