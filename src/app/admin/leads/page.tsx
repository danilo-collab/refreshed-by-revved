import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { Mail, Phone, MessageSquare, Circle } from "lucide-react";

// Mock data - would come from API
const mockLeads = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex@example.com",
    phone: "(305) 555-9999",
    message: "Looking for a quote on ceramic coating for my Tesla Model S",
    source: "contact_form",
    isRead: false,
    createdAt: new Date(2024, 3, 24, 15, 30),
  },
  {
    id: "2",
    name: "Sarah Williams",
    email: "sarah@example.com",
    phone: "(305) 555-8888",
    message: "Do you offer corporate fleet discounts?",
    source: "contact_form",
    isRead: true,
    createdAt: new Date(2024, 3, 23, 10, 15),
  },
  {
    id: "3",
    name: "Mike Chen",
    email: "mike@example.com",
    phone: null,
    message: "Interested in the monthly subscription plan. What areas do you cover?",
    source: "contact_form",
    isRead: false,
    createdAt: new Date(2024, 3, 22, 18, 45),
  },
];

export default async function AdminLeadsPage() {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  const unreadCount = mockLeads.filter((l) => !l.isRead).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Leads</h1>
          <p className="text-on-surface-variant mt-2 normal-case not-italic">
            Contact form submissions ({unreadCount} unread)
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {mockLeads.map((lead) => (
          <div
            key={lead.id}
            className={`machined-border p-6 ${
              lead.isRead
                ? "bg-surface-container-low"
                : "bg-surface-container-low border-primary-container/50"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {!lead.isRead && (
                  <Circle className="size-3 fill-primary-container text-primary-container" />
                )}
                <div>
                  <h3 className="text-lg font-bold not-italic normal-case">
                    {lead.name}
                  </h3>
                  <p className="text-xs text-outline">
                    {format(lead.createdAt, "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
              </div>
              <span className="text-xs bg-surface-container px-2 py-1 font-bold uppercase tracking-wider">
                {lead.source.replace("_", " ")}
              </span>
            </div>

            <div className="flex items-center gap-6 mb-4 text-sm">
              <span className="flex items-center gap-2">
                <Mail className="size-4 text-primary-container" />
                <a href={`mailto:${lead.email}`} className="hover:text-primary-container">
                  {lead.email}
                </a>
              </span>
              {lead.phone && (
                <span className="flex items-center gap-2">
                  <Phone className="size-4 text-primary-container" />
                  <a href={`tel:${lead.phone}`} className="hover:text-primary-container">
                    {lead.phone}
                  </a>
                </span>
              )}
            </div>

            <div className="flex items-start gap-2 pt-4 border-t border-outline-variant">
              <MessageSquare className="size-4 text-primary-container shrink-0 mt-1" />
              <p className="text-sm text-on-surface-variant normal-case not-italic">
                {lead.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
