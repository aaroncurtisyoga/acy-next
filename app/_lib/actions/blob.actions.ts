"use server";

import { list } from "@vercel/blob";
import { requireAdmin } from "@/app/_lib/auth";

export const getImages = async () => {
  try {
    await requireAdmin();

    const { blobs } = await list();
    return blobs;
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message);
    }
    return [];
  }
};
