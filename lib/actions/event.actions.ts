"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/mongodb/database";
import { handleError } from "@/lib/utils";
import Event from "@/lib/mongodb/database/models/event.model";
import Category from "@/lib/mongodb/database/models/category.model";
import { DeleteEventParams, GetAllEventsParams } from "@/types";

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

export async function deleteEvent({ eventId, path }: DeleteEventParams) {
  try {
    await connectToDatabase();

    const deletedEvent = await Event.findByIdAndDelete(eventId);
    if (deletedEvent) revalidatePath(path);
  } catch (error) {
    handleError(error);
  }
}

export async function getAllEvents({
  query,
  limit = 6,
  page,
  category,
}: GetAllEventsParams) {
  try {
    await connectToDatabase();
    const conditions = {};
    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: "desc" })
      .skip(0)
      .limit(limit);

    const events = await populateEvent(eventsQuery);
    const eventsCount = await Event.countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
}

export async function getEventById(eventId: string) {
  try {
    await connectToDatabase();
    const event = await populateEvent(Event.findById(eventId));
    return JSON.parse(JSON.stringify(event));
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
