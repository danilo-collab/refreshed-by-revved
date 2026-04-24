import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { Calendar, Clock, MapPin, User, Phone, Mail, CalendarX, Store } from "lucide-react";
import { db } from "@/lib/db";
import { bookings } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-500",
  confirmed: "bg-green-500/20 text-green-500",
  in_progress: "bg-blue-500/20 text-blue-500",
  completed: "bg-primary-container/20 text-primary-container",
  cancelled: "bg-red-500/20 text-red-500",
};

export default async function AdminBookingsPage() {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  // Fetch bookings with product relation
  const bookingsList = await db.query.bookings.findMany({
    with: { product: true },
    orderBy: [desc(bookings.scheduledDate)],
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Bookings</h1>
          <p className="text-on-surface-variant mt-2 normal-case not-italic">
            Manage customer appointments
          </p>
        </div>
      </div>

      {bookingsList.length === 0 ? (
        <div className="machined-border bg-surface-container-low p-12 text-center">
          <CalendarX className="size-12 text-outline mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">No bookings yet</h3>
          <p className="text-on-surface-variant normal-case not-italic">
            Bookings will appear here when customers schedule appointments.
          </p>
        </div>
      ) : (
      <div className="space-y-4">
        {bookingsList.map((booking) => (
          <div
            key={booking.id}
            className="machined-border bg-surface-container-low p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold not-italic normal-case">
                  {booking.product.name}
                </h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-on-surface-variant">
                  <span className="flex items-center gap-1">
                    <Calendar className="size-4" />
                    {format(new Date(booking.scheduledDate), "MMM d, yyyy")}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-4" />
                    {format(new Date(booking.scheduledDate), "h:mm a")}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                    statusColors[booking.status] || statusColors.pending
                  }`}
                >
                  {booking.status.replace("_", " ")}
                </span>
                <p className="text-2xl font-bold text-primary-container mt-2">
                  ${parseFloat(booking.totalPrice).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-outline-variant">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="size-4 text-primary-container" />
                  <span>{booking.customerName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="size-4 text-primary-container" />
                  <span>{booking.customerEmail}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="size-4 text-primary-container" />
                  <span>{booking.customerPhone}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  {booking.locationType === "store" ? (
                    <>
                      <Store className="size-4 text-primary-container" />
                      <span className="px-2 py-0.5 text-xs font-bold uppercase bg-primary-container/20 text-primary-container">
                        At Store
                      </span>
                    </>
                  ) : (
                    <>
                      <MapPin className="size-4 text-primary-container" />
                      <span className="px-2 py-0.5 text-xs font-bold uppercase bg-tertiary-container/20 text-tertiary-container">
                        On-Site
                      </span>
                    </>
                  )}
                </div>
                <div className="flex items-start gap-2 text-sm text-on-surface-variant">
                  <span className="ml-6">{booking.address}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}
