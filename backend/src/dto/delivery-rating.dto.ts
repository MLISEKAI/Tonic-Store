export class DeliveryRatingDto {
  id!: number;
  orderId!: number;
  userId!: number;
  rating!: number;
  comment?: string;
  createdAt!: Date;
  updatedAt!: Date;
} 