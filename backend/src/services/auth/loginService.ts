import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";
import { createRefreshToken } from '../../repositories/refreshTokenRepository';

const prisma = new PrismaClient();
const SECRET_KEY: jwt.Secret = config.jwt.secret || '';
const REFRESH_SECRET_KEY: jwt.Secret = config.jwt.refreshSecret || '';

export const loginUser = async (email: string, password: string, deviceInfo: string | null = null) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    // Tạo access token với thông tin tối thiểu
    const accessToken = jwt.sign(
      { id: user.id, role: user.role }, 
      SECRET_KEY, 
      { expiresIn: config.jwt.expiresIn as jwt.SignOptions["expiresIn"] }
    );

    // Tạo refresh token
    const refreshToken = jwt.sign(
      { id: user.id, role: user.role },
      REFRESH_SECRET_KEY,
      { expiresIn: config.jwt.refreshExpiresIn as jwt.SignOptions["expiresIn"] }
    );

    // TÍNH TOÁN expiresAt (lấy exp từ JWT hoặc parse lại cho chắc)
    const refreshExp = jwt.decode(refreshToken) as { exp: number } | null;
    if (refreshExp) {
      // XÓA CŨ TRƯỚC:
      await prisma.refreshToken.deleteMany({ where: { userId: user.id, deviceInfo } });
      await createRefreshToken(refreshToken, user.id, new Date(refreshExp.exp * 1000), deviceInfo);
    }

    // Create notification for user login (non-critical)
    try {
      await prisma.notification.create({
        data: {
          userId: user.id,
          message: `Bạn vừa đăng nhập từ một thiết bị mới. Nếu không phải bạn, hãy đổi mật khẩu ngay.`,
          isRead: false,
        },
      });
    } catch (notifyError) {
      console.warn('Login notification creation failed, continuing login flow:', notifyError);
    }

    // Trả về tokens và thông tin user (không bao gồm password)
    const { password: _, ...userWithoutPassword } = user;
    return { 
      accessToken, 
      refreshToken,
      user: userWithoutPassword
    };
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
