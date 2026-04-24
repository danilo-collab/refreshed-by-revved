import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { LeadDetail } from "./lead-detail";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function LeadDetailPage({ params }: Props) {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  const { id } = await params;

  const [lead] = await db
    .select()
    .from(leads)
    .where(eq(leads.id, id));

  if (!lead) {
    notFound();
  }

  // Mark as read if not already
  if (!lead.isRead) {
    await db
      .update(leads)
      .set({ isRead: true, updatedAt: new Date() })
      .where(eq(leads.id, id));
  }

  return <LeadDetail lead={lead} />;
}
