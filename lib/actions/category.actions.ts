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
    return await prisma.category.findMany();
  } catch (error) {
    handleError(error);
  }
};
