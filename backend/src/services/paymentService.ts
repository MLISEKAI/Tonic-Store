import { PaymentRepository } from '../repositories';
import { PaymentMethod, PaymentStatus } from '@prisma/client';

const paymentRepository = new PaymentRepository();

export const getAllPayments = async () => {
  return paymentRepository.getAllPayments();
};

export const createPayment = async (orderId: number, method: PaymentMethod, amount: number) => {
  return paymentRepository.createPayment(orderId, method, amount);
};

export const updatePaymentStatus = async (orderId: number, status: PaymentStatus, transactionId?: string) => {
  return paymentRepository.updatePaymentStatus(orderId, status, transactionId);
};

export const getPaymentByOrderId = async (orderId: number) => {
  return paymentRepository.getPaymentByOrderId(orderId);
};
