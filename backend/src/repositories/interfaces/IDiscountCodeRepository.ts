import { DiscountCode, DiscountCodeClaim, DiscountCodeUsage } from '@prisma/client';

export interface IDiscountCodeRepository {
  findAll(): Promise<DiscountCode[]>;
  findById(id: number): Promise<DiscountCode | null>;
  findByCode(code: string): Promise<DiscountCode | null>;
  create(data: any): Promise<DiscountCode>;
  update(id: number, data: any): Promise<DiscountCode>;
  delete(id: number): Promise<DiscountCode>;
  claimDiscountCode(code: string, userId: number): Promise<DiscountCode>;
  saveDiscountCodeUsage(userId: number, discountCodeId: number, orderId: number): Promise<void>;
  checkUserUsage(userId: number, discountCodeId: number): Promise<boolean>;
  updateDiscountCodeUsage(userId: number, discountCodeId: number, orderId: number): Promise<DiscountCodeUsage>;
  resetUsage(id: number): Promise<DiscountCode>;
  getClaimedCodes(userId: number): Promise<any[]>;
} 