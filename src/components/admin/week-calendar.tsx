"use client";

import { useMemo, useState } from "react";
import { addDays, format, isSameDay, startOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { parseWallClock } from "@/lib/date";
import {
  DayColumn,
  HourLabels,
  BUSINESS_START_HOUR,
  BUSINESS_END_HOUR,
} from "./day-column";
import type { AdminBooking } from "./bookings-page-client";

const ROW_HEIGHT_DESKTOP = 32;
const ROW_HEIGHT_MOBILE = 40;

interface Props {
  bookings: AdminBooking[];
}

export function WeekCalendar({ bookings }: Props) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(() => {
    const today = new Date();
    return today.getDay(); // 0=Sun
  });

  const weekStart = useMemo(
    () => addDays(startOfWeek(new Date(), { weekStartsOn: 0 }), weekOffset * 7),
    [weekOffset]
  );
  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  // Bucket bookings by day (local wall-clock)
  const byDay = useMemo(() => {
    const map = new Map<string, AdminBooking[]>();
    for (const b of bookings) {
      const d = parseWallClock(b.scheduledDate);
      const key = format(d, "yyyy-MM-dd");
      const arr = map.get(key) ?? [];
      arr.push(b);
      map.set(key, arr);
    }
    return map;
  }, [bookings]);

  const bookingsForDay = (day: Date) =>
    byDay.get(format(day, "yyyy-MM-dd")) ?? [];

  const today = new Date();
  const weekLabel = `${format(days[0], "MMM d")} – ${format(days[6], "MMM d, yyyy")}`;

  return (
    <div className="machined-border bg-surface-container-low">
      {/* Week nav */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant">
        <button
          onClick={() => setWeekOffset(weekOffset - 1)}
          aria-label="Previous week"
          className="inline-flex items-center justify-center size-11 rounded hover:bg-surface-container transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container"
        >
          <ChevronLeft className="size-5" />
        </button>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold">{weekLabel}</span>
          {weekOffset !== 0 && (
            <button
              onClick={() => setWeekOffset(0)}
              className="text-xs text-primary-container hover:underline cursor-pointer"
            >
              Today
            </button>
          )}
        </div>
        <button
          onClick={() => setWeekOffset(weekOffset + 1)}
          aria-label="Next week"
          className="inline-flex items-center justify-center size-11 rounded hover:bg-surface-container transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      {/* Mobile: day-picker chips */}
      <div className="md:hidden overflow-x-auto border-b border-outline-variant">
        <div className="flex gap-2 p-3 min-w-max">
          {days.map((day, i) => {
            const isSelected = i === selectedDayIdx;
            const isToday = isSameDay(day, today);
            const count = bookingsForDay(day).length;
            return (
              <button
                key={day.toISOString()}
                onClick={() => setSelectedDayIdx(i)}
                aria-pressed={isSelected}
                className={cn(
                  "flex flex-col items-center justify-center min-w-[56px] min-h-[56px] rounded px-2 py-1 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container",
                  isSelected
                    ? "bg-primary-container text-on-primary"
                    : "bg-surface-container hover:bg-surface-container-high"
                )}
              >
                <span className="text-[10px] uppercase font-bold opacity-80">
                  {format(day, "EEE")}
                </span>
                <span className={cn("text-lg font-bold", isToday && !isSelected && "text-primary-container")}>
                  {format(day, "d")}
                </span>
                {count > 0 && (
                  <span className="text-[9px] opacity-70">{count} bkg</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop: 7-column grid */}
      <div className="hidden md:block overflow-x-auto">
        <div className="flex min-w-[900px]">
          <div className="pt-10">
            <HourLabels rowHeight={ROW_HEIGHT_DESKTOP} />
          </div>
          <div className="flex-1 grid grid-cols-7 min-w-0">
            {days.map((day) => {
              const isToday = isSameDay(day, today);
              return (
                <div key={day.toISOString()} className="min-w-0">
                  <DayHeader day={day} isToday={isToday} />
                  <DayColumn
                    bookings={bookingsForDay(day)}
                    rowHeight={ROW_HEIGHT_DESKTOP}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile: single day */}
      <div className="md:hidden">
        <div className="flex">
          <div className="pt-2">
            <HourLabels rowHeight={ROW_HEIGHT_MOBILE} />
          </div>
          <div className="flex-1 min-w-0">
            <DayColumn
              bookings={bookingsForDay(days[selectedDayIdx])}
              rowHeight={ROW_HEIGHT_MOBILE}
            />
          </div>
        </div>
      </div>

      {/* Empty-state helper text */}
      {bookings.length === 0 && (
        <p className="text-center text-sm text-on-surface-variant py-6 normal-case not-italic">
          No bookings this week.
        </p>
      )}
      <p className="text-[10px] text-outline text-center py-2 border-t border-outline-variant">
        Showing {BUSINESS_START_HOUR}:00 – {BUSINESS_END_HOUR}:00 business hours
      </p>
    </div>
  );
}

function DayHeader({ day, isToday }: { day: Date; isToday: boolean }) {
  return (
    <div
      className={cn(
        "h-10 flex flex-col items-center justify-center border-b border-outline-variant",
        isToday && "bg-primary-container/10"
      )}
    >
      <span className="text-[10px] uppercase font-bold opacity-70">
        {format(day, "EEE")}
      </span>
      <span
        className={cn(
          "text-sm font-bold",
          isToday && "text-primary-container"
        )}
      >
        {format(day, "d")}
      </span>
    </div>
  );
}
