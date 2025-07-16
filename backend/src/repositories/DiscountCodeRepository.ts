import { PrismaClient, DiscountCode, DiscountCodeUsage } from '@prisma/client';
import { IDiscountCodeRepository } from './interfaces/IDiscountCodeRepository';

export class DiscountCodeRepository implements IDiscountCodeRepository {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }
  async findAll(): Promise<DiscountCode[]> {
    const codes = await this.prisma.discountCode.findMany({ orderBy: { createdAt: 'desc' } });
    const now = new Date();
    // Nếu mã đã hết hạn thì set isActive = false
    return codes.map(code => ({
      ...code,
      isActive: code.isActive && code.startDate <= now && code.endDate >= now
    }));
  }
  async findById(id: number): Promise<DiscountCode | null> {
    return this.prisma.discountCode.findUnique({ where: { id } });
  }
  async findByCode(code: string): Promise<DiscountCode | null> {
    return this.prisma.discountCode.findFirst({ where: { code } });
  }
  async create(data: any): Promise<DiscountCode> {
    return this.prisma.discountCode.create({ data });
  }
  async update(id: number, data: any): Promise<DiscountCode> {
    return this.prisma.discountCode.update({ where: { id }, data });
  }
  async delete(id: number): Promise<DiscountCode> {
    return this.prisma.discountCode.delete({ where: { id } });
  }
  async claimDiscountCode(code: string, userId: number): Promise<DiscountCode> {
    const discountCode = await this.prisma.discountCode.findFirst({
      where: {
        code,
        isActive: true,
        startDate: { lte: new Date() },
        endDate: { gte: new Date() }
      }
    });
    if (!discountCode) throw new Error('Mã giảm giá không hợp lệ hoặc đã hết hạn');
    if (discountCode.usageLimit && discountCode.usedCount >= discountCode.usageLimit) {
      throw new Error('Mã giảm giá đã hết lượt sử dụng');
    }
    await this.prisma.$transaction(async (tx) => {
      const existingClaim = await tx.discountCodeClaim.findFirst({
        where: { userId, discountCodeId: discountCode.id }
      });
      if (existingClaim) throw new Error('Bạn đã nhận mã giảm giá này trước đó');
      await tx.discountCodeClaim.create({ data: { userId, discountCodeId: discountCode.id } });
    });
    return discountCode;
  }
  async saveDiscountCodeUsage(userId: number, discountCodeId: number, orderId: number): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const claim = await tx.discountCodeClaim.findFirst({ where: { userId, discountCodeId, isUsed: false } });
      if (!claim) throw new Error('Bạn chưa nhận mã giảm giá này hoặc đã sử dụng');
      await tx.discountCodeUsage.create({ data: { userId, discountCodeId, orderId } });
      await tx.discountCodeClaim.update({ where: { id: claim.id }, data: { isUsed: true } });
      await tx.discountCode.update({ where: { id: discountCodeId }, data: { usedCount: { increment: 1 } } });
    });
  }
  async checkUserUsage(userId: number, discountCodeId: number): Promise<boolean> {
    const usage = await this.prisma.discountCodeUsage.findFirst({ where: { userId, discountCodeId } });
    return !!usage;
  }
  async updateDiscountCodeUsage(userId: number, discountCodeId: number, orderId: number): Promise<DiscountCodeUsage> {
    const usage = await this.prisma.discountCodeUsage.findFirst({ where: { userId, discountCodeId, orderId: null } });
    if (!usage) throw new Error('Không tìm thấy thông tin sử dụng mã giảm giá');
    return this.prisma.discountCodeUsage.update({ where: { id: usage.id }, data: { orderId } });
  }
  async resetUsage(id: number): Promise<DiscountCode> {
    return this.prisma.$transaction(async (tx) => {
      await tx.discountCodeUsage.deleteMany({ where: { discountCodeId: id } });
      await tx.discountCodeClaim.deleteMany({ where: { discountCodeId: id } });
      return tx.discountCode.update({ where: { id }, data: { usedCount: 0, isActive: true } });
    });
  }
  async getClaimedCodes(userId: number): Promise<any[]> {
    return this.prisma.discountCodeClaim.findMany({
      where: {
        userId,
        isUsed: false,
        discountCode: {
          isActive: true,
          startDate: { lte: new Date() },
          endDate: { gte: new Date() }
        }
      },
      include: {
        discountCode: true
      },
      orderBy: {
        id: 'desc'
      }
    });
  }
} 