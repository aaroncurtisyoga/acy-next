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
import {
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
} from "@/app/_lib/google-calendar";

export async function createEvent({
  event,
  path,
}: {
  event: CreateEventData;
  path: string;
}) {
  try {
    // Validate required fields
    if (!event.location || !event.location.placeId) {
      throw new Error("Location is required and must have a valid placeId");
    }

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

    // Sync with Google Calendar
    console.log("[Event Creation] Syncing new event with Google Calendar...");
    const calendarResult = await createCalendarEvent({
      title: event.title,
      description: event.description,
      startDateTime: startDateTimeISO,
      endDateTime: endDateTimeISO,
      location: location.formattedAddress || location.name || undefined,
      maxAttendees: event.maxAttendees,
      price: event.price,
      isFree: event.isFree,
      externalRegistrationUrl: event.externalRegistrationUrl,
    });

    // Update event with Google Calendar details if sync was successful
    if (calendarResult) {
      console.log(
        "[Event Creation] Updating event with Google Calendar details",
      );
      await prisma.event.update({
        where: { id: newEvent.id },
        data: {
          googleEventId: calendarResult.googleEventId,
          googleEventLink: calendarResult.googleEventLink,
        },
      });
    } else {
      console.warn(
        "[Event Creation] Google Calendar sync failed, but event was created in database",
      );
    }

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
    // First, get the event to check for Google Calendar ID
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { googleEventId: true, title: true },
    });

    if (!event) {
      console.error("[Event Deletion] Event not found:", eventId);
      return { success: false };
    }

    // Delete from Google Calendar if it exists there
    if (event.googleEventId) {
      console.log(
        "[Event Deletion] Deleting event from Google Calendar:",
        event.title,
      );
      const calendarDeleted = await deleteCalendarEvent(event.googleEventId);
      if (!calendarDeleted) {
        console.warn(
          "[Event Deletion] Failed to delete from Google Calendar, but continuing with database deletion",
        );
      }
    }

    // Delete from database
    const deletedEvent = await prisma.event.delete({
      where: { id: eventId },
    });

    if (deletedEvent) {
      console.log("[Event Deletion] Event deleted successfully from database");
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
    const {
      _id,
      categoryId,
      category,
      location,
      startDateTime,
      endDateTime,
      ...eventData
    } = event;

    // Use _id if provided, otherwise use id
    const eventId = _id || event.id;

    // Use categoryId if provided, otherwise use category
    const categoryToConnect = categoryId || category;

    // Handle datetime conversion - if it's already a valid ISO string, use it directly
    // If it's a ZonedDateTime string format, parse and convert to UTC ISO
    let processedStartDateTime = startDateTime;
    let processedEndDateTime = endDateTime;

    if (startDateTime && typeof startDateTime === "string") {
      try {
        // If it contains timezone info like "[America/New_York]", parse it
        if (startDateTime.includes("[")) {
          const zonedDateTime = parseZonedDateTime(startDateTime);
          processedStartDateTime = zonedDateTime.toAbsoluteString();
        } else {
          // If it's already a valid ISO string, use it as is
          processedStartDateTime = startDateTime;
        }
      } catch {
        // If parsing fails, try to use the original string
        processedStartDateTime = startDateTime;
      }
    }

    if (endDateTime && typeof endDateTime === "string") {
      try {
        // If it contains timezone info like "[America/New_York]", parse it
        if (endDateTime.includes("[")) {
          const zonedDateTime = parseZonedDateTime(endDateTime);
          processedEndDateTime = zonedDateTime.toAbsoluteString();
        } else {
          // If it's already a valid ISO string, use it as is
          processedEndDateTime = endDateTime;
        }
      } catch {
        // If parsing fails, try to use the original string
        processedEndDateTime = endDateTime;
      }
    }

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        ...eventData,
        ...(processedStartDateTime
          ? { startDateTime: processedStartDateTime }
          : {}),
        ...(processedEndDateTime ? { endDateTime: processedEndDateTime } : {}),
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
      include: {
        location: true,
      },
    });

    // Sync with Google Calendar if the event has a Google Event ID
    if (updatedEvent.googleEventId) {
      console.log(
        "[Event Update] Syncing updated event with Google Calendar...",
      );
      const calendarResult = await updateCalendarEvent(
        updatedEvent.googleEventId,
        {
          title: updatedEvent.title,
          description: updatedEvent.description,
          startDateTime: updatedEvent.startDateTime,
          endDateTime: updatedEvent.endDateTime,
          location:
            updatedEvent.location?.formattedAddress ||
            updatedEvent.location?.name ||
            undefined,
          maxAttendees: updatedEvent.maxAttendees,
          price: updatedEvent.price,
          isFree: updatedEvent.isFree,
          externalRegistrationUrl: updatedEvent.externalRegistrationUrl,
        },
      );

      if (!calendarResult) {
        console.warn(
          "[Event Update] Google Calendar sync failed, but event was updated in database",
        );
      } else {
        console.log("[Event Update] Google Calendar sync successful");
      }
    } else {
      // If no Google Event ID exists, try to create it in Google Calendar
      console.log(
        "[Event Update] No Google Event ID found, creating new calendar event...",
      );
      const calendarResult = await createCalendarEvent({
        title: updatedEvent.title,
        description: updatedEvent.description,
        startDateTime: updatedEvent.startDateTime,
        endDateTime: updatedEvent.endDateTime,
        location:
          updatedEvent.location?.formattedAddress ||
          updatedEvent.location?.name ||
          undefined,
        maxAttendees: updatedEvent.maxAttendees,
        price: updatedEvent.price,
        isFree: updatedEvent.isFree,
        externalRegistrationUrl: updatedEvent.externalRegistrationUrl,
      });

      if (calendarResult) {
        console.log(
          "[Event Update] Updating event with new Google Calendar details",
        );
        await prisma.event.update({
          where: { id: eventId },
          data: {
            googleEventId: calendarResult.googleEventId,
            googleEventLink: calendarResult.googleEventLink,
          },
        });
      }
    }

    revalidatePath(path);

    return updatedEvent;
  } catch (error) {
    handleError(error);
    return null;
  }
}
