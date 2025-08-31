import { NextRequest, NextResponse } from "next/server";
import { BrightBearCrawler } from "@/app/_lib/crawlers/bright-bear-crawler";
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
    console.log("🔄 Starting combined sync test...");

    const results = await Promise.allSettled([
      (async () => {
        const crawler = new BrightBearCrawler();
        return await crawler.getAaronClasses();
      })(),
      (async () => {
        const crawler = new DCBPCrawler();
        return await crawler.getScheduledClasses();
      })(),
    ]);

    const response = {
      success: true,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      brightBear: {
        success: false,
        classes: [] as any[],
        error: null as any,
      },
      dcbp: {
        success: false,
        classes: [] as any[],
        error: null as any,
      },
    };

    if (results[0].status === "fulfilled") {
      response.brightBear.success = true;
      response.brightBear.classes = results[0].value;
      console.log(`✅ Got ${results[0].value.length} classes from Bright Bear`);
    } else {
      response.brightBear.error =
        results[0].reason?.message || "Failed to fetch Bright Bear classes";
      console.error("❌ Bright Bear sync failed:", results[0].reason);
    }

    if (results[1].status === "fulfilled") {
      response.dcbp.success = true;
      response.dcbp.classes = results[1].value;
      console.log(`✅ Got ${results[1].value.length} classes from DCBP`);
    } else {
      response.dcbp.error =
        results[1].reason?.message || "Failed to fetch DCBP classes";
      console.error("❌ DCBP sync failed:", results[1].reason);
    }

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("❌ Combined sync failed:", error);
    return NextResponse.json(
      {
        success: false,
        environment: process.env.NODE_ENV,
        error: error.message || "Combined sync failed",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
