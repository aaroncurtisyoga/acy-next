import { chromium } from "playwright";

interface MomenceClass {
  id: string;
  title: string;
  instructor: string;
  startDateTime: Date;
  endDateTime: Date;
  bookingUrl: string;
  price?: string;
}

export class BrightBearCrawler {
  private baseUrl = "https://www.brightbearyogadc.com/book-a-class";

  async getAaronClasses(): Promise<MomenceClass[]> {
    console.log("🔄 Launching browser for web scraping...");

    const browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      const page = await browser.newPage();

      console.log(`📍 Navigating to ${this.baseUrl}...`);
      await page.goto(this.baseUrl, { waitUntil: "networkidle" });

      // Wait for the async content to load - look for the session list container
      console.log("⏳ Waiting for async content to load...");
      await page.waitForSelector(
        ".sc-12ui18s-1.jxVRBv.momence-host_schedule-session_list",
        { timeout: 10000 },
      );

      // Take a screenshot for debugging
      await page.screenshot({ path: "debug-screenshot.png" });
      console.log("📸 Screenshot saved to debug-screenshot.png");

      // Log the page content to see what's there
      const pageTitle = await page.title();
      console.log(`📄 Page title: ${pageTitle}`);

      // Look for the instructor dropdown button
      const instructorDropdown = await page.$(
        'button[id*="headlessui-listbox-button"]',
      );

      if (instructorDropdown) {
        console.log("📋 Found instructor dropdown...");

        // Check if Aaron is already selected by looking at the button text
        const buttonText = await instructorDropdown.textContent();
        console.log(`Current selection: ${buttonText}`);

        if (!buttonText?.includes("Aaron Curtis")) {
          console.log("🔄 Aaron not selected, clicking dropdown...");

          // Click on the dropdown to open it
          await instructorDropdown.click();
          await page.waitForTimeout(1000);

          // Wait for dropdown options to appear and select Aaron
          const aaronOption = await page.$("text=/Aaron Curtis/i");
          if (aaronOption) {
            console.log("✅ Found Aaron in dropdown, selecting...");
            await aaronOption.click();
            await page.waitForTimeout(3000); // Wait for filtering to complete
          } else {
            console.log("⚠️ Aaron Curtis not found in dropdown options");
          }
        } else {
          console.log("✅ Aaron Curtis already selected");
        }
      } else {
        console.log("⚠️ Instructor dropdown not found");
      }

      // Extract classes from the page using the correct Momence selectors
      console.log("🔍 Starting class extraction...");

      const classes = await page.evaluate(() => {
        const results = [];

        // Target the specific class article elements in the Momence session list
        const classElements = document.querySelectorAll(
          "article[data-session_id]",
        );

        console.log(`Found ${classElements.length} class articles`);

        classElements.forEach((article: any) => {
          // Extract class title - use stable momence class and fallback to h4
          const titleEl = article.querySelector(
            ".momence-host_schedule-session_list-item-title, h4",
          );
          const title = titleEl?.textContent?.trim() || "";

          // Extract instructor name - use stable class or look for name pattern
          let instructorEl = article.querySelector(
            ".momence-session-teacher .sc-czlrj2-2, .momence-session-teacher div:nth-child(2) div",
          );
          if (!instructorEl) {
            // Fallback: look for text pattern with pronouns and "Show bio"
            const teacherSection = article.querySelector(
              ".momence-session-teacher",
            );
            if (teacherSection) {
              const text = teacherSection.textContent || "";
              const nameMatch = text.match(
                /([A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s*\([^)]*\)/,
              );
              if (nameMatch) {
                instructorEl = { textContent: nameMatch[1] };
              }
            }
          }
          let instructor = instructorEl?.textContent?.trim() || "";
          instructor = instructor.replace(/Show bio/gi, "").trim();

          // Extract date from the date label preceding this article
          let dateTime = "";

          // Look for preceding date label with stable class
          const precedingTimeEl = article.previousElementSibling;
          if (
            precedingTimeEl &&
            precedingTimeEl.classList.contains(
              "momence-host_schedule-session_list-date_label",
            )
          ) {
            const dateText = precedingTimeEl.textContent?.trim() || "";
            dateTime = dateText.replace(/^(NEXT\s+|TUESDAY,\s*)/i, "").trim();
          }

          // Get the time from within the article using stable class
          const timeEl = article.querySelector(
            ".momence-session-duration, .momence-host_schedule-session_list-item-info.momence-session-duration",
          );
          if (timeEl) {
            const timeText = timeEl.textContent?.trim() || "";
            // Extract time range and duration (e.g., "6:30 AM - 7:15 AM 45 min")
            const timeMatch = timeText.match(/(\d{1,2}:\d{2}\s*[AP]M)/);
            if (timeMatch && dateTime) {
              dateTime += ` ${timeMatch[1]}`;
            }
          }

          // Extract price - look for $ sign pattern as fallback
          let priceEl = article.querySelector(
            ".momence-host_schedule-session_list-item-price div:last-child",
          );
          if (!priceEl) {
            // Fallback: find any element containing price pattern
            const allElements = article.querySelectorAll("*");
            for (const el of allElements) {
              if (el.textContent && el.textContent.match(/^\$\d+$/)) {
                priceEl = el;
                break;
              }
            }
          }
          const price = priceEl?.textContent?.trim() || "";

          // Extract booking URL from the "Book now" link - this should be stable
          const bookingLinkEl = article.querySelector(
            'a[href*="momence.com/s/"]',
          );
          const bookingUrl = bookingLinkEl?.getAttribute("href") || "";

          // Extract session ID for unique identification - this is stable
          const sessionId = article.getAttribute("data-session_id") || "";

          // Extract class type - use stable class or look for "Class" text
          let classTypeEl = article.querySelector(
            ".momence-host_schedule-session_list-item-type",
          );
          if (!classTypeEl) {
            // Fallback: look for h3 containing "Class"
            classTypeEl = article.querySelector("h3");
          }
          const classType = classTypeEl?.textContent?.trim() || "";

          // Extract description - use stable class or look for long text content
          let descriptionEl = article.querySelector(
            ".momence-host_schedule-session_list-item-description",
          );
          if (!descriptionEl) {
            // Fallback: look for div with title attribute (description preview)
            descriptionEl = article.querySelector("div[title]");
          }
          const description =
            descriptionEl?.textContent?.trim() ||
            descriptionEl?.getAttribute("title")?.trim() ||
            "";

          if (title && instructor && sessionId) {
            results.push({
              title,
              instructor,
              dateTime,
              price,
              bookingUrl,
              sessionId,
              classType,
              description: description.substring(0, 200), // Truncate long descriptions
              debug: {
                sessionId,
                textContent: article.textContent?.substring(0, 300),
                htmlSnippet: article.outerHTML.substring(0, 500),
              },
            });
          }
        });

        return results;
      });

      console.log(`Found ${classes.length} total classes`);
      if (classes.length > 0) {
        console.log("Sample class data:", classes[0]);
      }

      // Since we've already filtered by Aaron through the dropdown,
      // just parse all the returned classes
      const aaronClasses = classes.map((cls) => this.parseClassData(cls));

      console.log(`Found ${aaronClasses.length} classes for Aaron`);

      return aaronClasses;
    } catch (error) {
      console.error("Error crawling Bright Bear:", error);
      throw error;
    } finally {
      await browser.close();
    }
  }

  private parseClassData(rawClass: any): MomenceClass {
    const now = new Date();
    let startDateTime = now;
    let endDateTime = new Date(now.getTime() + 45 * 60 * 1000); // Default 45 min

    // Instructor is already cleaned
    const instructor = rawClass.instructor || "Aaron Curtis";

    // Parse date and time - improved parsing for Momence format
    if (rawClass.dateTime) {
      try {
        // The dateTime comes in formats like:
        // "Tuesday, September 2 6:30 AM" (missing year)
        // "Tuesday, September 9, 2025 6:30 AM" (with year)
        let dateTimeStr = rawClass.dateTime.trim();

        // Clean up common prefixes
        dateTimeStr = dateTimeStr
          .replace(/^(NEXT\s+|TUESDAY,?\s*)/i, "")
          .trim();

        // If the date doesn't include a year, add the current year or next year
        if (!dateTimeStr.match(/\d{4}/)) {
          const currentYear = new Date().getFullYear();
          const currentMonth = new Date().getMonth(); // 0-based

          // Extract month from the date string
          const monthMatch = dateTimeStr.match(
            /(January|February|March|April|May|June|July|August|September|October|November|December)/i,
          );
          if (monthMatch) {
            const monthName = monthMatch[1];
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
            const extractedMonth = monthNames.findIndex(
              (m) => m.toLowerCase() === monthName.toLowerCase(),
            );

            // If the extracted month is before current month, assume next year
            const yearToUse =
              extractedMonth < currentMonth ? currentYear + 1 : currentYear;

            // Insert year after the day number
            dateTimeStr = dateTimeStr.replace(
              /(\d{1,2})(\s+\d{1,2}:\d{2}\s*[AP]M)/i,
              `$1, ${yearToUse}$2`,
            );
          }
        }

        // Try to parse the full date string
        const parsedDate = new Date(dateTimeStr);

        if (!isNaN(parsedDate.getTime()) && parsedDate.getFullYear() > 2024) {
          startDateTime = parsedDate;

          // Extract duration from description or default to 45 minutes
          let duration = 45; // Default for most classes
          if (rawClass.description) {
            const durationMatch =
              rawClass.description.match(/(\d+)[\s-]*minute/i);
            if (durationMatch) {
              duration = parseInt(durationMatch[1]);
            }
          }

          endDateTime = new Date(
            startDateTime.getTime() + duration * 60 * 1000,
          );
        } else {
          console.warn(
            "Could not parse date after year insertion:",
            dateTimeStr,
            "original:",
            rawClass.dateTime,
          );
          // Final fallback - try a different approach
          const dayMatch = dateTimeStr.match(
            /(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?\s+([A-Za-z]+)\s+(\d{1,2})/i,
          );
          const timeMatch = dateTimeStr.match(/(\d{1,2}:\d{2}\s*[AP]M)/i);

          if (dayMatch && timeMatch) {
            const [, , month, day] = dayMatch;
            const [, time] = timeMatch;
            const currentYear = new Date().getFullYear();

            // Construct a standard date string
            const standardDateStr = `${month} ${day}, ${currentYear} ${time}`;
            const attemptParse = new Date(standardDateStr);

            if (!isNaN(attemptParse.getTime())) {
              startDateTime = attemptParse;
              endDateTime = new Date(startDateTime.getTime() + 45 * 60 * 1000);
            }
          }
        }
      } catch (e) {
        console.warn(
          "Date parsing error:",
          e,
          "for dateTime:",
          rawClass.dateTime,
        );
      }
    }

    // Use session ID for unique identification if available
    const id = rawClass.sessionId
      ? `momence-${rawClass.sessionId}`
      : `momence-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

    const title = rawClass.title || "Yoga Class";

    if (!rawClass.bookingUrl) {
      console.warn("No booking URL found for class:", title);
    }

    return {
      id,
      title,
      instructor,
      startDateTime,
      endDateTime,
      bookingUrl: rawClass.bookingUrl || this.baseUrl,
      price: rawClass.price,
    };
  }
}
