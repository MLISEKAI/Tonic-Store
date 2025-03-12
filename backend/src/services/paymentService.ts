import prisma from "../prisma";
import { PaymentMethod, PaymentStatus } from "@prisma/client";

export const getAllPayments = async () => {
  return prisma.payment.findMany({
    include: { order: true },
  });
};

export const createPayment = async (
  orderId: number,
  method: string,
  transactionId: string
) => {
  return prisma.payment.create({
    data: {
      orderId,
      method: method as PaymentMethod,
      transactionId,
      status: PaymentStatus.PENDING,
    },
  });
};

export const updatePaymentStatus = async (orderId: number, status: string) => {
  return prisma.payment.update({
    where: { orderId },
    data: { status: status as PaymentStatus },
  });
};
