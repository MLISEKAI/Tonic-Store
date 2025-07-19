import { prisma } from '../prisma';
import { BaseRepository } from './BaseRepository';
import { User } from '@prisma/client';

export class UserRepository extends BaseRepository<any> {
  constructor() {
    super(prisma.user);
  }
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email }
    });
  }
  async updatePassword(id: number, hashedPassword: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { password: hashedPassword }
    });
  }

  async findUsersWithSelect(select: any): Promise<any[]> {
    return prisma.user.findMany({ select });
  }

  async findUserByIdWithSelect(id: number, select: any): Promise<any | null> {
    return prisma.user.findUnique({ where: { id }, select });
  }

  async updateUserWithSelect(id: number, data: any, select: any): Promise<any> {
    return prisma.user.update({ where: { id }, data, select });
  }

  async createPasswordChangeLog(userId: number, adminId: number): Promise<any> {
    return prisma.passwordChangeLog.create({
      data: {
        userId,
        adminId,
      },
    });
  }

  async updateUserPasswordWithLog(userId: number, adminId: number, hashedPassword: string, select: any): Promise<any> {
    return prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
        select,
      }),
      prisma.passwordChangeLog.create({
        data: {
          userId,
          adminId,
        },
      }),
    ]);
  }
} 