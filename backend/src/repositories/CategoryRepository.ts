import { prisma } from '../prisma';
import { BaseRepository } from './BaseRepository';

export class CategoryRepository extends BaseRepository<any> {
  constructor() {
    super(prisma.category);
  }

  async getAllCategories() {
    return this.model.findMany({
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

  async getCategoryById(id: number) {
    return this.model.findUnique({
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

  async hasProducts(id: number) {
    const category = await this.model.findUnique({ where: { id }, include: { products: true } });
    return !!category && category.products.length > 0;
  }

  async createCategory(name: string) {
    return this.model.create({ data: { name } });
  }

  async updateCategory(id: number, name: string) {
    return this.model.update({ where: { id }, data: { name } });
  }

  async deleteCategory(id: number) {
    return this.model.delete({ where: { id } });
  }
} 