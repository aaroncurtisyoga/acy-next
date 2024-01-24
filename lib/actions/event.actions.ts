"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/mongodb/database";
import { handleError } from "@/lib/utils";
import Event from "@/lib/mongodb/database/models/event.model";
import Category from "@/lib/mongodb/database/models/category.model";

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

const populateEvent = (query: any) => {
  return query.populate({
    path: "category",
    model: Category,
    select: "_id name",
  });
};
export async function getEventById(eventId: string) {
  try {
    await connectToDatabase();
    const event = await populateEvent(Event.findById(eventId));

    if (!event) throw new Error("Event not found");

    return JSON.parse(JSON.stringify(event));
  } catch (error) {
    handleError(error);
  }
}
