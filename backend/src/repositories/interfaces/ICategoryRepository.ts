import { Category } from '@prisma/client';

export interface ICategoryRepository {
  getAllCategories(): Promise<any[]>;
  getCategoryById(id: number): Promise<any>;
  createCategory(name: string): Promise<Category>;
  updateCategory(id: number, name: string): Promise<Category>;
  deleteCategory(id: number): Promise<Category>;
  hasProducts(id: number): Promise<boolean>;
} 