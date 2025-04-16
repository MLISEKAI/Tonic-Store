import prisma from "../prisma";
import { OrderStatus } from "@prisma/client";

export const getAllOrders = async () => {
  return prisma.order.findMany({
    include: { user: true, items: true, payment: true },
  });
};

export const getOrder = async (id: number) => {
  return prisma.order.findUnique({
    where: { id },
    include: { user: true, items: { include: { product: true } }, payment: true },
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
  note?: string
) => {
  return prisma.order.create({
    data: {
      userId,
      totalPrice,
      status: status as OrderStatus,
      shippingAddress,
      shippingPhone,
      shippingName,
      note,
      items: {
        create: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
    include: { items: { include: { product: true } }, payment: true },
  });
};

export const updateOrderStatus = async (id: number, status: string) => {
  return prisma.order.update({
    where: { id },
    data: { status: status as OrderStatus },
    include: { items: { include: { product: true } }, payment: true },
  });
};
