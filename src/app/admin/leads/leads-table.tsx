"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Eye, Pencil, Trash2, Mail, Phone, MessageSquare } from "lucide-react";
import type { Lead } from "@/lib/db/schema";

const statusColors: Record<string, string> = {
  new: "bg-blue-500/20 text-blue-400",
  contacted: "bg-yellow-500/20 text-yellow-400",
  booked: "bg-green-500/20 text-green-400",
  rejected: "bg-red-500/20 text-red-400",
};

interface LeadsTableProps {
  leads: Lead[];
}

export function LeadsTable({ leads: initialLeads }: LeadsTableProps) {
  const router = useRouter();
  const [leads, setLeads] = useState(initialLeads);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this lead?")) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/leads/${id}`, { method: "DELETE" });
      if (res.ok) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete:", error);
    } finally {
      setDeleting(null);
    }
  };

  const handleView = (id: string) => {
    router.push(`/admin/leads/${id}`);
  };

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block machined-border bg-surface-container-low overflow-hidden">
        <table className="w-full">
          <thead className="bg-surface-container">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Phone
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Status
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/30">
            {leads.map((lead) => (
              <tr
                key={lead.id}
                className="hover:bg-surface-container/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div>
                    <p className="font-bold not-italic normal-case">
                      {lead.name}
                    </p>
                    <p className="text-xs text-outline">
                      {format(new Date(lead.createdAt), "MMM d, h:mm a")}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">{lead.email}</td>
                <td className="px-6 py-4 text-sm">{lead.phone || "-"}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-bold uppercase tracking-wider ${
                      statusColors[lead.status] || statusColors.new
                    }`}
                  >
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleView(lead.id)}
                      className="p-2 hover:bg-surface-container rounded transition-colors"
                      title="View"
                    >
                      <Eye className="size-4 text-primary-container" />
                    </button>
                    <button
                      onClick={() => handleView(lead.id)}
                      className="p-2 hover:bg-surface-container rounded transition-colors"
                      title="Edit"
                    >
                      <Pencil className="size-4 text-on-surface-variant" />
                    </button>
                    <button
                      onClick={() => handleDelete(lead.id)}
                      disabled={deleting === lead.id}
                      className="p-2 hover:bg-error/10 rounded transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 className="size-4 text-error" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {leads.map((lead) => (
          <div
            key={lead.id}
            className="machined-border bg-surface-container-low p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold not-italic normal-case">{lead.name}</h3>
                <p className="text-xs text-outline">
                  {format(new Date(lead.createdAt), "MMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
              <span
                className={`px-2 py-1 text-xs font-bold uppercase tracking-wider ${
                  statusColors[lead.status] || statusColors.new
                }`}
              >
                {lead.status}
              </span>
            </div>

            <div className="space-y-2 mb-4 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="size-4 text-primary-container" />
                <span>{lead.email}</span>
              </div>
              {lead.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="size-4 text-primary-container" />
                  <span>{lead.phone}</span>
                </div>
              )}
            </div>

            <div className="flex items-start gap-2 pt-3 border-t border-outline-variant/30 mb-4">
              <MessageSquare className="size-4 text-primary-container shrink-0 mt-0.5" />
              <p className="text-sm text-on-surface-variant normal-case not-italic line-clamp-2">
                {lead.message}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-variant/30">
              <button
                onClick={() => handleView(lead.id)}
                className="flex items-center gap-1 px-3 py-2 text-xs font-bold uppercase tracking-wider hover:bg-surface-container rounded transition-colors"
              >
                <Eye className="size-4" />
                View
              </button>
              <button
                onClick={() => handleDelete(lead.id)}
                disabled={deleting === lead.id}
                className="flex items-center gap-1 px-3 py-2 text-xs font-bold uppercase tracking-wider text-error hover:bg-error/10 rounded transition-colors disabled:opacity-50"
              >
                <Trash2 className="size-4" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
