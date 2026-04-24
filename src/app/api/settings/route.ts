import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { settings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Default settings
const defaultSettings = {
  paymentsEnabled: false,
  paymentProvider: "stripe",
  businessName: "Refreshed By Revved",
  businessPhone: "",
  businessEmail: "",
};

export type StoreSettings = typeof defaultSettings;

// GET /api/settings - Get all settings (public for paymentsEnabled check)
export async function GET() {
  try {
    const rows = await db.select().from(settings);

    // Merge with defaults
    const result = { ...defaultSettings };
    for (const row of rows) {
      if (row.key in result) {
        (result as Record<string, unknown>)[row.key] = row.value;
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return NextResponse.json(defaultSettings);
  }
}

// PUT /api/settings - Update settings (admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Upsert each setting
    for (const [key, value] of Object.entries(body)) {
      if (key in defaultSettings) {
        const existing = await db
          .select()
          .from(settings)
          .where(eq(settings.key, key))
          .limit(1);

        if (existing.length > 0) {
          await db
            .update(settings)
            .set({ value, updatedAt: new Date() })
            .where(eq(settings.key, key));
        } else {
          await db.insert(settings).values({ key, value });
        }
      }
    }

    // Return updated settings
    const rows = await db.select().from(settings);
    const result = { ...defaultSettings };
    for (const row of rows) {
      if (row.key in result) {
        (result as Record<string, unknown>)[row.key] = row.value;
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to update settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
