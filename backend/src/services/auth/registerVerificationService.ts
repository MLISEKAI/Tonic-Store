import { prisma } from '../../prisma';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";
import { createRefreshToken } from '../../repositories/refreshTokenRepository';
import { QueueService } from '../queue.service';

const SECRET_KEY: jwt.Secret = config.jwt.secret || '';
const REFRESH_SECRET_KEY: jwt.Secret = config.jwt.refreshSecret || '';

// Store OTP codes temporarily (in production, use Redis)
const otpStore = new Map<string, { code: string; expiresAt: number; data: any }>();

const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendRegisterCode = async (email: string) => {
  if (!email) {
    throw new Error("Email is required");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }

  // Check if email already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("Email đã được sử dụng");
  }

  const code = generateOTP();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  otpStore.set(email, { code, expiresAt, data: { email } });

  // Send email via queue
  void QueueService.addEmailJob({
    to: email,
    subject: 'Mã xác thực đăng ký - Tonic Store',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #111827; text-align: center;">Mã xác thực đăng ký</h2>
        <p>Xin chào,</p>
        <p>Bạn đã yêu cầu đăng ký tài khoản tại Tonic Store. Dưới đây là mã xác thực của bạn:</p>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #111827;">${code}</span>
        </div>
        <p style="color: #6b7280; font-size: 14px;">Mã này sẽ hết hạn sau 10 phút.</p>
        <p style="color: #6b7280; font-size: 14px;">Nếu bạn không yêu cầu đăng ký, vui lòng bỏ qua email này.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">© ${new Date().getFullYear()} Tonic Store</p>
      </div>
    `
  });

  return { message: 'Mã xác thực đã được gửi đến email của bạn' };
};

export const verifyOtpOnly = async (email: string, code: string) => {
  if (!email || !code) {
    throw new Error("Email và mã xác thực là bắt buộc");
  }

  const stored = otpStore.get(email);
  if (!stored) {
    throw new Error("Mã xác thực không tồn tại hoặc đã hết hạn");
  }

  if (stored.expiresAt < Date.now()) {
    otpStore.delete(email);
    throw new Error("Mã xác thực đã hết hạn");
  }

  if (stored.code !== code) {
    throw new Error("Mã xác thực không chính xác");
  }

  return { verified: true };
};

export const verifyRegisterCode = async (
  email: string,
  code: string,
  name: string,
  password: string,
  phone?: string,
  address?: string
) => {
  if (!email || !code || !name || !password) {
    throw new Error("All fields are required");
  }

  const stored = otpStore.get(email);
  if (!stored) {
    throw new Error("Mã xác thực không tồn tại hoặc đã hết hạn");
  }

  if (stored.expiresAt < Date.now()) {
    otpStore.delete(email);
    throw new Error("Mã xác thực đã hết hạn");
  }

  if (stored.code !== code) {
    throw new Error("Mã xác thực không chính xác");
  }

  // OTP is valid, delete it
  otpStore.delete(email);

  // Create user
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phone: phone || null,
      address: address || null,
      role: 'CUSTOMER'
    }
  });

  if (address && address.trim() !== "") {
    await prisma.shippingAddress.create({
      data: {
        userId: user.id,
        name,
        phone: phone || '',
        address: address.trim(),
        isDefault: true
      }
    });
  }

  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    SECRET_KEY,
    { expiresIn: config.jwt.expiresIn as jwt.SignOptions["expiresIn"] }
  );

  const refreshToken = jwt.sign(
    { id: user.id, role: user.role },
    REFRESH_SECRET_KEY,
    { expiresIn: config.jwt.refreshExpiresIn as jwt.SignOptions["expiresIn"] }
  );

  const refreshExp = jwt.decode(refreshToken) as { exp: number } | null;
  if (refreshExp) {
    await createRefreshToken(refreshToken, user.id, new Date(refreshExp.exp * 1000), null);
  }

  const { password: _, ...userWithoutPassword } = user;
  return {
    accessToken,
    refreshToken,
    user: userWithoutPassword
  };
};
