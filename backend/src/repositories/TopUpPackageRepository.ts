import { TopUpPackage, Prisma } from '@prisma/client';
import { prisma } from '../prisma';
import { ITopUpPackageRepository } from './interfaces/ITopUpPackageRepository';

export class TopUpPackageRepository implements ITopUpPackageRepository {
  async findAll(): Promise<TopUpPackage[]> {
    return prisma.topUpPackage.findMany({
      orderBy: { displayOrder: 'asc' },
    });
  }

  async findById(id: number): Promise<TopUpPackage | null> {
    return prisma.topUpPackage.findUnique({ where: { id } });
  }

  async findActive(): Promise<TopUpPackage[]> {
    return prisma.topUpPackage.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async create(data: {
    name: string;
    description?: string;
    amount: number;
    bonusAmount?: number;
    displayOrder?: number;
    icon?: string;
  }): Promise<TopUpPackage> {
    return prisma.topUpPackage.create({
      data: {
        name: data.name,
        description: data.description,
        amount: String(data.amount),
        bonusAmount: data.bonusAmount ? String(data.bonusAmount) : undefined,
        displayOrder: data.displayOrder || 0,
        icon: data.icon,
      } as Prisma.TopUpPackageCreateInput,
    });
  }

  async update(id: number, data: Partial<TopUpPackage>): Promise<TopUpPackage> {
    const updateData: Prisma.TopUpPackageUpdateInput = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.amount !== undefined) updateData.amount = String(data.amount);
    if (data.bonusAmount !== undefined) updateData.bonusAmount = String(data.bonusAmount);
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.displayOrder !== undefined) updateData.displayOrder = data.displayOrder;
    if (data.icon !== undefined) updateData.icon = data.icon;

    return prisma.topUpPackage.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: number): Promise<TopUpPackage> {
    return prisma.topUpPackage.delete({ where: { id } });
  }
}
