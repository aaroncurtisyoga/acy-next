import { test, expect } from "@playwright/test";

test.describe("Footer Component", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should render the footer section", async ({ page }) => {
    const footer = page.locator("[data-testid='footer']");
    await expect(footer).toBeVisible();
  });

  test("should display the newsletter form", async ({ page }) => {
    const newsletterForm = page.locator("[data-testid='footer-newsletter']");
    await expect(newsletterForm).toBeVisible();

    const emailInput = newsletterForm.locator("input[type='email']");
    await expect(emailInput).toHaveAttribute("placeholder", "Email");

    const submitButton = newsletterForm.locator(
      "button[aria-label='Submit newsletter form']",
    );
    await expect(submitButton).toBeVisible();
  });

  // Todo: Fix component. Then, fix test.
  /*  test("should submit the newsletter form", async ({ page }) => {
    const emailInput = page.locator(
      "[data-testid='footer-newsletter'] input[type='email']",
    );
    await emailInput.fill("test@example.com");

    const submitButton = page.locator(
      "[data-testid='footer-newsletter'] button[aria-label='Submit newsletter form']",
    );
    await submitButton.click();

    const confirmationMessage = page
      .locator("[data-testid='footer-newsletter']")
      .locator("text=Thank you for signing up!");
    await expect(confirmationMessage).toBeVisible();
  });*/

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

  test("should display contact information and credits", async ({ page }) => {
    const contactSection = page.locator("[data-testid='footer-contact']");
    await expect(contactSection).toBeVisible();

    const emailLink = contactSection.locator(
      "[data-testid='footer-email-link']",
    );
    await expect(emailLink).toHaveAttribute(
      "href",
      "mailto:aaroncurtisyoga@gmail.com",
    );

    const githubLink = contactSection.locator(
      "[data-testid='footer-github-link']",
    );
    await expect(githubLink).toHaveAttribute(
      "href",
      "https://github.com/aaroncurtisyoga/acy-next",
    );

    const currentYear = new Date().getFullYear().toString();
    await expect(contactSection).toContainText(
      `© ${currentYear} All Rights Reserved`,
    );
  });
});
