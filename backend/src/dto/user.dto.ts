export class UserDto {
  id!: number;
  name!: string;
  email!: string;
  role!: 'CUSTOMER' | 'ADMIN' | 'DELIVERY';
  phone?: string;
  address?: string;
  createdAt!: Date;
  updatedAt!: Date;
} 