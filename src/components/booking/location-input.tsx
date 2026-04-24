"use client";

import { MapPin, Store } from "lucide-react";
import { cn } from "@/lib/utils";

export type LocationType = "store" | "customer";

const STORE_ADDRESS = "8350 NW 52nd Terrace, Miami, FL 33166";

interface LocationInputProps {
  locationType: LocationType;
  address: string;
  addressNotes: string;
  onLocationTypeChange: (type: LocationType) => void;
  onAddressChange: (address: string) => void;
  onNotesChange: (notes: string) => void;
}

export function LocationInput({
  locationType,
  address,
  addressNotes,
  onLocationTypeChange,
  onAddressChange,
  onNotesChange,
}: LocationInputProps) {
  const handleTypeChange = (type: LocationType) => {
    onLocationTypeChange(type);
    if (type === "store") {
      onAddressChange(STORE_ADDRESS);
      onNotesChange("");
    } else {
      onAddressChange("");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Where Should We Detail?</h2>
      <p className="text-on-surface-variant mb-6 normal-case not-italic">
        Choose our shop or we come to you.
      </p>

      {/* Location Type Toggle */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          type="button"
          onClick={() => handleTypeChange("store")}
          className={cn(
            "p-4 machined-border transition-all flex flex-col items-center gap-2",
            locationType === "store"
              ? "border-primary-container bg-primary-container/10 text-primary-container"
              : "bg-surface-container hover:border-outline"
          )}
        >
          <Store className="size-6" />
          <span className="font-bold text-sm">OUR SHOP</span>
          <span className="text-xs text-on-surface-variant normal-case not-italic">
            Drop off at our location
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleTypeChange("customer")}
          className={cn(
            "p-4 machined-border transition-all flex flex-col items-center gap-2",
            locationType === "customer"
              ? "border-primary-container bg-primary-container/10 text-primary-container"
              : "bg-surface-container hover:border-outline"
          )}
        >
          <MapPin className="size-6" />
          <span className="font-bold text-sm">YOUR LOCATION</span>
          <span className="text-xs text-on-surface-variant normal-case not-italic">
            We come to you
          </span>
        </button>
      </div>

      <div className="space-y-6">
        {locationType === "store" ? (
          <div className="bg-surface-container-high p-4 machined-border">
            <div className="flex items-start gap-3">
              <Store className="size-5 text-primary-container shrink-0 mt-0.5" />
              <div>
                <p className="font-bold mb-1">Shop Address</p>
                <p className="text-on-surface-variant normal-case not-italic">
                  {STORE_ADDRESS}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                Service Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-outline size-5" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => onAddressChange(e.target.value)}
                  placeholder="Enter your full address"
                  className="w-full pl-12 pr-4 py-4 bg-surface-container machined-border text-on-surface placeholder:text-outline focus:border-primary-container focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                Special Instructions (Optional)
              </label>
              <textarea
                value={addressNotes}
                onChange={(e) => onNotesChange(e.target.value)}
                placeholder="Gate codes, parking instructions, etc."
                rows={3}
                className="w-full px-4 py-4 bg-surface-container machined-border text-on-surface placeholder:text-outline focus:border-primary-container focus:outline-none transition-colors resize-none"
              />
            </div>

            <div className="bg-surface-container-high p-4 machined-border">
              <p className="text-sm text-on-surface-variant normal-case not-italic">
                <strong className="text-primary-container">Pro Tip:</strong> We service all of
                Greater Miami including Coral Gables, Miami Beach, Brickell, Doral, and
                surrounding areas. Our mobile units are fully equipped with water and power.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
