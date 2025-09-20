import prisma from "@/app/_lib/prisma";
import { SyncEventData } from "@/app/_lib/types/event";
import {
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
} from "@/app/_lib/google-calendar";

export class EventDatabaseOperations {
  async batchUpsertEvents(eventUpdates: SyncEventData[], sourceType: string) {
    const existingEvents = await prisma.event.findMany({
      where: {
        sourceType,
        sourceId: { in: eventUpdates.map((e) => e.sourceId) },
      },
      select: { id: true, sourceId: true, googleEventId: true },
    });

    const existingMap = new Map(existingEvents.map((e) => [e.sourceId, e]));

    const eventsToCreate = eventUpdates.filter(
      (e) => !existingMap.has(e.sourceId),
    );
    const eventsToUpdate = eventUpdates.filter((e) =>
      existingMap.has(e.sourceId),
    );

    // Create new events with Google Calendar sync
    for (const eventData of eventsToCreate) {
      try {
        console.log(`[Cron Sync] Creating new event: ${eventData.title}`);

        // Check for existing events at the same time and location to prevent duplicates
        const duplicateEvent = await prisma.event.findFirst({
          where: {
            startDateTime: eventData.startDateTime,
            endDateTime: eventData.endDateTime,
            locationId: eventData.locationId,
            isActive: true,
          },
        });

        if (duplicateEvent) {
          console.log(
            `[Cron Sync] Skipping duplicate event: ${eventData.title} - An event already exists at this time and location`,
          );
          continue;
        }

        // First create the event in the database
        const newEvent = await prisma.event.create({
          data: eventData,
          include: {
            location: true,
          },
        });

        // Then sync with Google Calendar
        console.log(
          `[Cron Sync] Syncing new event to Google Calendar: ${eventData.title}`,
        );
        const calendarResult = await createCalendarEvent({
          title: eventData.title,
          description: eventData.description || undefined,
          startDateTime: eventData.startDateTime,
          endDateTime: eventData.endDateTime,
          location:
            newEvent.location?.formattedAddress ||
            newEvent.location?.name ||
            undefined,
          price: eventData.price || undefined,
          isFree: eventData.isFree,
          externalRegistrationUrl: eventData.externalUrl || undefined,
        });

        // Update event with Google Calendar details if sync was successful
        if (calendarResult) {
          await prisma.event.update({
            where: { id: newEvent.id },
            data: {
              googleEventId: calendarResult.googleEventId,
              googleEventLink: calendarResult.googleEventLink,
            },
          });
          console.log(
            `[Cron Sync] Successfully synced to Google Calendar: ${eventData.title}`,
          );
        } else {
          console.warn(
            `[Cron Sync] Failed to sync to Google Calendar: ${eventData.title}`,
          );
        }
      } catch (error) {
        console.error(
          `[Cron Sync] Error creating event ${eventData.title}:`,
          error,
        );
      }
    }

    // Update existing events with Google Calendar sync
    for (const eventData of eventsToUpdate) {
      const existingEvent = existingMap.get(eventData.sourceId);
      if (existingEvent) {
        try {
          console.log(`[Cron Sync] Updating event: ${eventData.title}`);

          // Update in database
          const updatedEvent = await prisma.event.update({
            where: { id: existingEvent.id },
            data: {
              title: eventData.title,
              startDateTime: eventData.startDateTime,
              endDateTime: eventData.endDateTime,
              externalUrl: eventData.externalUrl,
              lastSynced: eventData.lastSynced,
              price: eventData.price,
              description: eventData.description,
              isActive: eventData.isActive,
            },
            include: {
              location: true,
            },
          });

          // Sync with Google Calendar if it has a Google Event ID
          if (existingEvent.googleEventId) {
            console.log(
              `[Cron Sync] Updating event in Google Calendar: ${eventData.title}`,
            );
            const calendarResult = await updateCalendarEvent(
              existingEvent.googleEventId,
              {
                title: eventData.title,
                description: eventData.description || undefined,
                startDateTime: eventData.startDateTime,
                endDateTime: eventData.endDateTime,
                location:
                  updatedEvent.location?.formattedAddress ||
                  updatedEvent.location?.name ||
                  undefined,
                price: eventData.price || undefined,
                isFree: eventData.isFree,
                externalRegistrationUrl: eventData.externalUrl || undefined,
              },
            );

            if (calendarResult) {
              console.log(
                `[Cron Sync] Successfully updated in Google Calendar: ${eventData.title}`,
              );
            } else {
              console.warn(
                `[Cron Sync] Failed to update in Google Calendar: ${eventData.title}`,
              );
            }
          } else {
            // If no Google Event ID exists, create it in Google Calendar
            console.log(
              `[Cron Sync] Creating Google Calendar event for existing database event: ${eventData.title}`,
            );
            const calendarResult = await createCalendarEvent({
              title: eventData.title,
              description: eventData.description || undefined,
              startDateTime: eventData.startDateTime,
              endDateTime: eventData.endDateTime,
              location:
                updatedEvent.location?.formattedAddress ||
                updatedEvent.location?.name ||
                undefined,
              price: eventData.price || undefined,
              isFree: eventData.isFree,
              externalRegistrationUrl: eventData.externalUrl || undefined,
            });

            if (calendarResult) {
              await prisma.event.update({
                where: { id: existingEvent.id },
                data: {
                  googleEventId: calendarResult.googleEventId,
                  googleEventLink: calendarResult.googleEventLink,
                },
              });
              console.log(
                `[Cron Sync] Successfully created in Google Calendar: ${eventData.title}`,
              );
            }
          }
        } catch (error) {
          console.error(
            `[Cron Sync] Error updating event ${eventData.title}:`,
            error,
          );
        }
      }
    }
  }

  async deactivateOldEvents(sourceType: string): Promise<number> {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    // First, find events that need to be deactivated with their Google Calendar IDs
    const eventsToDeactivate = await prisma.event.findMany({
      where: {
        sourceType,
        lastSynced: {
          lt: oneHourAgo,
        },
        startDateTime: {
          gt: new Date(),
        },
        isActive: true,
      },
      select: {
        id: true,
        title: true,
        googleEventId: true,
      },
    });

    if (eventsToDeactivate.length === 0) {
      console.log("✅ No old events to deactivate");
      return 0;
    }

    // Delete from Google Calendar if they have Google Event IDs
    for (const event of eventsToDeactivate) {
      if (event.googleEventId) {
        console.log(
          `[Cron Sync] Removing deactivated event from Google Calendar: ${event.title}`,
        );
        try {
          await deleteCalendarEvent(event.googleEventId);
          console.log(
            `[Cron Sync] Successfully removed from Google Calendar: ${event.title}`,
          );
        } catch (error) {
          console.error(
            `[Cron Sync] Failed to remove from Google Calendar: ${event.title}`,
            error,
          );
        }
      }
    }

    // Now deactivate them in the database
    const deletedCount = await prisma.event.updateMany({
      where: {
        id: {
          in: eventsToDeactivate.map((e) => e.id),
        },
      },
      data: {
        isActive: false,
        googleEventId: null,
        googleEventLink: null,
      },
    });

    if (deletedCount.count > 0) {
      console.log(`Deactivated ${deletedCount.count} old ${sourceType} events`);
    }

    return deletedCount.count;
  }
}
