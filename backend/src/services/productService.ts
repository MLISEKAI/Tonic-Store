import { PrismaClient, ProductStatus } from '@prisma/client';
const prisma = new PrismaClient();

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
  return prisma.product.update({
    where: { id },
    data,
    include: {
      category: true
    }
  });
};

export const deleteProduct = async (id: number) => {
  return prisma.product.delete({
    where: { id }
  });
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

export const updateSoldCount = async (productId: number, quantity: number) => {
  return prisma.product.update({
    where: { id: productId },
    data: {
      soldCount: {
        increment: quantity
      },
      stock: {
        decrement: quantity
      }
    }
  });
}; 