import prisma from "../prisma";
import { OrderStatus } from "@prisma/client";

export const getAllOrders = async () => {
  return prisma.order.findMany({
    include: { user: true, items: true, payment: true },
  });
};

export const createOrder = async (
  userId: number,
  totalPrice: number,
  status: string,
  items: any[]
) => {
  return prisma.order.create({
    data: {
      userId,
      totalPrice,
      status: status as OrderStatus,
      items: {
        create: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
  });
};
