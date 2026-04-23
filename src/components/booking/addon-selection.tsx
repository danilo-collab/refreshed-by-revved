"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import type { Addon } from "./booking-wizard";

interface AddonSelectionProps {
  addons: Addon[];
  selectedAddons: Addon[];
  onToggle: (addon: Addon) => void;
}

export function AddonSelection({
  addons,
  selectedAddons,
  onToggle,
}: AddonSelectionProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Customize with Add-ons</h2>
      <p className="text-on-surface-variant mb-6 normal-case not-italic">
        Enhance your detail with premium add-on services. (Optional)
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addons.map((addon) => {
          const isSelected = selectedAddons.some((a) => a.id === addon.id);
          return (
            <button
              key={addon.id}
              onClick={() => onToggle(addon)}
              className={cn(
                "p-4 text-left machined-border transition-all flex items-center gap-4",
                isSelected
                  ? "border-primary-container bg-primary-container/10"
                  : "bg-surface-container hover:border-outline"
              )}
            >
              <div
                className={cn(
                  "size-6 rounded flex items-center justify-center shrink-0 transition-colors",
                  isSelected
                    ? "bg-primary-container text-on-primary"
                    : "border border-outline-variant"
                )}
              >
                {isSelected && <Check className="size-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold not-italic normal-case">{addon.name}</h4>
                <p className="text-xs text-outline mt-1">+{addon.durationMinutes} min</p>
              </div>
              <span className="text-lg font-bold text-primary-container">
                +${addon.price.toFixed(2)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
