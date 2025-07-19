import { IsEmail, IsEnum, IsOptional, IsString, IsInt } from 'class-validator';

export class UserDto {
  @IsInt()
  id!: number;

  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsEnum(['CUSTOMER', 'ADMIN', 'DELIVERY'])
  role!: 'CUSTOMER' | 'ADMIN' | 'DELIVERY';

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  createdAt!: Date;
  updatedAt!: Date;
} 