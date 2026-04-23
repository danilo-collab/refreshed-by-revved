import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products, addons } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  price: z.string().or(z.number()),
  durationMinutes: z.number().int().positive(),
  imageUrl: z.string().url().optional(),
  features: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
  isSubscription: z.boolean().optional(),
  subscriptionInterval: z.string().optional(),
  sortOrder: z.number().int().optional(),
});

// GET /api/products - List all products and addons
export async function GET() {
  try {
    const [productsList, addonsList] = await Promise.all([
      db
        .select()
        .from(products)
        .where(eq(products.isActive, true))
        .orderBy(products.sortOrder),
      db
        .select()
        .from(addons)
        .where(eq(addons.isActive, true))
        .orderBy(addons.sortOrder),
    ]);

    return NextResponse.json({
      products: productsList,
      addons: addonsList,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = productSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const [newProduct] = await db
      .insert(products)
      .values({
        name: data.name,
        slug: data.slug,
        description: data.description,
        shortDescription: data.shortDescription,
        price: String(data.price),
        durationMinutes: data.durationMinutes,
        imageUrl: data.imageUrl,
        features: data.features || [],
        isActive: data.isActive ?? true,
        isSubscription: data.isSubscription ?? false,
        subscriptionInterval: data.subscriptionInterval,
        sortOrder: data.sortOrder ?? 0,
      })
      .returning();

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
