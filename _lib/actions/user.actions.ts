import { handleError } from "@/_lib/utils";
import prisma from "@/_lib/prisma";

export async function getAllUsers({ query, limit = 8, page }) {
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
      totalPage: Math.ceil(users.length / limit),
    };
  } catch (error) {
    handleError(error);
  }
}

export async function deleteUser(userId: string) {
  try {
    return await prisma.user.delete({
      where: { id: userId },
    });
  } catch (error) {
    handleError(error);
  }
}
