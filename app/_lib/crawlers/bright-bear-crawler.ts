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

  private static extractClassData = (makeUrlsAbsolute = false) => {
    const classElements = document.querySelectorAll(
      '.schedule-item, .class-item, [data-testid*="class"]',
    );

    return Array.from(classElements).map((el) => {
      const title = el
        .querySelector(".class-title, .class-name, h3, h4")
        ?.textContent?.trim();
      const instructor = el
        .querySelector(
          '.instructor-name, .teacher, [data-testid*="instructor"]',
        )
        ?.textContent?.trim();
      const dateTime = el
        .querySelector(".class-time, .start-time, time")
        ?.textContent?.trim();
      const price = el.querySelector(".price, .cost")?.textContent?.trim();

      let bookingLink = null;
      const possibleLinks = [
        el.querySelector('a[href*="book"]'),
        el.querySelector('a[href*="register"]'),
        el.querySelector(".book-button"),
        el.querySelector('button[onclick*="book"]'),
        el.querySelector("[data-booking-url]"),
        el.closest("a"),
      ];

      for (const link of possibleLinks) {
        if (link) {
          bookingLink =
            link.getAttribute("href") || link.getAttribute("data-booking-url");
          if (bookingLink) break;
        }
      }

      if (makeUrlsAbsolute && bookingLink && bookingLink.startsWith("/")) {
        bookingLink = `https://www.brightbearyogadc.com${bookingLink}`;
      }

      return {
        title,
        instructor,
        dateTime,
        bookingLink,
        price,
        element: el.outerHTML.substring(0, 500),
      };
    });
  };

  async getAaronClasses(): Promise<MomenceClass[]> {
    console.log("🔄 Launching browser for web scraping...");

    const browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      const page = await browser.newPage();

      console.log(`📍 Navigating to ${this.baseUrl}...`);
      await page.goto(this.baseUrl, { waitUntil: "domcontentloaded" });

      // Give the page time to load dynamic content
      await page.waitForTimeout(3000);

      // Take a screenshot for debugging
      await page.screenshot({ path: "debug-screenshot.png" });
      console.log("📸 Screenshot saved to debug-screenshot.png");

      // Log the page content to see what's there
      const pageTitle = await page.title();
      console.log(`📄 Page title: ${pageTitle}`);

      // Look for the instructor filter dropdown
      const hasInstructorFilter = await page.$("text=Instructors");

      if (hasInstructorFilter) {
        console.log("📋 Found instructor filter...");

        // Click on the dropdown to open it
        await hasInstructorFilter.click();
        await page.waitForTimeout(1000);

        // Try to find and select Aaron from the dropdown
        const aaronOption = await page.$("text=/Aaron/i");
        if (aaronOption) {
          console.log("✅ Found Aaron in dropdown, selecting...");
          await aaronOption.click();
          await page.waitForTimeout(2000); // Wait for filtering to complete
        }
      }

      // Extract classes from the page with more detailed logging
      console.log("🔍 Starting class extraction...");

      const classes = await page.evaluate(() => {
        const results = [];

        // Look for all potential class elements
        const possibleElements = [
          "article",
          '[class*="class"]',
          '[class*="session"]',
          '[class*="event"]',
          "div:has(h2)",
          "div:has(h3)",
          "div:has(h4)",
        ];

        let allElements = new Set();
        possibleElements.forEach((selector) => {
          try {
            document
              .querySelectorAll(selector)
              .forEach((el) => allElements.add(el));
          } catch (e) {
            // Skip invalid selectors
          }
        });

        console.log(`Found ${allElements.size} potential elements`);

        allElements.forEach((el: any) => {
          const htmlSnippet = el.outerHTML.substring(0, 300);

          // Extract title - look more broadly and clean it up
          let title = "";
          const titleSelectors = [
            "h1",
            "h2",
            "h3",
            "h4",
            '[class*="title"]',
            '[class*="name"]',
          ];
          for (const selector of titleSelectors) {
            const titleEl = el.querySelector(selector);
            if (titleEl && titleEl.textContent?.trim()) {
              let rawTitle = titleEl.textContent.trim();
              // Clean up common prefixes/suffixes
              rawTitle = rawTitle
                .replace(/^CLASS\s+/i, "")
                .replace(/\s+CLASS$/i, "");
              if (
                rawTitle &&
                rawTitle.length > 2 &&
                !rawTitle.match(/^(class|session)$/i)
              ) {
                title = rawTitle;
                break;
              }
            }
          }

          // Extract instructor - improved pattern matching
          let instructor = "";
          const textContent = el.textContent || "";

          // Look for "Name (pronouns) Show bio" pattern, but be more specific
          const instructorPatterns = [
            /([A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s*\([^)]+\)\s*Show bio/, // "Aaron Curtis (he/him) Show bio"
            /Instructor:\s*([A-Za-z\s]+)/i,
            /Teacher:\s*([A-Za-z\s]+)/i,
          ];

          for (const pattern of instructorPatterns) {
            const match = textContent.match(pattern);
            if (match) {
              let name = match[1].trim();
              // Clean up any remaining artifacts
              name = name.replace(/^(Class|CLASS)\s+/i, "").trim();
              if (
                name.length > 3 &&
                name.includes(" ") &&
                name.match(/^[A-Za-z\s]+$/)
              ) {
                instructor = name;
                break;
              }
            }
          }

          // Extract date/time - look for date patterns
          let dateTime = "";
          const datePatterns = [
            /([A-Za-z]+,?\s+[A-Za-z]+\s+\d{1,2},?\s+\d{4})/,
            /(\d{1,2}:\d{2}\s*[AP]M)/,
            /(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)[^0-9]*(\d{1,2}:\d{2}\s*[AP]M)/i,
          ];

          for (const pattern of datePatterns) {
            const match = textContent.match(pattern);
            if (match) {
              dateTime = match[0].trim();
              break;
            }
          }

          // Extract price
          let price = "";
          const priceMatch = textContent.match(/\$\d+/);
          if (priceMatch) {
            price = priceMatch[0];
          }

          // Only include elements that seem to be classes
          const hasClassKeywords =
            textContent.toLowerCase().includes("class") ||
            textContent.toLowerCase().includes("yoga") ||
            textContent.toLowerCase().includes("session") ||
            title.toLowerCase().includes("yoga") ||
            title.toLowerCase().includes("class");

          if (
            hasClassKeywords &&
            (title || instructor) &&
            textContent.length > 20
          ) {
            results.push({
              title: title || "Yoga Class",
              instructor,
              dateTime,
              price,
              bookingUrl: "", // Will set this later
              debug: {
                textContent: textContent.substring(0, 200),
                htmlSnippet: htmlSnippet,
              },
            });
          }
        });

        return results;
      });

      console.log(`Found ${classes.length} total classes`);
      console.log("Sample class data:", classes[0]);

      const aaronClasses = classes
        .filter(
          (cls) =>
            cls.instructor?.toLowerCase().includes("aaron") ||
            cls.instructor?.toLowerCase().includes("curtis"),
        )
        .map((cls) => this.parseClassData(cls));

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
    let endDateTime = new Date(now.getTime() + 60 * 60 * 1000);

    // Clean up instructor name (remove "Show bio" text)
    let instructor = rawClass.instructor || "Aaron Curtis";
    instructor = instructor.replace(/Show bio/gi, "").trim();

    // Parse date and time
    if (rawClass.dateTime) {
      try {
        // The dateTime might be like "Tuesday, August 26, 2025" and "6:30 AM - 7:15 AM 45 min"
        // Try to extract meaningful parts
        const dateTimeStr = rawClass.dateTime;

        // Try various date parsing approaches
        startDateTime = new Date(dateTimeStr);
        if (isNaN(startDateTime.getTime())) {
          // If direct parsing fails, try to extract date components
          console.warn("Could not parse date:", rawClass.dateTime);
          startDateTime = now;
        }

        // Extract duration if available (e.g., "45 min")
        const durationMatch = dateTimeStr.match(/(\d+)\s*min/i);
        const duration = durationMatch ? parseInt(durationMatch[1]) : 90;
        endDateTime = new Date(startDateTime.getTime() + duration * 60 * 1000);
      } catch (e) {
        console.warn("Date parsing error:", e);
      }
    }

    // Clean up title
    let title = rawClass.title || "Yoga Class";
    if (title === "Class" || title === "CLASS") {
      // If title is generic, try to extract from HTML or use a default
      title = "Yoga Class";
    }

    if (!rawClass.bookingLink) {
      console.warn("No booking link found for class:", title);
    }

    return {
      id: `momence-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      title,
      instructor,
      startDateTime,
      endDateTime,
      bookingUrl: rawClass.bookingLink || this.baseUrl,
      price: rawClass.price,
    };
  }

  private getMockAaronClasses(): MomenceClass[] {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const dayAfter = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    return [
      {
        id: `mock-${Date.now()}-1`,
        title: "Vinyasa Flow",
        instructor: "Aaron Curtis",
        startDateTime: new Date(tomorrow.setHours(18, 0, 0, 0)),
        endDateTime: new Date(tomorrow.setHours(19, 30, 0, 0)),
        bookingUrl: "https://www.brightbearyogadc.com/book-a-class",
        price: "$20",
      },
      {
        id: `mock-${Date.now()}-2`,
        title: "Power Yoga",
        instructor: "Aaron Curtis",
        startDateTime: new Date(dayAfter.setHours(19, 0, 0, 0)),
        endDateTime: new Date(dayAfter.setHours(20, 30, 0, 0)),
        bookingUrl: "https://www.brightbearyogadc.com/book-a-class",
        price: "$20",
      },
    ];
  }
}
