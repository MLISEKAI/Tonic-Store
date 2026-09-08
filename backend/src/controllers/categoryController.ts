import type { Request, Response } from 'express';
import { prisma } from '../prisma';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from '../services/categoryService';
import { handleControllerError, ErrorCodes } from '../common/types/api-response';
import { parsePageOptions, calculatePagination } from '../common/types/pagination';

export const getAllCategoriesController = async (req: Request, res: Response) => {
  try {
    const pagination = parsePageOptions(req.query);

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.category.count(),
    ]);

    const paginationMeta = calculatePagination(total, pagination.limit, pagination.page);
    res.apiSuccess(categories, "Lấy danh sách danh mục thành công", 200, paginationMeta);
  } catch (error) {
    handleControllerError(res, error, "getAllCategoriesController");
  }
};

export const getCategoryByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const category = await getCategoryById(id);
    if (!category) {
      res.apiError('Category not found', ErrorCodes.NOT_FOUND);
      return;
    }
    res.apiSuccess(category, "Lấy danh mục thành công");
  } catch (error) {
    handleControllerError(res, error, "getCategoryByIdController");
  }
};

export const createCategoryController = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) {
      res.apiError('Name is required', ErrorCodes.BAD_REQUEST);
      return;
    }
    const category = await createCategory(name);
    res.apiSuccess(category, "Tạo danh mục thành công", 201);
  } catch (error) {
    handleControllerError(res, error, "createCategoryController");
  }
};

export const updateCategoryController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { name } = req.body;
    if (!name) {
      res.apiError('Name is required', ErrorCodes.BAD_REQUEST);
      return;
    }
    const category = await updateCategory(id, name);
    res.apiSuccess(category, "Cập nhật danh mục thành công");
  } catch (error) {
    handleControllerError(res, error, "updateCategoryController");
  }
};

export const deleteCategoryController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await deleteCategory(id);
    res.apiSuccess(null, "Xóa danh mục thành công");
  } catch (error) {
    if (error instanceof Error && error.message === 'Cannot delete category with products') {
      res.apiError(error.message, ErrorCodes.BAD_REQUEST);
      return;
    }
    handleControllerError(res, error, "deleteCategoryController");
  }
};
