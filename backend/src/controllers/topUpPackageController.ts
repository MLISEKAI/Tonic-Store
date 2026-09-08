import { TopUpPackageRepository } from '../repositories/TopUpPackageRepository';
import { prisma } from '../prisma';
import {
  getAllTopUpPackages,
  getActiveTopUpPackages,
  getTopUpPackageById,
  createTopUpPackage,
  updateTopUpPackage,
  deleteTopUpPackage,
} from '../services/topUpPackageService';
import type { Request, Response } from 'express';
import { handleControllerError, ErrorCodes } from '../common/types/api-response';
import { parsePageOptions, calculatePagination } from '../common/types/pagination';

const topUpPackageRepository = new TopUpPackageRepository();

export const getAllTopUpPackagesController = async (req: Request, res: Response) => {
  try {
    const pagination = parsePageOptions(req.query);

    const [packages, total] = await Promise.all([
      prisma.topUpPackage.findMany({
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.topUpPackage.count(),
    ]);

    const paginationMeta = calculatePagination(total, pagination.limit, pagination.page);
    res.apiSuccess(packages, "Lấy danh sách gói nạp tiền thành công", 200, paginationMeta);
  } catch (error) {
    handleControllerError(res, error, "getAllTopUpPackagesController");
  }
};

export const getActiveTopUpPackagesController = async (req: Request, res: Response) => {
  try {
    const pagination = parsePageOptions(req.query);

    const [packages, total] = await Promise.all([
      prisma.topUpPackage.findMany({
        where: { isActive: true },
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.topUpPackage.count({ where: { isActive: true } }),
    ]);

    const paginationMeta = calculatePagination(total, pagination.limit, pagination.page);
    res.apiSuccess(packages, "Lấy danh sách gói nạp tiền đang hoạt động thành công", 200, paginationMeta);
  } catch (error) {
    handleControllerError(res, error, "getActiveTopUpPackagesController");
  }
};

export const getTopUpPackageByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const pkg = await getTopUpPackageById(id);
    if (!pkg) {
      res.apiError('Top-up package not found', ErrorCodes.NOT_FOUND);
      return;
    }
    res.apiSuccess(pkg, "Lấy gói nạp tiền thành công");
  } catch (error) {
    handleControllerError(res, error, "getTopUpPackageByIdController");
  }
};

export const createTopUpPackageController = async (req: Request, res: Response) => {
  try {
    const pkg = await createTopUpPackage(req.body);
    res.apiSuccess(pkg, "Tạo gói nạp tiền thành công", 201);
  } catch (error) {
    handleControllerError(res, error, "createTopUpPackageController");
  }
};

export const updateTopUpPackageController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const pkg = await updateTopUpPackage(id, req.body);
    res.apiSuccess(pkg, "Cập nhật gói nạp tiền thành công");
  } catch (error) {
    handleControllerError(res, error, "updateTopUpPackageController");
  }
};

export const deleteTopUpPackageController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await deleteTopUpPackage(id);
    res.apiSuccess(null, "Xóa gói nạp tiền thành công");
  } catch (error) {
    handleControllerError(res, error, "deleteTopUpPackageController");
  }
};
