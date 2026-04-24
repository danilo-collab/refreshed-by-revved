"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format, addDays, isSameDay, startOfToday } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  Store,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Save,
} from "lucide-react";

interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  locationType: "store" | "customer";
  address: string;
  addressNotes: string | null;
  scheduledDate: string;
  scheduledEndDate: string;
  totalPrice: string;
  totalDurationMinutes: number;
  status: string;
  paymentStatus: string;
  notes: string | null;
  product: {
    id: string;
    name: string;
  };
}

const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00",
];

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const PAYMENT_STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
];

export default function BookingEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  // Reschedule state
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [availability, setAvailability] = useState<Record<string, boolean>>({});
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  const today = startOfToday();
  const days = Array.from({ length: 7 }, (_, i) =>
    addDays(today, i + weekOffset * 7)
  );

  // Fetch booking
  useEffect(() => {
    async function fetchBooking() {
      try {
        const res = await fetch(`/api/bookings/${id}`);
        if (!res.ok) throw new Error("Failed to fetch booking");
        const data = await res.json();
        setBooking(data);
        setStatus(data.status);
        setPaymentStatus(data.paymentStatus);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load booking");
      } finally {
        setIsLoading(false);
      }
    }
    fetchBooking();
  }, [id]);

  // Fetch availability when rescheduling
  const fetchAvailability = useCallback(async () => {
    if (!selectedDate || !booking) return;

    setLoadingAvailability(true);
    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const res = await fetch(
        `/api/bookings/availability?date=${dateStr}&duration=${booking.totalDurationMinutes}&locationType=${booking.locationType}`
      );

      if (res.ok) {
        const data = await res.json();
        setAvailability(data.availability);
      }
    } catch (error) {
      console.error("Failed to fetch availability:", error);
      const allAvailable: Record<string, boolean> = {};
      TIME_SLOTS.forEach((slot) => (allAvailable[slot] = true));
      setAvailability(allAvailable);
    } finally {
      setLoadingAvailability(false);
    }
  }, [selectedDate, booking]);

  useEffect(() => {
    if (isRescheduling) {
      fetchAvailability();
    }
  }, [fetchAvailability, isRescheduling]);

  const handleSave = async () => {
    if (!booking) return;

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const body: Record<string, unknown> = {};

      // Status change
      if (status !== booking.status) {
        body.status = status;
      }

      // Payment status change
      if (paymentStatus !== booking.paymentStatus) {
        body.paymentStatus = paymentStatus;
      }

      // Reschedule
      if (isRescheduling && selectedDate && selectedTime) {
        const [hours, minutes] = selectedTime.split(":").map(Number);
        const newStart = new Date(selectedDate);
        newStart.setHours(hours, minutes, 0, 0);

        const newEnd = new Date(newStart);
        newEnd.setMinutes(newEnd.getMinutes() + booking.totalDurationMinutes);

        body.scheduledDate = newStart.toISOString();
        body.scheduledEndDate = newEnd.toISOString();
      }

      if (Object.keys(body).length === 0) {
        setError("No changes to save");
        setIsSaving(false);
        return;
      }

      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update booking");
      }

      const updated = await res.json();
      setBooking({ ...booking, ...updated });
      setStatus(updated.status);
      setPaymentStatus(updated.paymentStatus);
      setIsRescheduling(false);
      setSelectedDate(null);
      setSelectedTime("");
      setSuccess("Booking updated successfully!");

      // Refresh after short delay
      setTimeout(() => {
        router.refresh();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="size-8 animate-spin text-primary-container" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="machined-border bg-surface-container-low p-8 text-center">
        <p className="text-error">{error || "Booking not found"}</p>
        <Link
          href="/admin/bookings"
          className="inline-flex items-center gap-2 mt-4 text-primary-container hover:underline"
        >
          <ArrowLeft className="size-4" />
          Back to bookings
        </Link>
      </div>
    );
  }

  const canReschedule = booking.status !== "completed";

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/bookings"
          className="p-2 hover:bg-surface-container rounded transition-colors"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Booking</h1>
          <p className="text-on-surface-variant mt-1 normal-case not-italic">
            {booking.product.name}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-error/10 border border-error/30 text-error px-4 py-3 mb-6 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-500 px-4 py-3 mb-6 rounded">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Info */}
        <div className="machined-border bg-surface-container-low p-6">
          <h2 className="text-lg font-bold mb-4">Customer Information</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="size-5 text-primary-container" />
              <span>{booking.customerName}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="size-5 text-primary-container" />
              <span>{booking.customerEmail}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="size-5 text-primary-container" />
              <span>{booking.customerPhone}</span>
            </div>
            <div className="flex items-start gap-3">
              {booking.locationType === "store" ? (
                <Store className="size-5 text-primary-container mt-0.5" />
              ) : (
                <MapPin className="size-5 text-primary-container mt-0.5" />
              )}
              <div>
                <span className="px-2 py-0.5 text-xs font-bold uppercase bg-primary-container/20 text-primary-container">
                  {booking.locationType === "store" ? "At Store" : "On-Site"}
                </span>
                <p className="mt-1 text-on-surface-variant">{booking.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="machined-border bg-surface-container-low p-6">
          <h2 className="text-lg font-bold mb-4">Booking Details</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="size-5 text-primary-container" />
              <span>{format(new Date(booking.scheduledDate), "EEEE, MMMM d, yyyy")}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="size-5 text-primary-container" />
              <span>
                {format(new Date(booking.scheduledDate), "h:mm a")} -{" "}
                {format(new Date(booking.scheduledEndDate), "h:mm a")}
              </span>
            </div>
            <div className="pt-2 border-t border-outline-variant">
              <span className="text-on-surface-variant text-sm">Total Price</span>
              <p className="text-2xl font-bold text-primary-container">
                ${parseFloat(booking.totalPrice).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Status Controls */}
        <div className="machined-border bg-surface-container-low p-6">
          <h2 className="text-lg font-bold mb-4">Status</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-on-surface-variant mb-2">
                Booking Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 bg-surface-container border border-outline-variant rounded focus:border-primary-container focus:outline-none"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-on-surface-variant mb-2">
                Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full px-4 py-3 bg-surface-container border border-outline-variant rounded focus:border-primary-container focus:outline-none"
              >
                {PAYMENT_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Reschedule */}
        <div className="machined-border bg-surface-container-low p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Reschedule</h2>
            {canReschedule && !isRescheduling && (
              <button
                onClick={() => setIsRescheduling(true)}
                className="text-sm text-primary-container hover:underline"
              >
                Change date/time
              </button>
            )}
            {!canReschedule && (
              <span className="text-sm text-on-surface-variant">
                Cannot reschedule completed bookings
              </span>
            )}
          </div>

          {isRescheduling ? (
            <div className="space-y-4">
              {/* Week Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setWeekOffset(Math.max(0, weekOffset - 1))}
                  disabled={weekOffset === 0}
                  className="p-1 disabled:opacity-30"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <span className="text-sm font-medium">
                  {format(days[0], "MMM d")} - {format(days[6], "MMM d")}
                </span>
                <button
                  onClick={() => setWeekOffset(weekOffset + 1)}
                  className="p-1"
                >
                  <ChevronRight className="size-5" />
                </button>
              </div>

              {/* Date Selection */}
              <div className="grid grid-cols-7 gap-1">
                {days.map((day) => {
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  const isPast = day < today;
                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => !isPast && setSelectedDate(day)}
                      disabled={isPast}
                      className={`p-2 text-center text-sm rounded transition-colors ${
                        isPast
                          ? "opacity-30 cursor-not-allowed"
                          : isSelected
                          ? "bg-primary-container text-on-primary"
                          : "bg-surface-container hover:bg-surface-container-high"
                      }`}
                    >
                      <div className="text-xs opacity-70">{format(day, "EEE")}</div>
                      <div className="font-bold">{format(day, "d")}</div>
                    </button>
                  );
                })}
              </div>

              {/* Time Selection */}
              {selectedDate && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium">
                      {format(selectedDate, "EEEE, MMM d")}
                    </span>
                    {loadingAvailability && (
                      <Loader2 className="size-3 animate-spin" />
                    )}
                  </div>
                  <div className="grid grid-cols-5 gap-1">
                    {TIME_SLOTS.map((time) => {
                      const isSelected = selectedTime === time;
                      const isAvailable = availability[time] !== false;
                      return (
                        <button
                          key={time}
                          onClick={() => isAvailable && setSelectedTime(time)}
                          disabled={!isAvailable || loadingAvailability}
                          className={`p-2 text-xs font-bold rounded transition-colors ${
                            !isAvailable
                              ? "opacity-30 line-through cursor-not-allowed"
                              : isSelected
                              ? "bg-primary-container text-on-primary"
                              : "bg-surface-container hover:bg-surface-container-high"
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  setIsRescheduling(false);
                  setSelectedDate(null);
                  setSelectedTime("");
                }}
                className="text-sm text-on-surface-variant hover:text-on-surface"
              >
                Cancel reschedule
              </button>
            </div>
          ) : (
            <p className="text-on-surface-variant text-sm">
              Current: {format(new Date(booking.scheduledDate), "MMM d, yyyy")} at{" "}
              {format(new Date(booking.scheduledDate), "h:mm a")}
            </p>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end gap-4">
        <Link
          href="/admin/bookings"
          className="px-6 py-3 font-bold text-on-surface-variant hover:text-on-surface transition-colors"
        >
          CANCEL
        </Link>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-8 py-3 bg-primary-container text-on-primary font-bold chamfer-clip cyan-glow hover:bg-primary-container/90 disabled:opacity-50 transition-all"
        >
          {isSaving ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              SAVING...
            </>
          ) : (
            <>
              <Save className="size-4" />
              SAVE CHANGES
            </>
          )}
        </button>
      </div>
    </div>
  );
}
