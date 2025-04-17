import { PrismaClient, OrderStatus, Prisma } from '@prisma/client';
const prisma = new PrismaClient();

export const getAllOrders = async () => {
  return prisma.order.findMany({
    include: { user: true, items: true, payment: true },
  });
};

export const getOrder = async (id: number) => {
  return prisma.order.findUnique({
    where: { id },
    include: { user: true, items: { include: { product: true } }, payment: true },
  });
};

export const createOrder = async (
  userId: number,
  totalPrice: number,
  status: string,
  items: Array<{ productId: number; quantity: number; price: number }>,
  shippingAddress: string,
  shippingPhone: string,
  shippingName: string,
  note?: string
) => {
  try {
    console.log('Creating order with data:', {
      userId,
      totalPrice,
      status,
      items,
      shippingAddress,
      shippingPhone,
      shippingName,
      note
    });

    const orderData: Prisma.OrderUncheckedCreateInput = {
      userId,
      totalPrice,
      status: status as OrderStatus,
      shippingAddress,
      shippingPhone,
      shippingName,
      note,
      items: {
        create: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    };

    console.log('Order data prepared:', orderData);

    const order = await prisma.order.create({
      data: orderData,
      include: { items: { include: { product: true } }, payment: true },
    });

    console.log('Order created successfully:', order);
    return order;
  } catch (error) {
    console.error('Error in createOrder:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('Prisma error code:', error.code);
      console.error('Prisma error meta:', error.meta);
    }
    throw error;
  }
};

export const updateOrderStatus = async (id: number, status: string) => {
  return prisma.order.update({
    where: { id },
    data: { status: status as OrderStatus },
    include: { items: { include: { product: true } }, payment: true },
  });
};
