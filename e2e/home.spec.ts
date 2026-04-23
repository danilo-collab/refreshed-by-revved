import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("should display the hero section", async ({ page }) => {
    await page.goto("/");

    // Check for main heading
    await expect(
      page.getByRole("heading", { name: /mobile car detailing/i })
    ).toBeVisible();

    // Check for CTA buttons
    await expect(page.getByRole("button", { name: /book/i })).toBeVisible();
  });

  test("should navigate to booking page", async ({ page }) => {
    await page.goto("/");

    // Click the main CTA
    await page.getByRole("button", { name: /book detail now/i }).click();

    // Should be on booking page
    await expect(page).toHaveURL("/booking");
    await expect(
      page.getByRole("heading", { name: /book your mobile detail/i })
    ).toBeVisible();
  });

  test("should display services section", async ({ page }) => {
    await page.goto("/");

    // Scroll to services
    await page.locator("#services").scrollIntoViewIfNeeded();

    // Check for service cards
    await expect(page.getByText("Exterior Restoration")).toBeVisible();
    await expect(page.getByText("Interior Car Detailing")).toBeVisible();
    await expect(page.getByText("Full Showroom Package")).toBeVisible();
  });

  test("should display pricing section", async ({ page }) => {
    await page.goto("/");

    // Scroll to pricing
    await page.locator("#pricing").scrollIntoViewIfNeeded();

    // Check for pricing tiers
    await expect(page.getByText("Essential")).toBeVisible();
    await expect(page.getByText("Executive")).toBeVisible();
    await expect(page.getByText("Signature")).toBeVisible();
  });
});
