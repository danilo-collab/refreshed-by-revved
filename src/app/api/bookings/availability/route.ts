import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bookings } from "@/lib/db/schema";
import { and, gte, lt, ne } from "drizzle-orm";

type LocationType = "store" | "customer";

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

const TRAVEL_GAP_MINUTES = 30;

/**
 * Calculate required gap between two bookings based on location types
 * Store → Store = 0 (back-to-back OK)
 * Any other combo = 30 min travel gap
 */
function getRequiredGap(
  prevLocationType: LocationType,
  nextLocationType: LocationType
): number {
  if (prevLocationType === "store" && nextLocationType === "store") {
    return 0;
  }
  return TRAVEL_GAP_MINUTES;
}

/**
 * Check if a proposed booking conflicts with existing bookings
 */
function hasConflict(
  proposedStart: Date,
  proposedEnd: Date,
  proposedLocationType: LocationType,
  existingBookings: Array<{
    scheduledDate: Date;
    scheduledEndDate: Date;
    locationType: LocationType | null;
  }>
): boolean {
  for (const existing of existingBookings) {
    const existingStart = existing.scheduledDate;
    const existingEnd = existing.scheduledEndDate;
    const existingLocationType = (existing.locationType || "customer") as LocationType;

    // Check direct overlap
    if (proposedStart < existingEnd && proposedEnd > existingStart) {
      return true;
    }

    // Check gap before proposed booking (existing ends before proposed starts)
    if (existingEnd <= proposedStart) {
      const requiredGap = getRequiredGap(existingLocationType, proposedLocationType);
      const actualGapMs = proposedStart.getTime() - existingEnd.getTime();
      const actualGapMinutes = actualGapMs / (1000 * 60);
      if (actualGapMinutes < requiredGap) {
        return true;
      }
    }

    // Check gap after proposed booking (proposed ends before existing starts)
    if (proposedEnd <= existingStart) {
      const requiredGap = getRequiredGap(proposedLocationType, existingLocationType);
      const actualGapMs = existingStart.getTime() - proposedEnd.getTime();
      const actualGapMinutes = actualGapMs / (1000 * 60);
      if (actualGapMinutes < requiredGap) {
        return true;
      }
    }
  }

  return false;
}

// GET /api/bookings/availability?date=2024-04-25&duration=90&locationType=customer
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const dateStr = searchParams.get("date");
    const durationStr = searchParams.get("duration");
    const locationType = (searchParams.get("locationType") || "customer") as LocationType;

    if (!dateStr || !durationStr) {
      return NextResponse.json(
        { error: "Missing required params: date, duration" },
        { status: 400 }
      );
    }

    const date = new Date(dateStr);
    const duration = parseInt(durationStr, 10);

    if (isNaN(date.getTime()) || isNaN(duration)) {
      return NextResponse.json(
        { error: "Invalid date or duration" },
        { status: 400 }
      );
    }

    // Get start/end of day
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    // Fetch existing bookings for this day (excluding cancelled)
    const existingBookings = await db
      .select({
        scheduledDate: bookings.scheduledDate,
        scheduledEndDate: bookings.scheduledEndDate,
        locationType: bookings.locationType,
      })
      .from(bookings)
      .where(
        and(
          gte(bookings.scheduledDate, dayStart),
          lt(bookings.scheduledDate, dayEnd),
          ne(bookings.status, "cancelled")
        )
      );

    // Check each time slot
    const availability: Record<string, boolean> = {};

    for (const slot of TIME_SLOTS) {
      const [hours, minutes] = slot.split(":").map(Number);

      const proposedStart = new Date(date);
      proposedStart.setHours(hours, minutes, 0, 0);

      const proposedEnd = new Date(proposedStart);
      proposedEnd.setMinutes(proposedEnd.getMinutes() + duration);

      // Check if slot ends after business hours (18:00)
      const businessEnd = new Date(date);
      businessEnd.setHours(18, 0, 0, 0);

      if (proposedEnd > businessEnd) {
        availability[slot] = false;
        continue;
      }

      // Check conflicts
      availability[slot] = !hasConflict(
        proposedStart,
        proposedEnd,
        locationType,
        existingBookings
      );
    }

    return NextResponse.json({ availability, date: dateStr, duration, locationType });
  } catch (error) {
    console.error("Availability check error:", error);
    return NextResponse.json(
      { error: "Failed to check availability" },
      { status: 500 }
    );
  }
}
