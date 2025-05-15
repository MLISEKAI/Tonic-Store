import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET;
if (!SECRET_KEY) {
  throw new Error("JWT_SECRET environment variable is not set");
}

export const loginUser = async (email: string, password: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: "1d" });

    // Create notification for user login
    await prisma.notification.create({
      data: {
        userId: user.id,
        message: `Bạn vừa đăng nhập từ một thiết bị mới. Nếu không phải bạn, hãy đổi mật khẩu ngay.`,
        isRead: false,
      },
    });

    return { token, user };
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
