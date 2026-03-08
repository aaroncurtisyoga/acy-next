"use server";

import prisma from "@/app/_lib/prisma";
import { CreateBookParams, UpdateBookParams } from "@/app/_lib/types";
import { handleError } from "@/app/_lib/utils";
import { serialize } from "@/app/_lib/utils/serialize";
import { revalidatePath } from "next/cache";

export const createBook = async (data: CreateBookParams) => {
  try {
    const newBook = await prisma.$transaction(async (tx) => {
      if (data.isCurrentlyReading) {
        await tx.book.updateMany({
          where: { isCurrentlyReading: true },
          data: { isCurrentlyReading: false },
        });
      }
      return tx.book.create({ data });
    });

    revalidatePath("/reading");
    revalidatePath("/admin/reading");

    return { status: true, data: serialize(newBook) };
  } catch (error) {
    handleError(error);
    return { status: false };
  }
};

export const getAllBooks = async () => {
  try {
    const books = await prisma.book.findMany({
      orderBy: [{ isCurrentlyReading: "desc" }, { updatedAt: "desc" }],
    });
    return serialize(books);
  } catch (error) {
    handleError(error);
    return [];
  }
};

export const getCurrentlyReadingBook = async () => {
  try {
    const book = await prisma.book.findFirst({
      where: { isCurrentlyReading: true },
    });
    return book ? serialize(book) : null;
  } catch (error) {
    handleError(error);
    return null;
  }
};

export const getPastReads = async () => {
  try {
    const books = await prisma.book.findMany({
      where: { isCurrentlyReading: false },
      orderBy: { updatedAt: "desc" },
    });
    return serialize(books);
  } catch (error) {
    handleError(error);
    return [];
  }
};

export const updateBook = async (id: string, data: UpdateBookParams) => {
  try {
    const updatedBook = await prisma.$transaction(async (tx) => {
      if (data.isCurrentlyReading) {
        await tx.book.updateMany({
          where: { isCurrentlyReading: true },
          data: { isCurrentlyReading: false },
        });
      }
      return tx.book.update({ where: { id }, data });
    });

    revalidatePath("/reading");
    revalidatePath("/admin/reading");

    return { status: true, data: serialize(updatedBook) };
  } catch (error) {
    handleError(error);
    return { status: false };
  }
};

export const deleteBook = async (id: string) => {
  try {
    const deletedBook = await prisma.book.delete({ where: { id } });

    revalidatePath("/reading");
    revalidatePath("/admin/reading");

    return { status: true, data: serialize(deletedBook) };
  } catch (error) {
    handleError(error);
    return { status: false };
  }
};
