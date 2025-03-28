import { Page, expect } from "@playwright/test";
import { NavLink } from "@/e2e/tests/constants/navigation";

/**
 * Verify navigation links are visible and have correct href
 */
export async function verifyLinks(page: Page, links: NavLink[]) {
  for (const link of links) {
    const selector = link.testId;
    const linkElement = page.getByTestId(selector);
    await expect(linkElement).toBeVisible();
    await expect(linkElement).toHaveAttribute("href", link.href);
  }
}

export async function openMobileMenu(page: Page) {
  await page.getByTestId("menu-toggle").click();
}

export async function openDesktopUserMenu(page: Page) {
  // Try the test ID first, then fall back to the role selector
  const userMenuByTestId = page.getByTestId("user-menu-button");

  if (await userMenuByTestId.isVisible()) {
    await userMenuByTestId.click();
  } else {
    await page.getByRole("button", { name: "User menu" }).click();
  }
}

export async function openMobileUserMenu(page: Page) {
  // Try the test ID first, then fall back to the role selector
  const userMenuByTestId = page.getByTestId("user-menu-button");

  if (await userMenuByTestId.isVisible()) {
    await userMenuByTestId.click();
  } else {
    const userMenuByRole = page.getByRole("button", { name: "User menu" });
    if (await userMenuByRole.isVisible()) {
      await userMenuByRole.click();
    }
    // If neither is visible, we assume the menu is already open or not needed
  }
}
