import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SettingsForm } from "./settings-form";
import { db } from "@/lib/db";
import { settings } from "@/lib/db/schema";

const defaultSettings = {
  paymentsEnabled: false,
  paymentProvider: "stripe",
  businessName: "Refreshed By Revved",
  businessPhone: "",
  businessEmail: "",
};

export default async function AdminSettingsPage() {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  // Fetch settings
  const rows = await db.select().from(settings);
  const currentSettings = { ...defaultSettings };
  for (const row of rows) {
    if (row.key in currentSettings) {
      (currentSettings as Record<string, unknown>)[row.key] = row.value;
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-on-surface-variant mt-2 normal-case not-italic">
          Configure store settings
        </p>
      </div>

      <SettingsForm initialSettings={currentSettings} />
    </div>
  );
}
