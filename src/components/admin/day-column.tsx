"use client";

import { parseWallClock } from "@/lib/date";
import { BookingCard } from "./booking-card";
import type { AdminBooking } from "./bookings-page-client";

export const BUSINESS_START_HOUR = 8; // 8am
export const BUSINESS_END_HOUR = 18; // 6pm
export const SLOT_MINUTES = 30;
export const TOTAL_SLOTS = ((BUSINESS_END_HOUR - BUSINESS_START_HOUR) * 60) / SLOT_MINUTES;

interface Props {
  /** Bookings that fall on this day */
  bookings: AdminBooking[];
  /** Pixel height of one 30-min slot */
  rowHeight: number;
}

/**
 * Renders a vertical timeline column for a single day, with bookings
 * absolutely positioned by their start time and duration.
 */
export function DayColumn({ bookings, rowHeight }: Props) {
  const totalHeight = TOTAL_SLOTS * rowHeight;

  return (
    <div
      className="relative border-l border-outline-variant/50"
      style={{ height: totalHeight }}
    >
      {Array.from({ length: TOTAL_SLOTS }).map((_, i) => (
        <div
          key={i}
          className="border-t border-outline-variant/30"
          style={{ height: rowHeight }}
          aria-hidden="true"
        />
      ))}

      {bookings.map((b) => {
        const pos = positionFor(b, rowHeight);
        if (!pos) return null;
        return (
          <BookingCard
            key={b.id}
            booking={b}
            top={pos.top}
            height={pos.height}
          />
        );
      })}
    </div>
  );
}

function positionFor(booking: { scheduledDate: string; scheduledEndDate: string }, rowHeight: number) {
  const start = parseWallClock(booking.scheduledDate);
  const end = parseWallClock(booking.scheduledEndDate);
  const minutesFromStart =
    (start.getHours() - BUSINESS_START_HOUR) * 60 + start.getMinutes();
  const durationMinutes = Math.max(
    SLOT_MINUTES,
    (end.getTime() - start.getTime()) / 60000
  );

  if (minutesFromStart < 0 || minutesFromStart >= (BUSINESS_END_HOUR - BUSINESS_START_HOUR) * 60) {
    return null;
  }

  return {
    top: (minutesFromStart / SLOT_MINUTES) * rowHeight,
    height: Math.max(24, (durationMinutes / SLOT_MINUTES) * rowHeight - 2),
  };
}

export function HourLabels({ rowHeight }: { rowHeight: number }) {
  const hours = Array.from(
    { length: BUSINESS_END_HOUR - BUSINESS_START_HOUR + 1 },
    (_, i) => BUSINESS_START_HOUR + i
  );
  const hourHeight = rowHeight * 2; // 2 slots per hour
  return (
    <div
      className="relative text-[10px] text-outline select-none"
      style={{ height: TOTAL_SLOTS * rowHeight, width: 48 }}
      aria-hidden="true"
    >
      {hours.map((h, i) => (
        <div
          key={h}
          className="absolute right-2"
          style={{ top: i * hourHeight - 6 }}
        >
          {formatHour(h)}
        </div>
      ))}
    </div>
  );
}

function formatHour(h: number): string {
  if (h === 0) return "12a";
  if (h === 12) return "12p";
  if (h < 12) return `${h}a`;
  return `${h - 12}p`;
}
