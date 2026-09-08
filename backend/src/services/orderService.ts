import { OrderStatus, PaymentStatus } from '@prisma/client';
import { OrderRepository } from '../repositories/OrderRepository';
import { ProductRepository } from '../repositories/ProductRepository';
import { CacheService, CacheKeys } from './cache.service';
import { QueueService } from './queue.service';
import logger from '../config/logger';

const orderRepository = new OrderRepository();
const productRepository = new ProductRepository();

const orderIncludeRelations = {
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    }
  },
  items: { include: { product: true } },
  payment: true,
  shipper: true
};

const orderWithItemsInclude = {
  items: { include: { product: true } },
  payment: true
};

const orderListSelect = {
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    }
  },
  items: true,
  payment: true,
};

export const getAllOrders = async () => {
  const cached = await CacheService.get(CacheKeys.ORDER_LIST());
  if (cached) {
    logger.debug('Order list cache HIT');
    return cached;
  }

  const orders = await orderRepository.findOrdersWithRelations(orderListSelect);
  await CacheService.set(CacheKeys.ORDER_LIST(), orders, 120);
  return orders;
};

export const getOrder = async (id: number) => {
  const cacheKey = CacheKeys.ORDER_DETAIL(id);
  const cached = await CacheService.get(cacheKey);
  if (cached) {
    logger.debug('Order detail cache HIT', { id });
    return cached;
  }

  const order = await orderRepository.findOrderByIdWithRelations(id, orderIncludeRelations);
  if (order) {
    await CacheService.set(cacheKey, order, 300);
  }
  return order;
};

export const createOrder = async (
  userId: number,
  totalPrice: number,
  status: string,
  items: Array<{ productId: number; quantity: number; price: number }>,
  shippingAddress: string,
  shippingPhone: string,
  shippingName: string,
  note?: string,
  promotionCode?: string,
  discount?: number
) => {
  try {
    // Check stock availability for all items
    for (const item of items) {
      const product = await productRepository.findById(item.productId);
      if (!product || product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product ${item.productId}`);
      }
      await productRepository.updateStock(item.productId, item.quantity);
    }

    const orderData = {
      userId,
      totalPrice,
      status: status as OrderStatus,
      shippingAddress,
      shippingPhone,
      shippingName,
      note,
      promotionCode,
      discount,
      items: {
        create: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    };

    const order = await orderRepository.createOrderWithItems(orderData, orderWithItemsInclude);

    await CacheService.delete(CacheKeys.ORDER_LIST());
    await CacheService.delete(CacheKeys.ORDER_DETAIL(order.id));
    await CacheService.deletePattern('orders:*');
    await CacheService.delete(CacheKeys.STATS());
    void CacheService.deletePattern('products:*');

    if (status === OrderStatus.DELIVERED) {
      for (const item of items) {
        await productRepository.updateSoldCount(item.productId, item.quantity);
      }
    }

    await orderRepository.createNotification(
      userId,
      `Đơn hàng của bạn đã được tạo thành công`
    );

    void QueueService.addOrderProcessingJob({
      orderId: order.id,
      userId,
      items,
      status,
    });

    void QueueService.addNotificationJob({
      userId,
      message: `Đơn hàng của bạn (#${order.id}) đã được tạo thành công`,
      orderId: order.id,
    });

    void QueueService.addStatsJob({ type: 'manual' });

    return order;
  } catch (error) {
    console.error('Error in createOrder:', error);
    throw error;
  }
};

export const updateOrderStatus = async (id: number, status: string) => {
  const order = await orderRepository.findOrderByIdWithRelations(id, {
    items: true,
    user: true
  });

  if (!order) {
    throw new Error('Order not found');
  }

  // If order is being delivered, update stock
  if (status === OrderStatus.DELIVERED) {
    for (const item of order.items) {
      await productRepository.updateSoldCount(item.productId, item.quantity);
    }
  }

  // Create delivery log for status update
  if (order.shipperId) {
    await orderRepository.createDeliveryLog(
      id,
      order.shipperId,
      status as OrderStatus,
      `Order status updated to ${status}`
    );
  }

  // Create notification for order status update
  await orderRepository.createNotification(
    order.userId,
    `Đơn hàng #${order.id} đã được cập nhật trạng thái: ${status}.`
  );

  const updatedOrder = await orderRepository.updateOrderWithRelations(
    id,
    { status: status as OrderStatus },
    orderWithItemsInclude
  );

  await CacheService.delete(CacheKeys.ORDER_DETAIL(id));
  await CacheService.delete(CacheKeys.ORDER_LIST());
  await CacheService.delete(CacheKeys.USER_ORDERS(order.userId));
  await CacheService.delete(CacheKeys.STATS());

  void QueueService.addNotificationJob({
    userId: order.userId,
    message: `Đơn hàng #${order.id} đã được cập nhật trạng thái: ${status}.`,
    orderId: id,
  });

  const update = {
    type: 'order_update',
    orderId: id,
    userId: order.userId,
    status: status
  };

  // Get the clients Map from the orderRoutes
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { clients } = require('../routes/orderRoutes');
  
  // Send update to the specific user
  const userClient = clients.get(order.userId);
  if (userClient) {
    userClient.write(`data: ${JSON.stringify(update)}\n\n`);
  }

  return updatedOrder;
};

export const cancelOrder = async (orderId: number, userId: number) => {
  try {
    const order = await orderRepository.findOrderWithPayment(orderId);

    if (!order) {
      return { success: false, status: 404, message: 'Đơn hàng không tồn tại' };
    }

    if (order.userId !== userId) {
      return { success: false, status: 403, message: 'Bạn không có quyền hủy đơn hàng này' };
    }

    if (order.status !== OrderStatus.PENDING) {
      return { success: false, status: 400, message: 'Chỉ có thể hủy đơn hàng ở trạng thái PENDING' };
    }

    const [canceledOrder] = await orderRepository.cancelOrderWithPayment(
      orderId,
      OrderStatus.CANCELLED,
      PaymentStatus.FAILED
    );

    if (order.payment?.method === 'WALLET' && order.payment.status === 'COMPLETED') {
      try {
        const { refund } = await import('../services/walletService');
        await refund(
          userId,
          order.totalPrice,
          'ORDER',
          orderId,
          `Hoàn tiền hủy đơn hàng #${orderId}`,
          `cancel_refund_${orderId}`
        );
      } catch (refundError) {
        logger.error('Failed to refund wallet on order cancel:', refundError);
      }
    }

    await CacheService.delete(CacheKeys.ORDER_DETAIL(orderId));
    await CacheService.delete(CacheKeys.ORDER_LIST());
    await CacheService.delete(CacheKeys.USER_ORDERS(order.userId));
    await CacheService.delete(CacheKeys.STATS());

    return { success: true, order: canceledOrder };
  } catch (error) {
    console.error('Error canceling order:', error);
    return { success: false, status: 500, message: 'Không thể hủy đơn hàng' };
  }
};