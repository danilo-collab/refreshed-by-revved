import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Calendar, Package, Users, DollarSign } from "lucide-react";

export default async function AdminDashboard() {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  // Mock stats - would come from API
  const stats = [
    { label: "Today's Bookings", value: "3", icon: Calendar, change: "+2 from yesterday" },
    { label: "Active Services", value: "4", icon: Package, change: "3 packages, 1 subscription" },
    { label: "New Leads", value: "7", icon: Users, change: "This week" },
    { label: "Revenue (MTD)", value: "$4,850", icon: DollarSign, change: "+12% vs last month" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-on-surface-variant mt-2 normal-case not-italic">
          Welcome back, {session.user.name || session.user.email}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="machined-border bg-surface-container-low p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-on-surface-variant text-sm uppercase tracking-wider">
                {stat.label}
              </span>
              <stat.icon className="size-5 text-primary-container" />
            </div>
            <div className="text-3xl font-bold text-on-surface font-headline not-italic">
              {stat.value}
            </div>
            <div className="text-xs text-outline mt-2">{stat.change}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="machined-border bg-surface-container-low p-6">
        <h2 className="text-xl font-bold mb-4 not-italic normal-case">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/bookings"
            className="p-4 bg-surface-container machined-border hover:border-primary-container transition-colors"
          >
            <Calendar className="size-6 text-primary-container mb-2" />
            <h3 className="font-bold not-italic normal-case">View Bookings</h3>
            <p className="text-sm text-on-surface-variant mt-1 normal-case not-italic">
              Manage upcoming and past appointments
            </p>
          </a>
          <a
            href="/admin/products"
            className="p-4 bg-surface-container machined-border hover:border-primary-container transition-colors"
          >
            <Package className="size-6 text-primary-container mb-2" />
            <h3 className="font-bold not-italic normal-case">Manage Services</h3>
            <p className="text-sm text-on-surface-variant mt-1 normal-case not-italic">
              Edit pricing, add-ons, and descriptions
            </p>
          </a>
          <a
            href="/admin/leads"
            className="p-4 bg-surface-container machined-border hover:border-primary-container transition-colors"
          >
            <Users className="size-6 text-primary-container mb-2" />
            <h3 className="font-bold not-italic normal-case">View Leads</h3>
            <p className="text-sm text-on-surface-variant mt-1 normal-case not-italic">
              Contact form submissions
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}
