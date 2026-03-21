"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/app/_lib/prisma";
import { CreateCategoryParams } from "@/app/_lib/types";
import { handleError } from "@/app/_lib/utils";
import { serialize } from "@/app/_lib/utils/serialize";

async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const user = await currentUser();
  if (user?.publicMetadata?.role !== "admin") throw new Error("Forbidden");
}

export const createCategory = async ({
  categoryName,
}: CreateCategoryParams) => {
  try {
    await requireAdmin();
    const newCategory = await prisma.category.create({
      data: {
        name: categoryName,
      },
    });
    return {
      status: true,
      newCategory: serialize(newCategory),
    };
  } catch (error) {
    handleError(error);
    return { status: false };
  }
};

export const deleteCategory = async (categoryId: string) => {
  try {
    await requireAdmin();
    const deletedCategory = await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });
    return { status: true, deletedCategory: serialize(deletedCategory) };
  } catch (error) {
    handleError(error);
    return { status: false };
  }
};

export const getAllCategories = async () => {
  try {
    const categories = await prisma.category.findMany();
    return serialize(categories);
  } catch (error) {
    handleError(error);
    return [];
  }
};
