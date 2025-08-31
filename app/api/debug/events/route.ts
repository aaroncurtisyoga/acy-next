import { NextResponse } from "next/server";
import prisma from "@/app/_lib/prisma";

export async function GET() {
  // Only allow in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "This endpoint is only available in development" },
      { status: 403 },
    );
  }

  try {
    const events = await prisma.event.findMany({
      where: {
        isActive: true,
        startDateTime: {
          gte: new Date(), // Only future events
        },
      },
      select: {
        id: true,
        title: true,
        startDateTime: true,
        endDateTime: true,
        sourceType: true,
        sourceId: true,
        externalUrl: true,
        isExternal: true,
        price: true,
        description: true,
        lastSynced: true,
        location: {
          select: {
            name: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        startDateTime: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      totalEvents: events.length,
      events: events.map((event) => ({
        ...event,
        startDateTimeEST: event.startDateTime.toLocaleString("en-US", {
          timeZone: "America/New_York",
          weekday: "long",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      })),
    });
  } catch (error: any) {
    console.error("❌ Debug events failed:", error);
    return NextResponse.json(
      {
        success: false,
        environment: process.env.NODE_ENV,
        error: error.message || "Debug events failed",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
