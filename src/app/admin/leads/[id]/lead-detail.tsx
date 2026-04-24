"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import {
  ArrowLeft,
  Mail,
  Phone,
  Save,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Lead } from "@/lib/db/schema";

const statusOptions = [
  { value: "new", label: "New", color: "bg-blue-500/20 text-blue-400" },
  { value: "contacted", label: "Contacted", color: "bg-yellow-500/20 text-yellow-400" },
  { value: "booked", label: "Booked", color: "bg-green-500/20 text-green-400" },
  { value: "rejected", label: "Rejected", color: "bg-red-500/20 text-red-400" },
];

interface LeadDetailProps {
  lead: Lead;
}

export function LeadDetail({ lead: initialLead }: LeadDetailProps) {
  const router = useRouter();
  const [lead, setLead] = useState(initialLead);
  const [status, setStatus] = useState(lead.status);
  const [notes, setNotes] = useState(lead.notes || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const hasChanges = status !== lead.status || notes !== (lead.notes || "");

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    try {
      const res = await fetch(`/api/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
      });

      if (res.ok) {
        const updated = await res.json();
        setLead(updated);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setSaving(false);
    }
  };

  const photos = (lead.photos as string[]) || [];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/leads"
          className="p-2 hover:bg-surface-container rounded transition-colors"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{lead.name}</h1>
          <p className="text-on-surface-variant mt-1 text-sm normal-case not-italic">
            Submitted {format(new Date(lead.createdAt), "MMMM d, yyyy 'at' h:mm a")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Info */}
          <div className="machined-border bg-surface-container-low p-6">
            <h2 className="text-lg font-bold mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Mail className="size-5 text-primary-container" />
                <div>
                  <p className="text-xs text-outline uppercase tracking-wider">
                    Email
                  </p>
                  <a
                    href={`mailto:${lead.email}`}
                    className="hover:text-primary-container transition-colors"
                  >
                    {lead.email}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="size-5 text-primary-container" />
                <div>
                  <p className="text-xs text-outline uppercase tracking-wider">
                    Phone
                  </p>
                  {lead.phone ? (
                    <a
                      href={`tel:${lead.phone}`}
                      className="hover:text-primary-container transition-colors"
                    >
                      {lead.phone}
                    </a>
                  ) : (
                    <span className="text-outline">Not provided</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="machined-border bg-surface-container-low p-6">
            <h2 className="text-lg font-bold mb-4">Message</h2>
            <p className="text-on-surface-variant whitespace-pre-wrap normal-case not-italic">
              {lead.message}
            </p>
          </div>

          {/* Photos */}
          {photos.length > 0 && (
            <div className="machined-border bg-surface-container-low p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <ImageIcon className="size-5 text-primary-container" />
                Photos ({photos.length})
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {photos.map((photo, index) => (
                  <a
                    key={index}
                    href={photo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="aspect-video bg-surface-container rounded overflow-hidden border border-outline-variant hover:border-primary-container transition-colors"
                  >
                    <img
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Status & Notes */}
        <div className="space-y-6">
          {/* Status */}
          <div className="machined-border bg-surface-container-low p-6">
            <h2 className="text-lg font-bold mb-4">Status</h2>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as typeof status)}
              className={`w-full px-4 py-3 bg-surface-container machined-border font-bold text-sm uppercase tracking-wider focus:border-primary-container focus:outline-none transition-colors cursor-pointer ${
                statusOptions.find((o) => o.value === status)?.color || ""
              }`}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div className="machined-border bg-surface-container-low p-6">
            <h2 className="text-lg font-bold mb-4">Notes</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 bg-surface-container machined-border text-on-surface placeholder:text-outline focus:border-primary-container focus:outline-none transition-colors resize-none text-sm"
              placeholder="Add internal notes about this lead..."
            />
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="w-full bg-primary-container text-on-primary font-bold py-4 h-auto chamfer-clip cyan-glow hover:bg-primary-container/90 disabled:opacity-50 flex items-center justify-center gap-2"
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
      </div>
    </div>
  );
}
