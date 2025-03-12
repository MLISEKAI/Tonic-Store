import prisma from "../prisma";

// Lấy giỏ hàng của user
export const getCartByUserId = async (userId: number) => {
  return prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true } } },
  });
};

// Thêm sản phẩm vào giỏ hàng hoặc cập nhật số lượng
export const addToCart = async (userId: number, productId: number, quantity: number) => {
  // Kiểm tra giỏ hàng có tồn tại chưa, nếu chưa thì tạo mới
  let cart = await prisma.cart.findUnique({ where: { userId } });

  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }

  // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
  const existingItem = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId },
  });

  if (existingItem) {
    // Nếu đã có, cập nhật số lượng
    return prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: Math.max(1, existingItem.quantity + quantity) }, // Đảm bảo quantity >= 1
    });
  } else {
    // Nếu chưa có, thêm mới
    return prisma.cartItem.create({
      data: { cartId: cart.id, productId, quantity: Math.max(1, quantity) },
    });
  }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
export const updateCartItemQuantity = async (userId: number, productId: number, quantity: number) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) throw new Error("Cart not found");

  return prisma.cartItem.updateMany({
    where: { cartId: cart.id, productId },
    data: { quantity: Math.max(1, quantity) }, // Đảm bảo số lượng không dưới 1
  });
};

// Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = async (userId: number, productId: number) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) throw new Error("Cart not found");

  return prisma.cartItem.deleteMany({
    where: { cartId: cart.id, productId },
  });
};

// Xóa toàn bộ giỏ hàng
export const clearCart = async (userId: number) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) throw new Error("Cart not found");

  return prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });
};
