export interface ShippingAddress {
  id: number;
  name: string;
  phone: string;
  address: string;
  isDefault: boolean;
  userId: number;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface CreateShippingAddressData {
  name: string;
  phone: string;
  address: string;
  userId: number;
  isDefault?: boolean;
}

export interface UpdateShippingAddressData {
  name?: string;
  phone?: string;
  address?: string;
  userId?: number;
  isDefault?: boolean;
} 