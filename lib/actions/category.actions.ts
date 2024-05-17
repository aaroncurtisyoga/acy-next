"use server";

import { revalidatePath } from "next/cache";
import { PrismaClient } from "@prisma/client";
import { handleError } from "@/lib/utils";
import { CreateCategoryParams } from "@/types";

const prisma = new PrismaClient();
export const createCategory = async ({
  categoryName,
}: CreateCategoryParams) => {
  try {
    return await prisma.category.create({
      data: {
        name: categoryName,
      },
    });
  } catch (error) {
    handleError(error);
  }
};

export const deleteCategory = async (categoryId: string, path) => {
  try {
    const deletedCategory = await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });
    revalidatePath(path);
    return deletedCategory;
  } catch (error) {
    handleError(error);
  }
};

export const getAllCategories = async () => {
  try {
    return await prisma.category.findMany();
  } catch (error) {
    handleError(error);
  }
};
