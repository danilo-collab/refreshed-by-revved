import { test, expect } from "@playwright/test";

test.describe("Booking Flow", () => {
  test("should complete booking wizard steps", async ({ page }) => {
    await page.goto("/booking");

    // Step 1: Select a service
    await expect(page.getByText("Choose Your Service")).toBeVisible();
    await page.getByText("Essential Wash").click();
    await page.getByRole("button", { name: /continue/i }).click();

    // Step 2: Add-ons (optional, just continue)
    await expect(page.getByText("Customize with Add-ons")).toBeVisible();
    await page.getByRole("button", { name: /continue/i }).click();

    // Step 3: Location
    await expect(page.getByText("Where Should We Come")).toBeVisible();
    await page.getByPlaceholder("Enter your full address").fill("123 Test St, Miami, FL");
    await page.getByRole("button", { name: /continue/i }).click();

    // Step 4: Date & Time
    await expect(page.getByText("Pick Your Date")).toBeVisible();
    // Select a date (first available)
    await page.locator("button").filter({ hasNotText: /(MON|TUE|WED|THU|FRI|SAT|SUN)/i }).first().click();
  });

  test("should display booking summary", async ({ page }) => {
    await page.goto("/booking");

    // Select a service
    await page.getByText("Full Detail").click();

    // Check summary updates
    await expect(page.getByText("Booking Summary")).toBeVisible();
    await expect(page.getByText("Full Detail")).toBeVisible();
    await expect(page.getByText("$179.99")).toBeVisible();
  });
});
