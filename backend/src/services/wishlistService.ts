import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Lấy danh sách sản phẩm yêu thích của user
export const getUserWishlist = async (userId: number) => {
  return prisma.wishlist.findMany({
    where: { userId },
    include: {
      product: {
        include: {
          category: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

// Thêm sản phẩm vào wishlist
export const addToWishlist = async (userId: number, productId: number) => {
  return prisma.wishlist.create({
    data: {
      userId,
      productId
    },
    include: {
      product: {
        include: {
          category: true
        }
      }
    }
  });
};

// Xóa sản phẩm khỏi wishlist
export const removeFromWishlist = async (userId: number, productId: number) => {
  return prisma.wishlist.delete({
    where: {
      userId_productId: {
        userId,
        productId
      }
    }
  });
};

// Kiểm tra xem sản phẩm có trong wishlist không
export const isInWishlist = async (userId: number, productId: number) => {
  const wishlistItem = await prisma.wishlist.findUnique({
    where: {
      userId_productId: {
        userId,
        productId
      }
    }
  });
  return !!wishlistItem;
}; 