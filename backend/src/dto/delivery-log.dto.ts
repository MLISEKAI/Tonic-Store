export class DeliveryLogDto {
  id!: number;
  orderId!: number;
  deliveryId!: number;
  status!: string;
  note?: string;
  createdAt!: Date;
  updatedAt!: Date;
} 