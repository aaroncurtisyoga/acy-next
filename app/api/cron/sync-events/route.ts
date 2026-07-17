import { NextResponse } from "next/server";
import { EventSyncService } from "@/app/_lib/services/event-sync-service";
import { assertCronRequest } from "@/app/_lib/api-auth";

export async function GET(request: Request) {
  try {
    const denied = assertCronRequest(request);
    if (denied) return denied;

    const syncService = new EventSyncService();
    // Use sequential execution to avoid concurrent rate limits
    const result = await syncService.syncAllEvents(true);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      brightBear: result.brightBear,
      dcbp: result.dcbp,
      totalSynced: result.brightBear.synced + result.dcbp.synced,
      totalDeactivated: result.brightBear.deactivated + result.dcbp.deactivated,
    });
  } catch (error: any) {
    console.error("Cron sync failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Cron sync failed",
      },
      { status: 500 },
    );
  }
}
