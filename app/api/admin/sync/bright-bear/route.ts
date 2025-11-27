import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { EventSyncService } from "@/app/_lib/services/event-sync-service";

export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await currentUser();
    const isAdmin = user?.publicMetadata?.role === "admin";

    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const syncService = new EventSyncService();
    const result = await syncService.syncBrightBearEvents();

    return NextResponse.json({
      success: true,
      message: `Synced ${result.synced} classes, deactivated ${result.deactivated} old events`,
      synced: result.synced,
      deactivated: result.deactivated,
    });
  } catch (error: unknown) {
    console.error("Bright Bear sync failed:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Bright Bear sync failed";
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 },
    );
  }
}
