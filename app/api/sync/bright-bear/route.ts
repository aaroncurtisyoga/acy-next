import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { EventSyncService } from "@/app/_lib/services/event-sync-service";

export async function POST() {
  try {
    // Check if user is authenticated and is an admin
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const syncService = new EventSyncService();
    const result = await syncService.syncBrightBearEvents();

    return NextResponse.json({
      success: true,
      message: `Bright Bear events synced successfully. Synced: ${result.synced}, Deactivated: ${result.deactivated}`,
      data: result,
    });
  } catch (error: any) {
    console.error("Sync failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Sync failed",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: "POST /api/sync/bright-bear",
    description: "Triggers manual sync of Bright Bear Yoga classes",
    authentication: "Required",
  });
}
