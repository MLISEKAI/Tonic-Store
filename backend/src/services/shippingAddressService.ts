import { ShippingAddressRepository } from '../repositories';

const shippingAddressRepository = new ShippingAddressRepository();

export const getAllShippingAddresses = async () => {
  return shippingAddressRepository.getAllShippingAddresses();
};

export const getShippingAddresses = async (userId: number) => {
  return shippingAddressRepository.getShippingAddresses(userId);
};

export const getShippingAddress = async (id: number, userId: number) => {
  return shippingAddressRepository.getShippingAddress(id, userId);
};

export const createShippingAddress = async (userId: number, data: any) => {
  return shippingAddressRepository.createShippingAddress(userId, data);
};

export const updateShippingAddress = async (id: number, userId: number, data: {
  name?: string;
  phone?: string;
  address?: string;
  isDefault?: boolean;
}) => {
  return shippingAddressRepository.updateShippingAddress(id, userId, data);
};

export const deleteShippingAddress = async (id: number, userId: number) => {
  return shippingAddressRepository.deleteShippingAddress(id, userId);
};

export const setDefaultShippingAddress = async (id: number, userId: number) => {
  return shippingAddressRepository.setDefaultShippingAddress(id, userId);
}; 