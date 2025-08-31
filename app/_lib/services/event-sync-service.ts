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
