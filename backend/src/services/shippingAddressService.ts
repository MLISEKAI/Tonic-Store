import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getShippingAddresses = async (userId: number) => {
  return prisma.shippingAddress.findMany({
    where: { userId },
    orderBy: { isDefault: 'desc' }
  });
};

export const getShippingAddress = async (id: number, userId: number) => {
  return prisma.shippingAddress.findFirst({
    where: { id, userId }
  });
};

export const createShippingAddress = async (userId: number, data: {
  name: string;
  phone: string;
  address: string;
  isDefault?: boolean;
}) => {
  // If this is set as default, unset all other defaults
  if (data.isDefault) {
    await prisma.shippingAddress.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false }
    });
  }

  return prisma.shippingAddress.create({
    data: {
      ...data,
      userId
    }
  });
};

export const updateShippingAddress = async (id: number, userId: number, data: {
  name?: string;
  phone?: string;
  address?: string;
  isDefault?: boolean;
}) => {
  // If this is set as default, unset all other defaults
  if (data.isDefault) {
    await prisma.shippingAddress.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false }
    });
  }

  return prisma.shippingAddress.update({
    where: { id },
    data
  });
};

export const deleteShippingAddress = async (id: number, userId: number) => {
  return prisma.shippingAddress.delete({
    where: { id }
  });
};

export const setDefaultShippingAddress = async (id: number, userId: number) => {
  // First unset all defaults
  await prisma.shippingAddress.updateMany({
    where: { userId, isDefault: true },
    data: { isDefault: false }
  });

  // Then set the new default
  return prisma.shippingAddress.update({
    where: { id },
    data: { isDefault: true }
  });
}; 