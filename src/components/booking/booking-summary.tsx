"use client";

import { format } from "date-fns";
import { Calendar, Clock, MapPin } from "lucide-react";
import type { Service, Addon } from "./booking-wizard";

interface BookingSummaryProps {
  service: Service | null;
  addons: Addon[];
  totalPrice: number;
  totalDuration: number;
  date: Date | null;
  time: string;
  address: string;
}

export function BookingSummary({
  service,
  addons,
  totalPrice,
  totalDuration,
  date,
  time,
  address,
}: BookingSummaryProps) {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins} min`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="machined-border bg-surface-container-low p-6 sticky top-24">
      <h3 className="text-xl font-bold mb-6 not-italic normal-case">
        Booking Summary
      </h3>

      {service ? (
        <div className="space-y-6">
          {/* Selected Service */}
          <div>
            <div className="text-xs uppercase tracking-wider text-outline mb-2">
              Service
            </div>
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold not-italic normal-case">{service.name}</p>
                <p className="text-xs text-outline mt-1">
                  {formatDuration(service.durationMinutes)}
                </p>
              </div>
              <span className="font-bold text-primary-container">
                ${service.price.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Add-ons */}
          {addons.length > 0 && (
            <div className="border-t border-outline-variant pt-4">
              <div className="text-xs uppercase tracking-wider text-outline mb-2">
                Add-ons
              </div>
              <div className="space-y-2">
                {addons.map((addon) => (
                  <div key={addon.id} className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">{addon.name}</span>
                    <span className="text-primary-container">
                      +${addon.price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Date & Time */}
          {date && time && (
            <div className="border-t border-outline-variant pt-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="size-4 text-primary-container" />
                <span>{format(date, "EEEE, MMMM d, yyyy")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm mt-2">
                <Clock className="size-4 text-primary-container" />
                <span>{time}</span>
              </div>
            </div>
          )}

          {/* Location */}
          {address && (
            <div className="border-t border-outline-variant pt-4">
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="size-4 text-primary-container shrink-0 mt-0.5" />
                <span className="text-on-surface-variant">{address}</span>
              </div>
            </div>
          )}

          {/* Total */}
          <div className="border-t border-outline-variant pt-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs uppercase tracking-wider text-outline">
                  Total Duration
                </p>
                <p className="font-bold">{formatDuration(totalDuration)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wider text-outline">
                  Total Price
                </p>
                <p className="text-2xl font-bold text-primary-container">
                  ${totalPrice.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-on-surface-variant text-sm normal-case not-italic">
          Select a service to see your booking summary.
        </p>
      )}
    </div>
  );
}
