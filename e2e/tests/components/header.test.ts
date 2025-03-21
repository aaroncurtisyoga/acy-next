import { clerk, setupClerkTestingToken } from "@clerk/testing/playwright";
import { test, expect } from "@playwright/test";

const unauthenticatedLinks = [
  {
    name: "Private Sessions",
    href: "/private-sessions",
    testId: "private-sessions",
  },
];

test.describe("Header Navigation", () => {
  test.describe("Unauthenticated Links", () => {
    test.beforeEach(async ({ page }) => {
      // Setup the testing token but don't sign in
      await setupClerkTestingToken({ page });
      await page.goto("/");
      // Ensure we're not signed in
      try {
        await clerk.signOut({ page });
      } catch (e) {
        // May already be signed out, which is fine
      }
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
    // This test requires having environment variables set up for auth credentials
    // E2E_CLERK_USER_USERNAME and E2E_CLERK_USER_PASSWORD

    test("include admin links for admin users", async ({ page }) => {
      // Set up clerk testing token
      await setupClerkTestingToken({ page });
      await page.goto("/");

      // You'll need to set up a test user with "admin" role
      // and set the credentials in env variables
      if (
        process.env.E2E_CLERK_ADMIN_USERNAME &&
        process.env.E2E_CLERK_ADMIN_PASSWORD
      ) {
        await clerk.signIn({
          page,
          signInParams: {
            strategy: "password",
            identifier: process.env.E2E_CLERK_ADMIN_USERNAME,
            password: process.env.E2E_CLERK_ADMIN_PASSWORD,
          },
        });
      } else {
        // For testing without env variables, implement route mocking
        // This is a fallback and less reliable than real auth
        await page.route("**!/clerk/session", (route) =>
          route.fulfill({
            status: 200,
            body: JSON.stringify({
              isSignedIn: true,
              user: { id: "test-admin", publicMetadata: { role: "admin" } },
            }),
          }),
        );
      }

      await page.goto("/"); // Reload with auth state
      // Click the user menu button to open the dropdown
      await page.getByTestId("user-menu-button").click();

      // Check if the admin link is visible and has the correct href
      const adminLink = page.getByTestId("admin-link");
      await expect(adminLink).toBeVisible();
      await expect(adminLink).toHaveAttribute("href", "/admin");
    });

    test("shows account link for all authenticated users", async ({ page }) => {
      // Set up clerk testing token
      await setupClerkTestingToken({ page });
      await page.goto("/");

      // You can use either admin or regular user credentials here
      // Since we're testing something all users should see
      if (
        process.env.E2E_CLERK_USER_USERNAME &&
        process.env.E2E_CLERK_USER_PASSWORD
      ) {
        await clerk.signIn({
          page,
          signInParams: {
            strategy: "password",
            identifier: process.env.E2E_CLERK_USER_USERNAME,
            password: process.env.E2E_CLERK_USER_PASSWORD,
          },
        });
      } else {
        // For testing without env variables, implement route mocking
        // This is a fallback and less reliable than real auth
        await page.route("**/clerk/session", (route) =>
          route.fulfill({
            status: 200,
            body: JSON.stringify({
              isSignedIn: true,
              user: { id: "test-user", publicMetadata: { role: "user" } },
            }),
          }),
        );
      }

      await page.goto("/"); // Reload with auth state

      // Click the user menu button to open the dropdown
      await page.getByRole("button", { name: "User menu" }).click();

      // Check if the account link is visible in the dropdown
      const accountLink = page.getByTestId("account-link");
      await expect(accountLink).toBeVisible();
      await expect(accountLink).toHaveAttribute("href", "/account");
    });
  });

  test.describe("Responsive Behavior", () => {
    test.beforeEach(async ({ page }) => {
      await setupClerkTestingToken({ page });
    });

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
