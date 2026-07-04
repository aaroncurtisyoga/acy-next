import { test, expect } from "@playwright/test";

test.describe("Homepage Smoke Test", () => {
  test("should load and display events", async ({ page }) => {
    const response = await page.goto("/");

    // No server errors
    expect(response?.status()).toBeLessThan(500);

    // Page loaded correctly
    await expect(page).toHaveTitle(/Aaron Curtis Yoga/i);

    // Hero is displayed
    await expect(
      page.getByRole("heading", { name: /an honest practice/i }),
    ).toBeVisible({ timeout: 10000 });

    // Schedule section is displayed
    await expect(page.getByRole("heading", { name: /this week/i })).toBeVisible(
      { timeout: 10000 },
    );
  });
});
