"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { handleError } from "@/lib/utils";

import {
  DeleteEventParams,
  GetAllEventsParams,
  GetRelatedEventsByCategoryParams,
} from "@/types";

const prisma = new PrismaClient();

export async function createEvent({ event, path }) {
  try {
    const newEvent = await prisma.event.create({
      data: {
        ...event,
        ...(event.price ? { isFree: Number(event.price) === 0 } : {}),
        category: event.categoryId,
      },
    });
    revalidatePath(path);
    return JSON.parse(JSON.stringify(newEvent));
  } catch (error) {
    handleError(error);
  }
}

export async function deleteEvent({ eventId, path }: DeleteEventParams) {
  try {
    const deletedEvent = await prisma.event.delete({
      where: { id: eventId },
    });
    if (deletedEvent) revalidatePath(path);
  } catch (error) {
    handleError(error);
  }
}

async function getEventAttendees(eventId: any) {
  return prisma.order.findMany({
    where: { event: eventId },
    include: {
      buyer: {
        select: {
          firstName: true,
          lastName: true,
          photo: true,
        },
      },
    },
  });
}

export async function getAllEvents({
  query,
  limit = 8,
  page,
  category,
}: GetAllEventsParams) {
  try {
    const titleCondition = query ? { title: { contains: query } } : {};
    const categoryCondition = category
      ? { category: { name: { equals: category } } }
      : {};
    const dateCondition = { endDateTime: { gt: new Date() } };

    const skipAmount = (Number(page) - 1) * limit;

    const events = await prisma.event.findMany({
      where: { AND: [titleCondition, categoryCondition, dateCondition] },
      orderBy: { startDateTime: "asc" },
      take: limit,
      skip: skipAmount,
      include: {
        category: true, // includes 'category' relation
        attendees: {
          include: {
            user: true, // include User in each EventUser
          },
        },
      },
    });

    const eventsCount = await prisma.event.count({
      where: { AND: [titleCondition, categoryCondition, dateCondition] },
    });

    const hasFiltersApplied: boolean = !!query || !!category;

    return {
      data: events,
      hasFiltersApplied,
      totalPages: Math.ceil(eventsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
}

const getCategoryByName = async (name: string) => {
  return prisma.category.findUnique({
    where: { name: name },
  });
};

export async function getEventsWithSameCategory({
  categoryId,
  eventId,
  limit = 3,
  page = 1,
}: GetRelatedEventsByCategoryParams) {
  try {
    const skipAmount = (Number(page) - 1) * limit;

    const events = await prisma.event.findMany({
      where: {
        AND: [{ category: { id: categoryId } }, { id: { not: eventId } }],
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: skipAmount,
    });

    const eventsCount = await prisma.event.count({
      where: {
        AND: [{ category: { id: categoryId } }, { id: { not: eventId } }],
      },
    });

    return {
      data: events,
      totalPages: Math.ceil(eventsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
}

export async function getEventById(eventId: string) {
  try {
    return await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        attendees: {
          include: {
            user: true,
          },
        },
      },
    });
  } catch (error) {
    handleError(error);
  }
}
const populateEvent = (query: any) => {
  return query.select({
    category: {
      select: {
        id: true,
        name: true,
      },
    },
  });
};

export async function updateEvent({ event, path }) {
  try {
    const updatedEvent = await prisma.event.update({
      where: { id: event._id },
      data: {
        ...event,
        isFree: parseInt(event.price, 10) === 0,
        category: event.categoryId,
      },
    });

    revalidatePath(path);

    return updatedEvent;
  } catch (error) {
    handleError(error);
  }
}
