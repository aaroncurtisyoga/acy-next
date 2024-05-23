"use server";

import { PrismaClient } from "@prisma/client";
import { handleError } from "@/_lib/utils";
import { CreateCategoryParams } from "@/_lib/types";

const prisma = new PrismaClient();
export const createCategory = async ({
  categoryName,
}: CreateCategoryParams) => {
  try {
    const newCategory = await prisma.category.create({
      data: {
        name: categoryName,
      },
    });
    return {
      status: true,
      newCategory,
    };
  } catch (error) {
    handleError(error);
    return { status: false };
  }
};

export const deleteCategory = async (categoryId: string) => {
  try {
    const deletedCategory = await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });
    return { status: true, deletedCategory };
  } catch (error) {
    handleError(error);
    return { status: false };
  }
};

export const getAllCategories = async () => {
  try {
    return await prisma.category.findMany();
  } catch (error) {
    handleError(error);
  }
};
