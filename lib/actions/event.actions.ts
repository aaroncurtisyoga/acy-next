"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/mongodb/database";
import { handleError } from "@/lib/utils";
import Event from "@/lib/mongodb/database/models/event.model";
import Category from "@/lib/mongodb/database/models/category.model";
import {
  DeleteEventParams,
  GetAllEventsParams,
  GetRelatedEventsByCategoryParams,
} from "@/types";

export async function createEvent({ event, path }) {
  try {
    await connectToDatabase();
    const newEvent = await Event.create({
      ...event,
      isFree: parseInt(event.price) === 0,
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
  limit = 8,
  page,
  category,
}: GetAllEventsParams) {
  try {
    await connectToDatabase();

    const titleCondition = query
      ? { title: { $regex: query, $options: "i" } }
      : {};
    const categoryCondition = category
      ? await getCategoryByName(category)
      : null;
    const dateCondition = { endDateTime: { $gt: new Date() } };
    const conditions = {
      $and: [
        titleCondition,
        categoryCondition ? { category: categoryCondition._id } : {},
        dateCondition,
      ],
    };

    const skipAmount = (Number(page) - 1) * limit;
    const eventsQuery = Event.find(conditions)
      .sort({ startDateTime: "asc" })
      .skip(skipAmount)
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

const getCategoryByName = async (name: string) => {
  return Category.findOne({ name: { $regex: name, $options: "i" } });
};

export async function getEventsWithSameCategory({
  categoryId,
  eventId,
  limit = 3,
  page = 1,
}: GetRelatedEventsByCategoryParams) {
  try {
    await connectToDatabase();

    const skipAmount = (Number(page) - 1) * limit;
    const conditions = {
      $and: [{ category: categoryId }, { _id: { $ne: eventId } }],
    };

    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
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

export async function updateEvent({ event, path }) {
  try {
    await connectToDatabase();

    const eventToUpdate = await Event.findById(event._id);

    const updatedEvent = await Event.findByIdAndUpdate(
      event._id,
      {
        ...event,
        isFree: parseInt(event.price) === 0,
        category: event.categoryId,
      },
      { new: true },
    );
    revalidatePath(path);

    return JSON.parse(JSON.stringify(updatedEvent));
  } catch (error) {
    handleError(error);
  }
}
