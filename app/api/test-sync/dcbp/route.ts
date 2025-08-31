import { NextRequest, NextResponse } from "next/server";
import { DCBPCrawler } from "@/app/_lib/crawlers/dcbp-crawler";

export async function GET(_request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "This endpoint is only available in development" },
      { status: 403 },
    );
  }

  try {
    console.log("🔄 Starting DCBP sync test...");

    const crawler = new DCBPCrawler();
    const classes = await crawler.getScheduledClasses();

    console.log(`✅ Got ${classes.length} DCBP classes`);

    return NextResponse.json({
      success: true,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      classes: classes,
      source: "DC Bouldering Project (ZoomShift)",
      message: "DCBP classes retrieved successfully for development",
    });
  } catch (error: any) {
    console.error("❌ DCBP sync failed:", error);
    return NextResponse.json(
      {
        success: false,
        environment: process.env.NODE_ENV,
        source: "DC Bouldering Project (ZoomShift)",
        error: error.message || "DCBP sync failed",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
