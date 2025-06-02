import { PrismaClient, OrderStatus, Prisma, PaymentStatus } from '@prisma/client';
import { checkAndUpdateStock, updateSoldCount } from './productService';

const prisma = new PrismaClient();

export const getAllOrders = async () => {
  return prisma.order.findMany({
    include: { user: true, items: true, payment: true },
  });
};

export const getOrder = async (id: number) => {
  return prisma.order.findUnique({
    where: { id },
    include: { 
      user: true, 
      items: { include: { product: true } }, 
      payment: true,
      shipper: true
    },
  });
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
      await checkAndUpdateStock(item.productId, item.quantity);
    }

    const orderData: Prisma.OrderUncheckedCreateInput = {
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

    const order = await prisma.order.create({
      data: orderData,
      include: { items: { include: { product: true } }, payment: true },
    });

    // Create notification for the user
    await prisma.notification.create({
      data: {
        userId,
        message: `Đơn hàng của bạn đã được tạo thành công`,
        isRead: false,
      },
    });

    return order;
  } catch (error) {
    console.error('Error in createOrder:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('Prisma error code:', error.code);
      console.error('Prisma error meta:', error.meta);
    }
    throw error;
  }
};

export const updateOrderStatus = async (id: number, status: string) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, user: true }
  });

  if (!order) {
    throw new Error('Order not found');
  }

  // If order is being delivered, update stock
  if (status === OrderStatus.DELIVERED) {
    for (const item of order.items) {
      await updateSoldCount(item.productId, item.quantity);
    }
  }

  // Create delivery log for status update
  if (order.shipperId) {
    await prisma.deliveryLog.create({
      data: {
        orderId: id,
        deliveryId: order.shipperId,
        status: status as OrderStatus,
        note: `Order status updated to ${status}`
      }
    });
  }

  // Create notification for order status update
  await prisma.notification.create({
    data: {
      userId: order.userId,
      message: `Đơn hàng #${order.id} đã được cập nhật trạng thái: ${status}.`,
      isRead: false,
    },
  });

  const updatedOrder = await prisma.order.update({
    where: { id },
    data: { status: status as OrderStatus },
    include: { items: { include: { product: true } }, payment: true },
  });

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
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true }
    });

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
    const [canceledOrder] = await prisma.$transaction([
      // Cập nhật trạng thái đơn hàng
      prisma.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.CANCELLED }
      }),
      // Cập nhật trạng thái thanh toán
      prisma.payment.update({
        where: { orderId: orderId },
        data: { status: PaymentStatus.FAILED }
      })
    ]);

    return { success: true, order: canceledOrder };
  } catch (error) {
    console.error('Error canceling order:', error);
    return { success: false, status: 500, message: 'Không thể hủy đơn hàng' };
  }
};