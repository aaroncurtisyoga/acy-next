import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

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

      // Extract booking URL
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

      // If relative URL, make it absolute
      if (makeUrlsAbsolute && bookingLink && bookingLink.startsWith("/")) {
        bookingLink = `https://www.brightbearyogadc.com${bookingLink}`;
      }

      return {
        title,
        instructor,
        dateTime,
        bookingLink,
        price,
        element: el.outerHTML.substring(0, 500), // For debugging
      };
    });
  };

  async getAaronClasses(): Promise<MomenceClass[]> {
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    try {
      const page = await browser.newPage();

      // Navigate to booking page
      await page.goto(this.baseUrl, { waitUntil: "networkidle0" });

      // Wait for Momence widget to load
      await page.waitForSelector(
        'iframe[src*="momence"], .momence-widget, #momence-plugin',
        { timeout: 10000 },
      );

      // Check if Momence is in an iframe
      const iframeElement = await page.$('iframe[src*="momence"]');

      let classes: any[] = [];

      if (iframeElement) {
        // Handle iframe case
        const frame = await iframeElement.contentFrame();
        if (frame) {
          // Wait for content to load in iframe
          await frame.waitForSelector(
            '.schedule-item, .class-item, [data-testid*="class"]',
            { timeout: 10000 },
          );

          // Extract class data from iframe
          classes = await frame.evaluate(BrightBearCrawler.extractClassData);
        }
      } else {
        // Direct widget case
        await page.waitForSelector(
          '.schedule-item, .class-item, [data-testid*="class"]',
          { timeout: 10000 },
        );

        // Try to filter by instructor if possible
        const instructorFilter = await page.$(
          'select[name*="instructor"], button[aria-label*="instructor"]',
        );
        if (instructorFilter) {
          await instructorFilter.click();
          await new Promise((resolve) => setTimeout(resolve, 500));

          // Look for Aaron in dropdown using evaluate
          const foundAaron = await page.evaluate(() => {
            const options = document.querySelectorAll("option, li, div");
            for (const option of options) {
              const text = option.textContent?.toLowerCase();
              if (text?.includes("aaron") || text?.includes("curtis")) {
                (option as HTMLElement).click();
                return true;
              }
            }
            return false;
          });

          if (foundAaron) {
            await new Promise((resolve) => setTimeout(resolve, 2000));
          }
        }

        // Extract class data
        classes = await page.evaluate(() =>
          BrightBearCrawler.extractClassData(true),
        );
      }

      console.log(`Found ${classes.length} total classes`);
      console.log("Sample class data:", classes[0]); // Debug first class

      // Filter and parse Aaron's classes
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
    // Parse Momence date/time format
    const now = new Date();
    let startDateTime = now;
    let endDateTime = new Date(now.getTime() + 60 * 60 * 1000); // Default 1 hour class

    if (rawClass.dateTime) {
      // Try to parse various date formats
      // Common formats: "Monday, Jan 1 at 6:00 PM", "1/1/2024 6:00 PM", etc.
      try {
        startDateTime = new Date(rawClass.dateTime);
        if (isNaN(startDateTime.getTime())) {
          // Try more parsing approaches if needed
          console.warn("Could not parse date:", rawClass.dateTime);
          startDateTime = now;
        }
        endDateTime = new Date(startDateTime.getTime() + 90 * 60 * 1000); // Assume 90 min class
      } catch (e) {
        console.warn("Date parsing error:", e);
      }
    }

    // Ensure booking URL exists
    if (!rawClass.bookingLink) {
      console.warn("No booking link found for class:", rawClass.title);
    }

    return {
      id: `momence-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      title: rawClass.title || "Yoga Class",
      instructor: rawClass.instructor || "Aaron Curtis",
      startDateTime,
      endDateTime,
      bookingUrl: rawClass.bookingLink || this.baseUrl,
      price: rawClass.price,
    };
  }
}
