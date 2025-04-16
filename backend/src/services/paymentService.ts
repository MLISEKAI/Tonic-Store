import { PrismaClient, PaymentMethod, PaymentStatus, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

export const getAllPayments = async () => {
  return prisma.payment.findMany({
    include: { order: true },
  });
};

export const createPayment = async (orderId: number, method: PaymentMethod, amount: number) => {
  return prisma.payment.create({
    data: {
      order: {
        connect: { id: orderId }
      },
      method,
      amount,
      status: PaymentStatus.PENDING,
      currency: "VND",
    } as Prisma.PaymentCreateInput,
    include: {
      order: true
    }
  });
};

export const updatePaymentStatus = async (orderId: number, status: PaymentStatus, transactionId?: string) => {
  const data: Prisma.PaymentUpdateInput = {
    status,
    transactionId,
    ...(status === PaymentStatus.COMPLETED && { paymentDate: new Date() })
  };

  return prisma.payment.update({
    where: { orderId },
    data,
    include: {
      order: true
    }
  });
};

export const getPaymentByOrderId = async (orderId: number) => {
  return prisma.payment.findUnique({
    where: { orderId },
    include: {
      order: true
    }
  });
};
