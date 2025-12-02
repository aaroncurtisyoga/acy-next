import { NextResponse, after } from "next/server";
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

    // Fire-and-forget: run sync in background after response is sent
    after(async () => {
      try {
        const syncService = new EventSyncService();
        const result = await syncService.syncBrightBearEvents();
        console.log(
          `[Bright Bear] Sync completed: ${result.synced} synced, ${result.deactivated} deactivated`,
        );
      } catch (error) {
        console.error("[Bright Bear] Background sync failed:", error);
      }
    });

    return NextResponse.json({
      success: true,
      message: "Sync started. Check back shortly for updated classes.",
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
