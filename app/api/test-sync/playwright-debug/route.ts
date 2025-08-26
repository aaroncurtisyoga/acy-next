import { NextRequest, NextResponse } from "next/server";
import { chromium } from "playwright";

export async function GET(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "This endpoint is only available in development" },
      { status: 403 },
    );
  }

  try {
    console.log("🔍 Debug: Testing Playwright setup...");

    const browser = await chromium.launch({
      headless: true,
      timeout: 30000,
    });
    console.log("✅ Browser launched successfully");

    const page = await browser.newPage();
    console.log("✅ New page created");

    await page.goto("https://example.com", {
      waitUntil: "networkidle",
      timeout: 30000,
    });
    console.log("✅ Navigation successful");

    const title = await page.title();
    console.log("✅ Page title:", title);

    await browser.close();
    console.log("✅ Browser closed successfully");

    return NextResponse.json({
      success: true,
      message: "Playwright test completed successfully",
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
