import { PrismaClient, Category } from '@prisma/client';
import { ICategoryRepository } from './interfaces/ICategoryRepository';

export class CategoryRepository implements ICategoryRepository {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }
  async getAllCategories(): Promise<any[]> {
    return this.prisma.category.findMany({
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
  }
  async getCategoryById(id: number): Promise<any> {
    return this.prisma.category.findUnique({
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
  }
  async createCategory(name: string): Promise<Category> {
    return this.prisma.category.create({ data: { name } });
  }
  async updateCategory(id: number, name: string): Promise<Category> {
    return this.prisma.category.update({ where: { id }, data: { name } });
  }
  async deleteCategory(id: number): Promise<Category> {
    return this.prisma.category.delete({ where: { id } });
  }
  async hasProducts(id: number): Promise<boolean> {
    const category = await this.prisma.category.findUnique({ where: { id }, include: { products: true } });
    return !!category && category.products.length > 0;
  }
} 