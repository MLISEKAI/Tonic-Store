import { ShipperRepository } from '../repositories';
import { CacheService, CacheKeys } from './cache.service';

const shipperRepository = new ShipperRepository();

export const getAllShippers = async () => {
  const cached = await CacheService.get(CacheKeys.SHIPPER_LIST());
  if (cached) return cached;

  const shippers = await shipperRepository.getAllShippers();
  await CacheService.set(CacheKeys.SHIPPER_LIST(), shippers, 300);
  return shippers;
};

export const assignShipperToOrder = async (orderId: number, shipperId: number) => {
  const result = await shipperRepository.assignShipperToOrder(orderId, shipperId);
  await CacheService.deletePattern('orders:*');
  await CacheService.delete(CacheKeys.SHIPPER_ORDERS(shipperId));
  return result;
};

export const updateDeliveryStatus = async (orderId: number, shipperId: number, status: any, note?: string) => {
  await shipperRepository.createDeliveryLog(orderId, shipperId, status, note);
  const result = await shipperRepository.updateOrderStatus(orderId, status);
  await CacheService.deletePattern('orders:*');
  await CacheService.delete(CacheKeys.SHIPPER_ORDERS(shipperId));
  return result;
};

export const getShipperOrders = async (shipperId: number, status?: any) => {
  const cacheKey = CacheKeys.SHIPPER_ORDERS(shipperId, status);
  const cached = await CacheService.get(cacheKey);
  if (cached) return cached;

  const orders = await shipperRepository.getShipperOrders(shipperId, status);
  await CacheService.set(cacheKey, orders, 120);
  return orders;
};

export const getOrderDeliveryLogs = async (orderId: number) => {
  return shipperRepository.getOrderDeliveryLogs(orderId);
};

export const getDeliveryRating = async (orderId: number) => {
  try {
    console.log('Getting delivery rating for order:', orderId);
    
    if (!orderId || isNaN(orderId)) {
      console.error('Invalid order ID:', orderId);
      throw new Error('Invalid order ID');
    }

    // Kiểm tra đơn hàng có tồn tại không
    const order = await shipperRepository.findOrderById(orderId);

    if (!order) {
      console.error('Order not found:', orderId);
      throw new Error('Order not found');
    }

    console.log('Order status:', order.status);

    // Kiểm tra đơn hàng đã được giao chưa
    if (order.status !== 'DELIVERED') {
      console.error('Order is not delivered yet:', orderId);
      throw new Error('Order is not delivered yet');
    }

    // Tìm đánh giá
    const rating = await shipperRepository.findDeliveryRating(orderId);

    // Nếu không tìm thấy đánh giá, trả về null thay vì lỗi
    if (!rating) {
      console.log('No rating found for order:', orderId);
      return null;
    }

    console.log('Found rating:', rating);
    return rating;
  } catch (error) {
    console.error('Error in getDeliveryRating:', error);
    throw error;
  }
};

// Tạo đánh giá shipper
export const createDeliveryRating = async (orderId: number, userId: number, rating: number, comment?: string) => {
  if (!orderId || isNaN(orderId)) {
    throw new Error('Order ID không hợp lệ');
  }
  // Kiểm tra xem đơn hàng đã được giao thành công chưa
  const order = await shipperRepository.findOrderById(orderId);

  if (!order || order.status !== 'DELIVERED') {
    throw new Error('Order is not delivered yet');
  }

  // Chỉ cho phép userId là chủ đơn hàng đánh giá shipper
  if (order.userId !== userId) {
    throw new Error('Chỉ khách hàng mới được đánh giá shipper');
  }

  // Không cho phép shipper tự đánh giá chính mình
  if (order.shipperId && order.shipperId === userId) {
    throw new Error('Shipper không được tự đánh giá chính mình');
  }

  // Kiểm tra xem người dùng đã đánh giá chưa
  const existingRating = await shipperRepository.findDeliveryRating(orderId);

  if (existingRating) {
    throw new Error('Order has already been rated');
  }

  return shipperRepository.createDeliveryRating(orderId, userId, rating, comment);
}; 

export const getShipperById = async (id: number) => {
  return shipperRepository.getShipperById(id);
};