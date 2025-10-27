import express from "express";
import { registerUser } from "../services/auth/registerService";
import { loginUser } from "../services/auth/loginService";
import { Prisma } from "@prisma/client";
import { sendResetPasswordEmail, resetPasswordByToken } from '../services/auth/forgotPasswordService';
import { authenticate, refreshToken } from "../middleware/auth";
import config  from "../config";
import { addToBlacklist } from '../repositories/tokenBlacklistRepository';
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone, address, role } = req.body;
    const result = await registerUser(name, email, password, phone, address, role);
    console.log("User registered successfully:", result.user);
    
    // Thiết lập cookies
    res.cookie('access_token', result.accessToken, config.jwt.cookieOptions);
    res.cookie('refresh_token', result.refreshToken, config.jwt.refreshCookieOptions);
    
    // Trả về thông tin user (không bao gồm tokens trong response body)
    res.json({ user: result.user });
  } catch (error) {
    console.error("Registration error details:", error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return res.status(400).json({ error: "Email already exists" });
      }
    }
    
    res.status(500).json({ 
      error: "Registration failed",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    console.log("Attempting to login user:", { email });
    const result = await loginUser(email, password);
    console.log("User logged in successfully:", { id: result.user.id, email: result.user.email, role: result.user.role });
    
    // Thiết lập cookies
    res.cookie('access_token', result.accessToken, config.jwt.cookieOptions);
    res.cookie('refresh_token', result.refreshToken, config.jwt.refreshCookieOptions);
    
    // Trả về thông tin user (không bao gồm tokens trong response body)
    res.json({ user: result.user });
  } catch (error) {
    console.error("Login error:", error);
    if (error instanceof Error) {
      if (error.message === "User not found") {
        return res.status(401).json({ error: "User not found" });
      }
      if (error.message === "Invalid password") {
        return res.status(401).json({ error: "Invalid password" });
      }
    }
    res.status(500).json({ error: "Login failed", details: error instanceof Error ? error.message : "Unknown error" });
  }
});

router.post('/logout', authenticate, async (req, res) => {
  try {
    const accessToken = req.cookies?.access_token;
    const refreshToken = req.cookies?.refresh_token;
    
    // Thêm tokens vào blacklist nếu tính năng blacklist được bật
    if (config.jwt.blacklistEnabled && req.user) {
      const userId = req.user.id;
      
      // Tính thời gian hết hạn của tokens
      const accessTokenExp = jwt.decode(accessToken) as { exp: number } | null;
      const refreshTokenExp = jwt.decode(refreshToken) as { exp: number } | null;
      
      // Thêm access token vào blacklist
      if (accessToken && accessTokenExp) {
        const accessTokenExpDate = new Date(accessTokenExp.exp * 1000);
        await addToBlacklist(accessToken, userId, accessTokenExpDate);
      }
      
      // Thêm refresh token vào blacklist
      if (refreshToken && refreshTokenExp) {
        const refreshTokenExpDate = new Date(refreshTokenExp.exp * 1000);
        await addToBlacklist(refreshToken, userId, refreshTokenExpDate);
      }
    }
    
    // Xóa hoặc revoke token (dùng revoke cho chuẩn)
    // if (refreshToken) { // This line was removed as per the edit hint
    //   await revokeRefreshToken(refreshToken); // This line was removed as per the edit hint
    // }
    
    // Xóa cookies
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    
    res.json({ message: 'Đăng xuất thành công' });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Đăng xuất thất bại" });
  }
});

router.post('/refresh-token', refreshToken, (req, res) => {
  // Middleware refreshToken đã xử lý việc tạo token mới và thiết lập cookie
  res.json({ message: 'Token đã được làm mới' });
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    await sendResetPasswordEmail(email);
    res.json({ message: 'Đã gửi email khôi phục mật khẩu, vui lòng kiểm tra hộp thư.' });
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'Có lỗi xảy ra!' });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    await resetPasswordByToken(token, password);
    res.json({ message: 'Đặt lại mật khẩu thành công!' });
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'Có lỗi xảy ra!' });
  }
});

export default router;
