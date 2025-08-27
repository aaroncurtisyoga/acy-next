"use server";

import { revalidatePath } from "next/cache";
import { parseZonedDateTime } from "@internationalized/date";
import prisma from "@/app/_lib/prisma";
import {
  GetAllEventsParams,
  GetAllEventsResponse,
  GetRelatedEventsByCategoryParams,
} from "@/app/_lib/types";
import { CreateEventData, UpdateEventData } from "@/app/_lib/types/event";
import { handleError } from "@/app/_lib/utils";
import {
  calculateSkipAmount,
  calculateTotalPages,
} from "@/app/_lib/utils/pagination";
import { buildEventSearchConditions } from "@/app/_lib/utils/query-builders";

export async function createEvent({
  event,
  path,
}: {
  event: CreateEventData;
  path: string;
}) {
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
        isHostedExternally: event.isHostedExternally ?? false,
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
    return null;
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
    return { success: false };
  } catch (error) {
    handleError(error);
    return { success: false };
  }
}

// Unused function - commented out to fix build
// async function getEventAttendees(eventId: string) {
//   return prisma.order.findMany({
//     where: { event: { id: eventId } },
//     include: {
//       buyer: {
//         select: {
//           firstName: true,
//           lastName: true,
//           photo: true,
//         },
//       },
//     },
//   });
// }

export async function getAllEvents({
  query,
  limit = 8,
  page,
  category,
  isActive = true,
}: GetAllEventsParams): Promise<GetAllEventsResponse> {
  try {
    const whereConditions = buildEventSearchConditions(
      query,
      category,
      isActive,
    );
    const skipAmount = calculateSkipAmount(Number(page), limit);

    const [events, eventsCount] = await Promise.all([
      prisma.event.findMany({
        where: whereConditions,
        orderBy: { startDateTime: "asc" },
        take: limit,
        skip: skipAmount,
        include: {
          category: true,
          location: true,
        },
      }),
      prisma.event.count({
        where: whereConditions,
      }),
    ]);

    const hasFiltersApplied: boolean = !!query || !!category;

    return {
      data: events,
      hasFiltersApplied,
      totalPages: calculateTotalPages(eventsCount, limit),
    };
  } catch (error) {
    handleError(error);
    return {
      data: [],
      hasFiltersApplied: false,
      totalPages: 0,
    };
  }
}

// Unused function - commented out to fix build
// const getCategoryByName = async (name: string) => {
//   return prisma.category.findUnique({
//     where: { name: name },
//   });
// };

export async function getEventsWithSameCategory({
  categoryId,
  eventId,
  limit = 3,
  page = 1,
}: GetRelatedEventsByCategoryParams) {
  try {
    const skipAmount = calculateSkipAmount(Number(page), limit);
    const whereConditions = {
      AND: [{ category: { id: categoryId } }, { id: { not: eventId } }],
    };

    const [events, eventsCount] = await Promise.all([
      prisma.event.findMany({
        where: whereConditions,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: skipAmount,
      }),
      prisma.event.count({
        where: whereConditions,
      }),
    ]);

    return {
      data: events,
      totalPages: calculateTotalPages(eventsCount, limit),
    };
  } catch (error) {
    handleError(error);
    return {
      data: [],
      totalPages: 0,
    };
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
    return null;
  }
}

export async function updateEvent({
  event,
  path,
}: {
  event: UpdateEventData;
  path: string;
}) {
  try {
    const { _id, categoryId, category, location, ...eventData } = event;

    const updatedEvent = await prisma.event.update({
      where: { id: _id },
      data: {
        ...eventData,
        ...(event.price ? { isFree: parseInt(event.price, 10) === 0 } : {}),
        ...(categoryId ? { category: { connect: { id: categoryId } } } : {}),
        ...(location &&
        location.placeId &&
        location.name &&
        location.formattedAddress
          ? {
              location: {
                connectOrCreate: {
                  create: {
                    name: location.name,
                    formattedAddress: location.formattedAddress,
                    placeId: location.placeId,
                    lat: location.lat,
                    lng: location.lng,
                  },
                  where: { placeId: location.placeId },
                },
              },
            }
          : {}),
      },
    });

    revalidatePath(path);

    return updatedEvent;
  } catch (error) {
    handleError(error);
    return null;
  }
}
