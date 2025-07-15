import { ShipperRepository } from '../repositories';

const shipperRepository = new ShipperRepository();

export const getAllShippers = async () => {
  return shipperRepository.getAllShippers();
};

export const assignShipperToOrder = async (orderId: number, shipperId: number) => {
  return shipperRepository.assignShipperToOrder(orderId, shipperId);
};

// Cập nhật trạng thái giao hàng
export const updateDeliveryStatus = async (orderId: number, shipperId: number, status: any, note?: string) => {
  // Tạo delivery log
  await shipperRepository.createDeliveryLog(orderId, shipperId, status, note);

  // Cập nhật trạng thái đơn hàng
  return shipperRepository.updateOrderStatus(orderId, status);
};

// Lấy danh sách đơn hàng của shipper
export const getShipperOrders = async (shipperId: number, status?: any) => {
  return shipperRepository.getShipperOrders(shipperId, status);
};

// Lấy lịch sử giao hàng của đơn hàng
export const getOrderDeliveryLogs = async (orderId: number) => {
  return shipperRepository.getOrderDeliveryLogs(orderId);
};

// Lấy đánh giá shipper của một đơn hàng
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
  // Kiểm tra xem đơn hàng đã được giao thành công chưa
  const order = await shipperRepository.findOrderById(orderId);

  if (!order || order.status !== 'DELIVERED') {
    throw new Error('Order is not delivered yet');
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