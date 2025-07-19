export class DiscountCodeDto {
  id!: number;
  code!: string;
  description!: string;
  discountType!: string;
  discountValue!: number;
  minOrderValue?: number;
  maxDiscount?: number;
  startDate!: Date;
  endDate!: Date;
  usageLimit?: number;
  usedCount!: number;
  isActive!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
} 