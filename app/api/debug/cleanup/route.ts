import { NextResponse } from "next/server";
import prisma from "@/app/_lib/prisma";

export async function POST() {
  // Only allow in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "This endpoint is only available in development" },
      { status: 403 },
    );
  }

  try {
    // Remove any events from today or earlier (past events)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const deletedPastEvents = await prisma.event.deleteMany({
      where: {
        startDateTime: {
          lt: yesterday,
        },
      },
    });

    // Deactivate any events that don't have a proper sourceId or are not from MOMENCE
    const deactivatedStrayEvents = await prisma.event.updateMany({
      where: {
        OR: [
          { sourceType: { not: "MOMENCE" } },
          { sourceId: null },
          { sourceId: "" },
        ],
        startDateTime: {
          gte: new Date(),
        },
      },
      data: {
        isActive: false,
      },
    });

    return NextResponse.json({
      success: true,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      deletedPastEvents: deletedPastEvents.count,
      deactivatedStrayEvents: deactivatedStrayEvents.count,
      message: "Database cleanup completed",
    });
  } catch (error: any) {
    console.error("❌ Cleanup failed:", error);
    return NextResponse.json(
      {
        success: false,
        environment: process.env.NODE_ENV,
        error: error.message || "Cleanup failed",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
