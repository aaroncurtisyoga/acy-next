"use server";

import prisma from "@/app/_lib/prisma";
import { CreateCategoryParams } from "@/app/_lib/types";
import { handleError } from "@/app/_lib/utils";
import { serialize } from "@/app/_lib/utils/serialize";

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
      newCategory: serialize(newCategory),
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
