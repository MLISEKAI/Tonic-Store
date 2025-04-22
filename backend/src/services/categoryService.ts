import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAllCategories = async () => {
  return prisma.category.findMany({
    include: {
      products: {
        select: {
          id: true,
          name: true,
          price: true,
          imageUrl: true,
          status: true
        }
      }
    }
  });
};

export const getCategoryById = async (id: number) => {
  return prisma.category.findUnique({
    where: { id },
    include: {
      products: {
        select: {
          id: true,
          name: true,
          price: true,
          imageUrl: true,
          status: true
        }
      }
    }
  });
};

export const createCategory = async (name: string) => {
  return prisma.category.create({
    data: { name }
  });
};

export const updateCategory = async (id: number, name: string) => {
  return prisma.category.update({
    where: { id },
    data: { name }
  });
};

export const deleteCategory = async (id: number) => {
  // Kiểm tra xem category có sản phẩm nào không
  const category = await prisma.category.findUnique({
    where: { id },
    include: { products: true }
  });

  if (category && category.products.length > 0) {
    throw new Error('Cannot delete category with products');
  }

  return prisma.category.delete({
    where: { id }
  });
}; 