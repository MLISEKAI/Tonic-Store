import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCart = async (userId: number) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  });

  return cart?.items || [];
};

export const addToCart = async (userId: number, productId: number, quantity: number) => {
  let cart = await prisma.cart.findUnique({
    where: { userId }
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId }
    });
  }

  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId
    }
  });

  if (existingItem) {
    return prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity }
    });
  }

  return prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId,
      quantity
    }
  });
};

export const updateCartItem = async (userId: number, itemId: number, quantity: number) => {
  const cart = await prisma.cart.findUnique({
    where: { userId }
  });

  if (!cart) {
    throw new Error('Cart not found');
  }

  return prisma.cartItem.update({
    where: {
      id: itemId,
      cartId: cart.id
    },
    data: { quantity }
  });
};

export const removeFromCart = async (userId: number, itemId: number) => {
  const cart = await prisma.cart.findUnique({
    where: { userId }
  });

  if (!cart) {
    throw new Error('Cart not found');
  }

  return prisma.cartItem.delete({
    where: {
      id: itemId,
      cartId: cart.id
    }
  });
};

export const clearCart = async (userId: number) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) throw new Error("Cart not found");

  return prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });
};
