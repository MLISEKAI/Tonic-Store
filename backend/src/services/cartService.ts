import prisma from '../prisma';

export const getCart = async (userId: number) => {
  try {
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

    if (!cart) {
      // Create a new cart if it doesn't exist
      const newCart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });
      return { items: newCart.items };
    }

    return { items: cart.items };
  } catch (error) {
    console.error('Error in getCart:', error);
    throw error;
  }
};

export const addToCart = async (userId: number, productId: number, quantity: number) => {
  try {
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
  } catch (error) {
    console.error('Error in addToCart:', error);
    throw error;
  }
};

export const updateCartItem = async (userId: number, itemId: number, quantity: number) => {
  try {
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
  } catch (error) {
    console.error('Error in updateCartItem:', error);
    throw error;
  }
};

export const removeFromCart = async (userId: number, itemId: number) => {
  try {
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
  } catch (error) {
    console.error('Error in removeFromCart:', error);
    throw error;
  }
};

export const clearCart = async (userId: number) => {
  try {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new Error("Cart not found");

    return prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
  } catch (error) {
    console.error('Error in clearCart:', error);
    throw error;
  }
};
