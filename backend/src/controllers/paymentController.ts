import type { Request, Response } from 'express';
import { PrismaClient, PaymentMethod, PaymentStatus, OrderStatus } from '@prisma/client';
import { createPaymentUrl, verifyPayment } from '../services/vnpayService';
import { discountCodeService, processDiscountCodeUsage } from '../services/discountCodeService';

const prisma = new PrismaClient();

export const createPaymentController = async (req: Request, res: Response) => {
  try {
    const { orderId, method } = req.body;
    
    // Kiểm tra order tồn tại
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Kiểm tra order chưa có payment
    if (order.payment) {
      return res.status(400).json({ error: 'Order already has a payment' });
    }

    // Tạo payment record
    const payment = await prisma.payment.create({
      data: {
        orderId,
        method: method as PaymentMethod,
        status: PaymentStatus.PENDING,
        amount: order.totalPrice,
        currency: 'VND'
      }
    });

    // Nếu là VNPay, tạo URL thanh toán
    if (method === PaymentMethod.VN_PAY) {
      const paymentUrl = await createPaymentUrl(order.id, order.totalPrice, req.body.bankCode);
      return res.json({ payment, paymentUrl });
    }

    // Nếu là COD, cập nhật trạng thái order thành PENDING
    if (method === PaymentMethod.COD) {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'PENDING' }
      });
    }

    res.json({ payment });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ error: 'Failed to create payment' });
  }
};

export const verifyPaymentController = async (req: Request, res: Response) => {
  try {
    const { orderId, method } = req.query;

    if (method === PaymentMethod.VN_PAY) {
      const isValid = verifyPayment(req.query as Record<string, string>);
      
      if (isValid) {
        // Get order to check shipper and promotion code
        const order = await prisma.order.findUnique({
          where: { id: Number(orderId) }
        });

        if (!order) {
          throw new Error('Order not found');
        }

        // Cập nhật trạng thái payment
        await prisma.payment.update({
          where: { orderId: Number(orderId) },
          data: {
            status: PaymentStatus.COMPLETED,
            transactionId: req.query.vnp_TransactionNo as string,
            paymentDate: new Date()
          }
        });

        // Cập nhật trạng thái order
        await prisma.order.update({
          where: { id: Number(orderId) },
          data: { status: 'CONFIRMED' }
        });

        // Xử lý discount code usage khi payment verified thành công
        await processDiscountCodeUsage(order.promotionCode, order.userId, order.id);

        // Create delivery log for confirmed status
        if (order.shipperId) {
          await prisma.deliveryLog.create({
            data: {
              orderId: Number(orderId),
              deliveryId: order.shipperId,
              status: OrderStatus.CONFIRMED,
              note: 'Payment verified, order confirmed'
            }
          });
        }

        return res.redirect(`${process.env.FRONTEND_URL}/payment/success?orderId=${orderId}`);
      }
    } else if (method === PaymentMethod.COD) {
      // Đối với COD, trạng thái thanh toán vẫn đang chờ xử lý cho đến khi Shipper xác nhận nhận khoản thanh toán
      return res.redirect(`${process.env.FRONTEND_URL}/payment/pending?orderId=${orderId}`);
    }

    return res.redirect(`${process.env.FRONTEND_URL}/payment/failed?orderId=${orderId}`);
  } catch (error) {
    console.error('Verify payment error:', error);
    return res.redirect(`${process.env.FRONTEND_URL}/payment/failed?orderId=${req.query.orderId}`);
  }
};

export const getPaymentController = async (req: Request, res: Response) => {
  try {
    const paymentId = parseInt(req.params.id);
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { order: true }
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json(payment);
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ error: 'Failed to get payment' });
  }
};

export const refundPaymentController = async (req: Request, res: Response) => {
  try {
    const paymentId = parseInt(req.params.id);
    const { amount } = req.body;

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { order: true }
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    if (payment.status !== PaymentStatus.COMPLETED) {
      return res.status(400).json({ error: 'Payment is not completed' });
    }

    // Cập nhật trạng thái payment
    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: amount === payment.amount ? PaymentStatus.REFUNDED : PaymentStatus.PARTIALLY_REFUNDED
      }
    });

    // Cập nhật trạng thái order
    await prisma.order.update({
      where: { id: payment.orderId },
      data: { status: 'REFUNDED' }
    });

    res.json(updatedPayment);
  } catch (error) {
    console.error('Refund payment error:', error);
    res.status(500).json({ error: 'Failed to refund payment' });
  }
}; 