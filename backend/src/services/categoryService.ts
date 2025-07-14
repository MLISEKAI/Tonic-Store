import { CategoryRepository } from '../repositories';

const categoryRepository = new CategoryRepository();

export const getAllCategories = async () => {
  return categoryRepository.getAllCategories();
};

export const getCategoryById = async (id: number) => {
  return categoryRepository.getCategoryById(id);
};

export const createCategory = async (name: string) => {
  return categoryRepository.createCategory(name);
};

export const updateCategory = async (id: number, name: string) => {
  return categoryRepository.updateCategory(id, name);
};

export const deleteCategory = async (id: number) => {
  const hasProducts = await categoryRepository.hasProducts(id);
  if (hasProducts) {
    throw new Error('Cannot delete category with products');
  }
  return categoryRepository.deleteCategory(id);
}; 