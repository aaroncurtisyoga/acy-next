import { NextResponse } from "next/server";
import { EventSyncService } from "@/app/_lib/services/event-sync-service";

export async function POST() {
  // Only allow in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "This endpoint is only available in development" },
      { status: 403 },
    );
  }

  try {
    console.log("🔄 Starting development sync...");

    const syncService = new EventSyncService();
    const result = await syncService.syncBrightBearEvents();

    console.log(
      `✅ Sync completed: ${result.synced} synced, ${result.deactivated} deactivated`,
    );

    return NextResponse.json({
      success: true,
      environment: process.env.NODE_ENV,
      message: `Development sync completed successfully. Synced: ${result.synced}, Deactivated: ${result.deactivated}`,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("❌ Development sync failed:", error);
    return NextResponse.json(
      {
        success: false,
        environment: process.env.NODE_ENV,
        error: error.message || "Development sync failed",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "This endpoint is only available in development" },
      { status: 403 },
    );
  }

  return NextResponse.json({
    endpoint: "POST /api/dev-sync",
    description:
      "Development-only endpoint to sync Bright Bear Yoga classes to database",
    environment: process.env.NODE_ENV,
    authentication: "Not required in development",
    instructions: [
      "1. Make a POST request to this endpoint to sync data to database",
      "2. After sync, check localhost:3000 to see updated events",
    ],
  });
}
