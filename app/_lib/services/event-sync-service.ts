import { BrightBearSyncService } from "./bright-bear-sync-service";
import { DCBPSyncService } from "./dcbp-sync-service";

export class EventSyncService {
  private brightBearService = new BrightBearSyncService();
  private dcbpService = new DCBPSyncService();

  async syncBrightBearEvents() {
    return this.brightBearService.syncEvents();
  }

  async syncDCBPEvents() {
    return this.dcbpService.syncEvents();
  }

  async syncAllEvents(sequential: boolean = false) {
    console.log("Starting full sync of all external events...");

    let results: PromiseSettledResult<any>[];

    if (sequential) {
      console.log("Running crawlers sequentially to avoid rate limits...");
      results = [];

      // Run Bright Bear first
      try {
        const brightBearResult = await this.syncBrightBearEvents();
        results.push({ status: "fulfilled", value: brightBearResult } as any);
      } catch (error) {
        results.push({ status: "rejected", reason: error } as any);
      }

      // Add delay between crawlers
      console.log("Waiting 3 seconds before next crawler...");
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Run DCBP second
      try {
        const dcbpResult = await this.syncDCBPEvents();
        results.push({ status: "fulfilled", value: dcbpResult } as any);
      } catch (error) {
        results.push({ status: "rejected", reason: error } as any);
      }
    } else {
      // Original parallel execution
      results = await Promise.allSettled([
        this.syncBrightBearEvents(),
        this.syncDCBPEvents(),
      ]);
    }

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
