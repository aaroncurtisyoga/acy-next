import { BrightBearCrawler } from "@/app/_lib/crawlers/bright-bear-crawler";
import { prisma } from "@/app/_lib/prisma";

export class EventSyncService {
  private crawler = new BrightBearCrawler();

  async syncBrightBearEvents() {
    try {
      console.log("Starting Bright Bear sync...");

      const externalClasses = await this.crawler.getAaronClasses();

      for (const cls of externalClasses) {
        await this.upsertEvent({
          title: cls.title,
          startDateTime: cls.startDateTime,
          endDateTime: cls.endDateTime,
          sourceType: "MOMENCE",
          sourceId: cls.id,
          externalUrl: cls.bookingUrl, // Direct registration link for users
          isExternal: true,
          lastSynced: new Date(),

          // Required existing fields
          locationId: await this.getBrightBearLocationId(),
          categoryId: await this.getDefaultCategoryId(),

          // Set defaults
          isFree: false,
          isHostedExternally: true, // Since users register at Bright Bear
          price: cls.price?.replace("$", "") || "20", // Default price if not found
          description: `Join Aaron Curtis for ${cls.title} at Bright Bear Yoga DC. Click "Register at Bright Bear" to book your spot.`,
          isActive: true,
        });
      }

      console.log(`Synced ${externalClasses.length} classes from Bright Bear`);

      // Clean up old external events that weren't found in latest sync
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const deletedCount = await prisma.event.updateMany({
        where: {
          sourceType: "MOMENCE",
          lastSynced: {
            lt: oneHourAgo,
          },
          startDateTime: {
            gt: new Date(), // Only delete future events
          },
        },
        data: {
          isActive: false,
        },
      });

      if (deletedCount.count > 0) {
        console.log(`Deactivated ${deletedCount.count} old external events`);
      }

      return {
        synced: externalClasses.length,
        deactivated: deletedCount.count,
      };
    } catch (error) {
      console.error("Bright Bear sync failed:", error);
      throw error;
    }
  }

  private async upsertEvent(eventData: any) {
    // Check if event already exists
    const existing = await prisma.event.findFirst({
      where: {
        sourceType: eventData.sourceType,
        sourceId: eventData.sourceId,
      },
    });

    if (existing) {
      // Update existing event
      return prisma.event.update({
        where: {
          id: existing.id,
        },
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
      });
    } else {
      // Create new event
      return prisma.event.create({
        data: eventData,
      });
    }
  }

  private async getBrightBearLocationId(): Promise<string> {
    let location = await prisma.location.findFirst({
      where: { name: "Bright Bear Yoga DC" },
    });

    if (!location) {
      location = await prisma.location.create({
        data: {
          name: "Bright Bear Yoga DC",
          formattedAddress: "1000 Florida Ave NE, Washington, DC 20002",
          lat: 38.9172,
          lng: -76.9834,
        },
      });
    }

    return location.id;
  }

  private async getDefaultCategoryId(): Promise<string> {
    let category = await prisma.category.findFirst({
      where: { name: "Yoga Class" },
    });

    if (!category) {
      category = await prisma.category.create({
        data: { name: "Yoga Class" },
      });
    }

    return category.id;
  }
}
