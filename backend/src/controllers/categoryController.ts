import type { Request, Response } from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from '../services/categoryService';

export const getAllCategoriesController = async (_req: Request, res: Response) => {
  try {
    const categories = await getAllCategories();
    res.json(categories);
  } catch { logger.error('Error', { err: (error as Error).message }); res.status(500).json({ error: 'Failed to get categories' });
  }
};

export const getCategoryByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const category = await getCategoryById(id);
    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }
    res.json(category);
  } catch { logger.error('Error', { err: (error as Error).message }); res.status(500).json({ error: 'Failed to get category' });
  }
};

export const createCategoryController = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }
    const category = await createCategory(name);
    res.status(201).json(category);
  } catch { logger.error('Error', { err: (error as Error).message }); res.status(500).json({ error: 'Failed to create category' });
  }
};

export const updateCategoryController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { name } = req.body;
    if (!name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }
    const category = await updateCategory(id, name);
    res.json(category);
  } catch { logger.error('Error', { err: (error as Error).message }); res.status(500).json({ error: 'Failed to update category' });
  }
};

export const deleteCategoryController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await deleteCategory(id);
    res.json({ message: 'Category deleted successfully' });
  } catch {
    if (error instanceof Error && error.message === 'Cannot delete category with products') {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Failed to delete category' });
  }
};
