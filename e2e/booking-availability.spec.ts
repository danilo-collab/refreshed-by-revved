import { test, expect, Page } from "@playwright/test";
import { neon } from "@neondatabase/serverless";
import { addDays, startOfToday, format } from "date-fns";

// Direct DB connection for assertions
const sql = neon(process.env.DATABASE_URL!);

// Unique email prefix for test isolation
const TEST_EMAIL_PREFIX = "e2e-avail-test";

// Cleanup: delete test bookings
async function cleanTestBookings() {
  await sql`
    DELETE FROM bookings
    WHERE customer_email LIKE ${TEST_EMAIL_PREFIX + "%"}
  `;
}

// Get tomorrow's date string (for API calls)
function getTomorrowDateStr(): string {
  const tomorrow = addDays(startOfToday(), 1);
  return format(tomorrow, "yyyy-MM-dd");
}

// Create booking via API (bypasses timezone issues)
async function createBookingViaAPI(
  baseUrl: string,
  time: string,
  locationType: "store" | "customer"
): Promise<string> {
  const dateStr = getTomorrowDateStr();
  const email = `${TEST_EMAIL_PREFIX}-${Date.now()}@test.com`;

  // Get a product ID first
  const productsRes = await fetch(`${baseUrl}/api/products`);
  const productsData = await productsRes.json();
  const productId = productsData.products[0].id;

  const bookingRes = await fetch(`${baseUrl}/api/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      productId,
      customerName: "E2E Test",
      customerEmail: email,
      customerPhone: "(305) 555-1234",
      locationType,
      address: "123 Test St",
      scheduledDate: `${dateStr}T${time}:00`,
      scheduledEndDate: `${dateStr}T${String(parseInt(time.split(":")[0]) + 1).padStart(2, "0")}:${time.split(":")[1]}:00`,
      totalPrice: "100.00",
      totalDurationMinutes: 60,
      status: "confirmed",
      paymentStatus: "paid",
    }),
  });

  if (!bookingRes.ok) {
    throw new Error(`Failed to create booking: ${await bookingRes.text()}`);
  }

  return email;
}

// Navigate through wizard to date selection step
async function navigateToDateStep(page: Page, locationType: "store" | "customer") {
  await page.goto("/booking");
  await expect(page.getByText("Choose Your Service")).toBeVisible({ timeout: 10000 });

  // Step 1: Select service (Essential Wash - 60 min)
  await page.getByRole("button", { name: /essential wash/i }).click();
  await page.getByRole("button", { name: /continue/i }).click();

  // Step 2: Skip add-ons
  await page.getByRole("button", { name: /continue/i }).click();

  // Step 3: Location
  if (locationType === "store") {
    await page.getByRole("button", { name: /our shop/i }).click();
  } else {
    await page.getByRole("button", { name: /your location/i }).click();
    await page.getByPlaceholder("Enter your full address").fill("123 Test St, Miami, FL");
  }
  await page.getByRole("button", { name: /continue/i }).click();

  // Now on date/time step
  await expect(page.getByText("Pick Your Date")).toBeVisible();
}

// Select first available date (second button = tomorrow)
async function selectFirstAvailableDate(page: Page) {
  const dateGrid = page.locator(".grid-cols-7");
  await expect(dateGrid).toBeVisible();
  // Click second button (index 1) - tomorrow
  await dateGrid.locator("button").nth(1).click();
  // Wait for availability to load
  await page.waitForTimeout(1500);
}

// Complete booking details and submit
async function completeBookingAndSubmit(page: Page): Promise<string> {
  await page.getByPlaceholder("John Doe").fill("E2E Test User");
  const email = `${TEST_EMAIL_PREFIX}-${Date.now()}@test.com`;
  await page.getByPlaceholder("john@example.com").fill(email);
  await page.getByPlaceholder("(305) 555-1234").fill("3055551234");
  await page.keyboard.press("Tab");

  await page.getByRole("button", { name: /confirm booking/i }).click();
  await expect(page).toHaveURL(/\/booking\/success/, { timeout: 15000 });

  return email;
}

test.describe("Booking Availability with Travel Gaps", () => {
  // Single worker to prevent parallel tests from interfering with shared DB state
  test.describe.configure({ mode: "serial" });

  const baseUrl = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";

  test.beforeEach(async () => {
    // Clean before each test for isolation
    await cleanTestBookings();
  });

  test.afterAll(async () => {
    await cleanTestBookings();
  });

  test("Scenario 1: Store booking via UI creates valid booking", async ({ page }) => {
    await navigateToDateStep(page, "store");
    await selectFirstAvailableDate(page);

    const slot8am = page.getByRole("button", { name: "08:00" });
    await expect(slot8am).toBeVisible({ timeout: 5000 });
    await expect(slot8am).toBeEnabled();
    await slot8am.click();

    await page.getByRole("button", { name: /continue/i }).click();
    const email = await completeBookingAndSubmit(page);

    // Verify booking in DB
    const bookings = await sql`
      SELECT * FROM bookings WHERE customer_email = ${email} LIMIT 1
    `;
    expect(bookings.length).toBe(1);
    expect(bookings[0].location_type).toBe("store");
    expect(bookings[0].status).toBe("confirmed");
  });

  test("Scenario 2: 8 AM blocked after booking, 9 AM available (store-to-store 0 gap)", async ({ page }) => {
    // Seed: create 8 AM store booking via API
    await createBookingViaAPI(baseUrl, "08:00", "store");

    await navigateToDateStep(page, "store");
    await selectFirstAvailableDate(page);

    // 8:00 should be blocked
    await expect(page.getByRole("button", { name: "08:00" })).toHaveClass(/line-through/, { timeout: 5000 });

    // 9:00 should be available (store-to-store = 0 gap)
    const slot9am = page.getByRole("button", { name: "09:00" });
    await expect(slot9am).not.toHaveClass(/line-through/);
    await expect(slot9am).toBeEnabled();
  });

  test("Scenario 3: Multiple store slots blocked, next available works", async ({ page }) => {
    // Seed: create 8 AM and 9 AM store bookings
    await createBookingViaAPI(baseUrl, "08:00", "store");
    await createBookingViaAPI(baseUrl, "09:00", "store");

    await navigateToDateStep(page, "store");
    await selectFirstAvailableDate(page);

    // Both should be blocked
    await expect(page.getByRole("button", { name: "08:00" })).toHaveClass(/line-through/, { timeout: 5000 });
    await expect(page.getByRole("button", { name: "09:00" })).toHaveClass(/line-through/);

    // 10:00 should be available
    const slot10am = page.getByRole("button", { name: "10:00" });
    await expect(slot10am).not.toHaveClass(/line-through/);
    await expect(slot10am).toBeEnabled();
  });

  test("Scenario 4: Customer location needs 30 min gap after store booking", async ({ page }) => {
    // Seed: create store bookings at 8, 9, 10 AM (ending at 11 AM)
    await createBookingViaAPI(baseUrl, "08:00", "store");
    await createBookingViaAPI(baseUrl, "09:00", "store");
    await createBookingViaAPI(baseUrl, "10:00", "store");

    // Navigate with CUSTOMER location
    await navigateToDateStep(page, "customer");
    await selectFirstAvailableDate(page);

    // All occupied slots blocked
    await expect(page.getByRole("button", { name: "08:00" })).toHaveClass(/line-through/, { timeout: 5000 });
    await expect(page.getByRole("button", { name: "09:00" })).toHaveClass(/line-through/);
    await expect(page.getByRole("button", { name: "10:00" })).toHaveClass(/line-through/);

    // 11:00 blocked (needs 30 min gap after 11:00 end)
    await expect(page.getByRole("button", { name: "11:00" })).toHaveClass(/line-through/);

    // 11:30 should be first available (30 min after last store booking ends)
    const slot1130 = page.getByRole("button", { name: "11:30" });
    await expect(slot1130).not.toHaveClass(/line-through/);
    await expect(slot1130).toBeEnabled();
  });
});
