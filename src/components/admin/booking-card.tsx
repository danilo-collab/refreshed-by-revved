"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { parseWallClock } from "@/lib/date";
import { format } from "date-fns";
import type { AdminBooking } from "./bookings-page-client";

const STATUS_TINT: Record<string, string> = {
  pending: "bg-yellow-500/15 border-l-yellow-500 text-yellow-100",
  confirmed: "bg-green-500/15 border-l-green-500 text-green-100",
  in_progress: "bg-blue-500/15 border-l-blue-500 text-blue-100",
  completed: "bg-primary-container/15 border-l-primary-container text-primary-container",
  cancelled: "bg-slate-500/15 border-l-slate-500 text-slate-300 line-through",
};

interface Props {
  booking: AdminBooking;
  /** Vertical position in px from top of day column */
  top: number;
  /** Height in px based on duration */
  height: number;
}

export function BookingCard({ booking, top, height }: Props) {
  const start = parseWallClock(booking.scheduledDate);
  const end = parseWallClock(booking.scheduledEndDate);
  const tint = STATUS_TINT[booking.status] ?? STATUS_TINT.pending;

  return (
    <Link
      href={`/admin/bookings/${booking.id}`}
      aria-label={`Booking: ${booking.product.name} at ${format(start, "h:mm a")}`}
      style={{ top, height }}
      className={cn(
        "absolute left-1 right-1 rounded-sm border-l-4 px-2 py-1 overflow-hidden cursor-pointer",
        "transition-colors hover:bg-surface-container-high focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container",
        tint
      )}
    >
      <p className="text-xs font-bold truncate not-italic normal-case">
        {booking.product.name}
      </p>
      <p className="text-[10px] opacity-80 truncate">
        {format(start, "h:mm a")}–{format(end, "h:mm a")}
      </p>
      <p className="text-[10px] opacity-70 truncate">{booking.customerName}</p>
    </Link>
  );
}
