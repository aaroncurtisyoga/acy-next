"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/app/_lib/prisma";
import {
  EventWithLocationAndCategory,
  GetAllEventsParams,
  GetAllEventsResponse,
} from "@/app/_lib/types";
import { CreateEventData, UpdateEventData } from "@/app/_lib/types/event";
import { handleError } from "@/app/_lib/utils";
import { serialize } from "@/app/_lib/utils/serialize";
import {
  calculateSkipAmount,
  calculateTotalPages,
} from "@/app/_lib/utils/pagination";
import {
  buildEventSearchConditions,
  buildWeekDateRange,
  buildMonthGridRange,
} from "@/app/_lib/utils/query-builders";
import { Prisma } from "@prisma/client";
import { generateMockEvents } from "@/app/_lib/utils/mock-events";
import {
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
  findCalendarEventByDatabaseId,
  buildCalendarEventData,
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

    // Convert date strings to UTC ISO strings
    const startDateTimeISO = new Date(event.startDateTime).toISOString();
    const endDateTimeISO = new Date(event.endDateTime).toISOString();

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

    // Check for existing events at the same time to prevent duplicates
    // Since you can only be in one place at once, we only check startDateTime
    const duplicateEvent = await prisma.event.findFirst({
      where: {
        startDateTime: startDateTimeISO,
        isActive: true,
      },
    });

    if (duplicateEvent) {
      throw new Error(
        `An event already exists at this time. Please choose a different time.`,
      );
    }

    const newEvent = await prisma.event.create({
      data: {
        title: event.title,
        description: event.description,
        startDateTime: startDateTimeISO,
        endDateTime: endDateTimeISO,
        price: event.price,
        // Only set maxAttendees for internally hosted events
        maxAttendees: event.isHostedExternally ? null : event.maxAttendees,
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
    const calendarResult = await createCalendarEvent(
      buildCalendarEventData(
        {
          ...event,
          startDateTime: startDateTimeISO,
          endDateTime: endDateTimeISO,
        },
        location.formattedAddress || location.name || undefined,
        newEvent.id,
      ),
    );

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
    return serialize(newEvent);
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

export async function getAllEvents({
  query,
  limit = 8,
  page,
  category,
  isActive = true,
}: GetAllEventsParams): Promise<GetAllEventsResponse> {
  try {
    // In dev mode with MOCK_EVENTS=true, return mock events for UI testing
    const useMockEvents =
      process.env.NODE_ENV === "development" &&
      process.env.MOCK_EVENTS === "true";

    if (useMockEvents) {
      const mockEvents = generateMockEvents(20);
      const skipAmount = calculateSkipAmount(Number(page), limit);
      const paginatedMockEvents = mockEvents.slice(
        skipAmount,
        skipAmount + limit,
      );

      return {
        data: paginatedMockEvents,
        hasFiltersApplied: false,
        totalPages: calculateTotalPages(mockEvents.length, limit),
        totalCount: mockEvents.length,
      };
    }

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
      data: serialize(events),
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

export async function getEventById(eventId: string) {
  try {
    // In dev mode with MOCK_EVENTS=true, return mock event for UI testing
    const useMockEvents =
      process.env.NODE_ENV === "development" &&
      process.env.MOCK_EVENTS === "true";

    if (useMockEvents && eventId.startsWith("mock-event-")) {
      const mockEvents = generateMockEvents(20);
      const mockEvent = mockEvents.find((e) => e.id === eventId);
      if (mockEvent) {
        return serialize({ ...mockEvent, attendees: [] });
      }
    }

    const event = await prisma.event.findUnique({
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

    if (!event) return null;

    return serialize(event);
  } catch (error) {
    handleError(error);
    return null;
  }
}

export async function getEventsByWeek(weekStartISO: string) {
  try {
    const { start, end } = buildWeekDateRange(new Date(weekStartISO));

    const events = await prisma.event.findMany({
      where: {
        isActive: true,
        startDateTime: { gte: start, lt: end },
      },
      orderBy: { startDateTime: "asc" },
      include: {
        category: true,
        location: true,
      },
    });

    return serialize(events) as EventWithLocationAndCategory[];
  } catch (error) {
    handleError(error);
    return [];
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
      maxAttendees,
      isHostedExternally,
      ...eventData
    } = event;

    // Use _id if provided, otherwise use id
    const eventId = _id || event.id;

    // In dev mode with MOCK_EVENTS=true, simulate successful update for mock events
    const useMockEvents =
      process.env.NODE_ENV === "development" &&
      process.env.MOCK_EVENTS === "true";

    if (useMockEvents && eventId?.startsWith("mock-event-")) {
      console.log("[Mock] Simulating event update for:", eventId, event);
      revalidatePath(path);
      return { success: true, id: eventId };
    }

    // Use categoryId if provided, otherwise use category
    const categoryToConnect = categoryId || category;

    // Convert datetime strings to ISO format
    let processedStartDateTime = startDateTime;
    let processedEndDateTime = endDateTime;

    if (startDateTime && typeof startDateTime === "string") {
      processedStartDateTime = new Date(startDateTime).toISOString();
    }

    if (endDateTime && typeof endDateTime === "string") {
      processedEndDateTime = new Date(endDateTime).toISOString();
    }

    // If datetime is being updated, check for duplicates
    // Since you can only be in one place at once, we only check startDateTime
    if (processedStartDateTime) {
      const duplicateEvent = await prisma.event.findFirst({
        where: {
          id: { not: eventId }, // Exclude the current event being updated
          startDateTime: processedStartDateTime,
          isActive: true,
        },
      });

      if (duplicateEvent) {
        throw new Error(
          `Another event already exists at this time. Please choose a different time.`,
        );
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
        // Only set maxAttendees for internally hosted events, null it out for external events
        ...(isHostedExternally !== undefined
          ? {
              isHostedExternally,
              maxAttendees: isHostedExternally ? null : maxAttendees,
            }
          : maxAttendees !== undefined
            ? { maxAttendees }
            : {}),
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

    // Sync with Google Calendar
    const locationStr =
      updatedEvent.location?.formattedAddress ||
      updatedEvent.location?.name ||
      undefined;
    const calendarData = buildCalendarEventData(updatedEvent, locationStr);

    if (updatedEvent.googleEventId) {
      console.log(
        "[Event Update] Syncing updated event with Google Calendar...",
      );
      const calendarResult = await updateCalendarEvent(
        updatedEvent.googleEventId,
        calendarData,
      );

      if (!calendarResult) {
        console.warn(
          "[Event Update] Google Calendar sync failed, but event was updated in database",
        );
      } else {
        console.log("[Event Update] Google Calendar sync successful");
      }
    } else {
      console.log(
        "[Event Update] No Google Event ID found, checking for existing calendar event...",
      );

      const existingGoogleEvent = await findCalendarEventByDatabaseId(eventId);

      let calendarResult;
      if (existingGoogleEvent) {
        console.log(
          "[Event Update] Found existing Google Calendar event, updating...",
        );
        calendarResult = await updateCalendarEvent(
          existingGoogleEvent.googleEventId,
          calendarData,
        );
      } else {
        console.log("[Event Update] Creating new calendar event...");
        calendarResult = await createCalendarEvent({
          ...calendarData,
          databaseEventId: eventId,
        });
      }

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

    return serialize(updatedEvent);
  } catch (error) {
    handleError(error);
    return null;
  }
}

export async function getEventsByMonth({
  year,
  month,
  query,
  category,
  isActive,
}: {
  year: number;
  month: number;
  query?: string;
  category?: string;
  isActive?: boolean;
}): Promise<EventWithLocationAndCategory[]> {
  try {
    const { gridStart, gridEnd } = buildMonthGridRange(year, month);

    const conditions: Prisma.EventWhereInput[] = [
      { startDateTime: { gte: gridStart, lte: gridEnd } },
    ];

    if (query) {
      conditions.push({ title: { contains: query } });
    }

    if (category) {
      conditions.push({ category: { id: category } });
    }

    if (typeof isActive === "boolean") {
      conditions.push({ isActive });
    }

    const events = await prisma.event.findMany({
      where: { AND: conditions },
      orderBy: { startDateTime: "asc" },
      include: {
        category: true,
        location: true,
      },
    });

    return serialize(events) as EventWithLocationAndCategory[];
  } catch (error) {
    handleError(error);
    return [];
  }
}

export async function getLastActiveEventDate(): Promise<Date | null> {
  try {
    const event = await prisma.event.findFirst({
      where: { isActive: true },
      orderBy: { startDateTime: "desc" },
      select: { startDateTime: true },
    });
    return event?.startDateTime ?? null;
  } catch (error) {
    handleError(error);
    return null;
  }
}
