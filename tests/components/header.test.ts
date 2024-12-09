import { test, expect } from "@playwright/test";

test.describe("Index Component", () => {
  // Tests for Desktop
  test.describe("Desktop MenuItems", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto("/");
    });

    test("should display the header with the correct site title", async ({
      page,
    }) => {
      const title = page.locator("[data-testid='navbar-brand']");
      await expect(title).toBeVisible();
      await expect(title).toHaveText("Aaron Curtis Yoga");
    });

    test("should display navigation links", async ({ page }) => {
      const privateSessionsLink = page.locator(
        "[data-testid='navbar-item-private-sessions']",
      );
      const loginLink = page.locator("[data-testid='navbar-login']");

      await expect(privateSessionsLink).toBeVisible();
      await expect(privateSessionsLink).toHaveText("Private Sessions");
      await expect(loginLink).toBeVisible();
      await expect(loginLink).toHaveText("Login");
    });

    test("should navigate to the Private Sessions page", async ({ page }) => {
      const privateSessionsLink = page.locator(
        "[data-testid='navbar-item-private-sessions']",
      );
      await privateSessionsLink.click();
      await expect(page).toHaveURL(/\/private-sessions/);
    });

    test("should apply active styles to the current page link", async ({
      page,
    }) => {
      await page
        .locator("[data-testid='navbar-item-private-sessions']")
        .click();
      const activeLink = page.locator(
        "[data-testid='navbar-item-private-sessions']",
      );
      await expect(activeLink).toHaveClass(/data-\[active=true]/);
    });

    test("should make navigation sticky at the top of the page", async ({
      page,
    }) => {
      const nav = page.locator("[data-testid='navbar']");
      await page.evaluate(() => window.scrollTo(0, 500));
      await expect(nav).toBeVisible();
    });
  });

  // Tests for Mobile
  test.describe("Mobile MenuItems", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 500, height: 800 });
      await page.goto("/");
    });

    test("should display the mobile menu button", async ({ page }) => {
      const menuButton = page.locator("[data-testid='menu-toggle']");
      await expect(menuButton).toBeVisible();
    });

    test("should toggle the mobile menu on click", async ({ page }) => {
      const menuButton = page.locator("[data-testid='menu-toggle']");
      const menu = page.locator("[data-testid='navbar-menu']");

      // Open the menu
      await menuButton.click();
      await expect(menu).toBeVisible();

      // Close the menu
      await menuButton.click();
      await expect(menu).toBeHidden();
    });

    test("should display navigation links in the mobile menu", async ({
      page,
    }) => {
      const menuButton = page.locator("[data-testid='menu-toggle']");
      await menuButton.click();

      const privateSessionsLink = page.locator(
        "[data-testid='menu-item-private-sessions']",
      );
      const loginLink = page.locator("[data-testid='menu-login']");

      await expect(privateSessionsLink).toBeVisible();
      await expect(privateSessionsLink).toHaveText("Private Sessions");
      await expect(loginLink).toBeVisible();
      await expect(loginLink).toHaveText("Login");
    });

    test("should navigate to the Private Sessions page from the mobile menu", async ({
      page,
    }) => {
      const menuButton = page.locator("[data-testid='menu-toggle']");
      await menuButton.click();

      const privateSessionsLink = page.locator(
        "[data-testid='menu-item-private-sessions']",
      );
      await privateSessionsLink.click();

      await expect(page).toHaveURL(/\/private-sessions/);
    });
  });
});
