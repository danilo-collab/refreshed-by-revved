import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { bookings } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { BookingsPageClient } from "@/components/admin/bookings-page-client";

export default async function AdminBookingsPage() {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  const bookingsList = await db.query.bookings.findMany({
    with: { product: true },
    orderBy: [desc(bookings.scheduledDate)],
  });

  return <BookingsPageClient bookings={bookingsList} />;
}
