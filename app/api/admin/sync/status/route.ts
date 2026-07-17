import { NextResponse } from "next/server";
import prisma from "@/app/_lib/prisma";
import { assertAdminRequest } from "@/app/_lib/api-auth";
import { SOURCE_TYPES } from "@/app/_lib/constants";

export async function GET() {
  try {
    const denied = await assertAdminRequest();
    if (denied) return denied;

    // Get last sync times for both sources in parallel
    const [brightBearLastSync, dcbpLastSync] = await Promise.all([
      prisma.event.findFirst({
        where: { sourceType: SOURCE_TYPES.BRIGHT_BEAR },
        orderBy: { lastSynced: "desc" },
        select: { lastSynced: true },
      }),
      prisma.event.findFirst({
        where: { sourceType: SOURCE_TYPES.DCBP },
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
