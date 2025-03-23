import { clerk, setupClerkTestingToken } from "@clerk/testing/playwright";
import { test, expect } from "@playwright/test";

const unauthenticatedLinks = [
  {
    name: "Private Sessions",
    href: "/private-sessions",
    testId: "private-sessions-link",
  },
];

test.describe("Desktop Header Navigation", () => {
  // Set desktop viewport for all tests in this file
  test.beforeEach(async ({ page }) => {
    await setupClerkTestingToken({ page });
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/");
  });

  test("desktop menu is visible", async ({ page }) => {
    const desktopMenu = page.getByTestId("navbar-menu-desktop");
    await expect(desktopMenu).toBeVisible();
  });

  test("displays unauthenticated links correctly", async ({ page }) => {
    // Ensure we're not signed in
    try {
      await clerk.signOut({ page });
    } catch (e) {
      // May already be signed out, which is fine
    }
    await page.goto("/"); // Reload after signout

    for (const link of unauthenticatedLinks) {
      const desktopLink = page.locator(
        `li[data-testid="navbar-item-${link.testId}"] > a`,
      );
      await expect(desktopLink).toBeVisible();
      await expect(desktopLink).toHaveAttribute("href", link.href);
    }
  });

  test("shows admin links for admin users", async ({ page }) => {
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
      // For testing without env variables, have route mocking
      // as a fallback and less reliable than real auth
      await page.route("**/clerk/session", (route) =>
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
