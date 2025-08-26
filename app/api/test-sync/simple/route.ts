import { NextRequest, NextResponse } from "next/server";
import { BrightBearCrawler } from "@/app/_lib/crawlers/bright-bear-crawler";

export async function GET(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "This endpoint is only available in development" },
      { status: 403 },
    );
  }

  try {
    console.log("🔄 Starting simple sync test...");

    const crawler = new BrightBearCrawler();
    const classes = await crawler.getAaronClasses();

    console.log(`✅ Got ${classes.length} mock classes`);

    return NextResponse.json({
      success: true,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      classes: classes,
      message: "Mock data returned successfully for development",
    });
  } catch (error: any) {
    console.error("❌ Simple sync failed:", error);
    return NextResponse.json(
      {
        success: false,
        environment: process.env.NODE_ENV,
        error: error.message || "Simple sync failed",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
