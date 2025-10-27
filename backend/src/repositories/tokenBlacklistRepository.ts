import { PrismaClient } from "@prisma/client";
import config from "../config";
import crypto from "crypto";

const prisma = new PrismaClient();

// Hàm hash token để lưu trữ an toàn
export const hashToken = (token: string) =>
  crypto.createHash("sha256").update(token).digest("hex");

// Thêm token vào blacklist
export const addToBlacklist = async (token: string, userId: number, expiresAt: Date) => {
  const hashed = hashToken(token);
  return prisma.tokenBlacklist.create({
    data: {
      token: hashed,
      userId,
      expiresAt,
    },
  });
};

// Kiểm tra token có trong blacklist không
export const isTokenBlacklisted = async (token: string): Promise<boolean> => {
  if (!config.jwt.blacklistEnabled) return false;
  
  const hashed = hashToken(token);
  const blacklistedToken = await prisma.tokenBlacklist.findFirst({
    where: {
      token: hashed,
      expiresAt: {
        gt: new Date(),
      },
    },
  });
  
  return !!blacklistedToken;
};

// Xóa các token hết hạn khỏi blacklist
export const cleanupBlacklist = async (): Promise<number> => {
  const result = await prisma.tokenBlacklist.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
  
  return result.count;
};