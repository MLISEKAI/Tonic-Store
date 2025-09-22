import { OrderStatus, PaymentStatus } from '@prisma/client';
import { OrderRepository } from '../repositories/OrderRepository';
import { ProductRepository } from '../repositories/ProductRepository';

const orderRepository = new OrderRepository();
const productRepository = new ProductRepository();

const orderIncludeRelations = {
  user: true,
  items: { include: { product: true } },
  payment: true,
  shipper: true
};

const orderWithItemsInclude = {
  items: { include: { product: true } },
  payment: true
};

export const getAllOrders = async () => {
  return orderRepository.findOrdersWithRelations({
    user: true,
    items: true,
    payment: true
  });
};

export const getOrder = async (id: number) => {
  return orderRepository.findOrderByIdWithRelations(id, orderIncludeRelations);
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

    // If order is created with DELIVERED status, update soldCount immediately
    if (status === OrderStatus.DELIVERED) {
      for (const item of items) {
        await productRepository.updateSoldCount(item.productId, item.quantity);
      }
    }

    // Create notification for the user
    await orderRepository.createNotification(
      userId,
      `Đơn hàng của bạn đã được tạo thành công`
    );

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

  // Broadcast update to connected clients
  const update = {
    type: 'order_update',
    orderId: id,
    userId: order.userId,
    status: status
  };

  // Get the clients Map from the orderRoutes
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
    // Tìm đơn hàng
    const order = await orderRepository.findOrderWithPayment(orderId);

    if (!order) {
      return { success: false, status: 404, message: 'Đơn hàng không tồn tại' };
    }

    // Kiểm tra quyền hủy đơn hàng
    if (order.userId !== userId) {
      return { success: false, status: 403, message: 'Bạn không có quyền hủy đơn hàng này' };
    }

    // Kiểm tra trạng thái đơn hàng
    if (order.status !== OrderStatus.PENDING) {
      return { success: false, status: 400, message: 'Chỉ có thể hủy đơn hàng ở trạng thái PENDING' };
    }

    // Cập nhật trạng thái đơn hàng và thanh toán trong một transaction
    const [canceledOrder] = await orderRepository.cancelOrderWithPayment(
      orderId,
      OrderStatus.CANCELLED,
      PaymentStatus.FAILED
    );

    return { success: true, order: canceledOrder };
  } catch (error) {
    console.error('Error canceling order:', error);
    return { success: false, status: 500, message: 'Không thể hủy đơn hàng' };
  }
};