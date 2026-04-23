"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/icons/logo";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Calendar,
  Package,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", icon: Calendar },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-surface-container-low border-r border-outline-variant flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-outline-variant">
        <Link href="/admin" className="flex items-center gap-3">
          <Logo className="size-8" />
          <span className="text-lg font-bold tracking-tighter font-headline normal-case not-italic">
            Admin
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 transition-colors machined-border",
                    isActive
                      ? "bg-primary-container/10 border-primary-container text-primary-container"
                      : "border-transparent hover:bg-surface-container hover:border-outline-variant"
                  )}
                >
                  <item.icon className="size-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User & Logout */}
      <div className="p-4 border-t border-outline-variant">
        <div className="mb-4 px-4">
          <p className="text-sm font-medium truncate">{user.name || user.email}</p>
          <p className="text-xs text-outline truncate">{user.email}</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-3 w-full px-4 py-3 text-left text-on-surface-variant hover:text-error hover:bg-error/10 machined-border border-transparent hover:border-error/30 transition-colors"
        >
          <LogOut className="size-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
