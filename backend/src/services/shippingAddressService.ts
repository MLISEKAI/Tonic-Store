import { ShippingAddressRepository } from '../repositories';
import { CacheService, CacheKeys } from './cache.service';

const shippingAddressRepository = new ShippingAddressRepository();

export const getAllShippingAddresses = async () => {
  return shippingAddressRepository.getAllShippingAddresses();
};

export const getShippingAddresses = async (userId: number) => {
  const cacheKey = CacheKeys.SHIPPING_ADDRESSES(userId);
  const cached = await CacheService.get(cacheKey);
  if (cached) return cached;

  const addresses = await shippingAddressRepository.getShippingAddresses(userId);
  await CacheService.set(cacheKey, addresses, 300);
  return addresses;
};

export const getShippingAddress = async (id: number, userId: number) => {
  return shippingAddressRepository.getShippingAddress(id, userId);
};

export const createShippingAddress = async (userId: number, data: any) => {
  const result = await shippingAddressRepository.createShippingAddress(userId, data);
  await CacheService.delete(CacheKeys.SHIPPING_ADDRESSES(userId));
  return result;
};

export const updateShippingAddress = async (id: number, userId: number, data) => {
  const result = await shippingAddressRepository.updateShippingAddress(id, userId, data);
  await CacheService.delete(CacheKeys.SHIPPING_ADDRESSES(userId));
  return result;
};

export const deleteShippingAddress = async (id: number, userId: number) => {
  const result = await shippingAddressRepository.deleteShippingAddress(id, userId);
  await CacheService.delete(CacheKeys.SHIPPING_ADDRESSES(userId));
  return result;
};

export const setDefaultShippingAddress = async (id: number, userId: number) => {
  const result = await shippingAddressRepository.setDefaultShippingAddress(id, userId);
  await CacheService.delete(CacheKeys.SHIPPING_ADDRESSES(userId));
  return result;
};