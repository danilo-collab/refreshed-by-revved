"use client";

import { useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SettingsFormProps {
  initialSettings: {
    paymentsEnabled: boolean;
    paymentProvider: string;
    businessName: string;
    businessPhone: string;
    businessEmail: string;
  };
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Payments Section */}
      <div className="machined-border bg-surface-container-low p-6">
        <h2 className="text-lg font-bold mb-4">Payments</h2>

        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium">Enable Payments</p>
              <p className="text-sm text-on-surface-variant normal-case not-italic">
                When disabled, bookings complete without payment
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.paymentsEnabled}
              onClick={() =>
                setSettings((s) => ({ ...s, paymentsEnabled: !s.paymentsEnabled }))
              }
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.paymentsEnabled
                  ? "bg-primary-container"
                  : "bg-surface-container-high"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-on-surface transition-transform ${
                  settings.paymentsEnabled ? "translate-x-6" : ""
                }`}
              />
            </button>
          </label>

          {settings.paymentsEnabled && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Payment Provider
              </label>
              <select
                value={settings.paymentProvider}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, paymentProvider: e.target.value }))
                }
                className="w-full px-4 py-3 bg-surface-container machined-border font-medium focus:border-primary-container focus:outline-none transition-colors"
              >
                <option value="stripe">Stripe</option>
                <option value="square">Square</option>
                <option value="authorizenet">Authorize.net</option>
              </select>
              <p className="text-xs text-outline mt-2 normal-case not-italic">
                Configure API keys in environment variables
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Business Info Section */}
      <div className="machined-border bg-surface-container-low p-6">
        <h2 className="text-lg font-bold mb-4">Business Information</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Business Name
            </label>
            <input
              type="text"
              value={settings.businessName}
              onChange={(e) =>
                setSettings((s) => ({ ...s, businessName: e.target.value }))
              }
              className="w-full px-4 py-3 bg-surface-container machined-border focus:border-primary-container focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Business Phone
            </label>
            <input
              type="tel"
              value={settings.businessPhone}
              onChange={(e) =>
                setSettings((s) => ({ ...s, businessPhone: e.target.value }))
              }
              className="w-full px-4 py-3 bg-surface-container machined-border focus:border-primary-container focus:outline-none transition-colors"
              placeholder="(305) 555-0123"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Business Email
            </label>
            <input
              type="email"
              value={settings.businessEmail}
              onChange={(e) =>
                setSettings((s) => ({ ...s, businessEmail: e.target.value }))
              }
              className="w-full px-4 py-3 bg-surface-container machined-border focus:border-primary-container focus:outline-none transition-colors"
              placeholder="contact@example.com"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <Button
        onClick={handleSave}
        disabled={saving}
        className="bg-primary-container text-on-primary font-bold py-4 h-auto chamfer-clip cyan-glow hover:bg-primary-container/90 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {saving ? (
          <>
            <Loader2 className="size-5 animate-spin" />
            SAVING...
          </>
        ) : saved ? (
          <>
            <Save className="size-5" />
            SAVED!
          </>
        ) : (
          <>
            <Save className="size-5" />
            SAVE CHANGES
          </>
        )}
      </Button>
    </div>
  );
}
