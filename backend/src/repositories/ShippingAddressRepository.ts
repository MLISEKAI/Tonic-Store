import { PrismaClient, ShippingAddress } from '@prisma/client';
import { IShippingAddressRepository } from './interfaces/IShippingAddressRepository';

export class ShippingAddressRepository implements IShippingAddressRepository {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }
  async getAllShippingAddresses(): Promise<any[]> {
    return this.prisma.shippingAddress.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } }
      },
      orderBy: [ { isDefault: 'desc' }, { createdAt: 'desc' } ]
    });
  }
  async getShippingAddresses(userId: number): Promise<any[]> {
    return this.prisma.shippingAddress.findMany({ where: { userId }, orderBy: { isDefault: 'desc' } });
  }
  async getShippingAddress(id: number, userId: number): Promise<ShippingAddress | null> {
    return this.prisma.shippingAddress.findFirst({ where: { id, userId } });
  }
  async createShippingAddress(userId: number, data: any): Promise<ShippingAddress> {
    if (data.isDefault) {
      await this.prisma.shippingAddress.updateMany({ where: { userId, isDefault: true }, data: { isDefault: false } });
    }
    return this.prisma.shippingAddress.create({ data: { ...data, userId } });
  }
  async updateShippingAddress(id: number, userId: number, data: any): Promise<ShippingAddress> {
    if (data.isDefault) {
      await this.prisma.shippingAddress.updateMany({ where: { userId, isDefault: true, id: { not: id } }, data: { isDefault: false } });
    }
    return this.prisma.shippingAddress.update({ where: { id }, data });
  }
  async deleteShippingAddress(id: number, userId: number): Promise<ShippingAddress> {
    return this.prisma.shippingAddress.delete({ where: { id } });
  }
  async setDefaultShippingAddress(id: number, userId: number): Promise<ShippingAddress> {
    await this.prisma.shippingAddress.updateMany({ where: { userId, isDefault: true }, data: { isDefault: false } });
    return this.prisma.shippingAddress.update({ where: { id }, data: { isDefault: true } });
  }
} 