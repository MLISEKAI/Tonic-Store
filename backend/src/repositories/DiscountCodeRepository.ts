import { prisma } from '../prisma';
import { BaseRepository } from './BaseRepository';

export class DiscountCodeRepository extends BaseRepository<any> {
  constructor() {
    super(prisma.discountCode);
  }

  async findAll() {
    const codes = await this.model.findMany({ orderBy: { createdAt: 'desc' } });
    const now = new Date();
    return codes.map((code: any) => ({
      ...code,
      isActive: code.isActive && code.startDate <= now && code.endDate >= now
    }));
  }

  async findByCode(code: string) {
    return this.model.findFirst({ where: { code } });
  }

  async claimDiscountCode(code: string, userId: number) {
    const discountCode = await this.model.findFirst({
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
    await prisma.$transaction(async (tx) => {
      const existingClaim = await tx.discountCodeClaim.findFirst({
        where: { userId, discountCodeId: discountCode.id }
      });
      if (existingClaim) throw new Error('Bạn đã nhận mã giảm giá này trước đó');
      await tx.discountCodeClaim.create({ data: { userId, discountCodeId: discountCode.id } });
    });
    return discountCode;
  }

  async saveDiscountCodeUsage(userId: number, discountCodeId: number, orderId: number) {
    await prisma.$transaction(async (tx) => {
      const claim = await tx.discountCodeClaim.findFirst({ where: { userId, discountCodeId, isUsed: false } });
      if (!claim) throw new Error('Bạn chưa nhận mã giảm giá này hoặc đã sử dụng');
      await tx.discountCodeUsage.create({ data: { userId, discountCodeId, orderId } });
      await tx.discountCodeClaim.update({ where: { id: claim.id }, data: { isUsed: true } });
      await tx.discountCode.update({ where: { id: discountCodeId }, data: { usedCount: { increment: 1 } } });
    });
  }

  async checkUserUsage(userId: number, discountCodeId: number) {
    const usage = await prisma.discountCodeUsage.findFirst({ where: { userId, discountCodeId } });
    return !!usage;
  }

  async updateDiscountCodeUsage(userId: number, discountCodeId: number, orderId: number) {
    const usage = await prisma.discountCodeUsage.findFirst({ where: { userId, discountCodeId, orderId: null } });
    if (!usage) throw new Error('Không tìm thấy thông tin sử dụng mã giảm giá');
    return prisma.discountCodeUsage.update({ where: { id: usage.id }, data: { orderId } });
  }

  async resetUsage(id: number) {
    return prisma.$transaction(async (tx) => {
      await tx.discountCodeUsage.deleteMany({ where: { discountCodeId: id } });
      await tx.discountCodeClaim.deleteMany({ where: { discountCodeId: id } });
      return tx.discountCode.update({ where: { id }, data: { usedCount: 0, isActive: true } });
    });
  }

  async getClaimedCodes(userId: number) {
    return prisma.discountCodeClaim.findMany({
      where: {
        userId,
        isUsed: false,
        discountCode: {
          isActive: true,
          startDate: { lte: new Date() },
          endDate: { gte: new Date() }
        }
      },
      include: { discountCode: true },
      orderBy: { id: 'desc' }
    });
  }
} 