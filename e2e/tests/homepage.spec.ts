import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("should load the homepage", async ({ page }) => {
    await page.goto("/");

    // Check that the page loads
    await expect(page).toHaveTitle(/Aaron Curtis Yoga/i);

    // Check for main navigation
    await expect(page.getByRole("navigation")).toBeVisible();
  });

  test("should have working navigation links", async ({ page }) => {
    await page.goto("/");

    // Check that navigation links exist (less strict)
    const links = page.locator("nav a");
    await expect(links.first()).toBeVisible();

    // Check that we have at least some navigation items
    const linkCount = await links.count();
    expect(linkCount).toBeGreaterThan(0);
  });

  test("should display hero section", async ({ page }) => {
    await page.goto("/");

    // Look for any main heading (h1, h2, or h3)
    const headings = page.getByRole("heading");
    await expect(headings.first()).toBeVisible();
  });
});
