import prisma from "../prisma";
import { Role } from "@prisma/client";

export const getAllUsers = async () => {
  return prisma.user.findMany();
};

export const createUser = async (name: string, email: string, password: string, role: string) => {
  return prisma.user.create({
    data: { name, email, password, role: role as Role },
  });
};
