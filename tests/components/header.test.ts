import { test, expect } from "@playwright/test";

const unauthenticatedLinks = [
  {
    name: "Private Sessions",
    href: "/private-sessions",
    testId: "private-sessions",
  },
];

// Mock helper for different user states
const mockUnauthenticatedUser = async (page) => {
  await page.route("**/clerk/session", (route) =>
    route.fulfill({
      status: 200,
      body: JSON.stringify({ isSignedIn: false }),
    }),
  );
};

const mockAuthenticatedUser = async (page, role = "user") => {
  const user = {
    isSignedIn: true,
    user: { id: "test-user", publicMetadata: { role } },
  };
  await page.route("**/clerk/session", (route) =>
    route.fulfill({
      status: 200,
      body: JSON.stringify(user),
    }),
  );
};

test.describe("Header Navigation", () => {
  test.describe("Unauthenticated Links", () => {
    test.beforeEach(async ({ page }) => {
      await mockUnauthenticatedUser(page);
    });

    test("are visible on mobile", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/");
      await page.getByTestId("menu-toggle").click();

      for (const link of unauthenticatedLinks) {
        const mobileLink = page.getByTestId(`navbar-menu-item-${link.testId}`);
        await expect(mobileLink).toBeVisible();
        await expect(mobileLink).toHaveAttribute("href", link.href);
      }
    });

    test("are visible on desktop", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto("/");

      for (const link of unauthenticatedLinks) {
        const desktopLink = page.locator(
          `li[data-testid="navbar-item-${link.testId}"] > a`,
        );
        await expect(desktopLink).toBeVisible();
        await expect(desktopLink).toHaveAttribute("href", link.href);
      }
    });
  });

  test.describe("Authenticated Links", () => {
    test("are visible for regular users", async ({ page }) => {
      await mockAuthenticatedUser(page);
      await page.goto("/");
      const dashboardLink = page.getByTestId("navbar-item-dashboard");
      await expect(dashboardLink).toBeVisible();
    });

    test("include admin links for admin users", async ({ page }) => {
      await mockAuthenticatedUser(page, "admin");
      await page.goto("/");
      const adminLink = page.getByTestId("navbar-item-admin");
      await expect(adminLink).toBeVisible();
    });
  });

  test.describe("Responsive Behavior", () => {
    test("renders desktop menu on large screens", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto("/");
      const desktopMenu = page.getByTestId("navbar-menu-desktop");
      await expect(desktopMenu).toBeVisible();
    });

    test("renders mobile menu on small screens", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/");
      const mobileMenu = page.getByTestId("navbar-menu-mobile");
      await expect(mobileMenu).toBeVisible();
    });
  });
});
