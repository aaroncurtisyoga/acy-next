import { BrightBearCrawler } from "@/app/_lib/crawlers/bright-bear-crawler";
import { DCBPCrawler } from "@/app/_lib/crawlers/dcbp-crawler";
import prisma from "@/app/_lib/prisma";
import { SyncEventData } from "@/app/_lib/types/event";

export class EventSyncService {
  private brightBearCrawler = new BrightBearCrawler();
  private dcbpCrawler = new DCBPCrawler();
  private locationCache: Map<string, string> = new Map();
  private categoryCache: Map<string, string> = new Map();

  async syncBrightBearEvents() {
    try {
      console.log("Starting Bright Bear sync...");

      const [externalClasses, locationId, categoryId] = await Promise.all([
        this.brightBearCrawler.getAaronClasses(),
        this.getBrightBearLocationId(),
        this.getDefaultCategoryId(),
      ]);

      const eventUpdates: SyncEventData[] = externalClasses.map((cls) => ({
        title: cls.title,
        startDateTime: cls.startDateTime,
        endDateTime: cls.endDateTime,
        sourceType: "MOMENCE",
        sourceId: cls.id,
        externalUrl: cls.bookingUrl,
        isExternal: true,
        lastSynced: new Date(),
        locationId,
        categoryId,
        isFree: false,
        isHostedExternally: true,
        price: cls.price?.replace("$", "") || "20",
        description: `Join Aaron Curtis for ${cls.title} at Bright Bear Yoga DC. Click "Register at Bright Bear" to book your spot.`,
        isActive: true,
      }));

      await this.batchUpsertEvents(eventUpdates);

      console.log(`Synced ${externalClasses.length} classes from Bright Bear`);

      const deactivatedCount = await this.deactivateOldEvents();

      return {
        synced: externalClasses.length,
        deactivated: deactivatedCount,
      };
    } catch (error) {
      console.error("Bright Bear sync failed:", error);
      throw error;
    }
  }

  private async batchUpsertEvents(eventUpdates: SyncEventData[]) {
    const existingEvents = await prisma.event.findMany({
      where: {
        sourceType: "MOMENCE",
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

  private async deactivateOldEvents(): Promise<number> {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const deletedCount = await prisma.event.updateMany({
      where: {
        sourceType: "MOMENCE",
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
      console.log(`Deactivated ${deletedCount.count} old external events`);
    }

    return deletedCount.count;
  }

  private async getBrightBearLocationId(): Promise<string> {
    const cacheKey = "Bright Bear Yoga DC";

    if (this.locationCache.has(cacheKey)) {
      return this.locationCache.get(cacheKey)!;
    }

    let location = await prisma.location.findFirst({
      where: { name: cacheKey },
    });

    if (!location) {
      location = await prisma.location.create({
        data: {
          name: cacheKey,
          formattedAddress: "1000 Florida Ave NE, Washington, DC 20002",
          lat: 38.9172,
          lng: -76.9834,
        },
      });
    }

    this.locationCache.set(cacheKey, location.id);
    return location.id;
  }

  private async getDefaultCategoryId(): Promise<string> {
    const cacheKey = "Yoga Class";

    if (this.categoryCache.has(cacheKey)) {
      return this.categoryCache.get(cacheKey)!;
    }

    let category = await prisma.category.findFirst({
      where: { name: cacheKey },
    });

    if (!category) {
      category = await prisma.category.create({
        data: { name: cacheKey },
      });
    }

    this.categoryCache.set(cacheKey, category.id);
    return category.id;
  }

  async syncDCBPEvents() {
    try {
      console.log("Starting DCBP sync...");

      const [externalClasses, locationId, categoryId] = await Promise.all([
        this.dcbpCrawler.getScheduledClasses(),
        this.getDCBPLocationId(),
        this.getDefaultCategoryId(),
      ]);

      const eventUpdates: SyncEventData[] = externalClasses.map((cls) => ({
        title: cls.title,
        startDateTime: cls.startDateTime,
        endDateTime: cls.endDateTime,
        sourceType: "ZOOMSHIFT",
        sourceId: cls.id,
        externalUrl: "https://dcboulderingproject.com/dc/yoga",
        isExternal: true,
        lastSynced: new Date(),
        locationId,
        categoryId,
        isFree: false,
        isHostedExternally: true,
        price: "25",
        description: `Join Aaron Curtis for ${cls.title} at DC Bouldering Project. Visit DCBP website for more information.`,
        isActive: true,
      }));

      await this.batchUpsertEventsDCBP(eventUpdates);

      console.log(`Synced ${externalClasses.length} classes from DCBP`);

      const deactivatedCount = await this.deactivateOldDCBPEvents();

      return {
        synced: externalClasses.length,
        deactivated: deactivatedCount,
      };
    } catch (error) {
      console.error("DCBP sync failed:", error);
      throw error;
    }
  }

  private async getDCBPLocationId(): Promise<string> {
    const cacheKey = "DC Bouldering Project";

    if (this.locationCache.has(cacheKey)) {
      return this.locationCache.get(cacheKey)!;
    }

    let location = await prisma.location.findFirst({
      where: { name: cacheKey },
    });

    if (!location) {
      location = await prisma.location.create({
        data: {
          name: cacheKey,
          formattedAddress: "1432 33rd St, Washington, DC 20018",
          lat: 38.9397,
          lng: -76.9949,
        },
      });
    }

    this.locationCache.set(cacheKey, location.id);
    return location.id;
  }

  private async batchUpsertEventsDCBP(eventUpdates: SyncEventData[]) {
    const existingEvents = await prisma.event.findMany({
      where: {
        sourceType: "ZOOMSHIFT",
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

  private async deactivateOldDCBPEvents(): Promise<number> {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const deletedCount = await prisma.event.updateMany({
      where: {
        sourceType: "ZOOMSHIFT",
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
      console.log(`Deactivated ${deletedCount.count} old DCBP events`);
    }

    return deletedCount.count;
  }

  async syncAllEvents() {
    console.log("Starting full sync of all external events...");

    const results = await Promise.allSettled([
      this.syncBrightBearEvents(),
      this.syncDCBPEvents(),
    ]);

    const summary = {
      brightBear: {
        success: false,
        synced: 0,
        deactivated: 0,
        error: null as any,
      },
      dcbp: { success: false, synced: 0, deactivated: 0, error: null as any },
    };

    if (results[0].status === "fulfilled") {
      summary.brightBear = { success: true, ...results[0].value, error: null };
    } else {
      summary.brightBear.error = results[0].reason;
      console.error("Bright Bear sync error:", results[0].reason);
    }

    if (results[1].status === "fulfilled") {
      summary.dcbp = { success: true, ...results[1].value, error: null };
    } else {
      summary.dcbp.error = results[1].reason;
      console.error("DCBP sync error:", results[1].reason);
    }

    console.log("Sync complete:", summary);
    return summary;
  }
}
