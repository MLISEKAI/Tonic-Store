import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createReview = async (userId: number, productId: number, rating: number, comment?: string) => {
  return prisma.review.create({
    data: {
      userId,
      productId,
      rating,
      comment
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      product: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });
};

export const getProductReviews = async (productId: number) => {
  return prisma.review.findMany({
    where: { productId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

export const getUserReviews = async (userId: number) => {
  return prisma.review.findMany({
    where: { userId },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          imageUrl: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

export const updateReview = async (id: number, rating: number, comment?: string) => {
  return prisma.review.update({
    where: { id },
    data: {
      rating,
      comment
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      product: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });
};

export const deleteReview = async (id: number) => {
  return prisma.review.delete({
    where: { id }
  });
}; 