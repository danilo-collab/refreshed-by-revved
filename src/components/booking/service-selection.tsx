"use client";

import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";
import type { Service } from "./booking-wizard";

interface ServiceSelectionProps {
  services: Service[];
  selectedService: Service | null;
  onSelect: (service: Service) => void;
}

export function ServiceSelection({
  services,
  selectedService,
  onSelect,
}: ServiceSelectionProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Choose Your Service</h2>
      <p className="text-on-surface-variant mb-6 normal-case not-italic">
        Select the detailing package that best fits your needs.
      </p>

      <div className="space-y-4">
        {services.map((service) => {
          const isSelected = selectedService?.id === service.id;
          return (
            <button
              key={service.id}
              onClick={() => onSelect(service)}
              className={cn(
                "w-full p-6 text-left machined-border transition-all",
                isSelected
                  ? "border-primary-container bg-primary-container/10"
                  : "bg-surface-container hover:border-outline"
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold not-italic normal-case">
                      {service.name}
                    </h3>
                    {isSelected && (
                      <CheckCircle className="size-5 text-primary-container" />
                    )}
                  </div>
                  <p className="text-sm text-on-surface-variant mt-2 normal-case not-italic">
                    {service.description}
                  </p>
                  <p className="text-xs text-outline mt-2">
                    Duration: ~{service.durationMinutes} min
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-primary-container">
                    ${service.price.toFixed(2)}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
