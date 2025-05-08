import { PrismaClient, OrderStatus } from '@prisma/client';
const prisma = new PrismaClient();

// Lấy danh sách shipper
export const getAllShippers = async () => {
  return prisma.user.findMany({
    where: {
      role: 'DELIVERY'
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      createdAt: true,
      updatedAt: true
    }
  });
};

// Lấy thông tin chi tiết shipper
export const getShipperById = async (id: number) => {
  return prisma.user.findUnique({
    where: {
      id,
      role: 'DELIVERY'
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      createdAt: true,
      updatedAt: true,
      shipperOrders: {
        include: {
          items: {
            include: {
              product: true
            }
          },
          user: true
        }
      }
    }
  });
};

// Gán shipper cho đơn hàng
export const assignShipperToOrder = async (orderId: number, shipperId: number) => {
  return prisma.order.update({
    where: { id: orderId },
    data: {
      shipperId,
      status: OrderStatus.PROCESSING
    },
    include: {
      items: {
        include: {
          product: true
        }
      },
      shipper: true
    }
  });
};

// Cập nhật trạng thái giao hàng
export const updateDeliveryStatus = async (orderId: number, shipperId: number, status: OrderStatus, note?: string) => {
  // Tạo delivery log
  await prisma.deliveryLog.create({
    data: {
      orderId,
      deliveryId: shipperId,
      status,
      note
    }
  });

  // Cập nhật trạng thái đơn hàng
  return prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: {
      items: {
        include: {
          product: true
        }
      },
      shipper: true
    }
  });
};

// Lấy danh sách đơn hàng của shipper
export const getShipperOrders = async (shipperId: number, status?: OrderStatus) => {
  return prisma.order.findMany({
    where: {
      shipperId,
      ...(status && { status })
    },
    include: {
      items: {
        include: {
          product: true
        }
      },
      user: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

// Lấy lịch sử giao hàng của đơn hàng
export const getOrderDeliveryLogs = async (orderId: number) => {
  return prisma.deliveryLog.findMany({
    where: { orderId },
    include: {
      delivery: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}; 