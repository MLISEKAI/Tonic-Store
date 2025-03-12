import prisma from "../../prisma";
import bcrypt from "bcrypt";

export const registerUser = async (name: string, email: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: { name, email, password: hashedPassword, role: "CUSTOMER" },
  });
};
