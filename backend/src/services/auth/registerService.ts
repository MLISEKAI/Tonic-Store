import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";
import { createRefreshToken } from '../../repositories/refreshTokenRepository';

const prisma = new PrismaClient();
const SECRET_KEY: jwt.Secret = config.jwt.secret || '';
const REFRESH_SECRET_KEY: jwt.Secret = config.jwt.refreshSecret || '';

export const registerUser = async (
  name: string, 
  email: string, 
  password: string, 
  phone: string,
  address: string,
  role: "CUSTOMER" | "ADMIN" | "DELIVERY" = "CUSTOMER",
  deviceInfo: string | null = null
) => {
  // Validate required fields
  if (!name || !email || !password || !phone) {
    throw new Error("Name, email, password and phone are required");
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }

  // Validate password length
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phone,
      address: address || null,
      role
    }
  });
  
  // Nếu có nhập địa chỉ, tạo luôn shipping address mặc định cho user
  if (address && address.trim() !== "") {
    await prisma.shippingAddress.create({
      data: {
        userId: user.id,
        name,
        phone,
        address: address.trim(),
        isDefault: true
      }
    });
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
  
  // Sau khi sinh refreshToken
  const refreshExp = jwt.decode(refreshToken) as { exp: number } | null;
  if (refreshExp) {
    await prisma.refreshToken.deleteMany({ where: { userId: user.id, deviceInfo } });
    await createRefreshToken(refreshToken, user.id, new Date(refreshExp.exp * 1000), deviceInfo);
  }
  
  // Trả về tokens và thông tin user (không bao gồm password)
  const { password: _, ...userWithoutPassword } = user;
  return { 
    accessToken, 
    refreshToken,
    user: userWithoutPassword
  };
};
