import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET;
if (!SECRET_KEY) {
  throw new Error("JWT_SECRET environment variable is not set");
}

export const registerUser = async (
  name: string, 
  email: string, 
  password: string, 
  phone: string,
  address: string,
  role: "CUSTOMER" | "ADMIN" | "DELIVERY" = "CUSTOMER"
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
  
  const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: "1d" });
  return { token, user };
};
