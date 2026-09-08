import { ShippingAddressRepository } from '../repositories';
import { CacheService, CacheKeys } from './cache.service';
import { parsePageOptions, calculatePagination, PaginationMeta } from '../common/types/pagination';
import logger from '../config/logger';

const shippingAddressRepository = new ShippingAddressRepository();

const SHIPPING_ADDRESS_CACHE_TTL = 300;

export const getAllShippingAddresses = async (pageOptions?: { page: number; limit: number }) => {
  if (!pageOptions) {
    return shippingAddressRepository.getAllShippingAddresses();
  }

  const cacheKey = 'shipping:all';
  const cached = await CacheService.get(cacheKey);
  if (cached && typeof cached === 'object' && 'items' in cached) {
    logger.debug('Shipping addresses admin cache HIT');
    return cached;
  }

  const skip = (pageOptions.page - 1) * pageOptions.limit;
  const [addresses, total] = await Promise.all([
    shippingAddressRepository.getAllShippingAddresses(skip, pageOptions.limit),
    shippingAddressRepository.getAllShippingAddressesCount(),
  ]);

  const pagination = calculatePagination(total, pageOptions.limit, pageOptions.page);
  const result = { items: addresses, pagination };
  await CacheService.set(cacheKey, result, SHIPPING_ADDRESS_CACHE_TTL);
  return result;
};

export const getShippingAddresses = async (userId: number, pageOptions?: { page: number; limit: number }) => {
  const cacheKey = pageOptions
    ? `shipping:addresses:${userId}:page:${pageOptions.page}:limit:${pageOptions.limit}`
    : CacheKeys.SHIPPING_ADDRESSES(userId);

  const cached = await CacheService.get(cacheKey);
  if (cached && typeof cached === 'object' && 'items' in cached) {
    logger.debug('Shipping addresses cache HIT', { userId });
    return { items: cached.items, pagination: cached.pagination };
  }
  if (cached) {
    logger.debug('Shipping addresses cache HIT', { userId });
    return cached;
  }

  if (pageOptions) {
    const skip = (pageOptions.page - 1) * pageOptions.limit;
    const [addresses, total] = await Promise.all([
      shippingAddressRepository.getShippingAddresses(userId, skip, pageOptions.limit),
      shippingAddressRepository.getShippingAddressesCount(userId),
    ]);
    const pagination = calculatePagination(total, pageOptions.limit, pageOptions.page);
    const result = { items: addresses, pagination };
    await CacheService.set(cacheKey, result, SHIPPING_ADDRESS_CACHE_TTL);
    return result;
  }

  const addresses = await shippingAddressRepository.getShippingAddresses(userId);
  await CacheService.set(cacheKey, addresses, SHIPPING_ADDRESS_CACHE_TTL);
  return addresses;
};

export const getShippingAddress = async (id: number, userId: number) => {
  return shippingAddressRepository.getShippingAddress(id, userId);
};

export const createShippingAddress = async (userId: number, data: any) => {
  const result = await shippingAddressRepository.createShippingAddress(userId, data);
  await CacheService.delete(CacheKeys.SHIPPING_ADDRESSES(userId));
  await CacheService.deletePattern(`shipping:addresses:${userId}:*`);
  await CacheService.delete('shipping:all');
  return result;
};

export const updateShippingAddress = async (id: number, userId: number, data) => {
  const result = await shippingAddressRepository.updateShippingAddress(id, userId, data);
  await CacheService.delete(CacheKeys.SHIPPING_ADDRESSES(userId));
  await CacheService.deletePattern(`shipping:addresses:${userId}:*`);
  await CacheService.delete('shipping:all');
  return result;
};

export const deleteShippingAddress = async (id: number, userId: number) => {
  const result = await shippingAddressRepository.deleteShippingAddress(id, userId);
  await CacheService.delete(CacheKeys.SHIPPING_ADDRESSES(userId));
  await CacheService.deletePattern(`shipping:addresses:${userId}:*`);
  await CacheService.delete('shipping:all');
  return result;
};

export const setDefaultShippingAddress = async (id: number, userId: number) => {
  const result = await shippingAddressRepository.setDefaultShippingAddress(id, userId);
  await CacheService.delete(CacheKeys.SHIPPING_ADDRESSES(userId));
  await CacheService.deletePattern(`shipping:addresses:${userId}:*`);
  await CacheService.delete('shipping:all');
  return result;
};
