export class DiscountCodeClaimDto {
  id!: number;
  userId!: number;
  discountCodeId!: number;
  claimedAt!: Date;
  isUsed!: boolean;
} 