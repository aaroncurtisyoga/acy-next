import { test, expect } from "@playwright/test";

test.describe("Footer Component", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should render the footer section", async ({ page }) => {
    const footer = page.locator("[data-testid='footer']");
    await expect(footer).toBeVisible();
  });

  test("should have working social media links", async ({ page }) => {
    const youtubeLink = page.locator("[data-testid='footer-youtube-link']");
    await expect(youtubeLink).toHaveAttribute(
      "href",
      "https://www.youtube.com/channel/UCwwNWri2IhKxXKmQkCpj-uw",
    );

    const spotifyLink = page.locator("[data-testid='footer-spotify-link']");
    await expect(spotifyLink).toHaveAttribute(
      "href",
      "https://open.spotify.com/user/31fmmphtelatfs7ra4tvboorm4qy?si=c32d094ea2c84e08",
    );

    const instagramLink = page.locator("[data-testid='footer-instagram-link']");
    await expect(instagramLink).toHaveAttribute(
      "href",
      "https://www.instagram.com/aaroncurtisyoga/",
    );
  });

  test("should display social links section", async ({ page }) => {
    const socialSection = page.locator("[data-testid='footer-social-links']");
    await expect(socialSection).toBeVisible();
  });
});
