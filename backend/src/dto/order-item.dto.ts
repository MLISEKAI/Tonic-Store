import { ProductDto } from './product.dto';

export class OrderItemDto {
  id!: number;
  orderId!: number;
  productId!: number;
  quantity!: number;
  price!: number;
  createdAt!: Date;
  updatedAt!: Date;
  product?: ProductDto;
} 