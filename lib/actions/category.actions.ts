"use server";

import { PrismaClient } from "@prisma/client";
import { handleError } from "@/lib/utils";
import { CreateCategoryParams } from "@/types";

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
    return JSON.parse(JSON.stringify(newCategory));
  } catch (error) {
    handleError(error);
  }
};

export const getAllCategories = async () => {
  try {
    const categories = await prisma.category.findMany();
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    handleError(error);
  }
};
