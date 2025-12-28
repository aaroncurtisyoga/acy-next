"use server";

import { list } from "@vercel/blob";
import { auth, currentUser } from "@clerk/nextjs/server";

export const getImages = async () => {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const user = await currentUser();
    const isAdmin = user?.publicMetadata?.role === "admin";

    if (!isAdmin) {
      throw new Error("Forbidden");
    }

    const { blobs } = await list();
    return blobs;
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message);
    }
    return [];
  }
};
