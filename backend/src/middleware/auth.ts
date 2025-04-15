import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;
if (!SECRET_KEY) {
  throw new Error("JWT_SECRET environment variable is not set");
}

// Định nghĩa kiểu mở rộng của Request
declare module "express-serve-static-core" {
  interface Request {
    user?: { id: number; role: string };
  }
}

// Middleware xác thực JWT
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ error: "Bạn chưa đăng nhập" });
      return;
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
    if (!token) {
      res.status(401).json({ error: "Token không hợp lệ" });
      return;
    }
  
    try {
      const decoded = jwt.verify(token, SECRET_KEY) as { id: number; role: string };
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
  
