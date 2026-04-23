"use client";

import { MapPin } from "lucide-react";

interface LocationInputProps {
  address: string;
  addressNotes: string;
  onAddressChange: (address: string) => void;
  onNotesChange: (notes: string) => void;
}

export function LocationInput({
  address,
  addressNotes,
  onAddressChange,
  onNotesChange,
}: LocationInputProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Where Should We Come?</h2>
      <p className="text-on-surface-variant mb-6 normal-case not-italic">
        Enter your service location. We bring everything we need.
      </p>

      <div className="space-y-6">
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
      </div>
    </div>
  );
}
