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
    console.log('Auth Headers:', req.headers);
    console.log('Auth Header:', req.headers.authorization);
    
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      console.log('No token found in request');
      res.status(401).json({ error: "Bạn chưa đăng nhập" });
      return;
    }
  
    try {
      console.log('Attempting to verify token');
      const decoded = jwt.verify(token, SECRET_KEY) as { id: number; role: string };
      console.log('Token verified successfully:', decoded);
      req.user = decoded;
      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      res.status(401).json({ error: "Token không hợp lệ" });
    }
  };
  
