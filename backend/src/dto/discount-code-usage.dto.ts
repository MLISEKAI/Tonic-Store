export class DiscountCodeUsageDto {
  id!: number;
  userId!: number;
  discountCodeId!: number;
  orderId?: number;
  usedAt!: Date;
} 