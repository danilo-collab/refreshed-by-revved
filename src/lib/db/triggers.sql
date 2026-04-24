-- Dashboard stats triggers
-- Run this after schema push to set up automatic stat updates

-- Initialize dashboard_stats row if not exists
INSERT INTO dashboard_stats (id, bookings_today, bookings_today_date, bookings_total, leads_this_week, leads_week_start, leads_total, revenue_mtd, revenue_month, revenue_year, revenue_total, updated_at)
VALUES ('main', 0, CURRENT_DATE, 0, 0, date_trunc('week', CURRENT_DATE), 0, 0, EXTRACT(MONTH FROM CURRENT_DATE), EXTRACT(YEAR FROM CURRENT_DATE), 0, NOW())
ON CONFLICT (id) DO NOTHING;

-- Function to update stats on booking insert
CREATE OR REPLACE FUNCTION update_dashboard_on_booking()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE dashboard_stats
  SET
    -- Reset today counter if date changed
    bookings_today = CASE
      WHEN bookings_today_date::date = CURRENT_DATE THEN bookings_today + 1
      ELSE 1
    END,
    bookings_today_date = CURRENT_DATE,
    bookings_total = bookings_total + 1,
    -- Reset MTD if month changed
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
$$ LANGUAGE plpgsql;

-- Function to update stats on lead insert
CREATE OR REPLACE FUNCTION update_dashboard_on_lead()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE dashboard_stats
  SET
    -- Reset week counter if week changed
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
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS trg_booking_insert ON bookings;
DROP TRIGGER IF EXISTS trg_lead_insert ON leads;

-- Create triggers
CREATE TRIGGER trg_booking_insert
AFTER INSERT ON bookings
FOR EACH ROW
EXECUTE FUNCTION update_dashboard_on_booking();

CREATE TRIGGER trg_lead_insert
AFTER INSERT ON leads
FOR EACH ROW
EXECUTE FUNCTION update_dashboard_on_lead();
