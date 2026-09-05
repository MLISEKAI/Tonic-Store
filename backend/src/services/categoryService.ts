import { CategoryRepository } from '../repositories';
import { CacheService, CacheKeys } from './cache.service';

const categoryRepository = new CategoryRepository();

export const getAllCategories = async () => {
  const cached = await CacheService.get(CacheKeys.CATEGORY_LIST());
  if (cached) return cached;

  const categories = await categoryRepository.getAllCategories();
  await CacheService.set(CacheKeys.CATEGORY_LIST(), categories, 600);
  return categories;
};

export const getCategoryById = async (id: number) => {
  const cacheKey = CacheKeys.CATEGORY_DETAIL(id);
  const cached = await CacheService.get(cacheKey);
  if (cached) return cached;

  const category = await categoryRepository.getCategoryById(id);
  if (category) {
    await CacheService.set(cacheKey, category, 600);
  }
  return category;
};

export const createCategory = async (name: string) => {
  const category = await categoryRepository.create({ name });
  await CacheService.delete(CacheKeys.CATEGORY_LIST());
  return category;
};

export const updateCategory = async (id: number, name: string) => {
  const category = await categoryRepository.update(id, { name });
  await CacheService.delete(CacheKeys.CATEGORY_LIST());
  await CacheService.delete(CacheKeys.CATEGORY_DETAIL(id));
  return category;
};

export const deleteCategory = async (id: number) => {
  const hasProducts = await categoryRepository.hasProducts(id);
  if (hasProducts) {
    throw new Error('Cannot delete category with products');
  }
  const result = await categoryRepository.delete(id);
  await CacheService.delete(CacheKeys.CATEGORY_LIST());
  await CacheService.delete(CacheKeys.CATEGORY_DETAIL(id));
  return result;
};