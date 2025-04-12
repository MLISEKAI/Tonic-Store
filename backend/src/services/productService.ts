import prisma from "../prisma";

export const getAllProducts = async () => prisma.product.findMany();

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
  category: string
) => {
  return prisma.product.create({
    data: { name, description, price, stock, imageUrl, category },
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
    category?: string;
  }
) => {
  return prisma.product.update({
    where: { id },
    data,
  });
};

export const deleteProduct = async (id: number) => {
  return prisma.product.delete({
    where: { id },
  });
};
