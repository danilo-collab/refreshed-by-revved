import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { desc } from "drizzle-orm";
import { z } from "zod";
import { headers } from "next/headers";

const leadSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(1),
  photos: z.array(z.string()).max(5).optional(), // Max 5 photos as base64 data URLs
  source: z.string().optional(),
});

// GET /api/leads - List leads (admin only)
export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const leadsList = await db
      .select()
      .from(leads)
      .orderBy(desc(leads.createdAt));

    return NextResponse.json(leadsList);
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}

// POST /api/leads - Submit contact form (public, rate-limited)
export async function POST(request: NextRequest) {
  try {
    // Rate limiting by IP
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "anonymous";
    const rateLimit = await checkRateLimit(`lead:${ip}`);

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
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const [newLead] = await db
      .insert(leads)
      .values({
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        photos: data.photos || [],
        source: data.source || "contact_form",
      })
      .returning();

    // TODO: Send notification email to admin

    return NextResponse.json(
      { success: true, message: "Thank you for contacting us!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { error: "Failed to submit contact form" },
      { status: 500 }
    );
  }
}
