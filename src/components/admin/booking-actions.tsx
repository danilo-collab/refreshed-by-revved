"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, Trash2, Loader2 } from "lucide-react";

interface BookingActionsProps {
  bookingId: string;
  status: string;
}

export function BookingActions({ bookingId, status }: BookingActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const canDelete = status === "pending" || status === "cancelled";

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete");
      }

      router.refresh();
    } catch (error) {
      console.error("Delete failed:", error);
      alert(error instanceof Error ? error.message : "Failed to delete booking");
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/admin/bookings/${bookingId}`}
        className="p-2 hover:bg-surface-container rounded transition-colors"
        title="Edit booking"
      >
        <Pencil className="size-4 text-primary-container" />
      </Link>

      {canDelete && (
        <>
          {showConfirm ? (
            <div className="flex items-center gap-2 bg-surface-container px-3 py-1.5 rounded">
              <span className="text-xs text-on-surface-variant">Delete?</span>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-xs font-bold text-red-500 hover:text-red-400 disabled:opacity-50"
              >
                {isDeleting ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : (
                  "YES"
                )}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
                className="text-xs font-bold text-on-surface-variant hover:text-on-surface"
              >
                NO
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirm(true)}
              className="p-2 hover:bg-red-500/10 rounded transition-colors"
              title="Delete booking"
            >
              <Trash2 className="size-4 text-red-500" />
            </button>
          )}
        </>
      )}

      {!canDelete && (
        <span
          className="p-2 opacity-30 cursor-not-allowed"
          title="Can only delete pending or cancelled bookings"
        >
          <Trash2 className="size-4 text-outline" />
        </span>
      )}
    </div>
  );
}
