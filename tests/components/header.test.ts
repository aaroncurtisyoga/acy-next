import { test, expect } from "@playwright/test";

const unauthenticatedLinks = [
  {
    name: "Private Sessions",
    href: "/private-sessions",
    testId: "private-sessions",
  },
];

// Helper function to mock unauthenticated user state
const mockUnauthenticatedUser = async (page) => {
  await page.route("**/clerk/session", (route) => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({ isSignedIn: false }),
    });
  });
};

test.describe("Header Navigation - Unauthenticated Links", () => {
  test.beforeEach(async ({ page }) => {
    // Apply the unauthenticated user mock before each test
    await mockUnauthenticatedUser(page);
  });

  test("renders all unauthenticated links on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Open the mobile menu
    const menuToggle = page.getByTestId("menu-toggle");
    await menuToggle.click();

    // Verify each unauthenticated link is visible with correct href
    for (const link of unauthenticatedLinks) {
      const mobileLink = page.getByTestId(`navbar-menu-item-${link.testId}`);
      await expect(mobileLink).toBeVisible();
      await expect(mobileLink).toHaveAttribute("href", link.href);
    }
  });

  test("renders all unauthenticated links on desktop", async ({ page }) => {
    // Mock unauthenticated user
    await page.route("**/clerk/session", (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ isSignedIn: false }),
      });
    });

    // Set desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/");

    for (const link of unauthenticatedLinks) {
      // Target the <a> element within the <li> using the test ID
      const desktopLink = page.locator(
        `li[data-testid="navbar-item-${link.testId}"] > a`,
      );
      await expect(desktopLink).toBeVisible();
      await expect(desktopLink).toHaveAttribute("href", link.href);
    }
  });
});

/*
test.describe("Header Navigation", () => {
  test("renders authenticated user links", async ({ page }) => {
    // Mock authenticated user
    await page.route("**!/clerk/session", (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          isSignedIn: true,
          user: { id: "test-user", publicMetadata: {} },
        }),
      });
    });

    await page.goto("/");

    // Check for authenticated links
    const dashboardLink = await page.getByTestId("navbar-item-dashboard");
    await expect(dashboardLink).toBeVisible();
  });

  test("renders admin links", async ({ page }) => {
    // Mock admin user
    await page.route("**!/clerk/session", (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          isSignedIn: true,
          user: { id: "admin-user", publicMetadata: { role: "admin" } },
        }),
      });
    });

    await page.goto("/");

    // Check for admin links
    const adminLink = await page.getByTestId("navbar-item-admin");
    await expect(adminLink).toBeVisible();
  });

  test("responsive behavior", async ({ page }) => {
    await page.goto("/");

    // Test desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    const desktopMenu = await page.getByTestId("navbar-menu-desktop");
    await expect(desktopMenu).toBeVisible();

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    const mobileMenu = await page.getByTestId("navbar-menu-mobile");
    await expect(mobileMenu).toBeVisible();
  });
});
*/
