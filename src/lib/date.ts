/**
 * Parse a naive wall-clock string ("YYYY-MM-DDTHH:mm:ss") into a Date
 * whose local getters (getHours, getFullYear, etc.) return the original
 * components. This makes display via date-fns `format()` and comparison
 * math tz-invariant: bookings at 8am display as 8am on any server.
 */
export function parseWallClock(s: string): Date {
  const [datePart, timePart = "00:00:00"] = s.replace(" ", "T").split("T");
  const [y, mo, d] = datePart.split("-").map(Number);
  const [h = 0, mi = 0, se = 0] = timePart.split(":").map((p) => parseInt(p, 10));
  return new Date(y, mo - 1, d, h, mi, se || 0);
}

/**
 * Format a Date as a naive wall-clock string ("YYYY-MM-DDTHH:mm:ss"),
 * using the Date's local components (mirror of parseWallClock).
 */
export function formatWallClock(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}
