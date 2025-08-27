import { NextRequest, NextResponse } from "next/server";
import { EventSyncService } from "@/app/_lib/services/event-sync-service";

export async function GET(_request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "This endpoint is only available in development" },
      { status: 403 },
    );
  }

  try {
    console.log("🔄 Starting manual sync test...");

    const syncService = new EventSyncService();
    const result = await syncService.syncBrightBearEvents();

    console.log("✅ Sync completed:", result);

    return NextResponse.json({
      success: true,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      synced: result.synced,
      deactivated: result.deactivated,
      details: {
        syncedEvents: result.synced,
        deactivatedEvents: result.deactivated,
      },
    });
  } catch (error: any) {
    console.error("❌ Manual sync failed:", error);
    return NextResponse.json(
      {
        success: false,
        environment: process.env.NODE_ENV,
        error: error.message || "Manual sync failed",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
