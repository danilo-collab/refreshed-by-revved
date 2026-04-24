import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bookings, settings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Payment provider types
type PaymentProvider = "stripe" | "square" | "authorizenet";

async function createStripeSession(booking: typeof bookings.$inferSelect) {
  const stripe = await import("stripe").then(
    (m) => new m.default(process.env.STRIPE_SECRET_KEY!)
  );

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Mobile Detailing Service`,
            description: `Booking ID: ${booking.id}`,
          },
          unit_amount: Math.round(Number(booking.totalPrice) * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.NEXTAUTH_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/booking?cancelled=true`,
    metadata: {
      bookingId: booking.id,
    },
  });

  return session.url;
}

async function createSquareCheckout(booking: typeof bookings.$inferSelect) {
  // Square Web Payments SDK implementation
  // For now, return a placeholder
  // TODO: Implement Square checkout
  console.log("Square checkout for booking:", booking.id);
  return `${process.env.NEXTAUTH_URL}/booking/square-checkout?bookingId=${booking.id}`;
}

async function createAuthorizeNetCheckout(booking: typeof bookings.$inferSelect) {
  // Authorize.net Accept Hosted implementation
  // For now, return a placeholder
  // TODO: Implement Authorize.net checkout
  console.log("Authorize.net checkout for booking:", booking.id);
  return `${process.env.NEXTAUTH_URL}/booking/authnet-checkout?bookingId=${booking.id}`;
}

// GET /api/checkout/[id] - Redirect to payment provider
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const baseUrl = request.nextUrl.origin;

    // Fetch booking
    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, id))
      .limit(1);

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.paymentStatus === "paid") {
      return NextResponse.redirect(new URL("/booking/success", baseUrl));
    }

    // Check if payments are enabled
    const [paymentsEnabledSetting] = await db
      .select()
      .from(settings)
      .where(eq(settings.key, "paymentsEnabled"))
      .limit(1);

    const paymentsEnabled = paymentsEnabledSetting?.value === true;

    // If payments disabled, mark as confirmed and redirect to success
    if (!paymentsEnabled) {
      await db
        .update(bookings)
        .set({
          paymentStatus: "paid",
          status: "confirmed",
          updatedAt: new Date(),
        })
        .where(eq(bookings.id, id));

      return NextResponse.redirect(new URL("/booking/success", baseUrl));
    }

    // Determine payment provider from settings or env
    const [providerSetting] = await db
      .select()
      .from(settings)
      .where(eq(settings.key, "paymentProvider"))
      .limit(1);

    const provider = ((providerSetting?.value as string) ||
      process.env.PAYMENT_PROVIDER ||
      "stripe") as PaymentProvider;

    let checkoutUrl: string | null = null;

    switch (provider) {
      case "stripe":
        if (!process.env.STRIPE_SECRET_KEY) {
          return NextResponse.json(
            { error: "Stripe not configured" },
            { status: 500 }
          );
        }
        checkoutUrl = await createStripeSession(booking);
        break;

      case "square":
        if (!process.env.SQUARE_ACCESS_TOKEN) {
          return NextResponse.json(
            { error: "Square not configured" },
            { status: 500 }
          );
        }
        checkoutUrl = await createSquareCheckout(booking);
        break;

      case "authorizenet":
        if (!process.env.AUTHORIZENET_API_LOGIN) {
          return NextResponse.json(
            { error: "Authorize.net not configured" },
            { status: 500 }
          );
        }
        checkoutUrl = await createAuthorizeNetCheckout(booking);
        break;

      default:
        return NextResponse.json(
          { error: "Invalid payment provider" },
          { status: 500 }
        );
    }

    if (!checkoutUrl) {
      return NextResponse.json(
        { error: "Failed to create checkout session" },
        { status: 500 }
      );
    }

    // Update booking with payment provider
    await db
      .update(bookings)
      .set({ paymentProvider: provider, updatedAt: new Date() })
      .where(eq(bookings.id, id));

    return NextResponse.redirect(checkoutUrl);
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
