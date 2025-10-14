import { PrismaClient } from "@prisma/client";
import config from "../config";

const prisma = new PrismaClient();

/**
 * Thêm token vào blacklist
 */
export const addToBlacklist = async (token: string, userId: number, expiresAt: Date) => {
  return prisma.tokenBlacklist.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });
};

/**
 * Kiểm tra token có trong blacklist không
 */
export const isTokenBlacklisted = async (token: string): Promise<boolean> => {
  if (!config.jwt.blacklistEnabled) return false;
  
  const blacklistedToken = await prisma.tokenBlacklist.findFirst({
    where: {
      token,
      expiresAt: {
        gt: new Date(),
      },
    },
  });
  
  return !!blacklistedToken;
};

/**
 * Xóa các token hết hạn khỏi blacklist
 */
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