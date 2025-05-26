import express, { Request, Response } from 'express';
import { authenticate } from '../middleware/auth';
import { createOrder, getOrder, updateOrderStatus, getAllOrders, cancelOrder } from '../services/orderService';
import { createPayment, updatePaymentStatus } from '../services/paymentService';
import { createPaymentUrl, verifyPayment } from '../services/vnpayService';
import { PaymentMethod, PaymentStatus, PrismaClient } from '@prisma/client';
import { ShipperController } from '../controllers/shipperController';

const router = express.Router();
const prisma = new PrismaClient();

// Store active SSE connections
export const clients = new Map<number, Response>();

// Get all orders (admin only)
router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    if (req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    const orders = await getAllOrders();
    res.json(orders);
  } catch (error) {
    console.error('Error getting orders:', error);
    res.status(500).json({ error: 'Failed to get orders' });
  }
});

// Update order status (admin only)
router.patch('/:id/status', authenticate, async (req: Request, res: Response) => {
  try {
    if (req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { status } = req.body;
    const order = await updateOrderStatus(Number(req.params.id), status);
    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Update payment status (admin only)
router.patch('/:id/payment', authenticate, async (req: Request, res: Response) => {
  try {
    if (req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { status, transactionId } = req.body;
    const payment = await updatePaymentStatus(Number(req.params.id), status, transactionId);
    res.json(payment);
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ error: 'Failed to update payment status' });
  }
});

// Xác nhận COD đã giao hàng (chỉ cho SHIPPER)
router.post('/:id/confirm-cod', authenticate, async (req: Request, res: Response) => {
  try {
    if (req.user!.role !== 'DELIVERY') {
      return res.status(403).json({ error: 'Permission denied' });
    }
    const orderId = Number(req.params.id);
    // Lấy order và payment
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true }
    });
    if (!order || !order.payment) {
      return res.status(404).json({ error: 'Order or payment not found' });
    }
    if (order.payment.method !== 'COD' || order.status !== 'DELIVERED') {
      return res.status(400).json({ error: 'Order is not eligible for COD confirmation' });
    }
    // Cập nhật trạng thái thanh toán
    const payment = await prisma.payment.update({
      where: { orderId },
      data: {
        status: 'COMPLETED',
        paymentDate: new Date()
      }
    });
    res.json(payment);
  } catch (error) {
    console.error('Error confirming COD payment:', error);
    res.status(500).json({ error: 'Failed to confirm COD payment' });
  }
});

// Hủy đơn hàng
router.patch('/:id/cancel', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const orderId = Number(req.params.id);

    const result = await cancelOrder(orderId, userId);
    if (!result.success) {
      return res.status(result.status || 500).json({ error: result.message });
    }

    res.json({ success: true, order: result.order });
  } catch (error) {
    console.error('Error canceling order:', error);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

// Get user's orders
router.get('/user', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } }, payment: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    console.error('Error getting user orders:', error);
    res.status(500).json({ error: 'Failed to get user orders' });
  }
});

// Create new order
router.post('/', authenticate, async (req: Request, res: Response) => {
  try {
    const { items, totalPrice, shippingAddress, shippingPhone, shippingName, note, paymentMethod } = req.body;
    const userId = req.user!.id;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items array is required and must not be empty' });
    }

    if (!totalPrice || typeof totalPrice !== 'number') {
      return res.status(400).json({ error: 'Total price is required and must be a number' });
    }

    if (!shippingAddress || !shippingPhone || !shippingName) {
      return res.status(400).json({ error: 'Shipping information is required' });
    }

    if (!paymentMethod) {
      return res.status(400).json({ error: 'Payment method is required' });
    }

    // Validate items structure
    for (const item of items) {
      if (!item.productId || !item.quantity || !item.price) {
        return res.status(400).json({ error: 'Each item must have productId, quantity, and price' });
      }
    }

    // Create order
    const order = await createOrder(
      userId,
      totalPrice,
      'PENDING',
      items,
      shippingAddress,
      shippingPhone,
      shippingName,
      note
    );

    // Create payment record
    const payment = await createPayment(
      order.id,
      paymentMethod as PaymentMethod,
      totalPrice
    );

    // If payment method is VNPay, create payment URL
    if (paymentMethod === 'VN_PAY') {
      const ipAddr = req.ip || '127.0.0.1';
      const paymentUrl = createPaymentUrl(order.id, totalPrice, ipAddr);
      return res.json({ order, paymentUrl });
    }

    res.json({ order });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get order by ID
router.get('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const order = await getOrder(Number(req.params.id));
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user is authorized to view this order
    if (order.userId !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error getting order:', error);
    res.status(500).json({ error: 'Failed to get order' });
  }
});

// VNPay payment callback
router.get('/vnpay/callback', async (req: Request, res: Response) => {
  try {
    const { vnp_ResponseCode, vnp_TxnRef } = req.query;
    const orderId = Number(vnp_TxnRef);

    // Verify payment
    const isValid = verifyPayment(req.query as Record<string, string>);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    // Update payment status based on response code
    let paymentStatus: PaymentStatus;
    if (vnp_ResponseCode === '00') {
      paymentStatus = PaymentStatus.COMPLETED;
    } else {
      paymentStatus = PaymentStatus.FAILED;
    }

    await updatePaymentStatus(orderId, paymentStatus, vnp_TxnRef as string);
    
    // Redirect to frontend success/failure page
    const redirectUrl = `${process.env.FRONTEND_URL}/orders/${orderId}?payment_status=${paymentStatus}`;
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Error processing VNPay callback:', error);
    res.status(500).json({ error: 'Failed to process payment callback' });
  }
});

// SSE endpoint for order updates
router.get('/updates', authenticate, (req: Request, res: Response) => {
  // Set headers for SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Send initial connection message
  res.write('data: {"type": "connected"}\n\n');

  // Store this client's connection
  const clientId = req.user!.id;
  clients.set(clientId, res);

  // Remove client when connection closes
  req.on('close', () => {
    clients.delete(clientId);
  });
});

// Get delivery logs for an order
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
    res.json(logs);
  } catch (error) {
    console.error('Error getting delivery logs:', error);
    res.status(500).json({ error: 'Failed to get delivery logs' });
  }
});

// Get delivery rating for an order
router.get('/:id/delivery/rating', authenticate, ShipperController.getDeliveryRating);

// Create delivery rating
router.post('/:id/delivery/rating', authenticate, ShipperController.createDeliveryRating);

export default router;