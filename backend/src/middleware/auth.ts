import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

// Định nghĩa kiểu mở rộng của Request
declare module "express-serve-static-core" {
  interface Request {
    user?: { id: number; role: string };
  }
}

// Middleware xác thực JWT
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ error: "Bạn chưa đăng nhập" });
      return;
    }
  
    try {
      const decoded = jwt.verify(token, SECRET_KEY) as { id: number; role: string };
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ error: "Token không hợp lệ" });
    }
  };
  
