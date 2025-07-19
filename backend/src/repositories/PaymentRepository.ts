import { prisma } from '../prisma';
import { BaseRepository } from './BaseRepository';
import { PaymentMethod, PaymentStatus, Prisma } from '@prisma/client';

export class PaymentRepository extends BaseRepository<any> {
  constructor() {
    super(prisma.payment);
  }

  async getAllPayments() {
    return this.model.findMany({ include: { order: true } });
  }

  async createPayment(orderId: number, method: PaymentMethod, amount: number) {
    return this.model.create({
      data: {
        order: { connect: { id: orderId } },
        method,
        amount,
        status: PaymentStatus.PENDING,
        currency: 'VND',
      } as Prisma.PaymentCreateInput,
      include: { order: true }
    });
  }

  async updatePaymentStatus(orderId: number, status: PaymentStatus, transactionId?: string) {
    const data: Prisma.PaymentUpdateInput = {
      status,
      transactionId,
      ...(status === PaymentStatus.COMPLETED && { paymentDate: new Date() })
    };
    return this.model.update({
      where: { orderId },
      data,
      include: { order: true }
    });
  }

  async getPaymentByOrderId(orderId: number) {
    return this.model.findUnique({ where: { orderId }, include: { order: true } });
  }
} 