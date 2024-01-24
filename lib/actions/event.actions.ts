"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/mongodb/database";
import { handleError } from "@/lib/utils";
import Event from "@/lib/mongodb/database/models/event.model";

export async function createEvent({ event, path }) {
  try {
    await connectToDatabase();

    const newEvent = await Event.create({
      ...event,
      category: event.categoryId,
    });
    revalidatePath(path);
    return JSON.parse(JSON.stringify(newEvent));
  } catch (error) {
    handleError(error);
  }
}
