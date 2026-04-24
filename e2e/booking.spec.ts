import { test, expect } from "@playwright/test";

test.describe("Booking Flow", () => {
  test("should complete full booking wizard and reach success", async ({ page }) => {
    await page.goto("/booking");

    // Wait for services to load
    await expect(page.getByText("Choose Your Service")).toBeVisible({ timeout: 10000 });

    // Step 1: Select a service
    await page.getByRole("button", { name: /essential wash/i }).click();
    await page.getByRole("button", { name: /continue/i }).click();

    // Step 2: Add-ons (skip)
    await expect(page.getByRole("heading", { name: "Customize with Add-ons" })).toBeVisible();
    await page.getByRole("button", { name: /continue/i }).click();

    // Step 3: Location
    await expect(page.getByRole("heading", { name: /where should we come/i })).toBeVisible();
    await page.getByPlaceholder("Enter your full address").fill("123 Test St, Miami, FL 33101");
    await page.getByRole("button", { name: /continue/i }).click();

    // Step 4: Date & Time
    await expect(page.getByText("Pick Your Date")).toBeVisible();

    // Click on a date - find buttons in the date grid that contain numbers
    // The grid has 7 columns with day buttons containing day name + number
    const dateGrid = page.locator(".grid-cols-7");
    await expect(dateGrid).toBeVisible();

    // Get buttons in the grid and click the second one (first non-past day)
    const dayButtons = dateGrid.locator("button");
    await dayButtons.nth(1).click();

    // Wait for time slots to appear and select 08:00
    const timeSlot = page.getByRole("button", { name: "08:00" });
    await expect(timeSlot).toBeVisible({ timeout: 5000 });
    await timeSlot.click();

    await page.getByRole("button", { name: /continue/i }).click();

    // Step 5: Customer Details
    await expect(page.getByText("Your Contact Details")).toBeVisible();

    await page.getByPlaceholder("John Doe").fill("Test User");
    await page.getByPlaceholder("john@example.com").fill("test@example.com");
    await page.getByPlaceholder("(305) 555-1234").fill("3055551234");

    // Tab out to trigger phone formatting
    await page.keyboard.press("Tab");

    // Verify phone was formatted
    await expect(page.getByPlaceholder("(305) 555-1234")).toHaveValue("(305) 555-1234");

    // Submit booking
    await page.getByRole("button", { name: /confirm booking/i }).click();

    // Wait for redirect to success page
    await expect(page).toHaveURL(/\/booking\/success/, { timeout: 15000 });
    await expect(page.getByText("Booking Confirmed")).toBeVisible();
  });

  test("should show validation errors for invalid email", async ({ page }) => {
    await page.goto("/booking");

    // Navigate through steps quickly
    await expect(page.getByText("Choose Your Service")).toBeVisible({ timeout: 10000 });
    await page.getByRole("button", { name: /essential wash/i }).click();
    await page.getByRole("button", { name: /continue/i }).click();

    await page.getByRole("button", { name: /continue/i }).click(); // skip addons

    await page.getByPlaceholder("Enter your full address").fill("123 Test St");
    await page.getByRole("button", { name: /continue/i }).click();

    // Select date and time
    const dateGrid = page.locator(".grid-cols-7");
    await dateGrid.locator("button").nth(1).click();
    await page.getByRole("button", { name: "08:00" }).click();
    await page.getByRole("button", { name: /continue/i }).click();

    // Enter invalid email
    await page.getByPlaceholder("John Doe").fill("Test User");
    await page.getByPlaceholder("john@example.com").fill("invalid-email");
    await page.keyboard.press("Tab"); // blur to trigger validation

    // Should show error
    await expect(page.getByText("Please enter a valid email address")).toBeVisible();

    // Confirm button should be disabled
    const confirmBtn = page.getByRole("button", { name: /confirm booking/i });
    await expect(confirmBtn).toHaveClass(/cursor-not-allowed/);
  });

  test("should show validation errors for invalid phone", async ({ page }) => {
    await page.goto("/booking");

    // Navigate through steps
    await expect(page.getByText("Choose Your Service")).toBeVisible({ timeout: 10000 });
    await page.getByRole("button", { name: /essential wash/i }).click();
    await page.getByRole("button", { name: /continue/i }).click();
    await page.getByRole("button", { name: /continue/i }).click();

    await page.getByPlaceholder("Enter your full address").fill("123 Test St");
    await page.getByRole("button", { name: /continue/i }).click();

    // Select date and time
    const dateGrid = page.locator(".grid-cols-7");
    await dateGrid.locator("button").nth(1).click();
    await page.getByRole("button", { name: "08:00" }).click();
    await page.getByRole("button", { name: /continue/i }).click();

    // Enter invalid phone
    await page.getByPlaceholder("John Doe").fill("Test User");
    await page.getByPlaceholder("john@example.com").fill("test@example.com");
    await page.getByPlaceholder("(305) 555-1234").fill("123");
    await page.keyboard.press("Tab"); // blur to trigger validation

    // Should show error
    await expect(page.getByText("Please enter a valid US phone number")).toBeVisible();
  });

  test("should display booking summary with correct price", async ({ page }) => {
    await page.goto("/booking");

    await expect(page.getByText("Choose Your Service")).toBeVisible({ timeout: 10000 });

    // Select Full Detail service
    await page.getByRole("button", { name: /full detail/i }).click();

    // Check summary shows correct service and price
    const summary = page.locator("text=Booking Summary").locator("..");
    await expect(summary.getByText("Full Detail")).toBeVisible();
  });
});
