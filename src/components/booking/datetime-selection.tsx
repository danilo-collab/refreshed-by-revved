"use client";

import { useState } from "react";
import { format, addDays, isSameDay, startOfToday } from "date-fns";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";

interface DateTimeSelectionProps {
  selectedDate: Date | null;
  selectedTime: string;
  onDateChange: (date: Date) => void;
  onTimeChange: (time: string) => void;
  serviceDuration: number;
}

const TIME_SLOTS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

export function DateTimeSelection({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
  serviceDuration,
}: DateTimeSelectionProps) {
  const [weekOffset, setWeekOffset] = useState(0);
  const today = startOfToday();

  // Generate 7 days starting from today + weekOffset
  const days = Array.from({ length: 7 }, (_, i) =>
    addDays(today, i + weekOffset * 7)
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Pick Your Date & Time</h2>
      <p className="text-on-surface-variant mb-6 normal-case not-italic">
        Select an available slot. Service duration: ~{serviceDuration} minutes.
      </p>

      {/* Date Selection */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setWeekOffset(Math.max(0, weekOffset - 1))}
            disabled={weekOffset === 0}
            className={cn(
              "p-2 machined-border transition-colors",
              weekOffset === 0
                ? "text-outline cursor-not-allowed"
                : "text-on-surface hover:border-primary-container"
            )}
          >
            <ChevronLeft className="size-5" />
          </button>
          <span className="font-bold">
            {format(days[0], "MMM d")} - {format(days[6], "MMM d, yyyy")}
          </span>
          <button
            onClick={() => setWeekOffset(weekOffset + 1)}
            className="p-2 machined-border text-on-surface hover:border-primary-container transition-colors"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => {
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isPast = day < today;
            return (
              <button
                key={day.toISOString()}
                onClick={() => !isPast && onDateChange(day)}
                disabled={isPast}
                className={cn(
                  "p-3 text-center machined-border transition-all",
                  isPast
                    ? "text-outline cursor-not-allowed opacity-50"
                    : isSelected
                    ? "border-primary-container bg-primary-container/10 text-primary-container"
                    : "bg-surface-container hover:border-outline"
                )}
              >
                <div className="text-xs text-outline uppercase">
                  {format(day, "EEE")}
                </div>
                <div className="text-lg font-bold mt-1">{format(day, "d")}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="size-5 text-primary-container" />
            <span className="font-bold">
              Available Times for {format(selectedDate, "EEEE, MMMM d")}
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {TIME_SLOTS.map((time) => {
              const isSelected = selectedTime === time;
              // TODO: Check actual availability from API
              const isAvailable = true;
              return (
                <button
                  key={time}
                  onClick={() => isAvailable && onTimeChange(time)}
                  disabled={!isAvailable}
                  className={cn(
                    "p-3 text-center machined-border transition-all font-bold",
                    !isAvailable
                      ? "text-outline cursor-not-allowed line-through opacity-50"
                      : isSelected
                      ? "border-primary-container bg-primary-container text-on-primary cyan-glow"
                      : "bg-surface-container hover:border-outline"
                  )}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
