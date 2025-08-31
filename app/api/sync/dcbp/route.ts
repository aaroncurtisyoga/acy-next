import { NextRequest, NextResponse } from "next/server";
import { EventSyncService } from "@/app/_lib/services/event-sync-service";

export async function GET(_request: NextRequest) {
  try {
    // Optional: Add authentication if needed
    // const authHeader = _request.headers.get("authorization");
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const syncService = new EventSyncService();
    const result = await syncService.syncDCBPEvents();

    return NextResponse.json({
      success: true,
      venue: "DCBP",
      timestamp: new Date().toISOString(),
      synced: result.synced,
      deactivated: result.deactivated,
    });
  } catch (error: any) {
    console.error("DCBP sync failed:", error);
    return NextResponse.json(
      {
        success: false,
        venue: "DCBP",
        error: error.message || "DCBP sync failed",
      },
      { status: 500 },
    );
  }
}

export async function POST(_request: NextRequest) {
  // POST endpoint for manual triggering with potential options
  return GET(_request);
}
