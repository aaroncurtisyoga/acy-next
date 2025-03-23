import { clerk, setupClerkTestingToken } from "@clerk/testing/playwright";
import { test, expect } from "@playwright/test";

const unauthenticatedLinks = [
  {
    name: "Private Sessions",
    href: "/private-sessions",
    testId: "private-sessions-link",
  },
];

test.describe("Mobile Header Navigation", () => {
  // Set mobile viewport for all tests in this file
  test.beforeEach(async ({ page }) => {
    await setupClerkTestingToken({ page });
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
  });

  test("mobile menu is visible when toggled", async ({ page }) => {
    await page.getByTestId("menu-toggle").click();
    const mobileMenu = page.getByTestId("navbar-menu-mobile");
    await expect(mobileMenu).toBeVisible();
  });

  test("displays unauthenticated links correctly", async ({ page }) => {
    // Ensure we're not signed in
    try {
      await clerk.signOut({ page });
    } catch (e) {
      // May already be signed out, which is fine
    }
    // Reload after sign out
    await page.goto("/");

    // Open the mobile menu
    await page.getByTestId("menu-toggle").click();

    for (const link of unauthenticatedLinks) {
      const mobileLink = page.getByTestId(`navbar-menu-item-${link.testId}`);
      await expect(mobileLink).toBeVisible();
      await expect(mobileLink).toHaveAttribute("href", link.href);
    }
  });

  test("shows admin links for admin users in mobile menu", async ({ page }) => {
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

    // Reload with auth state
    await page.goto("/");

    // Open the mobile menu if user menu is within it
    await page.getByTestId("menu-toggle").click();

    // Click the user menu button to open the dropdown (if it's separate)
    const userMenuButton = page.getByTestId("user-menu-button");
    if (await userMenuButton.isVisible()) await userMenuButton.click();

    // Check if the admin link is visible and has the correct href
    const adminLink = page.getByTestId("navbar-menu-item-admin-link");
    await expect(adminLink).toBeVisible();
    await expect(adminLink).toHaveAttribute("href", "/admin");
  });

  test("shows account link for all authenticated users in mobile menu", async ({
    page,
  }) => {
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

    // Open the mobile menu if user menu is within it
    await page.getByTestId("menu-toggle").click();

    // Click the user menu button to open the dropdown (if it's separate)
    // Using a more flexible selector that works in mobile context
    const userMenuButton = page.getByRole("button", { name: "User menu" });
    if (await userMenuButton.isVisible()) await userMenuButton.click();

    // Check if the account link is visible in the dropdown
    const accountLink = page.getByTestId("navbar-menu-item-account-link");
    await expect(accountLink).toBeVisible();
    await expect(accountLink).toHaveAttribute("href", "/account");
  });
});
