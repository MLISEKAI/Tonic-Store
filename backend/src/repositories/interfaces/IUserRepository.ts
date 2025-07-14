import { User } from '@prisma/client';

export interface IUserRepository {
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: Partial<User>): Promise<User>;
  update(id: number, data: Partial<User>): Promise<User>;
  delete(id: number): Promise<User>;
  updatePassword(id: number, hashedPassword: string): Promise<User>;
  findUsersWithSelect(select: any): Promise<any[]>;
  findUserByIdWithSelect(id: number, select: any): Promise<any | null>;
} 