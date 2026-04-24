import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bookings, products } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, and, gte, lt, ne } from "drizzle-orm";
import { z } from "zod";
import { sendRescheduleNotification } from "@/lib/email";

type LocationType = "store" | "customer";
const TRAVEL_GAP_MINUTES = 30;

function getRequiredGap(
  prevLocationType: LocationType,
  nextLocationType: LocationType
): number {
  if (prevLocationType === "store" && nextLocationType === "store") {
    return 0;
  }
  return TRAVEL_GAP_MINUTES;
}

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

    if (proposedStart < existingEnd && proposedEnd > existingStart) {
      return true;
    }

    if (existingEnd <= proposedStart) {
      const requiredGap = getRequiredGap(existingLocationType, proposedLocationType);
      const actualGapMs = proposedStart.getTime() - existingEnd.getTime();
      const actualGapMinutes = actualGapMs / (1000 * 60);
      if (actualGapMinutes < requiredGap) {
        return true;
      }
    }

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

const updateSchema = z.object({
  status: z.enum(["pending", "confirmed", "in_progress", "completed", "cancelled"]).optional(),
  paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]).optional(),
  scheduledDate: z.string().datetime().optional(),
  scheduledEndDate: z.string().datetime().optional(),
});

// GET /api/bookings/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const booking = await db.query.bookings.findFirst({
      where: eq(bookings.id, id),
      with: { product: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}

// PATCH /api/bookings/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.issues },
        { status: 400 }
      );
    }

    // Fetch current booking
    const currentBooking = await db.query.bookings.findFirst({
      where: eq(bookings.id, id),
      with: { product: true },
    });

    if (!currentBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Prevent rescheduling completed bookings
    if (parsed.data.scheduledDate && currentBooking.status === "completed") {
      return NextResponse.json(
        { error: "Cannot reschedule completed bookings" },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    let isRescheduled = false;

    // Handle rescheduling
    if (parsed.data.scheduledDate && parsed.data.scheduledEndDate) {
      const newStart = new Date(parsed.data.scheduledDate);
      const newEnd = new Date(parsed.data.scheduledEndDate);
      const locationType = (currentBooking.locationType || "customer") as LocationType;

      // Check availability (exclude this booking)
      const dayStart = new Date(newStart);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(newStart);
      dayEnd.setHours(23, 59, 59, 999);

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
            ne(bookings.status, "cancelled"),
            ne(bookings.id, id) // Exclude current booking
          )
        );

      // Check business hours
      const businessEnd = new Date(newStart);
      businessEnd.setHours(18, 0, 0, 0);

      if (newEnd > businessEnd) {
        return NextResponse.json(
          { error: "Booking extends past business hours (6 PM)" },
          { status: 400 }
        );
      }

      // Check conflicts
      if (hasConflict(newStart, newEnd, locationType, existingBookings)) {
        return NextResponse.json(
          { error: "Time slot conflicts with existing booking" },
          { status: 400 }
        );
      }

      updateData.scheduledDate = newStart;
      updateData.scheduledEndDate = newEnd;
      updateData.status = "pending"; // Reset to pending on reschedule
      isRescheduled = true;
    }

    // Handle status update
    if (parsed.data.status && !isRescheduled) {
      updateData.status = parsed.data.status;
    }

    // Handle payment status update
    if (parsed.data.paymentStatus) {
      updateData.paymentStatus = parsed.data.paymentStatus;
    }

    const [updated] = await db
      .update(bookings)
      .set(updateData)
      .where(eq(bookings.id, id))
      .returning();

    // Send email notification if rescheduled
    if (isRescheduled) {
      try {
        await sendRescheduleNotification({
          customerName: currentBooking.customerName,
          customerEmail: currentBooking.customerEmail,
          serviceName: currentBooking.product.name,
          scheduledDate: new Date(parsed.data.scheduledDate!),
          address: currentBooking.address,
          locationType: currentBooking.locationType as "store" | "customer",
        });
      } catch (emailError) {
        console.error("Failed to send reschedule email:", emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}

// DELETE /api/bookings/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check booking exists and status
    const booking = await db.query.bookings.findFirst({
      where: eq(bookings.id, id),
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Only allow deleting pending or cancelled bookings
    if (booking.status !== "pending" && booking.status !== "cancelled") {
      return NextResponse.json(
        { error: "Can only delete pending or cancelled bookings" },
        { status: 400 }
      );
    }

    await db.delete(bookings).where(eq(bookings.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting booking:", error);
    return NextResponse.json(
      { error: "Failed to delete booking" },
      { status: 500 }
    );
  }
}
