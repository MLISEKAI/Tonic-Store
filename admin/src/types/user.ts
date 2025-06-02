export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
  createdAt: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: string;
  phone?: string;
  address?: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  phone?: string;
  address?: string;
}

export interface Shipper {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  isActive?: boolean;
  createdAt: string;
} 