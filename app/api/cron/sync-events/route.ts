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
    const result = await syncService.syncAllEvents();

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
