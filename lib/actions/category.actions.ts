"use server";

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

export const deleteCategory = async (categoryId: string) => {
  try {
    return await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });
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
