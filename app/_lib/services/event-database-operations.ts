import prisma from "@/app/_lib/prisma";
import { SyncEventData } from "@/app/_lib/types/event";

export class EventDatabaseOperations {
  async batchUpsertEvents(eventUpdates: SyncEventData[], sourceType: string) {
    const existingEvents = await prisma.event.findMany({
      where: {
        sourceType,
        sourceId: { in: eventUpdates.map((e) => e.sourceId) },
      },
      select: { id: true, sourceId: true },
    });

    const existingSourceIds = new Set(existingEvents.map((e) => e.sourceId));
    const eventsToCreate = eventUpdates.filter(
      (e) => !existingSourceIds.has(e.sourceId),
    );
    const eventsToUpdate = eventUpdates.filter((e) =>
      existingSourceIds.has(e.sourceId),
    );

    const operations = [];

    if (eventsToCreate.length > 0) {
      operations.push(
        prisma.event.createMany({
          data: eventsToCreate,
        }),
      );
    }

    for (const eventData of eventsToUpdate) {
      const existingEvent = existingEvents.find(
        (e) => e.sourceId === eventData.sourceId,
      );
      if (existingEvent) {
        operations.push(
          prisma.event.update({
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
          }),
        );
      }
    }

    await Promise.all(operations);
  }

  async deactivateOldEvents(sourceType: string): Promise<number> {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const deletedCount = await prisma.event.updateMany({
      where: {
        sourceType,
        lastSynced: {
          lt: oneHourAgo,
        },
        startDateTime: {
          gt: new Date(),
        },
      },
      data: {
        isActive: false,
      },
    });

    if (deletedCount.count > 0) {
      console.log(`Deactivated ${deletedCount.count} old ${sourceType} events`);
    }

    return deletedCount.count;
  }
}
