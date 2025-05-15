import { Request, Response } from "express";
import { PrismaClient, OrderStatus } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { ParsedQs } from "qs";
import { createPaymentUrl } from "../services/vnpayService";

const prisma = new PrismaClient();

type PaymentMethod = "COD" | "VN_PAY" | "BANK_TRANSFER";
type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "CANCELED";
type LocalOrderStatus = "PENDING" | "COMPLETED" | "CANCELED";

interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
}

export const OrderController = {
  // Create new order
  async createOrder(req: Request, res: Response) {
    try {
      const {
        userId,
        items,
        shippingAddress,
        shippingPhone,
        shippingName,
        note,
        paymentMethod,
      } = req.body;

      // Validate input
      if (
        !userId ||
        !items ||
        !shippingAddress ||
        !shippingPhone ||
        !shippingName ||
        !paymentMethod
      ) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Calculate total price
      const totalPrice = items.reduce(
        (sum: number, item: OrderItem) => sum + item.price * item.quantity,
        0
      );

      // Create order
      const order = await prisma.order.create({
        data: {
          userId,
          totalPrice: Number(totalPrice),
          shippingAddress,
          shippingPhone,
          shippingName,
          note,
          status: "PENDING",
          items: {
            create: items.map((item: OrderItem) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      // Nếu phương thức thanh toán là COD, không cần tạo URL thanh toán
      if (paymentMethod === "COD") {
        return res.json({ success: true, order });
      }

      // Nếu là phương thức khác (ví dụ: VNPay), xử lý tiếp
      if (paymentMethod === "VN_PAY") {
        const paymentUrl = createPaymentUrl(order.id, totalPrice);
        return res.json({ success: true, order, paymentUrl });
      }

      return res.json({ success: true, order });
    } catch (error) {
      console.error("Error creating order:", error);
      return res.status(500).json({ error: "Failed to create order" });
    }
  },

  // Get order by ID
  async getOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const order = await prisma.order.findUnique({
        where: { id: Number(id) },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          payment: true,
          user: true,
          shipper: true,
        },
      });

      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to get order" });
    }
  },

  // Get cancel orders
  async cancelOrder(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      const { id } = req.params;
      const userId = req.user.id;

      // Tìm đơn hàng
      const order = await prisma.order.findUnique({
        where: { id: Number(id) },
      });

      if (!order) {
        return res
          .status(404)
          .json({ success: false, message: "Đơn hàng không tồn tại" });
      }

      // Kiểm tra quyền hủy đơn hàng
      if (order.userId !== userId) {
        return res
          .status(403)
          .json({
            success: false,
            message: "Bạn không có quyền hủy đơn hàng này",
          });
      }

      // Kiểm tra trạng thái đơn hàng (chỉ cho phép hủy nếu trạng thái là "PENDING")
      if (order.status !== "PENDING") {
        return res
          .status(400)
          .json({
            success: false,
            message: "Chỉ có thể hủy đơn hàng ở trạng thái PENDING",
          });
      }

      // Cập nhật trạng thái đơn hàng thành "CANCELED"
      const canceledOrder = await prisma.order.update({
        where: { id: Number(id) },
        data: { status: "CANCELLED" },
      });

      return res.json({ success: true, order: canceledOrder });
    } catch (error) {
      console.error("Error canceling order:", error);
      return res
        .status(500)
        .json({ success: false, message: "Không thể hủy đơn hàng" });
    }
  },

  // Get user's orders
  async getUserOrders(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const orders = await prisma.order.findMany({
        where: { userId: Number(userId) },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          payment: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to get user orders" });
    }
  },

  // Update order status
  async updateOrderStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const order = await prisma.order.update({
        where: { id: Number(id) },
        data: { status },
      });

      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to update order status" });
    }
  },

  // Update payment status
  async updatePaymentStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status, transactionId } = req.body;

      // Lấy thông tin order và payment
      const order = await prisma.order.findUnique({
        where: { id: Number(id) },
        include: { payment: true }
      });
      if (!order || !order.payment) {
        return res.status(404).json({ error: 'Order or payment not found' });
      }

      // Kiểm tra quyền
      const isAdminOrUser = req.user?.role === 'ADMIN' || req.user?.role === 'USER';
      const isShipperCOD = req.user?.role === 'DELIVERY' && order.payment.method === 'COD' && order.status === 'DELIVERED';
      if (!isAdminOrUser && !isShipperCOD) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const payment = await prisma.payment.update({
        where: { orderId: Number(id) },
        data: {
          status,
          transactionId,
          paymentDate: status === 'COMPLETED' ? new Date() : undefined,
        },
      });

      res.json(payment);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update payment status' });
    }
  },

  // Get all orders (admin)
  async getAllOrders(req: Request, res: Response) {
    try {
      const { status, page = 1, limit = 10 } = req.query;

      const where = status ? { status: status as OrderStatus } : {};

      const [orders, total] = await Promise.all([
        prisma.order.findMany({
          where,
          include: {
            items: {
              include: {
                product: true,
              },
            },
            payment: true,
            user: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          skip: (Number(page) - 1) * Number(limit),
          take: Number(limit),
        }),
        prisma.order.count({ where }),
      ]);

      res.json({
        orders,
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to get orders" });
    }
  },
};
