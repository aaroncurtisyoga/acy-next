"use server";

import { PrismaClient } from "@prisma/client";
import { handleError } from "@/_lib/utils";
const prisma = new PrismaClient();

export async function getAllUsers({ query, limit = 8, page = 1 }) {
  const skipAmount = (Number(page) - 1) * limit;
  try {
    const users = await prisma.user.findMany({
      // Todo: Setup to work w/ search query
      where: {},
      orderBy: { firstName: "asc" },
      take: limit,
      skip: skipAmount,
    });
    return {
      data: users,
      totalPages: Math.ceil(users.length / limit),
    };
  } catch (error) {
    handleError(error);
  }
}

export async function deleteUser(
  userId: string,
): Promise<{ success: boolean }> {
  try {
    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });
    if (deletedUser) {
      return { success: true };
    }
  } catch (error) {
    handleError(error);
    return { success: false };
  }
}
