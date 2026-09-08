import { prisma } from '../prisma';
import { PrismaClient, ShippingAddress } from '@prisma/client';
import type { IShippingAddressRepository } from './interfaces/IShippingAddressRepository';

const shippingAddressSelect = {
  id: true,
  userId: true,
  name: true,
  phone: true,
  address: true,
  isDefault: true,
  createdAt: true,
  updatedAt: true,
};

export class ShippingAddressRepository implements IShippingAddressRepository {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = prisma;
  }
  async getAllShippingAddresses(skip?: number, take?: number): Promise<any[]> {
    const query: any = {
      select: {
        ...shippingAddressSelect,
        user: { select: { id: true, name: true, email: true } }
      },
      orderBy: [ { isDefault: 'desc' }, { createdAt: 'desc' } ]
    };
    if (skip !== undefined) query.skip = skip;
    if (take !== undefined) query.take = take;
    return this.prisma.shippingAddress.findMany(query);
  }
  async getShippingAddresses(userId: number, skip?: number, take?: number): Promise<any[]> {
    const query: any = {
      where: { userId },
      select: shippingAddressSelect,
      orderBy: { isDefault: 'desc' }
    };
    if (skip !== undefined) query.skip = skip;
    if (take !== undefined) query.take = take;
    return this.prisma.shippingAddress.findMany(query);
  }
  async getAllShippingAddressesCount(): Promise<number> {
    return this.prisma.shippingAddress.count();
  }
  async getShippingAddressesCount(userId: number): Promise<number> {
    return this.prisma.shippingAddress.count({ where: { userId } });
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
  async deleteShippingAddress(id: number, _userId: number): Promise<ShippingAddress> {
    return this.prisma.shippingAddress.delete({ where: { id } });
  }
  async setDefaultShippingAddress(id: number, userId: number): Promise<ShippingAddress> {
    await this.prisma.shippingAddress.updateMany({ where: { userId, isDefault: true }, data: { isDefault: false } });
    return this.prisma.shippingAddress.update({ where: { id }, data: { isDefault: true } });
  }
} 
