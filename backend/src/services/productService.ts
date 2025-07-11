import { PrismaClient, ProductStatus } from '@prisma/client';
const prisma = new PrismaClient();

// Cooldown mechanism to prevent spamming flash sale notifications
let lastFlashSaleNotificationSent = 0;
const NOTIFICATION_COOLDOWN = 60 * 60 * 1000; // 1 hour in milliseconds

export const getAllProducts = async (categoryName?: string, filters?: {
  status?: ProductStatus;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  minPrice?: number;
  maxPrice?: number;
}) => {
  const where: any = {};

  if (categoryName) {
    const category = await prisma.category.findFirst({
      where: { name: categoryName }
    });
    if (category) {
      where.categoryId = category.id;
    }
  }

  if (filters) {
    if (filters.status) where.status = filters.status;
    if (filters.isFeatured !== undefined) where.isFeatured = filters.isFeatured;
    if (filters.isNew !== undefined) where.isNew = filters.isNew;
    if (filters.isBestSeller !== undefined) where.isBestSeller = filters.isBestSeller;
    if (filters.minPrice !== undefined) where.price = { gte: filters.minPrice };
    if (filters.maxPrice !== undefined) where.price = { ...where.price, lte: filters.maxPrice };
  }

  return prisma.product.findMany({
    where,
    include: {
      category: true,
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }
    }
  });
};

export const getProductById = async (id: number) => {
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }
    }
  });
};

export const createProduct = async (data: {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  imageUrl?: string;
  sku?: string;
  barcode?: string;
  weight?: number;
  dimensions?: string;
  material?: string;
  origin?: string;
  warranty?: string;
  status?: ProductStatus;
  seoTitle?: string;
  seoDescription?: string;
  seoUrl?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
}) => {
  return prisma.product.create({
    data,
    include: {
      category: true
    }
  });
};

export const updateProduct = async (id: number, data: {
  name?: string;
  description?: string;
  price?: number;
  promotionalPrice?: number;
  stock?: number;
  categoryId?: number;
  imageUrl?: string;
  sku?: string;
  barcode?: string;
  weight?: number;
  dimensions?: string;
  material?: string;
  origin?: string;
  warranty?: string;
  status?: ProductStatus;
  seoTitle?: string;
  seoDescription?: string;
  seoUrl?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
}) => {
  // If stock is being updated, check if we need to update status
  if (data.stock !== undefined) {
    data.status = data.stock <= 0 ? 'OUT_OF_STOCK' : 'ACTIVE';
  }

  return prisma.product.update({
    where: { id },
    data,
    include: {
      category: true
    }
  });
};

export const deleteProduct = async (id: number) => {
  try {
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        reviews: true,
        orderItems: true,
        wishlist: true,
        cartItems: true
      }
    });

    if (!product) {
      throw new Error('Product not found');
    }

    // Delete related records first
    await prisma.$transaction([
      // Delete cart items
      prisma.cartItem.deleteMany({
        where: { productId: id }
      }),
      // Delete reviews
      prisma.review.deleteMany({
        where: { productId: id }
      }),
      // Delete order items
      prisma.orderItem.deleteMany({
        where: { productId: id }
      }),
      // Delete wishlist items
      prisma.wishlist.deleteMany({
        where: { productId: id }
      }),
      // Finally delete the product
      prisma.product.delete({
        where: { id }
      })
    ]);

    return product;
  } catch (error) {
    console.error('Error deleting product:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to delete product');
  }
};

export const updateProductStatus = async (id: number, status: ProductStatus) => {
  return prisma.product.update({
    where: { id },
    data: { status },
    include: {
      category: true
    }
  });
};

export const updateProductRating = async (productId: number) => {
  const reviews = await prisma.review.findMany({
    where: { productId }
  });

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

  return prisma.product.update({
    where: { id: productId },
    data: {
      rating: averageRating,
      reviewCount: reviews.length
    }
  });
};

export const searchProducts = async (query: string) => {
  return prisma.product.findMany({
    where: {
      OR: [
        {
          name: {
            contains: query
          }
        },
        {
          description: {
            contains: query
          }
        },
        {
          seoUrl: {
            contains: query
          }
        }
      ]
    },
    include: {
      category: true
    }
  });
};

export const getProductBySeoUrl = async (seoUrl: string) => {
  return prisma.product.findUnique({
    where: { seoUrl },
    include: {
      category: true,
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }
    }
  });
};

export const incrementViewCount = async (productId: number) => {
  return prisma.product.update({
    where: { id: productId },
    data: {
      viewCount: {
        increment: 1
      }
    }
  });
};

export const checkAndUpdateStock = async (productId: number, quantity: number) => {
  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product) {
    throw new Error('Product not found');
  }

  if (product.stock < quantity) {
    throw new Error(`Only ${product.stock} items available in stock`);
  }

  return product;
};

export const updateSoldCount = async (productId: number, quantity: number) => {
  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product) {
    throw new Error('Product not found');
  }

  const newStock = product.stock - quantity;
  const newStatus = newStock <= 0 ? 'OUT_OF_STOCK' : 'ACTIVE';

  return prisma.product.update({
    where: { id: productId },
    data: {
      stock: newStock,
      soldCount: {
        increment: quantity
      },
      status: newStatus
    }
  });
};

export const getFlashSaleProducts = async () => {
  try {
    console.log('Starting getFlashSaleProducts...');
    
    const products = await prisma.product.findMany({
      where: {
        AND: [
          { status: 'ACTIVE' },
          { promotionalPrice: { not: null } },
          { promotionalPrice: { gt: 0 } }
        ]
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        promotionalPrice: true,
        stock: true,
        imageUrl: true,
        status: true,
        category: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('Found products:', products.length);
    if (products.length > 0) {
      console.log('First product sample:', {
        id: products[0].id,
        name: products[0].name,
        price: products[0].price,
        promotionalPrice: products[0].promotionalPrice,
        status: products[0].status
      });
    }

    // Create notification for all users about the flash sale, with a cooldown
    const now = Date.now();
    if (products.length > 0 && (now - lastFlashSaleNotificationSent > NOTIFICATION_COOLDOWN)) {
      const users = await prisma.user.findMany({
        select: { id: true },
      });

      if (users.length > 0) {
        const notificationData = users.map((user) => ({
          userId: user.id,
          message: `Flash Sale đang diễn ra! Hãy nhanh tay mua sắm.`,
          isRead: false,
        }));

        await prisma.notification.createMany({
          data: notificationData,
        });

        // Update the timestamp after sending notifications
        lastFlashSaleNotificationSent = now;
        console.log(`Flash sale notifications sent at ${new Date(now).toISOString()}`);
      }
    }
    
    return products;
  } catch (error) {
    console.error('Detailed error in getFlashSaleProducts:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw new Error('Failed to get flash sale products');
  }
};

export const getNewestProducts = async (limit: number = 8) => {
  try {
    console.log('Starting getNewestProducts with limit:', limit);
    
    const products = await prisma.product.findMany({
      where: {
        status: 'ACTIVE',
        isNew: true
      },
      include: {
        category: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    });

    console.log('Found newest products:', products.length);
    if (products.length > 0) {
      console.log('First product sample:', {
        id: products[0].id,
        name: products[0].name,
        isNew: products[0].isNew,
        status: products[0].status
      });
    }

    return products;
  } catch (error) {
    console.error('Detailed error in getNewestProducts:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      code: error instanceof Error ? (error as any).code : undefined,
      meta: error instanceof Error ? (error as any).meta : undefined
    });
    throw new Error('Failed to get newest products');
  }
};

export const getBestSellingProducts = async (limit: number = 8) => {
  try {
    console.log('Starting getBestSellingProducts with limit:', limit);
    
    // First check if we can connect to the database
    try {
      await prisma.$queryRaw`SELECT 1`;
      console.log('Database connection successful');
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      throw new Error('Database connection failed');
    }
    
    const products = await prisma.product.findMany({
      where: {
        status: 'ACTIVE',
        isBestSeller: true
      },
      include: {
        category: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        soldCount: 'desc'
      },
      take: limit
    });

    console.log('Found best selling products:', products.length);
    if (products.length > 0) {
      console.log('First product sample:', {
        id: products[0].id,
        name: products[0].name,
        isBestSeller: products[0].isBestSeller,
        soldCount: products[0].soldCount,
        status: products[0].status
      });
    }

    return products;
  } catch (error) {
    console.error('Detailed error in getBestSellingProducts:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      code: error instanceof Error ? (error as any).code : undefined,
      meta: error instanceof Error ? (error as any).meta : undefined
    });
    throw new Error('Failed to get best selling products');
  }
}; 