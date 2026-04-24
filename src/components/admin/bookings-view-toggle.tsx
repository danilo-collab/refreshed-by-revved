"use client";

import { List, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

export type BookingsView = "list" | "calendar";

interface Props {
  view: BookingsView;
  onChange: (v: BookingsView) => void;
}

export function BookingsViewToggle({ view, onChange }: Props) {
  return (
    <div
      role="tablist"
      aria-label="Bookings view"
      className="inline-flex items-center bg-surface-container rounded-md p-1 border border-outline-variant"
    >
      <ToggleButton
        active={view === "list"}
        onClick={() => onChange("list")}
        label="List view"
        icon={<List className="size-4" />}
        text="List"
      />
      <ToggleButton
        active={view === "calendar"}
        onClick={() => onChange("calendar")}
        label="Calendar view"
        icon={<CalendarDays className="size-4" />}
        text="Calendar"
      />
    </div>
  );
}

function ToggleButton({
  active,
  onClick,
  label,
  icon,
  text,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <button
      role="tab"
      aria-selected={active}
      aria-label={label}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 px-3 min-h-11 text-sm font-bold rounded transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container",
        active
          ? "bg-primary-container text-on-primary"
          : "text-on-surface-variant hover:text-on-surface"
      )}
    >
      {icon}
      <span className="hidden sm:inline">{text}</span>
    </button>
  );
}
