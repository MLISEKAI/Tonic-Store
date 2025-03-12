import prisma from "../prisma";

export const getAllUsers = async () => prisma.user.findMany();

export const deleteUser = async (id: number) => {
  await prisma.user.delete({ where: { id } });
};
