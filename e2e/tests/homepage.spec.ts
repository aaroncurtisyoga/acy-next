import { test, expect } from "@playwright/test";

test.describe("Homepage Smoke Test", () => {
  test("should load and display events", async ({ page }) => {
    const response = await page.goto("/");

    // No server errors
    expect(response?.status()).toBeLessThan(500);

    // Page loaded correctly
    await expect(page).toHaveTitle(/Aaron Curtis Yoga/i);

    // At least one event is displayed
    const eventCards = page.locator('[id^="event-"]');
    await expect(eventCards.first()).toBeVisible({ timeout: 10000 });
  });
});
