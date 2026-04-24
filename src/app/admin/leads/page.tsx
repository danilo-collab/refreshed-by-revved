import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { LeadsTable } from "./leads-table";
import { InboxIcon } from "lucide-react";

export default async function AdminLeadsPage() {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  const leadsList = await db
    .select()
    .from(leads)
    .orderBy(desc(leads.createdAt));

  const newCount = leadsList.filter((l) => l.status === "new").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Leads</h1>
          <p className="text-on-surface-variant mt-2 normal-case not-italic">
            Contact form submissions ({newCount} new)
          </p>
        </div>
      </div>

      {leadsList.length === 0 ? (
        <div className="machined-border bg-surface-container-low p-12 text-center">
          <InboxIcon className="size-12 text-outline mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">No leads yet</h3>
          <p className="text-on-surface-variant normal-case not-italic">
            Leads will appear here when customers submit contact forms.
          </p>
        </div>
      ) : (
        <LeadsTable leads={leadsList} />
      )}
    </div>
  );
}
