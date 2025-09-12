import { BrightBearCrawler } from "@/app/_lib/crawlers/bright-bear-crawler";
import { SyncEventData } from "@/app/_lib/types/event";
import { EventDatabaseOperations } from "./event-database-operations";
import { LocationCategoryService } from "./location-category-service";
import {
  withRetry,
  isBrowserlessRateLimit,
} from "@/app/_lib/utils/retry-helper";

export class BrightBearSyncService {
  private crawler = new BrightBearCrawler();
  private dbOperations = new EventDatabaseOperations();
  private locationCategoryService = new LocationCategoryService();
  private sourceType = "MOMENCE";

  async syncEvents() {
    try {
      console.log("🎯 Starting Bright Bear sync...");
      console.log(
        "🔄 Fetching Aaron Curtis classes from Bright Bear Yoga DC...",
      );

      console.log("🕐 Starting parallel data fetch:");
      console.log("  - Crawling Bright Bear website for classes");
      console.log("  - Fetching location ID from database");
      console.log("  - Fetching category ID from database");

      const [externalClasses, locationId, categoryId] = await Promise.all([
        withRetry(() => this.crawler.getAaronClasses(), {
          maxAttempts: 3,
          baseDelay: 5000,
          maxDelay: 20000,
          retryCondition: isBrowserlessRateLimit,
        }),
        this.locationCategoryService.getBrightBearLocationId(),
        this.locationCategoryService.getDefaultCategoryId(),
      ]);

      console.log(`✅ Data fetch complete:`);
      console.log(
        `  - Found ${externalClasses.length} classes from Bright Bear`,
      );
      console.log(`  - Location ID: ${locationId}`);
      console.log(`  - Category ID: ${categoryId}`);

      console.log("🔄 Transforming class data for database...");
      const eventUpdates: SyncEventData[] = externalClasses.map(
        (cls, index) => {
          console.log(
            `  [${index + 1}/${externalClasses.length}] Processing: ${cls.title} on ${cls.startDateTime.toLocaleString()}`,
          );
          return {
            title: cls.title,
            startDateTime: cls.startDateTime,
            endDateTime: cls.endDateTime,
            sourceType: this.sourceType,
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
          };
        },
      );

      console.log("💾 Upserting events to database...");
      await this.dbOperations.batchUpsertEvents(eventUpdates, this.sourceType);

      console.log(
        `✅ Successfully synced ${externalClasses.length} classes from Bright Bear`,
      );

      console.log("🧼 Checking for old events to deactivate...");
      const deactivatedCount = await this.dbOperations.deactivateOldEvents(
        this.sourceType,
      );

      if (deactivatedCount > 0) {
        console.log(
          `🚫 Deactivated ${deactivatedCount} old events from Bright Bear`,
        );
      } else {
        console.log("✅ No old events to deactivate");
      }

      console.log("🎉 Bright Bear sync completed successfully!");
      console.log("📊 Summary:");
      console.log(`  - Classes synced: ${externalClasses.length}`);
      console.log(`  - Events deactivated: ${deactivatedCount}`);

      return {
        synced: externalClasses.length,
        deactivated: deactivatedCount,
      };
    } catch (error) {
      console.error("❌ Bright Bear sync failed:", error);
      throw error;
    }
  }
}
