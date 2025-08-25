"use server";

import prisma from "@/app/_lib/prisma";
import { handleError } from "@/app/_lib/utils";
import {
  calculateSkipAmount,
  calculateTotalPages,
} from "@/app/_lib/utils/pagination";
import { buildUserSearchConditions } from "@/app/_lib/utils/query-builders";

export async function getAllUsers({ query, limit = 8, page = 1 }) {
  try {
    const skipAmount = calculateSkipAmount(page, limit);
    const whereConditions = buildUserSearchConditions(query);

    const [users, totalUsers] = await Promise.all([
      prisma.user.findMany({
        where: whereConditions,
        orderBy: { firstName: "asc" },
        take: limit,
        skip: skipAmount,
      }),
      prisma.user.count({
        where: whereConditions,
      }),
    ]);

    return {
      data: users,
      totalPages: calculateTotalPages(totalUsers, limit),
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
