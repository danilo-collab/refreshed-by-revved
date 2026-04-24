"use client";

import { useState, useEffect, useCallback } from "react";
import { format, addDays, isSameDay, startOfToday } from "date-fns";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Clock, Loader2 } from "lucide-react";
import type { LocationType } from "./location-input";

interface DateTimeSelectionProps {
  selectedDate: Date | null;
  selectedTime: string;
  onDateChange: (date: Date) => void;
  onTimeChange: (time: string) => void;
  serviceDuration: number;
  locationType: LocationType;
}

export function DateTimeSelection({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
  serviceDuration,
  locationType,
}: DateTimeSelectionProps) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [slots, setSlots] = useState<string[]>([]);
  const [availability, setAvailability] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const today = startOfToday();

  // Generate 7 days starting from today + weekOffset
  const days = Array.from({ length: 7 }, (_, i) =>
    addDays(today, i + weekOffset * 7)
  );

  // Fetch availability when date or locationType changes
  const fetchAvailability = useCallback(async () => {
    if (!selectedDate) return;

    setIsLoading(true);
    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const res = await fetch(
        `/api/bookings/availability?date=${dateStr}&duration=${serviceDuration}&locationType=${locationType}`
      );

      if (res.ok) {
        const data = await res.json();
        setSlots(data.slots || []);
        setAvailability(data.availability);
      }
    } catch (error) {
      console.error("Failed to fetch availability:", error);
      setSlots([]);
      setAvailability({});
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate, serviceDuration, locationType]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  // Clear selected time if it becomes unavailable
  useEffect(() => {
    if (selectedTime && availability[selectedTime] === false) {
      onTimeChange("");
    }
  }, [availability, selectedTime, onTimeChange]);

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
            {isLoading && <Loader2 className="size-4 animate-spin text-outline" />}
          </div>

          <div className="grid grid-cols-5 gap-2">
            {slots.map((time) => {
              const isSelected = selectedTime === time;
              const isAvailable = availability[time] !== false;
              return (
                <button
                  key={time}
                  onClick={() => isAvailable && !isLoading && onTimeChange(time)}
                  disabled={!isAvailable || isLoading}
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

          {Object.values(availability).every((v) => v === false) && !isLoading && (
            <p className="text-center text-on-surface-variant mt-4 normal-case not-italic">
              No available slots for this date. Please try another day.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
