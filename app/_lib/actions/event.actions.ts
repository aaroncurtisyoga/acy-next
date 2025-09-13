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

    // Handle location creation/connection first
    const location = await prisma.location.upsert({
      where: {
        placeId: event.location.placeId,
      },
      create: {
        ...event.location,
      },
      update: {
        ...event.location,
      },
    });

    const newEvent = await prisma.event.create({
      data: {
        title: event.title,
        description: event.description,
        startDateTime: startDateTimeISO,
        endDateTime: endDateTimeISO,
        price: event.price,
        maxAttendees: event.maxAttendees,
        imageUrl: event.imageUrl,
        externalRegistrationUrl: event.externalRegistrationUrl,
        isFree: event.isFree ?? (!event.price || Number(event.price) === 0),
        isHostedExternally: event.isHostedExternally ?? false,
        // Use scalar field assignments instead of nested connects
        categoryId: event.category,
        locationId: location.id,
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
      totalCount: eventsCount,
    };
  } catch (error) {
    handleError(error);
    return {
      data: [],
      hasFiltersApplied: false,
      totalPages: 0,
      totalCount: 0,
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

    // Use _id if provided, otherwise use id
    const eventId = _id || event.id;

    // Use categoryId if provided, otherwise use category
    const categoryToConnect = categoryId || category;

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        ...eventData,
        isFree: event.isFree ?? (!event.price || Number(event.price) === 0),
        ...(categoryToConnect
          ? { category: { connect: { id: categoryToConnect } } }
          : {}),
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
