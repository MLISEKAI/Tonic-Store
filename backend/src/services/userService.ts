import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      address: true,
      createdAt: true,
    },
  });
};

export const deleteUser = async (id: number) => {
  await prisma.user.delete({ where: { id } });
};

export const getUserProfile = async (userId: number) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      address: true,
      createdAt: true,
    },
  });
};

export const updateUserProfile = async (userId: number, data: {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}) => {
  return prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      address: true,
      createdAt: true,
    },
  });
};
