import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/app/_lib/prisma";

export async function GET() {
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

    // Get last sync times for both sources in parallel
    const [brightBearLastSync, dcbpLastSync] = await Promise.all([
      prisma.event.findFirst({
        where: { sourceType: "MOMENCE" },
        orderBy: { lastSynced: "desc" },
        select: { lastSynced: true },
      }),
      prisma.event.findFirst({
        where: { sourceType: "ZOOMSHIFT" },
        orderBy: { lastSynced: "desc" },
        select: { lastSynced: true },
      }),
    ]);

    return NextResponse.json({
      brightBear: brightBearLastSync?.lastSynced ?? null,
      dcbp: dcbpLastSync?.lastSynced ?? null,
    });
  } catch (error: unknown) {
    console.error("Failed to get sync status:", error);
    return NextResponse.json(
      { error: "Failed to get sync status" },
      { status: 500 },
    );
  }
}
