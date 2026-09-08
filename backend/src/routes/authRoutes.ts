import express from "express";
import { registerUser } from "../services/auth/registerService";
import { loginUser } from "../services/auth/loginService";
import { Prisma } from "@prisma/client";
import { sendResetPasswordEmail, resetPasswordByToken } from '../services/auth/forgotPasswordService';
import { sendRegisterCode, verifyRegisterCode } from '../services/auth/registerVerificationService';
import { authenticate, refreshToken } from "../middleware/auth";
import config  from "../config";
import { addToBlacklist } from '../repositories/tokenBlacklistRepository';
import jwt from "jsonwebtoken";
import { handleControllerError, ErrorCodes } from "../common/types/api-response";
import logger from "../config/logger";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone, address, role } = req.body;
    const result = await registerUser(name, email, password, phone, address, role);
    logger.info("User registered successfully:", { userId: result.user.id });
    
    res.cookie('access_token', result.accessToken, config.jwt.cookieOptions);
    res.cookie('refresh_token', result.refreshToken, config.jwt.refreshCookieOptions);
    
    res.apiSuccess({ user: result.user }, "Đăng ký thành công");
  } catch (error) {
    logger.error("Registration error details:", { error: error instanceof Error ? error.message : error });
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        res.apiError("Email đã tồn tại", ErrorCodes.BAD_REQUEST);
        return;
      }
    }
    
    handleControllerError(res, error, "POST /api/auth/register", "Đăng ký thất bại");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.apiError("Email và mật khẩu là bắt buộc", ErrorCodes.BAD_REQUEST);
      return;
    }

    logger.info("Attempting to login user:", { email });
    const result = await loginUser(email, password);
    logger.info("User logged in successfully:", { id: result.user.id, email: result.user.email, role: result.user.role });
    
    res.cookie('access_token', result.accessToken, config.jwt.cookieOptions);
    res.cookie('refresh_token', result.refreshToken, config.jwt.refreshCookieOptions);
    
    res.apiSuccess({ user: result.user }, "Đăng nhập thành công");
  } catch (error) {
    logger.error("Login error:", { error: error instanceof Error ? error.message : error });
    if (error instanceof Error) {
      if (error.message === "User not found") {
        res.apiError("Không tìm thấy người dùng", ErrorCodes.UNAUTHORIZED);
        return;
      }
      if (error.message === "Invalid password") {
        res.apiError("Mật khẩu không đúng", ErrorCodes.UNAUTHORIZED);
        return;
      }
    }
    handleControllerError(res, error, "POST /api/auth/login", "Đăng nhập thất bại");
  }
});

router.post('/logout', authenticate, async (req, res) => {
  try {
    const accessToken = req.cookies?.access_token;
    const refreshTokenValue = req.cookies?.refresh_token;
    
    if (config.jwt.blacklistEnabled && req.user) {
      const userId = req.user.id;
      
      const accessTokenExp = jwt.decode(accessToken) as { exp: number } | null;
      const refreshTokenExp = jwt.decode(refreshTokenValue) as { exp: number } | null;
      
      if (accessToken && accessTokenExp) {
        const accessTokenExpDate = new Date(accessTokenExp.exp * 1000);
        await addToBlacklist(accessToken, userId, accessTokenExpDate);
      }
      
      if (refreshTokenValue && refreshTokenExp) {
        const refreshTokenExpDate = new Date(refreshTokenExp.exp * 1000);
        await addToBlacklist(refreshTokenValue, userId, refreshTokenExpDate);
      }
    }
    
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    
    res.apiSuccess(null, "Đăng xuất thành công");
  } catch (error) {
    logger.error("Logout error:", { error: error instanceof Error ? error.message : error });
    handleControllerError(res, error, "POST /api/auth/logout", "Đăng xuất thất bại");
  }
});

router.post('/refresh-token', refreshToken, (req, res) => {
  res.apiSuccess(null, "Token đã được làm mới");
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.apiError("Email là bắt buộc", ErrorCodes.BAD_REQUEST);
      return;
    }
    await sendResetPasswordEmail(email);
    res.apiSuccess(null, "Đã gửi email khôi phục mật khẩu, vui lòng kiểm tra hộp thư");
  } catch (error) {
    handleControllerError(res, error, "POST /api/auth/forgot-password");
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      res.apiError("Token và mật khẩu mới là bắt buộc", ErrorCodes.BAD_REQUEST);
      return;
    }
    await resetPasswordByToken(token, password);
    res.apiSuccess(null, "Đặt lại mật khẩu thành công");
  } catch (error) {
    handleControllerError(res, error, "POST /api/auth/reset-password");
  }
});

router.post('/send-register-code', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.apiError("Email là bắt buộc", ErrorCodes.BAD_REQUEST);
      return;
    }
    const result = await sendRegisterCode(email);
    res.apiSuccess(result, "Đã gửi mã xác thực");
  } catch (error) {
    handleControllerError(res, error, "POST /api/auth/send-register-code");
  }
});

router.post('/verify-otp-only', async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      res.apiError("Email và mã xác thực là bắt buộc", ErrorCodes.BAD_REQUEST);
      return;
    }
    const { verifyOtpOnly } = await import('../services/auth/registerVerificationService');
    await verifyOtpOnly(email, code);
    res.apiSuccess({ verified: true }, "Xác thực mã thành công");
  } catch (error) {
    handleControllerError(res, error, "POST /api/auth/verify-otp-only");
  }
});

router.post('/verify-register-code', async (req, res) => {
  try {
    const { email, code, name, password, phone, address } = req.body;
    if (!email || !code) {
      res.apiError("Email và mã xác thực là bắt buộc", ErrorCodes.BAD_REQUEST);
      return;
    }
    const result = await verifyRegisterCode(email, code, name, password, phone, address);
    
    res.cookie('access_token', result.accessToken, config.jwt.cookieOptions);
    res.cookie('refresh_token', result.refreshToken, config.jwt.refreshCookieOptions);
    
    res.apiSuccess({ user: result.user }, "Xác thực thành công");
  } catch (error) {
    handleControllerError(res, error, "POST /api/auth/verify-register-code");
  }
});

export default router;
