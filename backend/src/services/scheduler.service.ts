import { prisma } from '../prisma';
import logger from '../config/logger';
import { CacheService, CacheKeys } from './cache.service';
import { QueueService } from './queue.service';
import { PaymentStatus, OrderStatus } from '@prisma/client';

const COD_AUTO_COMPLETE_MINUTES = parseInt(process.env.COD_AUTO_COMPLETE_MINUTES || '2');
const BANK_TRANSFER_AUTO_CANCEL_MINUTES = parseInt(process.env.BANK_TRANSFER_AUTO_CANCEL_MINUTES || '2');

export function startScheduler() {
  setInterval(async () => {
    try {
      await processExpiredCODPayments();
    } catch (error) {
      logger.error('Scheduler error (COD):', error);
    }
  }, COD_AUTO_COMPLETE_MINUTES * 60 * 1000);

  setInterval(async () => {
    try {
      await processExpiredBankTransfers();
    } catch (error) {
      logger.error('Scheduler error (Bank Transfer):', error);
    }
  }, BANK_TRANSFER_AUTO_CANCEL_MINUTES * 60 * 1000);

  logger.info('Scheduler started', {
    codAutoCompleteMinutes: COD_AUTO_COMPLETE_MINUTES,
    bankTransferAutoCancelMinutes: BANK_TRANSFER_AUTO_CANCEL_MINUTES,
  });
}

async function processExpiredCODPayments() {
  const cutoffDate = new Date();
  cutoffDate.setMinutes(cutoffDate.getMinutes() - COD_AUTO_COMPLETE_MINUTES);

  const expiredOrders = await prisma.order.findMany({
    where: {
      status: OrderStatus.DELIVERED,
      payment: {
        method: 'COD',
        status: PaymentStatus.PENDING,
      },
      updatedAt: { lte: cutoffDate },
    },
    include: { payment: true },
  });

  if (expiredOrders.length === 0) return;

  logger.info(`Processing ${expiredOrders.length} expired COD payments`);

  for (const order of expiredOrders) {
    try {
      await prisma.payment.update({
        where: { orderId: order.id },
        data: {
          status: PaymentStatus.COMPLETED,
          paymentDate: new Date(),
        },
      });

      await CacheService.delete(CacheKeys.ORDER_DETAIL(order.id));
      await CacheService.delete(CacheKeys.ORDER_LIST());
      await CacheService.delete(CacheKeys.STATS());

      void QueueService.addNotificationJob({
        userId: order.userId,
        message: `Đơn hàng #${order.id} đã được tự động xác nhận thanh toán COD.`,
        orderId: order.id,
      });

      logger.info(`COD payment auto-completed for order ${order.id}`);
    } catch (error) {
      logger.error(`Failed to auto-complete COD for order ${order.id}:`, error);
    }
  }
}

async function processExpiredBankTransfers() {
  const cutoffDate = new Date();
  cutoffDate.setMinutes(cutoffDate.getMinutes() - BANK_TRANSFER_AUTO_CANCEL_MINUTES);

  const expiredOrders = await prisma.order.findMany({
    where: {
      status: OrderStatus.PENDING,
      payment: {
        method: 'BANK_TRANSFER',
        status: PaymentStatus.PENDING,
      },
      createdAt: { lte: cutoffDate },
    },
    include: { payment: true, items: true },
  });

  if (expiredOrders.length === 0) return;

  logger.info(`Processing ${expiredOrders.length} expired bank transfers`);

  for (const order of expiredOrders) {
    try {
      await prisma.$transaction(async (tx) => {
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }

        await tx.order.update({
          where: { id: order.id },
          data: { status: OrderStatus.CANCELLED },
        });

        await tx.payment.update({
          where: { orderId: order.id },
          data: { status: PaymentStatus.FAILED },
        });
      });

      await CacheService.delete(CacheKeys.ORDER_DETAIL(order.id));
      await CacheService.delete(CacheKeys.ORDER_LIST());
      await CacheService.delete(CacheKeys.USER_ORDERS(order.userId));
      await CacheService.delete(CacheKeys.STATS());
      void CacheService.deletePattern('products:*');

      void QueueService.addNotificationJob({
        userId: order.userId,
        message: `Đơn hàng #${order.id} đã tự động hủy do không nhận được xác nhận thanh toán chuyển khoản trong ${BANK_TRANSFER_AUTO_CANCEL_MINUTES} phút.`,
        orderId: order.id,
      });

      logger.info(`Bank transfer order ${order.id} auto-cancelled`);
    } catch (error) {
      logger.error(`Failed to auto-cancel bank transfer for order ${order.id}:`, error);
    }
  }
}
