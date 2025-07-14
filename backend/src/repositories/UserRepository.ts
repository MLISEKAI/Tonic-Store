import { PrismaClient, User } from '@prisma/client';
import { IUserRepository } from './interfaces/IUserRepository';

export class UserRepository implements IUserRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id }
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email }
    });
  }

  async create(data: Partial<User>): Promise<User> {
    return this.prisma.user.create({
      data: data as any
    });
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data
    });
  }

  async delete(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: { id }
    });
  }

  async updatePassword(id: number, hashedPassword: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword }
    });
  }

  async findUsersWithSelect(select: any): Promise<any[]> {
    return this.prisma.user.findMany({
      select
    });
  }

  async findUserByIdWithSelect(id: number, select: any): Promise<any | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select
    });
  }

  async updateUserWithSelect(id: number, data: any, select: any): Promise<any> {
    return this.prisma.user.update({
      where: { id },
      data,
      select
    });
  }

  async createPasswordChangeLog(userId: number, adminId: number): Promise<any> {
    return this.prisma.passwordChangeLog.create({
      data: {
        userId,
        adminId,
      },
    });
  }

  async updateUserPasswordWithLog(userId: number, adminId: number, hashedPassword: string, select: any): Promise<any> {
    return this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
        select,
      }),
      this.prisma.passwordChangeLog.create({
        data: {
          userId,
          adminId,
        },
      }),
    ]);
  }
} 