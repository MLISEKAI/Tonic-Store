import type { OrderItemDto } from './order-item.dto';
import type { PaymentDto } from './payment.dto';
import type { UserDto } from './user.dto';

export class OrderDto {
  id!: number;
  userId!: number;
  totalPrice!: number;
  status!: string;
  shippingAddress!: string;
  shippingPhone!: string;
  shippingName!: string;
  note?: string;
  createdAt!: Date;
  updatedAt!: Date;
  shipperId?: number;
  promotionCode?: string;
  discount?: number;
  items?: OrderItemDto[];
  payment?: PaymentDto;
  shipper?: UserDto;
  user?: UserDto;
} 