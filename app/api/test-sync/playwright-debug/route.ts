import { NextRequest, NextResponse } from "next/server";
import { chromium } from "playwright-core";

export async function GET(_request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "This endpoint is only available in development" },
      { status: 403 },
    );
  }

  try {
    console.log("🔍 Debug: Testing Browserless setup...");

    // Always use Browserless for consistency
    if (!process.env.BROWSERLESS_API_TOKEN) {
      throw new Error("BROWSERLESS_API_TOKEN is required");
    }

    console.log("Mode: Browserless");

    const browser = await chromium.connectOverCDP(
      `wss://production-sfo.browserless.io?token=${process.env.BROWSERLESS_API_TOKEN}`,
    );
    console.log("✅ Browser connected successfully");

    const page = await browser.newPage();
    console.log("✅ New page created");

    await page.goto("https://example.com", {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    console.log("✅ Navigation successful");

    const title = await page.title();
    console.log("✅ Page title:", title);

    await browser.close();
    console.log("✅ Browser closed successfully");

    return NextResponse.json({
      success: true,
      message: "Browser test completed successfully",
      mode: "Browserless",
      title,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("❌ Debug test failed:", error);
    return NextResponse.json(
      {
        success: false,
        environment: process.env.NODE_ENV,
        error: error.message || "Debug test failed",
        stack: error.stack,
      },
      { status: 500 },
    );
  }
}
