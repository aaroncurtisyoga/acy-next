import { NextRequest, NextResponse } from "next/server";
import { EventSyncService } from "@/app/_lib/services/event-sync-service";

export async function GET(request: NextRequest) {
  try {
    // Verify this is coming from Vercel Cron
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const syncService = new EventSyncService();
    const result = await syncService.syncBrightBearEvents();

    return NextResponse.json({
      success: true,
      venue: "Bright Bear",
      timestamp: new Date().toISOString(),
      synced: result.synced,
      deactivated: result.deactivated,
    });
  } catch (error: any) {
    console.error("Bright Bear sync failed:", error);
    return NextResponse.json(
      {
        success: false,
        venue: "Bright Bear",
        error: error.message || "Bright Bear sync failed",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  // POST endpoint for manual triggering with potential options
  return GET(request);
}
