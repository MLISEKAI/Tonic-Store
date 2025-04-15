import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

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

export const changeUserPassword = async (userId: number, adminId: number, newPassword: string) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  const [updatedUser, log] = await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        address: true,
        createdAt: true,
      },
    }),
    prisma.passwordChangeLog.create({
      data: {
        userId,
        adminId,
      },
    }),
  ]);

  return updatedUser;
};

export const changeOwnPassword = async (userId: number, currentPassword: string, newPassword: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error('User not found');
  }

  const isValidPassword = await bcrypt.compare(currentPassword, user.password);
  if (!isValidPassword) {
    throw new Error('Current password is incorrect');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  return prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
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

export const updateUser = async (id: number, data: {
  name?: string;
  email?: string;
  role?: string;
  phone?: string;
  address?: string;
}) => {
  return prisma.user.update({
    where: { id },
    data: {
      name: data.name,
      email: data.email,
      role: data.role as Role,
      phone: data.phone,
      address: data.address,
    },
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
