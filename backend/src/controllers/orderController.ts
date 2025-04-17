import { Request, Response } from 'express';
import { PrismaClient, OrderStatus, PaymentMethod, PaymentStatus } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { ParsedQs } from 'qs';

const prisma = new PrismaClient();

interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
}

export const OrderController = {
  // Create new order
  async createOrder(req: Request, res: Response) {
    try {
      const { userId, items, shippingAddress, shippingPhone, shippingName, note, paymentMethod } = req.body;

      // Validate input
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Order must contain at least one item' });
      }

      if (!shippingAddress || !shippingPhone || !shippingName) {
        return res.status(400).json({ error: 'Shipping information is required' });
      }

      if (!paymentMethod) {
        return res.status(400).json({ error: 'Payment method is required' });
      }

      // Calculate total price and validate items
      let totalPrice = 0;
      const validatedItems: OrderItem[] = [];

      try {
        for (const item of items) {
          if (!item.productId || !item.quantity || !item.price) {
            return res.status(400).json({ error: 'Invalid item data. Product ID, quantity and price are required' });
          }

          // Verify product exists and has sufficient stock
          const product = await prisma.product.findUnique({
            where: { id: item.productId }
          });

          if (!product) {
            return res.status(400).json({ error: `Product with id ${item.productId} not found` });
          }

          if (product.stock < item.quantity) {
            return res.status(400).json({ 
              error: `Insufficient stock for product ${product.name}`,
              productId: product.id,
              availableStock: product.stock,
              requestedQuantity: item.quantity
            });
          }

          const itemPrice = Number(item.price);
          totalPrice += itemPrice * item.quantity;
          validatedItems.push({
            productId: product.id,
            quantity: item.quantity,
            price: itemPrice
          });
        }
      } catch (error) {
        console.error('Error validating products:', error);
        return res.status(500).json({ 
          error: 'Error validating products',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }

      // Create order in a transaction to ensure consistency
      try {
        console.log('Creating order with data:', {
          userId,
          totalPrice,
          shippingAddress,
          shippingPhone,
          shippingName,
          note,
          paymentMethod,
          items: validatedItems
        });

        const order = await prisma.$transaction(async (prisma) => {
          try {
            // Create the order
            const newOrder = await prisma.order.create({
              data: {
                userId,
                totalPrice: Number(totalPrice),
                shippingAddress,
                shippingPhone,
                shippingName,
                note,
                status: OrderStatus.PENDING,
                items: {
                  create: validatedItems.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price
                  }))
                }
              },
              include: {
                items: {
                  include: {
                    product: true
                  }
                }
              }
            });

            console.log('Order created successfully:', newOrder);

            // Create payment separately
            const payment = await prisma.payment.create({
              data: {
                orderId: newOrder.id,
                method: PaymentMethod.COD,
                status: PaymentStatus.PENDING,
                amount: Number(totalPrice),
                currency: 'VND'
              }
            });

            console.log('Payment created successfully:', payment);

            // Update product stock
            for (const item of validatedItems) {
              try {
                await prisma.product.update({
                  where: { id: item.productId },
                  data: {
                    stock: {
                      decrement: item.quantity
                    }
                  }
                });
                console.log(`Updated stock for product ${item.productId}`);
              } catch (error) {
                console.error(`Error updating stock for product ${item.productId}:`, error);
                throw error;
              }
            }

            return newOrder;
          } catch (error) {
            console.error('Error in transaction:', error);
            throw error;
          }
        });

        return res.status(201).json(order);
      } catch (error) {
        console.error('Error in order creation transaction:', error);
        if (error instanceof Error) {
          console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
          });
        }
        return res.status(500).json({ 
          error: 'Failed to create order',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    } catch (error) {
      console.error('Unexpected error in createOrder:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
      }
      return res.status(500).json({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
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
              product: true
            }
          },
          payment: true,
          user: true
        }
      });

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      res.json(order);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get order' });
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
              product: true
            }
          },
          payment: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get user orders' });
    }
  },

  // Update order status
  async updateOrderStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const order = await prisma.order.update({
        where: { id: Number(id) },
        data: { status }
      });

      res.json(order);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update order status' });
    }
  },

  // Update payment status
  async updatePaymentStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status, transactionId } = req.body;

      const payment = await prisma.payment.update({
        where: { orderId: Number(id) },
        data: {
          status,
          transactionId,
          paymentDate: status === 'COMPLETED' ? new Date() : undefined
        }
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
                product: true
              }
            },
            payment: true,
            user: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          skip: (Number(page) - 1) * Number(limit),
          take: Number(limit)
        }),
        prisma.order.count({ where })
      ]);

      res.json({
        orders,
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get orders' });
    }
  }
}; 