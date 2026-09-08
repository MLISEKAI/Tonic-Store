import { prisma } from '../prisma';
import type { Request, Response } from 'express';
import { OrderStatus, PaymentMethod, PaymentStatus } from '@prisma/client';
import { createPaymentUrl, verifyPayment } from '../services/vnpayService';
import { processDiscountCodeUsage } from '../services/discountCodeService';
import { getOrCreateWallet, deduct, refund as walletRefund } from '../services/walletService';
import { WalletTransactionType } from '@prisma/client';
import logger from '../config/logger';

export const createPaymentController = async (req: Request, res: Response) => {
  try {
    const { orderId, method } = req.body;
    const userId = req.user?.id;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true, user: true },
    });

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    if (order.payment) {
      res.status(400).json({ error: 'Order already has a payment' });
      return;
    }

    if (method === PaymentMethod.WALLET) {
      if (!userId || order.userId !== userId) {
        res.status(403).json({ error: 'Forbidden' });
        return;
      }

      const wallet = await getOrCreateWallet(userId);
      const balance = parseFloat(wallet.balance.toString());

      if (balance < order.totalPrice) {
        res.status(400).json({ error: 'Insufficient wallet balance' });
        return;
      }

      const payment = await prisma.payment.create({
        data: {
          orderId,
          method: PaymentMethod.WALLET,
          status: PaymentStatus.PENDING,
          amount: order.totalPrice,
          currency: 'VND',
        },
      });

      try {
        const deductResult = await deduct(
          userId,
          order.totalPrice,
          WalletTransactionType.PAYMENT,
          'ORDER',
          orderId,
          `Thanh toán đơn hàng #${orderId}`,
          `payment_${orderId}`
        );

        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: PaymentStatus.COMPLETED,
            transactionId: `WALLET_${Date.now()}`,
            paymentDate: new Date(),
          },
        });

        await prisma.order.update({
          where: { id: orderId },
          data: { status: OrderStatus.CONFIRMED },
        });

        await processDiscountCodeUsage(order.promotionCode, order.userId, order.id);

        if (order.shipperId) {
          await prisma.deliveryLog.create({
            data: {
              orderId,
              deliveryId: order.shipperId,
              status: OrderStatus.CONFIRMED,
              note: 'Payment verified via wallet, order confirmed',
            },
          });
        }

        res.json({
          payment: { ...payment, status: PaymentStatus.COMPLETED },
          message: 'Payment successful',
          balance: (deductResult as any).balance,
        });
        return;
      } catch (error) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: PaymentStatus.FAILED },
        });

        await walletRefund(
          userId,
          order.totalPrice,
          'ORDER',
          orderId,
          `Hoàn tiền do lỗi thanh toán đơn hàng #${orderId}`,
          `refund_payment_failed_${orderId}`
        );

        logger.error('Wallet payment failed, refunded:', error);
        res.status(500).json({ error: 'Payment failed, balance refunded' });
        return;
      }
    }

    const payment = await prisma.payment.create({
      data: {
        orderId,
        method: method as PaymentMethod,
        status: PaymentStatus.PENDING,
        amount: order.totalPrice,
        currency: 'VND',
      },
    });

    if (method === PaymentMethod.VN_PAY) {
      const paymentUrl = await createPaymentUrl(order.id, order.totalPrice, req.body.bankCode);
      res.json({ payment, paymentUrl });
      return;
    }

    if (method === PaymentMethod.COD) {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.PENDING },
      });
    }

    res.json({ payment });
  } catch (error) {
    logger.error('Create payment error:', error);
    res.status(500).json({ error: 'Failed to create payment' });
  }
};

export const verifyPaymentController = async (req: Request, res: Response) => {
  try {
    const { orderId, method } = req.query;

    if (method === PaymentMethod.VN_PAY) {
      const isValid = verifyPayment(req.query as Record<string, string>);

      if (isValid) {
        const order = await prisma.order.findUnique({
          where: { id: Number(orderId) },
        });

        if (!order) {
          res.redirect(`${process.env.FRONTEND_URL}/payment/failed?orderId=${orderId}`);
          return;
        }

        await prisma.payment.update({
          where: { orderId: Number(orderId) },
          data: {
            status: PaymentStatus.COMPLETED,
            transactionId: req.query.vnp_TransactionNo as string,
            paymentDate: new Date(),
          },
        });

        await prisma.order.update({
          where: { id: Number(orderId) },
          data: { status: OrderStatus.CONFIRMED },
        });

        await processDiscountCodeUsage(order.promotionCode, order.userId, order.id);

        if (order.shipperId) {
          await prisma.deliveryLog.create({
            data: {
              orderId: Number(orderId),
              deliveryId: order.shipperId,
              status: OrderStatus.CONFIRMED,
              note: 'Payment verified, order confirmed',
            },
          });
        }

        res.redirect(`${process.env.FRONTEND_URL}/payment/success?orderId=${orderId}`);
        return;
      }
    } else if (method === PaymentMethod.COD) {
      res.redirect(`${process.env.FRONTEND_URL}/payment/pending?orderId=${orderId}`);
      return;
    }

    res.redirect(`${process.env.FRONTEND_URL}/payment/failed?orderId=${orderId}`);
    return;
  } catch (error) {
    logger.error('Verify payment error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/payment/failed?orderId=${req.query.orderId}`);
    return;
  }
};

export const getPaymentController = async (req: Request, res: Response) => {
  try {
    const paymentId = parseInt(req.params.id);
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { order: true },
    });

    if (!payment) {
      res.status(404).json({ error: 'Payment not found' });
      return;
    }

    res.json(payment);
  } catch (error) {
    logger.error('Get payment error:', error);
    res.status(500).json({ error: 'Failed to get payment' });
  }
};

export const refundPaymentController = async (req: Request, res: Response) => {
  try {
    const paymentId = parseInt(req.params.id);
    const { amount } = req.body;

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { order: true },
    });

    if (!payment) {
      res.status(404).json({ error: 'Payment not found' });
      return;
    }

    if (payment.status !== PaymentStatus.COMPLETED) {
      res.status(400).json({ error: 'Payment is not completed' });
      return;
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: amount === payment.amount ? PaymentStatus.REFUNDED : PaymentStatus.PARTIALLY_REFUNDED,
      },
    });

    await prisma.order.update({
      where: { id: payment.orderId },
      data: { status: OrderStatus.REFUNDED },
    });

    if (payment.method === PaymentMethod.WALLET) {
      await walletRefund(
        payment.order.userId,
        amount,
        'ORDER',
        payment.orderId,
        `Hoàn tiền đơn hàng #${payment.orderId}`
      );
    }

    res.json(updatedPayment);
  } catch (error) {
    logger.error('Refund payment error:', error);
    res.status(500).json({ error: 'Failed to refund payment' });
  }
};
