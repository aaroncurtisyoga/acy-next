import { test, expect } from "@playwright/test";

test.describe("Desktop Navigation", () => {
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
    await page.locator("[data-testid='navbar-item-private-sessions']").click();
    const activeLink = page.locator(
      "[data-testid='navbar-item-private-sessions']",
    );
    await expect(activeLink).toHaveClass(/data-\[active=true]/);
  });

  test("should make navigation sticky at top of page", async ({ page }) => {
    const nav = page.locator("[data-testid='navbar']");
    await page.evaluate(() => window.scrollTo(0, 500));
    await expect(nav).toBeVisible();
  });

  test("should only display the mobile menu button on small screens", async ({
    page,
  }) => {
    const menuButton = page.locator("[data-testid='menu-toggle']");
    await expect(menuButton).toBeHidden();

    await page.setViewportSize({ width: 500, height: 800 });
    await expect(menuButton).toBeVisible();
  });

  test("should toggle mobile menu on click", async ({ page }) => {
    await page.setViewportSize({ width: 500, height: 800 });

    const menuButton = page.locator("[data-testid='menu-toggle']");
    await menuButton.click();
    await expect(page.locator("[data-testid='navbar-menu']")).toBeVisible();

    await menuButton.click();
    await expect(page.locator("[data-testid='navbar-menu']")).toBeHidden();
  });
});
