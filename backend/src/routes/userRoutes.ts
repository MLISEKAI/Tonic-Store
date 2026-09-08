import express from "express";
import type { Request, Response } from "express";
import { getAllUsers, getUserProfile, updateUserProfile, changeUserPassword, changeOwnPassword, updateUser, deleteUser } from "../services/userService";
import { authenticate, requireAdmin } from "../middleware/auth";
import { handleControllerError, ErrorCodes } from "../common/types/api-response";
import { parsePageOptions, sendPaginated } from "../common/types/pagination";

const router = express.Router();

router.get("/", authenticate, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const pageOptions = parsePageOptions(req.query);
    const search = pageOptions.search_text || '';

    const result = await getAllUsers({
      page: pageOptions.page,
      limit: pageOptions.limit,
      search,
    });

    sendPaginated(res, result, "Lấy danh sách users thành công");
  } catch (error) {
    handleControllerError(res, error, "GET /api/users");
  }
});

router.delete("/:id", authenticate, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = Number(req.params.id);
    const force = req.query.force === 'true';
    const deletedBy = req.user?.id;

    if (force && deletedBy) {
      await deleteUser(userId, true, deletedBy);
      res.apiSuccess({ forceDeleted: true }, "User đã bị xóa (force delete)");
    } else {
      await deleteUser(userId, false);
      res.apiSuccess(null, "User đã bị xóa");
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Không thể xóa người dùng')) {
      res.apiError(error.message, ErrorCodes.BAD_REQUEST);
      return;
    }
    handleControllerError(res, error, "DELETE /api/users/:id");
  }
});

router.get('/profile', authenticate, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.apiError('Unauthorized', ErrorCodes.UNAUTHORIZED);
      return;
    }
    const user = await getUserProfile(userId);
    res.apiSuccess(user, "Lấy thông tin user thành công");
  } catch (error) {
    handleControllerError(res, error, "GET /api/users/profile");
  }
});

router.put('/profile', authenticate, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.apiError('Unauthorized', ErrorCodes.UNAUTHORIZED);
      return;
    }
    const updatedUser = await updateUserProfile(userId, req.body);
    res.apiSuccess(updatedUser, "Cập nhật thông tin thành công");
  } catch (error) {
    handleControllerError(res, error, "PUT /api/users/profile");
  }
});

router.put("/:id/password", authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword) {
      res.apiError('Mật khẩu mới là bắt buộc', ErrorCodes.BAD_REQUEST);
      return;
    }

    if (!req.user) {
      res.apiError('Unauthorized', ErrorCodes.UNAUTHORIZED);
      return;
    }

    const updatedUser = await changeUserPassword(
      Number(req.params.id),
      req.user.id,
      newPassword
    );
    res.apiSuccess(updatedUser, "Đổi mật khẩu thành công");
  } catch (error) {
    handleControllerError(res, error, "PUT /api/users/:id/password");
  }
});

router.put("/profile/password", authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.apiError('Unauthorized', ErrorCodes.UNAUTHORIZED);
      return;
    }

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      res.apiError('Mật khẩu hiện tại và mật khẩu mới là bắt buộc', ErrorCodes.BAD_REQUEST);
      return;
    }

    const updatedUser = await changeOwnPassword(userId, currentPassword, newPassword);
    res.apiSuccess(updatedUser, "Đổi mật khẩu thành công");
  } catch (error) {
    if (error instanceof Error && error.message === "Current password is incorrect") {
      res.apiError('Mật khẩu hiện tại không đúng', ErrorCodes.BAD_REQUEST);
      return;
    }
    handleControllerError(res, error, "PUT /api/users/profile/password");
  }
});

router.put("/:id", authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { name, email, role, phone, address } = req.body;
    const updatedUser = await updateUser(Number(req.params.id), {
      name,
      email,
      role,
      phone,
      address
    });
    res.apiSuccess(updatedUser, "Cập nhật user thành công");
  } catch (error) {
    handleControllerError(res, error, "PUT /api/users/:id");
  }
});

export default router;
