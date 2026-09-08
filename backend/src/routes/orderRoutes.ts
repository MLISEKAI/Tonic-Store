import { prisma } from '../prisma';
import express from 'express';
import type { Request, Response } from 'express';
import { authenticate, authenticateSSE } from '../middleware/auth';
import { createOrder, getOrder, updateOrderStatus, getAllOrders, cancelOrder } from '../services/orderService';
import { createPayment, updatePaymentStatus } from '../services/paymentService';
import { createPaymentUrl, verifyPayment } from '../services/vnpayService';
import { PaymentMethod, PaymentStatus, OrderStatus } from '@prisma/client';
import { ShipperController } from '../controllers/shipperController';
import { CacheService, CacheKeys } from '../services/cache.service';
import { QueueService } from '../services/queue.service';
import { handleControllerError, ErrorCodes } from '../common/types/api-response';
import { parsePageOptions, calculatePagination, sendPaginated } from '../common/types/pagination';
import logger from '../config/logger';

const router = express.Router();
export const clients = new Map<number, Response>();

router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    if (req.user!.role !== 'ADMIN') {
      res.apiError('Unauthorized', ErrorCodes.FORBIDDEN);
      return;
    }
    const orders = await getAllOrders();
    res.apiSuccess(orders, "Lấy danh sách đơn hàng thành công");
  } catch (error) {
    handleControllerError(res, error, "GET /api/orders");
  }
});

router.patch('/:id/status', authenticate, async (req: Request, res: Response) => {
  try {
    if (req.user!.role !== 'ADMIN') {
      res.apiError('Unauthorized', ErrorCodes.FORBIDDEN);
      return;
    }

    const { status } = req.body;
    const order = await updateOrderStatus(Number(req.params.id), status);

    await CacheService.delete(CacheKeys.ORDER_DETAIL(Number(req.params.id)));
    await CacheService.delete(CacheKeys.ORDER_LIST());
    await CacheService.delete(CacheKeys.STATS());

    void QueueService.addNotificationJob({
      userId: order.userId,
      message: `Đơn hàng #${order.id} đã được cập nhật trạng thái: ${status}.`,
      orderId: Number(req.params.id),
    });

    res.apiSuccess(order, "Cập nhật trạng thái đơn hàng thành công");
  } catch (error) {
    handleControllerError(res, error, "PATCH /api/orders/:id/status");
  }
});

router.patch('/:id/payment', authenticate, async (req: Request, res: Response) => {
  try {
    if (req.user!.role !== 'ADMIN') {
      res.apiError('Unauthorized', ErrorCodes.FORBIDDEN);
      return;
    }

    const { status, transactionId } = req.body;
    const payment = await updatePaymentStatus(Number(req.params.id), status, transactionId);

    void CacheService.delete(CacheKeys.ORDER_DETAIL(Number(req.params.id)));
    void CacheService.delete(CacheKeys.STATS());

    res.apiSuccess(payment, "Cập nhật trạng thái thanh toán thành công");
  } catch (error) {
    handleControllerError(res, error, "PATCH /api/orders/:id/payment");
  }
});

router.post('/:id/confirm-cod', authenticate, async (req: Request, res: Response) => {
  try {
    if (req.user!.role !== 'DELIVERY') {
      res.apiError('Permission denied', ErrorCodes.FORBIDDEN);
      return;
    }
    const orderId = Number(req.params.id);
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true, items: true },
    });
    if (!order || !order.payment) {
      res.apiError('Order or payment not found', ErrorCodes.NOT_FOUND);
      return;
    }
    if (order.payment.method !== 'COD' || order.status !== 'DELIVERED') {
      res.apiError('Order is not eligible for COD confirmation', ErrorCodes.BAD_REQUEST);
      return;
    }
    const payment = await prisma.payment.update({
      where: { orderId },
      data: {
        status: 'COMPLETED',
        paymentDate: new Date()
      }
    });

    void CacheService.delete(CacheKeys.ORDER_DETAIL(orderId));
    void CacheService.delete(CacheKeys.STATS());

    void QueueService.addNotificationJob({
      userId: order.userId,
      message: `Đơn hàng #${orderId} đã được xác nhận thanh toán thành công.`,
      orderId,
    });

    res.apiSuccess(payment, "Xác nhận thanh toán COD thành công");
  } catch (error) {
    handleControllerError(res, error, "POST /api/orders/:id/confirm-cod");
  }
});

router.patch('/:id/cancel', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const orderId = Number(req.params.id);

    const result = await cancelOrder(orderId, userId);
    if (!result.success) {
      res.apiError(result.message || 'Failed to cancel order', ErrorCodes.BAD_REQUEST);
      return;
    }

    void CacheService.deletePattern('orders:*');
    void CacheService.delete(CacheKeys.STATS());
    res.apiSuccess({ order: result.order }, "Hủy đơn hàng thành công");
  } catch (error) {
    handleControllerError(res, error, "PATCH /api/orders/:id/cancel");
  }
});

router.get('/user', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const cacheKey = CacheKeys.USER_ORDERS(userId);
    const cached = await CacheService.get(cacheKey);
    if (cached) {
      res.set('X-Cache', 'HIT');
      res.apiSuccess(cached, "Lấy danh sách đơn hàng thành công");
      return;
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } }, payment: true },
      orderBy: { createdAt: 'desc' }
    });

    await CacheService.set(cacheKey, orders, 120);
    res.set('X-Cache', 'MISS');
    res.apiSuccess(orders, "Lấy danh sách đơn hàng thành công");
  } catch (error) {
    handleControllerError(res, error, "GET /api/orders/user");
  }
});

router.post('/', authenticate, async (req: Request, res: Response) => {
  try {
    const { items, totalPrice, shippingAddress, shippingPhone, shippingName, note, paymentMethod, promotionCode, discount } = req.body;
    const userId = req.user!.id;

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.apiError('Items array is required and must not be empty', ErrorCodes.BAD_REQUEST);
      return;
    }

    if (!totalPrice || typeof totalPrice !== 'number') {
      res.apiError('Total price is required and must be a number', ErrorCodes.BAD_REQUEST);
      return;
    }

    if (!shippingAddress || !shippingPhone || !shippingName) {
      res.apiError('Shipping information is required', ErrorCodes.BAD_REQUEST);
      return;
    }

    if (!paymentMethod) {
      res.apiError('Payment method is required', ErrorCodes.BAD_REQUEST);
      return;
    }

    for (const item of items) {
      if (!item.productId || !item.quantity || !item.price) {
        res.apiError('Each item must have productId, quantity, and price', ErrorCodes.BAD_REQUEST);
        return;
      }
    }

    const order = await createOrder(
      userId,
      totalPrice,
      'PENDING',
      items,
      shippingAddress,
      shippingPhone,
      shippingName,
      note,
      promotionCode,
      discount
    );

    await CacheService.delete(CacheKeys.ORDER_LIST());
    await CacheService.delete(CacheKeys.ORDER_DETAIL(order.id));
    await CacheService.delete(CacheKeys.USER_ORDERS(userId));
    await CacheService.delete(CacheKeys.STATS());

    await createPayment(
      order.id,
      paymentMethod as PaymentMethod,
      totalPrice
    );

    if (paymentMethod === 'VN_PAY') {
      const ipAddr = req.ip || '127.0.0.1';
      const paymentUrl = createPaymentUrl(order.id, totalPrice, ipAddr);
      res.apiSuccess({ order, paymentUrl }, "Tạo đơn hàng thành công");
      return;
    }

    res.apiSuccess({ order }, "Tạo đơn hàng thành công");
  } catch (error) {
    handleControllerError(res, error, "POST /api/orders");
  }
});

router.get('/delivery', authenticate, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.apiError('Unauthorized', ErrorCodes.UNAUTHORIZED);
      return;
    }

    if (req.user.role !== 'DELIVERY') {
      res.apiError('Forbidden', ErrorCodes.FORBIDDEN);
      return;
    }

    const { status, name, dateFrom, dateTo, paymentMethod } = req.query;
    const pagination = parsePageOptions(req.query);
    const where: any = {
      shipperId: req.user.id
    };
    if (status) where.status = status;
    if (name) where.shippingName = { contains: name };
    if (dateFrom || dateTo) {
      const createdAt: any = {};
      if (dateFrom && dateFrom !== 'undefined') createdAt.gte = new Date(dateFrom as string);
      if (dateTo && dateTo !== 'undefined') createdAt.lte = new Date(dateTo as string);
      if (Object.keys(createdAt).length > 0) where.createdAt = createdAt;
    }
    if (paymentMethod) {
      let method = paymentMethod;
      if (typeof paymentMethod === 'string') {
        const map: Record<string, string> = {
          cod: 'COD',
          bank: 'BANK_TRANSFER',
          vnpay: 'VN_PAY',
          paypal: 'PAYPAL',
          credit: 'CREDIT_CARD',
        };
        method = map[paymentMethod.toLowerCase()] || paymentMethod;
      }
      where.payment = { method };
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: true
            }
          },
          user: true,
          payment: {
            select: {
              method: true,
              status: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit
      }),
      prisma.order.count({ where })
    ]);

    const paginationMeta = calculatePagination(total, pagination.limit, pagination.page);
    sendPaginated(res, { items: orders, pagination: paginationMeta }, "Lấy danh sách đơn hàng giao hàng thành công");
  } catch (error) {
    handleControllerError(res, error, "GET /api/orders/delivery");
  }
});

router.get('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const order = await getOrder(Number(req.params.id));
    if (!order) {
      res.apiError('Order not found', ErrorCodes.NOT_FOUND);
      return;
    }

    if (order.userId !== req.user!.id && req.user!.role !== 'ADMIN') {
      res.apiError('Unauthorized', ErrorCodes.FORBIDDEN);
      return;
    }

    res.apiSuccess(order, "Lấy thông tin đơn hàng thành công");
  } catch (error) {
    handleControllerError(res, error, "GET /api/orders/:id");
  }
});

router.get('/vnpay/callback', async (req: Request, res: Response) => {
  try {
    const { vnp_ResponseCode, vnp_TxnRef, vnp_Amount } = req.query;
    const orderId = Number(vnp_TxnRef);

    const isValid = verifyPayment(req.query as Record<string, string>);
    if (!isValid) {
      const errorUrl = `${process.env.FRONTEND_URL}/orders/0?payment_status=INVALID_SIGNATURE`;
      res.redirect(errorUrl);
      return;
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true, items: true },
    });

    if (!order) {
      const errorUrl = `${process.env.FRONTEND_URL}/orders/0?payment_status=ORDER_NOT_FOUND`;
      res.redirect(errorUrl);
      return;
    }

    let paymentStatus: PaymentStatus;
    if (vnp_ResponseCode === '00') {
      paymentStatus = PaymentStatus.COMPLETED;
    } else if (vnp_ResponseCode === '24' || vnp_ResponseCode === '51' || vnp_ResponseCode === '65' || vnp_ResponseCode === '75') {
      paymentStatus = PaymentStatus.FAILED;
    } else {
      paymentStatus = PaymentStatus.FAILED;
    }

    const expectedAmount = order.totalPrice * 100;
    if (vnp_Amount && Number(vnp_Amount) !== expectedAmount) {
      paymentStatus = PaymentStatus.FAILED;
      logger.warn(`VNPay amount mismatch for order ${orderId}: expected ${expectedAmount}, got ${vnp_Amount}`);
    }

    await updatePaymentStatus(orderId, paymentStatus, vnp_TxnRef as string);

    if (paymentStatus === PaymentStatus.FAILED && order.status === OrderStatus.PENDING) {
      for (const item of order.items || []) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }
      await prisma.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.CANCELLED },
      });
    }

    void QueueService.addNotificationJob({
      userId: order.userId,
      message: paymentStatus === PaymentStatus.COMPLETED
        ? `Đơn hàng #${orderId} đã thanh toán thành công qua VNPay.`
        : `Đơn hàng #${orderId} thanh toán VNPay thất bại. Vui lòng thử lại.`,
      orderId,
    });

    await CacheService.delete(CacheKeys.ORDER_DETAIL(orderId));
    await CacheService.delete(CacheKeys.ORDER_LIST());
    void CacheService.deletePattern('products:*');

    const statusParam = paymentStatus === PaymentStatus.COMPLETED ? 'success' : 'failed';
    const redirectUrl = `${process.env.FRONTEND_URL}/orders/${orderId}?payment_status=${statusParam}`;
    res.redirect(redirectUrl);
  } catch (error) {
    logger.error('Error processing VNPay callback:', error);
    const errorUrl = `${process.env.FRONTEND_URL}/orders/0?payment_status=ERROR`;
    res.redirect(errorUrl);
  }
});

router.post('/:id/confirm-bank-transfer', authenticate, async (req: Request, res: Response) => {
  try {
    if (req.user!.role !== 'ADMIN') {
      res.apiError('Unauthorized', ErrorCodes.FORBIDDEN);
      return;
    }

    const orderId = Number(req.params.id);
    const { transactionId } = req.body;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });

    if (!order || !order.payment) {
      res.apiError('Order or payment not found', ErrorCodes.NOT_FOUND);
      return;
    }

    if (order.payment.method !== 'BANK_TRANSFER') {
      res.apiError('Order is not a bank transfer order', ErrorCodes.BAD_REQUEST);
      return;
    }

    if (order.payment.status !== PaymentStatus.PENDING) {
      res.apiError('Payment is not pending', ErrorCodes.BAD_REQUEST);
      return;
    }

    const payment = await prisma.payment.update({
      where: { orderId },
      data: {
        status: PaymentStatus.COMPLETED,
        paymentDate: new Date(),
        transactionId: transactionId || `BANK-${orderId}-${Date.now()}`,
      },
    });

    await CacheService.delete(CacheKeys.ORDER_DETAIL(orderId));
    await CacheService.delete(CacheKeys.ORDER_LIST());
    await CacheService.delete(CacheKeys.STATS());

    void QueueService.addNotificationJob({
      userId: order.userId,
      message: `Đơn hàng #${orderId} đã được xác nhận thanh toán chuyển khoản.`,
      orderId,
    });

    res.apiSuccess(payment, "Xác nhận thanh toán chuyển khoản thành công");
  } catch (error) {
    handleControllerError(res, error, "POST /api/orders/:id/confirm-bank-transfer");
  }
});

router.get('/updates', authenticateSSE, (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  res.write('data: {"type": "connected"}\n\n');

  const clientId = req.user!.id;
  clients.set(clientId, res);

  req.on('close', () => {
    clients.delete(clientId);
  });
});

router.get('/:id/delivery/logs', authenticate, async (req: Request, res: Response) => {
  try {
    const orderId = Number(req.params.id);
    const logs = await prisma.deliveryLog.findMany({
      where: { orderId },
      include: {
        delivery: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.apiSuccess(logs, "Lấy lịch sử giao hàng thành công");
  } catch (error) {
    handleControllerError(res, error, "GET /api/orders/:id/delivery/logs");
  }
});

router.get('/:id/delivery/rating', authenticate, ShipperController.getDeliveryRating);
router.post('/:id/delivery/rating', authenticate, ShipperController.createDeliveryRating);

export default router;
