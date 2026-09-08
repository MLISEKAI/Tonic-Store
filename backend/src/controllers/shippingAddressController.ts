import type { Request, Response } from 'express';
import * as shippingAddressService from '../services/shippingAddressService';
import { handleControllerError, ErrorCodes } from '../common/types/api-response';
import { parsePageOptions } from '../common/types/pagination';

export const getShippingAddresses = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
      res.apiError('Unauthorized', ErrorCodes.UNAUTHORIZED);
      return;
    }

    const pagination = parsePageOptions(req.query);

    if (userRole === 'ADMIN') {
      const { items, pagination: paginationMeta } = await shippingAddressService.getAllShippingAddresses({
        page: pagination.page,
        limit: pagination.limit,
      });
      res.apiSuccess(items, "Lấy danh sách địa chỉ thành công", 200, paginationMeta);
      return;
    }

    const { items, pagination: paginationMeta } = await shippingAddressService.getShippingAddresses(userId, {
      page: pagination.page,
      limit: pagination.limit,
    });
    res.apiSuccess(items, "Lấy danh sách địa chỉ thành công", 200, paginationMeta);
  } catch (error) {
    handleControllerError(res, error, "getShippingAddresses");
  }
};

export const getShippingAddress = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.apiError('Unauthorized', ErrorCodes.UNAUTHORIZED);
      return;
    }

    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.apiError('Invalid address ID', ErrorCodes.BAD_REQUEST);
      return;
    }

    const address = await shippingAddressService.getShippingAddress(id, userId);
    if (!address) {
      res.apiError('Address not found', ErrorCodes.NOT_FOUND);
      return;
    }

    res.apiSuccess(address, "Lấy địa chỉ thành công");
  } catch (error) {
    handleControllerError(res, error, "getShippingAddress");
  }
};

export const createShippingAddress = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.apiError('Unauthorized', ErrorCodes.UNAUTHORIZED);
      return;
    }

    const { name, phone, address, isDefault } = req.body;
    if (!name || !phone || !address) {
      res.apiError('Missing required fields', ErrorCodes.BAD_REQUEST);
      return;
    }

    const newAddress = await shippingAddressService.createShippingAddress(userId, {
      name,
      phone,
      address,
      isDefault
    });

    res.apiSuccess(newAddress, "Tạo địa chỉ thành công", 201);
  } catch (error) {
    handleControllerError(res, error, "createShippingAddress");
  }
};

export const updateShippingAddress = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.apiError('Unauthorized', ErrorCodes.UNAUTHORIZED);
      return;
    }

    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.apiError('Invalid address ID', ErrorCodes.BAD_REQUEST);
      return;
    }

    const { name, phone, address, isDefault } = req.body;
    const updatedAddress = await shippingAddressService.updateShippingAddress(id, userId, {
      name,
      phone,
      address,
      isDefault
    });

    res.apiSuccess(updatedAddress, "Cập nhật địa chỉ thành công");
  } catch (error) {
    handleControllerError(res, error, "updateShippingAddress");
  }
};

export const deleteShippingAddress = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.apiError('Unauthorized', ErrorCodes.UNAUTHORIZED);
      return;
    }

    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.apiError('Invalid address ID', ErrorCodes.BAD_REQUEST);
      return;
    }

    await shippingAddressService.deleteShippingAddress(id, userId);
    res.apiSuccess(null, "Xóa địa chỉ thành công");
  } catch (error) {
    handleControllerError(res, error, "deleteShippingAddress");
  }
};

export const setDefaultShippingAddress = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.apiError('Unauthorized', ErrorCodes.UNAUTHORIZED);
      return;
    }

    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.apiError('Invalid address ID', ErrorCodes.BAD_REQUEST);
      return;
    }

    const updatedAddress = await shippingAddressService.setDefaultShippingAddress(id, userId);
    res.apiSuccess(updatedAddress, "Đặt địa chỉ mặc định thành công");
  } catch (error) {
    handleControllerError(res, error, "setDefaultShippingAddress");
  }
};
