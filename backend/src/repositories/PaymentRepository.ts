import { PrismaClient, Payment, PaymentMethod, PaymentStatus, Prisma } from '@prisma/client';
import { IPaymentRepository } from './interfaces/IPaymentRepository';

export class PaymentRepository implements IPaymentRepository {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }
  async getAllPayments(): Promise<Payment[]> {
    return this.prisma.payment.findMany({ include: { order: true } });
  }
  async createPayment(orderId: number, method: PaymentMethod, amount: number): Promise<Payment> {
    return this.prisma.payment.create({
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
  async updatePaymentStatus(orderId: number, status: PaymentStatus, transactionId?: string): Promise<Payment> {
    const data: Prisma.PaymentUpdateInput = {
      status,
      transactionId,
      ...(status === PaymentStatus.COMPLETED && { paymentDate: new Date() })
    };
    return this.prisma.payment.update({
      where: { orderId },
      data,
      include: { order: true }
    });
  }
  async getPaymentByOrderId(orderId: number): Promise<Payment | null> {
    return this.prisma.payment.findUnique({
      where: { orderId },
      include: { order: true }
    });
  }
} 