import { chromium } from "playwright-core";

interface DCBPClass {
  id: string;
  title: string;
  instructor: string;
  startDateTime: Date;
  endDateTime: Date;
  location: string;
  type: string;
}

export class DCBPCrawler {
  private loginUrl = "https://app.zoomshift.com/";
  private email = process.env.ZOOMSHIFT_EMAIL;
  private password = process.env.ZOOMSHIFT_PASSWORD;

  async getScheduledClasses(): Promise<DCBPClass[]> {
    console.log("🔄 Launching browser for DCBP/ZoomShift scraping...");

    if (!process.env.BROWSERLESS_API_TOKEN) {
      throw new Error("BROWSERLESS_API_TOKEN is required for web scraping");
    }

    if (!this.email || !this.password) {
      throw new Error(
        "ZOOMSHIFT_EMAIL and ZOOMSHIFT_PASSWORD environment variables are required",
      );
    }

    const browser = await chromium.connectOverCDP(
      `wss://production-sfo.browserless.io?token=${process.env.BROWSERLESS_API_TOKEN}`,
    );

    try {
      const page = await browser.newPage();
      // Reduce timeout for faster execution on Vercel
      page.setDefaultTimeout(20000);

      // Set minimal page settings for faster loading
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.setExtraHTTPHeaders({
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      });

      console.log(`📍 Navigating to ZoomShift login: ${this.loginUrl}`);
      await page.goto(this.loginUrl, {
        waitUntil: "domcontentloaded",
        timeout: 15000,
      });

      console.log("🔐 Logging in to ZoomShift...");

      // Wait for and fill in the email field
      await page.waitForSelector(
        'input[type="email"], input[name="email"], input[placeholder*="email" i]',
      );
      await page.fill(
        'input[type="email"], input[name="email"], input[placeholder*="email" i]',
        this.email!,
      );

      // Fill in the password field
      await page.waitForSelector(
        'input[type="password"], input[name="password"]',
      );
      await page.fill(
        'input[type="password"], input[name="password"]',
        this.password!,
      );

      // Click the login button
      await page.click(
        'button[type="submit"], input[type="submit"], button:has-text("Log in"), button:has-text("Sign in")',
      );

      // Wait for navigation after login
      console.log("⏳ Waiting for dashboard to load...");
      await page.waitForURL("**/app.zoomshift.com/**", {
        waitUntil: "domcontentloaded",
        timeout: 15000,
      });

      // Wait for the schedule section to load
      await page.waitForSelector(
        '.page-title:has-text("Your Upcoming Schedule"), h1:has-text("Your Upcoming Schedule"), h2:has-text("Your Upcoming Schedule")',
        { timeout: 15000 },
      );
      console.log("✅ Successfully logged in and found schedule section");

      // Wait for the calendar to load
      await page.waitForSelector(".calendar-wrapper", { timeout: 10000 });
      console.log("📅 Calendar loaded, extracting classes...");

      // Extract the schedule data
      const classes = await page.evaluate(() => {
        const results = [];
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();

        // Find all shift items (classes I'm teaching)
        const shiftElements = document.querySelectorAll(".schedule-item.shift");

        console.log(`Found ${shiftElements.length} shift elements`);

        shiftElements.forEach((shift: any) => {
          // Get the cell containing this shift to find the date
          const cell = shift.closest(".cell");
          if (!cell) return;

          // Get the date from the cell's date header
          const dateHeader = cell.querySelector(".date-header .date");
          if (!dateHeader) return;

          let dateText = dateHeader.textContent?.trim() || "";
          let month = currentMonth;
          let year = currentYear;

          // Check if the date includes month name
          const monthSpan = dateHeader.querySelector(".month");
          if (monthSpan) {
            const monthName = monthSpan.textContent?.trim() || "";
            const monthNames = [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ];
            const monthIndex = monthNames.findIndex((m) =>
              monthName.includes(m),
            );
            if (monthIndex !== -1) {
              month = monthIndex;
              // If the month is earlier than current month, it's likely next year
              if (monthIndex < currentMonth) {
                year = currentYear + 1;
              }
            }
            // Remove month from dateText
            dateText = dateText.replace(monthName, "").trim();
          }

          const day = parseInt(dateText) || 1;

          // Extract time from the shift element
          const titleElement = shift.querySelector(".title");
          const timeText = titleElement?.textContent?.trim() || "";

          // Parse time range (e.g., "4:30pm - 5:30pm")
          const timeMatch = timeText.match(
            /(\d{1,2}:\d{2}[ap]m)\s*-\s*(\d{1,2}:\d{2}[ap]m)/i,
          );

          let startTime = "";
          let endTime = "";
          if (timeMatch) {
            startTime = timeMatch[1];
            endTime = timeMatch[2];
          }

          // Extract details (instructor name, role, class type)
          const detailsElement = shift.querySelector(".details");
          const detailsText = detailsElement?.textContent?.trim() || "";

          // Parse details (format: "Aaron Curtis • Yoga Instructor • Hot Power Flow")
          const detailsParts = detailsText
            .split("•")
            .map((s: string) => s.trim());
          const instructorName = detailsParts[0] || "Aaron Curtis";
          const role = detailsParts[1] || "Yoga Instructor";
          const classType = detailsParts[2] || "Yoga Class";

          // Get shift ID for uniqueness
          const shiftId = shift.getAttribute("data-id") || "";

          if (startTime && day) {
            results.push({
              id: shiftId,
              day,
              month,
              year,
              startTime,
              endTime,
              instructor: instructorName,
              role,
              classType,
              rawDetails: detailsText,
              rawTime: timeText,
            });
          }
        });

        return results;
      });

      console.log(`Found ${classes.length} scheduled classes`);
      if (classes.length > 0) {
        console.log("Sample class data:", classes[0]);
      }

      // Parse and convert the raw data to DCBPClass format
      return classes.map((cls) => this.parseClassData(cls));
    } catch (error) {
      console.error("Error crawling DCBP/ZoomShift:", error);
      throw error;
    } finally {
      await browser.close();
    }
  }

  private parseClassData(rawClass: any): DCBPClass {
    // Create date objects from the extracted data
    const startDateTime = this.parseDateTime(
      rawClass.year,
      rawClass.month,
      rawClass.day,
      rawClass.startTime,
    );

    const endDateTime = this.parseDateTime(
      rawClass.year,
      rawClass.month,
      rawClass.day,
      rawClass.endTime,
    );

    return {
      id: `dcbp-${rawClass.id || Date.now()}`,
      title: rawClass.classType || "Yoga Class",
      instructor: rawClass.instructor || "Aaron Curtis",
      startDateTime,
      endDateTime,
      location: "DC Bouldering Project",
      type: rawClass.classType || "Hot Power Flow",
    };
  }

  private parseDateTime(
    year: number,
    month: number,
    day: number,
    timeStr: string,
  ): Date {
    // Parse time string like "4:30pm" or "5:30pm"
    const timeLower = timeStr.toLowerCase();
    const match = timeLower.match(/(\d{1,2}):(\d{2})([ap]m)/);

    if (!match) {
      // Return a default date if parsing fails
      return new Date();
    }

    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const isPM = match[3] === "pm";

    // Convert to 24-hour format
    if (isPM && hours !== 12) {
      hours += 12;
    } else if (!isPM && hours === 12) {
      hours = 0;
    }

    return new Date(year, month, day, hours, minutes);
  }
}
