import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

export const hashToken = (token: string) =>
  crypto.createHash("sha256").update(token).digest("hex");

export const createRefreshToken = async (token: string, userId: number, expiresAt: Date, deviceInfo: string | null = null) => {
  const hashed = hashToken(token);
  return prisma.refreshToken.create({
    data: {
      token: hashed,
      userId,
      expiresAt,
      deviceInfo,
      revoked: false,
    },
  });
};

export const findRefreshToken = async (token: string, userId?: number) => {
  const hashed = hashToken(token);
  return prisma.refreshToken.findFirst({
    where: {
      token: hashed,
      ...(userId !== undefined && { userId }),
      revoked: false,
      expiresAt: { gt: new Date() },
    },
  });
};

export const revokeRefreshToken = async (token: string) => {
  const hashed = hashToken(token);
  return prisma.refreshToken.updateMany({
    where: { token: hashed },
    data: { revoked: true },
  });
};

export const deleteRefreshToken = async (token: string) => {
  const hashed = hashToken(token);
  return prisma.refreshToken.deleteMany({
    where: { token: hashed },
  });
};

export const cleanupExpiredRefreshTokens = async () => {
  return prisma.refreshToken.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
};
