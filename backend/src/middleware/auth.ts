// KIỂM TRA XÁC THỰC JWT TRONG BACKEND
import type { Request, Response, NextFunction } from "express";
import jwt, { SignOptions, Secret } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import config from "../config";
import { findRefreshToken, hashToken, revokeRefreshToken } from '../repositories/refreshTokenRepository';

const prisma = new PrismaClient();
const SECRET_KEY: Secret = config.jwt.secret as Secret;
const REFRESH_SECRET_KEY: Secret = config.jwt.refreshSecret as Secret;

// Định nghĩa kiểu mở rộng của Request
declare module "express-serve-static-core" {
  interface Request {
    user?: { id: number; role: string };
  }
}

// Hàm dùng chung: trích xuất token
const extractToken = (req: Request): string | null => {
  // Ưu tiên kiểm tra token trong cookie.
  if (req.cookies?.access_token) return req.cookies.access_token;
  // Nếu không tìm thấy trong cookie, kiểm tra header Authorization.
  if (req.headers.authorization?.startsWith("Bearer "))
  // Lấy token từ header Authorization: Bearer <token>
    return req.headers.authorization.split(" ")[1];
  // Kiểm tra token trong query string.
  if (typeof req.query.token === "string") return req.query.token;
  // Trả về null nếu không tìm thấy token.
  return null;
};

// Kiểm tra token có trong blacklist không
const isTokenBlacklisted = async (token: string): Promise<boolean> => {
  if (!config.jwt.blacklistEnabled) return false;
  
  try {
    const hashed = hashToken(token);
    const blacklistedToken = await prisma.tokenBlacklist.findUnique({
      where: { token: hashed }
    });
    return !!blacklistedToken;
  } catch (error) {
    console.error('Error checking blacklisted token:', error);
    // Trả về true để đảm bảo an toàn khi có lỗi kiểm tra blacklist
    return true;
  }
};

const verifyToken = async (req: Request, res: Response, next: NextFunction, allowQuery: boolean = false): Promise<void> => {
  const token = extractToken(req);

  if (!token) {
    res.status(401).json({ error: "Bạn chưa đăng nhập" });
    return;
  }

  try {
    if (config.jwt.blacklistEnabled && (await isTokenBlacklisted(token))) {
      res.status(401).json({ error: "Token đã bị vô hiệu hóa" });
      return;
    }

    const decoded = jwt.verify(token, SECRET_KEY as jwt.Secret) as {
      id: number;
      role: string;
    };

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ error: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

// Middleware xác thực JWT
export const authenticate = (req: Request, res: Response, next: NextFunction) =>
  verifyToken(req, res, next, false);

// Middleware kiểm tra quyền admin
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};
  
// Middleware xác thực JWT cho SSE (cho phép lấy token từ query string)
export const authenticateSSE = (req: Request, res: Response, next: NextFunction) =>
  verifyToken(req, res, next, true);

// Middleware xử lý refresh token
export const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const refreshToken = req.cookies?.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ error: "Không tìm thấy refresh token" });
    return;
  }

  try {
    if (config.jwt.blacklistEnabled && (await isTokenBlacklisted(refreshToken))) {
      res.clearCookie("access_token");
      res.clearCookie("refresh_token");
      res.status(401).json({ error: "Refresh token đã bị vô hiệu hóa" });
      return;
    }

    const decoded = jwt.verify(refreshToken, REFRESH_SECRET_KEY as jwt.Secret) as {
      id: number;
      role: string;
    };

    // Kiểm tra token có trong bảng refreshToken chưa bị thu hồi
    const tokenDb = await findRefreshToken(refreshToken, decoded.id);
    if (!tokenDb) {
      res.clearCookie("access_token");
      res.clearCookie("refresh_token");
      res.status(401).json({ error: "Refresh token không hợp lệ hoặc đã hết hạn" });
      return;
    }

    // Tạo access token mới
    const payload = { id: decoded.id, role: decoded.role };
    const newAccessToken = jwt.sign(payload, SECRET_KEY, {
      expiresIn: config.jwt.expiresIn as SignOptions["expiresIn"],
    });

    res.cookie("access_token", newAccessToken, config.jwt.cookieOptions);
    req.user = decoded;
    next();
  } catch (error) {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    res.status(401).json({ error: "Refresh token không hợp lệ hoặc đã hết hạn" });
  }
};