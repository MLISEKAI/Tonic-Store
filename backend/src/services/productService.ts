import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAllProducts = async (categoryName?: string) => {
  if (categoryName) {
    const category = await prisma.category.findFirst({
      where: {
        name: categoryName
      }
    });

    if (!category) {
      return [];
    }

    return prisma.product.findMany({
      where: {
        categoryId: category.id
      },
      include: {
        category: true
      }
    });
  }

  return prisma.product.findMany({
    include: {
      category: true
    }
  });
};

export const getProductById = async (id: number) => {
  return prisma.product.findUnique({
    where: { id }
  });
};

export const createProduct = async (
  name: string,
  description: string,
  price: number,
  stock: number,
  imageUrl: string,
  categoryId: number
) => {
  return prisma.product.create({
    data: {
      name,
      description,
      price,
      stock,
      imageUrl,
      categoryId
    }
  });
};

export const updateProduct = async (
  id: number,
  data: {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    imageUrl?: string;
    categoryId?: number;
  }
) => {
  return prisma.product.update({
    where: { id },
    data
  });
};

export const deleteProduct = async (id: number) => {
  await prisma.cartItem.deleteMany({
    where: {
      productId: id,
    },
  });
  return prisma.product.delete({
    where: { id }
  });
}; 