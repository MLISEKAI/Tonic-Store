import { ShippingAddress } from '@prisma/client';

export interface IShippingAddressRepository {
  getAllShippingAddresses(): Promise<any[]>;
  getShippingAddresses(userId: number): Promise<any[]>;
  getShippingAddress(id: number, userId: number): Promise<ShippingAddress | null>;
  createShippingAddress(userId: number, data: any): Promise<ShippingAddress>;
  updateShippingAddress(id: number, userId: number, data: any): Promise<ShippingAddress>;
  deleteShippingAddress(id: number, userId: number): Promise<ShippingAddress>;
  setDefaultShippingAddress(id: number, userId: number): Promise<ShippingAddress>;
} 