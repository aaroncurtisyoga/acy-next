"use server";

import { revalidatePath } from "next/cache";
import { parseZonedDateTime } from "@internationalized/date";
import { PrismaClient } from "@prisma/client";
import {
  GetAllEventsParams,
  GetAllEventsResponse,
  GetRelatedEventsByCategoryParams,
} from "@/_lib/types";
import { handleError } from "@/_lib/utils";

const prisma = new PrismaClient();

export async function createEvent({ event, path }) {
  try {
    // Parse the string into a ZonedDateTime object
    const startZonedDateTime = parseZonedDateTime(event.startDateTime);
    const endZonedDateTime = parseZonedDateTime(event.endDateTime);

    // Convert ZonedDateTime to UTC ISO string
    const startDateTimeISO = startZonedDateTime.toAbsoluteString();
    const endDateTimeISO = endZonedDateTime.toAbsoluteString();

    const newEvent = await prisma.event.create({
      data: {
        ...event,
        ...(event.price ? { isFree: Number(event.price) === 0 } : {}),
        // Convert string to Date and then to ISO String
        startDateTime: startDateTimeISO,
        endDateTime: endDateTimeISO,
        category: {
          connect: {
            id: event.category,
          },
        },
        location: {
          connectOrCreate: {
            create: {
              ...event.location,
            },
            where: {
              placeId: event.location.placeId,
            },
          },
        },
      },
    });
    revalidatePath(path);
    return newEvent;
  } catch (error) {
    handleError(error);
  }
}

export async function deleteEvent(
  eventId: string,
): Promise<{ success: boolean }> {
  try {
    const deletedEvent = await prisma.event.delete({
      where: { id: eventId },
    });
    if (deletedEvent) {
      return { success: true };
    }
  } catch (error) {
    handleError(error);
    return { success: false };
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
  isActive = true,
}: GetAllEventsParams): Promise<GetAllEventsResponse> {
  try {
    const activeCondition = { isActive };

    const titleCondition = query ? { title: { contains: query } } : {};
    const categoryCondition = category
      ? { category: { name: { equals: category } } }
      : {};
    const dateCondition = { endDateTime: { gt: new Date() } };

    const skipAmount = (Number(page) - 1) * limit;

    const events = await prisma.event.findMany({
      where: {
        AND: [
          titleCondition,
          categoryCondition,
          dateCondition,
          activeCondition,
        ],
      },
      orderBy: { startDateTime: "asc" },
      take: limit,
      skip: skipAmount,
      include: {
        category: true,
        location: true,
      },
    });

    const eventsCount = await prisma.event.count({
      where: {
        AND: [
          titleCondition,
          categoryCondition,
          dateCondition,
          activeCondition,
        ],
      },
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
        category: true,
        location: true,
      },
    });
  } catch (error) {
    handleError(error);
  }
}

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
