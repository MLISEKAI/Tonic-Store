import { Request, Response, NextFunction } from "express";
import jwt, { SignOptions, Secret } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import config from "../config";

const prisma = new PrismaClient();
const SECRET_KEY: Secret = config.jwt.secret;
const REFRESH_SECRET_KEY: Secret = config.jwt.refreshSecret;

// Định nghĩa kiểu mở rộng của Request
declare module "express-serve-static-core" {
  interface Request {
    user?: { id: number; role: string };
  }
}

// Kiểm tra token có trong blacklist không
const isTokenBlacklisted = async (token: string): Promise<boolean> => {
  if (!config.jwt.blacklistEnabled) return false;
  
  try {
    const blacklistedToken = await prisma.tokenBlacklist.findUnique({
      where: { token }
    });
    return !!blacklistedToken;
  } catch (error) {
    console.error('Error checking blacklisted token:', error);
    // Trả về true để đảm bảo an toàn khi có lỗi kiểm tra blacklist
    return true;
  }
};

// Middleware xác thực JWT
export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Ưu tiên lấy token từ cookie
    let token = req.cookies?.access_token;
    
    // Nếu không có trong cookie, thử lấy từ header
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }
    
    if (!token) {
      res.status(401).json({ error: "Bạn chưa đăng nhập" });
      return;
    }
  
    try {
      // Kiểm tra token có trong blacklist không
      if (config.jwt.blacklistEnabled && await isTokenBlacklisted(token)) {
        res.status(401).json({ error: "Token đã bị vô hiệu hóa" });
        return;
      }
      
      const decoded = jwt.verify(token, SECRET_KEY as jwt.Secret) as { id: number; role: string };
      req.user = decoded;
      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      res.status(401).json({ error: "Token không hợp lệ hoặc đã hết hạn" });
    }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};
  
// Middleware xác thực JWT cho SSE (cho phép lấy token từ query string)
export const authenticateSSE = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Ưu tiên lấy token từ cookie
    let token = req.cookies?.access_token;
    
    // Nếu không có trong cookie, thử lấy từ header hoặc query string
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      } else if (req.query.token && typeof req.query.token === 'string') {
        token = req.query.token;
      }
    }
    
    if (!token) {
      res.status(401).json({ error: "Bạn chưa đăng nhập" });
      return;
    }
    
    try {
      // Kiểm tra token có trong blacklist không
      if (config.jwt.blacklistEnabled && await isTokenBlacklisted(token)) {
        res.status(401).json({ error: "Token đã bị vô hiệu hóa" });
        return;
      }
      
      const decoded = jwt.verify(token, SECRET_KEY as jwt.Secret) as { id: number; role: string };
      req.user = decoded;
      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      res.status(401).json({ error: "Token không hợp lệ hoặc đã hết hạn" });
    }
};

// Middleware xử lý refresh token
export const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const refreshToken = req.cookies?.refresh_token;
  
  if (!refreshToken) {
    res.status(401).json({ error: "Không tìm thấy refresh token" });
    return;
  }
  
  try {
    // Kiểm tra refresh token có trong blacklist không
    if (config.jwt.blacklistEnabled && await isTokenBlacklisted(refreshToken)) {
      res.clearCookie('access_token');
      res.clearCookie('refresh_token');
      res.status(401).json({ error: "Refresh token đã bị vô hiệu hóa" });
      return;
    }
    
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET_KEY as jwt.Secret) as { id: number; role: string };
    
    // Tạo access token mới
    const payload = { id: decoded.id, role: decoded.role };
    const options: SignOptions = { expiresIn: config.jwt.expiresIn as jwt.SignOptions["expiresIn"] };
    const newAccessToken = jwt.sign(payload, SECRET_KEY as jwt.Secret, options);
    
    // Thiết lập cookie mới
    res.cookie('access_token', newAccessToken, config.jwt.cookieOptions);
    
    // Lưu thông tin user vào request
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Refresh token verification failed:', error);
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    res.status(401).json({ error: "Refresh token không hợp lệ hoặc đã hết hạn" });
  }
};
  
