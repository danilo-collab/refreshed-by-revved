import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";

async function setupTriggers() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required");
  }

  const sql = neon(process.env.DATABASE_URL);

  console.log("Setting up dashboard triggers...");

  // Initialize dashboard_stats row
  console.log("  Creating dashboard_stats row...");
  await sql`
    INSERT INTO dashboard_stats (id, bookings_today, bookings_today_date, bookings_total, leads_this_week, leads_week_start, leads_total, revenue_mtd, revenue_month, revenue_year, revenue_total, updated_at)
    VALUES ('main', 0, CURRENT_DATE, 0, 0, date_trunc('week', CURRENT_DATE), 0, 0, EXTRACT(MONTH FROM CURRENT_DATE), EXTRACT(YEAR FROM CURRENT_DATE), 0, NOW())
    ON CONFLICT (id) DO NOTHING
  `;

  // Create booking trigger function
  console.log("  Creating booking trigger function...");
  await sql`
    CREATE OR REPLACE FUNCTION update_dashboard_on_booking()
    RETURNS TRIGGER AS $$
    BEGIN
      UPDATE dashboard_stats
      SET
        bookings_today = CASE
          WHEN bookings_today_date::date = CURRENT_DATE THEN bookings_today + 1
          ELSE 1
        END,
        bookings_today_date = CURRENT_DATE,
        bookings_total = bookings_total + 1,
        revenue_mtd = CASE
          WHEN revenue_month = EXTRACT(MONTH FROM CURRENT_DATE) AND revenue_year = EXTRACT(YEAR FROM CURRENT_DATE)
          THEN revenue_mtd + NEW.total_price
          ELSE NEW.total_price
        END,
        revenue_month = EXTRACT(MONTH FROM CURRENT_DATE),
        revenue_year = EXTRACT(YEAR FROM CURRENT_DATE),
        revenue_total = revenue_total + NEW.total_price,
        updated_at = NOW()
      WHERE id = 'main';
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql
  `;

  // Create lead trigger function
  console.log("  Creating lead trigger function...");
  await sql`
    CREATE OR REPLACE FUNCTION update_dashboard_on_lead()
    RETURNS TRIGGER AS $$
    BEGIN
      UPDATE dashboard_stats
      SET
        leads_this_week = CASE
          WHEN leads_week_start = date_trunc('week', CURRENT_DATE) THEN leads_this_week + 1
          ELSE 1
        END,
        leads_week_start = date_trunc('week', CURRENT_DATE),
        leads_total = leads_total + 1,
        updated_at = NOW()
      WHERE id = 'main';
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql
  `;

  // Drop and recreate triggers
  console.log("  Setting up triggers...");
  await sql`DROP TRIGGER IF EXISTS trg_booking_insert ON bookings`;
  await sql`DROP TRIGGER IF EXISTS trg_lead_insert ON leads`;

  await sql`
    CREATE TRIGGER trg_booking_insert
    AFTER INSERT ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_dashboard_on_booking()
  `;

  await sql`
    CREATE TRIGGER trg_lead_insert
    AFTER INSERT ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_dashboard_on_lead()
  `;

  console.log("Triggers setup complete!");
}

setupTriggers().catch(console.error);
