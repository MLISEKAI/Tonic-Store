import express from "express";
import type { Request, Response } from "express";
import { getAllUsers, deleteUser, getUserProfile, updateUserProfile, changeUserPassword, changeOwnPassword, updateUser } from "../services/userService";
import { authenticate, requireAdmin } from "../middleware/auth";
import logger from "../config/logger";

const router = express.Router();

router.get("/", authenticate, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await getAllUsers();
    res.json(users);
    return;
  } catch {
    logger.error('Failed to get users', { err: (error as Error).message });
    res.status(500).json({ error: "Lỗi khi lấy danh sách user" });
  }
});

router.delete("/:id", authenticate, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = Number(req.params.id);
    const force = req.query.force === 'true';
    const deletedBy = req.user?.id;

    if (force && deletedBy) {
      await deleteUser(userId, true, deletedBy);
      res.json({ message: "User đã bị xóa (force delete)" });
    } else {
      await deleteUser(userId, false);
      res.json({ message: "User đã bị xóa" });
    }
    return;
  } catch {
    console.error(error);
    if (error instanceof Error) {
      // Nếu lỗi liên quan đến các hồ sơ liên quan, trả về 400 với thông báo
      if (error.message.includes('Không thể xóa người dùng')) {
        res.status(400).json({ error: error.message });
        return;
      }
    }
    res.status(500).json({ error: "Lỗi khi xóa user" });
    return;
  }
});

// Get user profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const user = await getUserProfile(userId);
    res.json(user);
  } catch { logger.error('Error', { err: (error as Error).message }); res.status(500).json({ message: 'Error fetching user profile' });
  }
});

// Update user profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const updatedUser = await updateUserProfile(userId, req.body);
    res.json(updatedUser);
  } catch { logger.error('Error', { err: (error as Error).message }); res.status(500).json({ message: 'Error updating user profile' });
  }
});

// Admin changes user's password
router.put("/:id/password", authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword) {
      res.status(400).json({ error: "Mật khẩu mới là bắt buộc" });
      return;
    }

    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const updatedUser = await changeUserPassword(
      Number(req.params.id),
      req.user.id,
      newPassword
    );
    res.json(updatedUser);
  } catch { logger.error('Error', { err: (error as Error).message }); res.status(500).json({ error: "Lỗi khi thay đổi mật khẩu" });
  }
});

// User changes their own password
router.put("/profile/password", authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: "Mật khẩu hiện tại và mật khẩu mới là bắt buộc" });
      return;
    }

    const updatedUser = await changeOwnPassword(userId, currentPassword, newPassword);
    res.json(updatedUser);
  } catch {
    if (error instanceof Error && error.message === "Current password is incorrect") {
      res.status(400).json({ error: "Mật khẩu hiện tại không đúng" });
      return;
    }
    res.status(500).json({ error: "Lỗi khi thay đổi mật khẩu" });
  }
});

// Update user information (admin only)
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
    res.json(updatedUser);
  } catch { logger.error('Error', { err: 'internal error' }); res.status(500).json({ error: "Lỗi khi cập nhật user" });
  }
});

export default router;
