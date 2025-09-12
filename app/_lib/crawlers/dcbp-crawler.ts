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

      // Wait for dashboard to load first
      await page.waitForSelector(
        '.page-title:has-text("Your Upcoming Schedule"), h1:has-text("Your Upcoming Schedule"), h2:has-text("Your Upcoming Schedule")',
        { timeout: 15000 },
      );
      console.log("✅ Successfully logged in to dashboard");

      // Navigate to Schedule through header dropdown
      console.log("📅 Navigating to Schedule through header menu...");

      // Step 1: Click the Schedule button in header to trigger dropdown
      await page.waitForSelector(
        'a[data-helpers--links-active-pattern="shifts|swaps|time_offs"][data-toggle="dropdown"]',
        {
          state: "visible",
          timeout: 10000,
        },
      );
      await page.click(
        'a[data-helpers--links-active-pattern="shifts|swaps|time_offs"][data-toggle="dropdown"]',
      );
      console.log("✅ Clicked Schedule button in header");

      // Step 2: Wait for dropdown and click Schedule item
      await page.waitForSelector(".dropdown-menu.show", {
        state: "visible",
        timeout: 10000,
      });
      await page.waitForTimeout(500); // Let dropdown animation complete

      await page.click('.dropdown-menu.show a[href*="/shifts"]:first-of-type');
      console.log("✅ Clicked Schedule item in dropdown");

      // Wait for navigation to schedule page
      await page.waitForURL("**/shifts**", { timeout: 15000 });
      console.log("✅ Navigated to shifts page");

      // Step 3: Click "Yours" filter to see only your shifts
      console.log("🔄 Selecting 'Yours' filter...");
      await page.waitForSelector(".variation-type-menu", { timeout: 10000 });

      // Click the "Yours" link
      await page.click(
        '.variation-type-menu a[href*="variation=parent_assignment"]',
      );
      console.log("✅ Selected 'Yours' filter");

      // Wait for page to reload with filtered results
      await page.waitForTimeout(2000);

      // Step 4: Switch from Week view to Month view
      console.log("📅 Switching to Month view...");

      // Click the view dropdown (might show "Week" initially)
      const viewDropdownSelector =
        'a[data-toggle="dropdown"]:has-text("Week"), a[data-toggle="dropdown"]:has-text("Month")';
      await page.waitForSelector(viewDropdownSelector, { timeout: 10000 });
      await page.click(viewDropdownSelector);
      console.log("✅ Opened view dropdown");

      // Wait for dropdown menu to appear
      await page.waitForSelector(
        '.dropdown-menu:has(a[href*="interval=month"])',
        {
          state: "visible",
          timeout: 5000,
        },
      );
      await page.waitForTimeout(300);

      // Click "Month" option in dropdown
      await page.click('.dropdown-menu a[href*="interval=month"]');
      console.log("✅ Selected Month view");

      // Wait for calendar to load in month view
      await page.waitForSelector(".calendar-wrapper", { timeout: 15000 });
      await page.waitForSelector(".calendar-header", { timeout: 10000 });
      await page.waitForSelector(".date-header .date", { timeout: 10000 });
      console.log("✅ Calendar loaded in Month view");

      // Verify we're in the right view
      const currentUrl = page.url();
      console.log(`📍 Current URL: ${currentUrl}`);
      if (!currentUrl.includes("variation=parent_assignment")) {
        console.warn(
          "⚠️ URL doesn't include 'Yours' filter, may see all shifts",
        );
      }
      if (!currentUrl.includes("interval=month")) {
        console.warn(
          "⚠️ URL doesn't include month interval, may be in wrong view",
        );
      }

      // Get current date to determine which month to start from
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth(); // 0-based (0 = January)
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      // Check current month shown in calendar
      const currentMonthText = await page.textContent(
        '[data-target="layouts--date-range-picker.pickerText"]',
      );
      console.log(`Current month shown: ${currentMonthText}`);

      // Navigate to current month if needed
      const targetMonthName = monthNames[currentMonth];
      const targetMonthYear = currentYear;

      if (
        !currentMonthText?.includes(targetMonthYear.toString()) ||
        !currentMonthText?.includes(targetMonthName.substring(0, 3))
      ) {
        console.log(
          `📅 Navigating to ${targetMonthName} ${targetMonthYear}...`,
        );

        // Try to navigate to current month (max 12 attempts)
        for (let attempts = 0; attempts < 12; attempts++) {
          const monthText = await page.textContent(
            '[data-target="layouts--date-range-picker.pickerText"]',
          );
          console.log(`Currently viewing: ${monthText}`);

          if (
            monthText?.includes(targetMonthName.substring(0, 3)) &&
            monthText?.includes(targetMonthYear.toString())
          ) {
            console.log(`✅ Reached ${targetMonthName} ${targetMonthYear}`);
            break;
          }

          // Determine if we need to go forward or backward
          // Parse the current month being displayed
          const currentDisplayMonth = monthNames.findIndex((m) =>
            monthText?.includes(m.substring(0, 3)),
          );
          const currentDisplayYear = parseInt(
            monthText?.match(/\d{4}/)?.[0] || "0",
          );

          const shouldGoForward =
            currentDisplayYear < targetMonthYear ||
            (currentDisplayYear === targetMonthYear &&
              currentDisplayMonth < currentMonth);

          if (shouldGoForward) {
            await page.click(
              'a[data-action*="layouts--date-range-picker#next"]',
            );
          } else {
            await page.click(
              'a[data-action*="layouts--date-range-picker#previous"]',
            );
          }
          await page.waitForTimeout(1000);
        }
      }

      // Wait for the calendar to load
      await page.waitForSelector(".calendar-wrapper", { timeout: 10000 });

      // Get current URL to confirm which page we're on
      const schedulePageUrl = page.url();
      console.log(`📍 Schedule page: ${schedulePageUrl}`);

      // Get classes from current month and next 2 months (3 months total)
      const allClasses = [];
      const monthsToCheck = 3; // Check current month + next 2 months

      console.log(
        `📅 Will check ${monthsToCheck} months starting from ${monthNames[currentMonth]} ${currentYear}`,
      );

      for (let monthIndex = 0; monthIndex < monthsToCheck; monthIndex++) {
        // Get current month text
        const monthText = await page.textContent(
          '[data-target="layouts--date-range-picker.pickerText"]',
        );

        console.log(`\n📅 Extracting classes from ${monthText}...`);
        const monthResult = await this.extractClassesFromCurrentView(page);

        console.log(`📊 ${monthText} extraction results:`);
        console.log(
          `  - Schedule items found: ${monthResult.debugInfo.scheduleItems}`,
        );
        console.log(
          `  - Shift elements found: ${monthResult.debugInfo.shiftElements}`,
        );
        console.log(`  - Aaron's shifts: ${monthResult.debugInfo.aaronShifts}`);
        console.log(
          `  - Classes extracted: ${monthResult.debugInfo.totalResults}`,
        );

        allClasses.push(...monthResult.results);

        // Navigate to next month if not the last iteration
        if (monthIndex < monthsToCheck - 1) {
          console.log("➡️ Moving to next month...");

          const currentMonthTextBeforeNav = monthText;

          // Click next month arrow
          await page.click('a[data-action*="layouts--date-range-picker#next"]');

          // Wait for month to change
          await page.waitForFunction(
            (oldText: string) => {
              const element = document.querySelector(
                '[data-target="layouts--date-range-picker.pickerText"]',
              );
              return element && element.textContent !== oldText;
            },
            currentMonthTextBeforeNav,
            { timeout: 5000 },
          );

          // Wait for calendar to re-render
          await page.waitForTimeout(2000);

          const newMonthText = await page.textContent(
            '[data-target="layouts--date-range-picker.pickerText"]',
          );
          console.log(`Now showing: ${newMonthText}`);
        }
      }

      console.log(
        `\n🎯 Found total ${allClasses.length} classes across ${monthsToCheck} months`,
      );

      return allClasses.map((cls) => this.parseClassData(cls));
    } catch (error) {
      console.error("Error crawling DCBP/ZoomShift:", error);
      throw error;
    } finally {
      await browser.close();
    }
  }

  private async extractClassesFromCurrentView(page: any) {
    // Extract the schedule data from current calendar view
    const extractionResult = await page.evaluate(() => {
      const results: any[] = [];
      const debugInfo = {
        scheduleItems: 0,
        anchorScheduleItems: 0,
        shifts: 0,
        shiftElements: 0,
        aaronShifts: 0,
        items: [] as any[],
        parseIssues: [] as any[],
        totalResults: 0,
      };
      const currentYear = new Date().getFullYear();

      // Get the calendar month from the date picker (more reliable)
      let calendarMonth = new Date().getMonth();
      let calendarYear = currentYear;

      const datePickerElement = document.querySelector(
        '[data-target="layouts--date-range-picker.pickerText"]',
      );
      const datePickerText = datePickerElement?.textContent || "";
      console.log("Date picker shows:", datePickerText);

      // Parse month and year from "August 2024" format
      const monthYearMatch = datePickerText.match(
        /(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/i,
      );
      if (monthYearMatch) {
        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        calendarMonth = monthNames.findIndex(
          (m) => m.toLowerCase() === monthYearMatch[1].toLowerCase(),
        );
        calendarYear = parseInt(monthYearMatch[2]);
        console.log(
          `Calendar showing: ${monthNames[calendarMonth]} ${calendarYear}`,
        );
      } else {
        console.log("Could not parse date picker, using current month/year");
      }

      // Debug: log all schedule items to see what's available
      const allScheduleItems = document.querySelectorAll(".schedule-item");
      debugInfo.scheduleItems = allScheduleItems.length;

      // Also check for anchors with schedule-item class
      const allAnchorScheduleItems =
        document.querySelectorAll("a.schedule-item");
      debugInfo.anchorScheduleItems = allAnchorScheduleItems.length;

      // Check for shifts specifically
      const allShifts = document.querySelectorAll(".shift");
      debugInfo.shifts = allShifts.length;

      // Debug: Check what kind of calendar view we have
      const calendarWrapper = document.querySelector(".calendar-wrapper");
      const dateHeaders = document.querySelectorAll(".date-header");
      const dates = document.querySelectorAll(".date");

      console.log(`Calendar debugging:
          - Calendar wrapper found: ${!!calendarWrapper}
          - Date headers found: ${dateHeaders.length}
          - Date elements found: ${dates.length}
          - URL: ${window.location.href}
          - Page title: ${document.title}
        `);

      // Sample first few date headers to see format
      if (dates.length > 0) {
        console.log("First few dates found:");
        for (let i = 0; i < Math.min(5, dates.length); i++) {
          console.log(`  Date ${i}: "${dates[i].textContent?.trim()}"`);
        }
      }

      allAnchorScheduleItems.forEach((item: any, index: number) => {
        const classes = Array.from(item.classList).join(" ");
        const text = item.textContent?.substring(0, 200) || "";
        debugInfo.items.push({
          index,
          classes,
          text,
          hasShiftClass: item.classList.contains("shift"),
        });
      });

      // Find all shift items (classes I'm teaching)
      const shiftElements = document.querySelectorAll("a.schedule-item.shift");

      debugInfo.shiftElements = shiftElements.length;

      debugInfo.parseIssues.push({
        step: "starting_foreach",
        shiftElementsLength: shiftElements.length,
      });

      shiftElements.forEach((shift: any) => {
        debugInfo.aaronShifts++;
        debugInfo.parseIssues.push({
          step: "processing_shift",
          shiftId: shift.getAttribute("data-id"),
        });

        // The shift is inside schedule-item-list, which is inside the cell
        const scheduleList = shift.closest(".schedule-item-list");
        const cell = scheduleList?.parentElement;

        // Log the full cell HTML to see the structure
        if (cell) {
          console.log(
            `Cell HTML for shift ${shift.getAttribute("data-id")}:`,
            cell.innerHTML.substring(0, 600),
          );
        }
        debugInfo.parseIssues.push({
          step: "cell_check",
          cellFound: !!cell,
          shiftId: shift.getAttribute("data-id"),
        });
        if (!cell) return;

        // Get date from data attribute (more reliable than DOM parsing)
        const dateIndex = scheduleList?.getAttribute(
          "data-renditions--schedule-item-list-date-index",
        );

        let dateText = "";
        let day = 1;
        let month = calendarMonth;
        let year = calendarYear;

        // Find the date header in the same cell as the schedule item list
        const dateHeader = cell?.querySelector(".date-header .date");
        if (dateHeader) {
          dateText = dateHeader.textContent?.trim() || "";
          // Extract just the numeric part, ignoring month abbreviations like "Aug 1"
          const dayMatch = dateText.match(/(\d{1,2})/);
          day = dayMatch ? parseInt(dayMatch[1]) : 1;

          // Check if date contains month abbreviation to determine which month
          const monthMatch = dateText.match(
            /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i,
          );
          if (monthMatch) {
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
              monthMatch[1].toLowerCase().includes(m.toLowerCase()),
            );
            if (monthIndex !== -1) {
              month = monthIndex;
              // If month is before current calendar month, assume next year
              if (monthIndex < calendarMonth) {
                year = calendarYear + 1;
              } else {
                year = calendarYear;
              }
            }
          }
        } else {
          console.warn(
            `No date header found for shift ${shift.getAttribute("data-id")}, skipping`,
          );
          return;
        }

        debugInfo.parseIssues.push({
          step: "date_header_check",
          dateHeaderFound: !!dateHeader,
          dateHeaderText: dateHeader?.textContent?.trim() || "",
          dateIndexFound: !!dateIndex,
          dateIndexValue: dateIndex || "",
          extractedDateText: dateText,
          finalDay: day,
          finalMonth: month,
          finalYear: year,
          cellClasses: cell?.className || "",
          cellTagName: cell?.tagName || "",
          cellInnerHtml: cell?.innerHTML?.substring(0, 400) || "",
          scheduleListFound: !!scheduleList,
          usedDomParsing: !!dateHeader,
          shiftId: shift.getAttribute("data-id"),
        });
        if (!dateText) return;

        // Handle month padding cells (previous/next month dates)
        if (cell.classList.contains("month-padding")) {
          // These are previous or next month dates at the edges of the calendar
          if (day > 15) {
            // High day numbers at start of calendar = previous month
            month = calendarMonth - 1;
            if (month < 0) {
              month = 11;
              year = calendarYear - 1;
            }
          } else {
            // Low day numbers at end of calendar = next month
            month = calendarMonth + 1;
            if (month > 11) {
              month = 0;
              year = calendarYear + 1;
            }
          }
        }

        // Extract time from the shift element
        const titleElement = shift.querySelector(".title");
        const timeText = titleElement?.textContent?.trim() || "";

        // Log the specific date and time for debugging
        console.log(
          `Shift ${shift.getAttribute("data-id")} on ${month + 1}/${day}/${year}: "${timeText}"`,
        );

        debugInfo.parseIssues.push({
          step: "time_parsing",
          titleElementFound: !!titleElement,
          timeText: timeText,
          shiftId: shift.getAttribute("data-id"),
        });

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
        const finalDetailsElement = shift.querySelector(".details");
        const finalDetailsText = finalDetailsElement?.textContent?.trim() || "";

        // Parse details (format: "Aaron Curtis • Yoga Instructor • Hot Power Flow")
        const detailsParts = finalDetailsText
          .split("•")
          .map((s: string) => s.trim());
        const instructorName = detailsParts[0] || "Aaron Curtis";
        const role = detailsParts[1] || "Yoga Instructor";
        const classType = detailsParts[2] || "Yoga Class";

        // Get shift ID for uniqueness
        const shiftId = shift.getAttribute("data-id") || "";

        debugInfo.parseIssues.push({
          step: "final_check",
          day: day,
          startTime: startTime,
          endTime: endTime,
          timeMatch: !!timeMatch,
          instructorName: instructorName,
          willAdd: !!(startTime && day),
        });

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
            rawDetails: finalDetailsText,
            rawTime: timeText,
          });
        }
      });

      debugInfo.totalResults = results.length;
      return { results, debugInfo };
    });

    console.log(
      `Found ${extractionResult.results.length} scheduled classes in current view`,
    );
    return extractionResult;
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
      console.warn(`Failed to parse time string: ${timeStr}`);
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

    // Create date string formatted for EST/EDT
    const monthStr = String(month + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    const hoursStr = String(hours).padStart(2, "0");
    const minutesStr = String(minutes).padStart(2, "0");

    // Determine if this date is in EDT (daylight saving time) or EST
    // DST in 2025: March 9 - November 2
    const testDate = new Date(year, month, day);
    const isDST = this.isDaylightSavingTime(testDate);

    // Create ISO string with proper timezone offset
    // EDT is UTC-4, EST is UTC-5
    const offset = isDST ? "-04:00" : "-05:00";
    const dateStr = `${year}-${monthStr}-${dayStr}T${hoursStr}:${minutesStr}:00${offset}`;

    const resultDate = new Date(dateStr);

    // Debug logging
    console.log(`Parsing time: ${timeStr} on ${year}-${month + 1}-${day}`);
    console.log(`Is DST: ${isDST}, Using offset: ${offset}`);
    console.log(`ISO string: ${dateStr}`);
    console.log(`Result date UTC: ${resultDate.toISOString()}`);
    console.log(
      `Result date ET: ${resultDate.toLocaleString("en-US", { timeZone: "America/New_York" })}`,
    );

    return resultDate;
  }

  private isDaylightSavingTime(date: Date): boolean {
    // DST in the US starts on the second Sunday of March
    // and ends on the first Sunday of November
    const year = date.getFullYear();

    // Find second Sunday of March
    const march = new Date(year, 2, 1); // March 1st
    const dstStart = new Date(year, 2, 1 + (14 - march.getDay()));

    // Find first Sunday of November
    const november = new Date(year, 10, 1); // November 1st
    const dstEnd = new Date(year, 10, 1 + (7 - november.getDay()));

    return date >= dstStart && date < dstEnd;
  }
}
