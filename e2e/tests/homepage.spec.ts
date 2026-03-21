import { test, expect } from "@playwright/test";

test.describe("Homepage Smoke Test", () => {
  test("should load and display events", async ({ page }) => {
    const response = await page.goto("/");

    // No server errors
    expect(response?.status()).toBeLessThan(500);

    // Page loaded correctly
    await expect(page).toHaveTitle(/Aaron Curtis Yoga/i);

    // Schedule section is displayed
    await expect(
      page.getByRole("heading", { name: /where to find me/i }),
    ).toBeVisible({ timeout: 10000 });
  });
});
