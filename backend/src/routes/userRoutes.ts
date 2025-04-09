import express, { Request, Response } from "express";
import { getAllUsers, deleteUser, getUserProfile, updateUserProfile } from "../services/userService";
import { authenticate } from "../middleware/auth";

const router = express.Router();

router.get("/", authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== "ADMIN") {
      res.status(403).json({ error: "Không có quyền truy cập" });
      return;
    }
    const users = await getAllUsers();
    res.json(users);
    return;
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy danh sách user" });
  }
});

router.delete("/:id", authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== "ADMIN") {
      res.status(403).json({ error: "Không có quyền xóa user" });
      return;
    }
    await deleteUser(Number(req.params.id));
    res.json({ message: "User đã bị xóa" });
    return;
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi xóa user" });
  }
});

// Get user profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const user = await getUserProfile(userId);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});

// Update user profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const updatedUser = await updateUserProfile(userId, req.body);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user profile' });
  }
});

export default router;
