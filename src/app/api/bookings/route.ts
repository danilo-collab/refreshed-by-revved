import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bookings } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { headers } from "next/headers";

const bookingSchema = z.object({
  productId: z.string().uuid(),
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(1),
  address: z.string().min(1),
  addressNotes: z.string().optional(),
  scheduledDate: z.string().datetime(),
  scheduledEndDate: z.string().datetime(),
  totalPrice: z.string().or(z.number()),
  totalDurationMinutes: z.number().int().positive(),
  addonIds: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

// GET /api/bookings - List bookings (admin only)
export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookingsList = await db
      .select()
      .from(bookings)
      .orderBy(desc(bookings.scheduledDate));

    return NextResponse.json(bookingsList);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

// POST /api/bookings - Create a new booking (public, rate-limited)
export async function POST(request: NextRequest) {
  try {
    // Rate limiting by IP
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "anonymous";
    const rateLimit = await checkRateLimit(`booking:${ip}`);

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: "Too many requests. Please try again later.",
          retryAfter: Math.ceil((rateLimit.reset - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": String(rateLimit.limit),
            "X-RateLimit-Remaining": String(rateLimit.remaining),
            "X-RateLimit-Reset": String(rateLimit.reset),
          },
        }
      );
    }

    const body = await request.json();
    const parsed = bookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // TODO: Check for scheduling conflicts
    // TODO: Validate product and addon IDs exist

    const [newBooking] = await db
      .insert(bookings)
      .values({
        productId: data.productId,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        address: data.address,
        addressNotes: data.addressNotes,
        scheduledDate: new Date(data.scheduledDate),
        scheduledEndDate: new Date(data.scheduledEndDate),
        totalPrice: String(data.totalPrice),
        totalDurationMinutes: data.totalDurationMinutes,
        addonIds: data.addonIds || [],
        notes: data.notes,
        status: "pending",
        paymentStatus: "pending",
      })
      .returning();

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

// PATCH /api/bookings - Update booking status (admin only)
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, status, paymentStatus } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Booking ID required" },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const [updated] = await db
      .update(bookings)
      .set(updateData)
      .where(eq(bookings.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
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
