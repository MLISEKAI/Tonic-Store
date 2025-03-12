import prisma from "../prisma";

export const getCartByUserId = async (userId: number) => {
  return prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true } } },
  });
};

export const addToCart = async (userId: number, productId: number, quantity: number) => {
  let cart = await prisma.cart.findUnique({ where: { userId } });

  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }

  const existingItem = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId },
  });

  return existingItem
    ? prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      })
    : prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity },
      });
};

export const updateCartItemQuantity = async (userId: number, productId: number, quantity: number) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) throw new Error("Cart not found");

  return prisma.cartItem.updateMany({
    where: { cartId: cart.id, productId },
    data: { quantity },
  });
};

export const removeFromCart = async (userId: number, productId: number) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) throw new Error("Cart not found");

  return prisma.cartItem.deleteMany({
    where: { cartId: cart.id, productId },
  });
};

export const clearCart = async (userId: number) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) throw new Error("Cart not found");

  return prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });
};
