import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Calendar, Package, Users, DollarSign } from "lucide-react";
import { db } from "@/lib/db";
import { dashboardStats, products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default async function AdminDashboard() {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  // Fetch dashboard stats from pre-computed table
  const [stats, activeProducts] = await Promise.all([
    db.select().from(dashboardStats).where(eq(dashboardStats.id, "main")).then(r => r[0]),
    db.select().from(products).where(eq(products.isActive, true)),
  ]);

  // Check if date counters need reset (for display purposes)
  const today = new Date();
  const isToday = stats?.bookingsTodayDate &&
    new Date(stats.bookingsTodayDate).toDateString() === today.toDateString();
  const isThisWeek = stats?.leadsWeekStart &&
    new Date(stats.leadsWeekStart).getTime() === getWeekStart(today).getTime();
  const isThisMonth = stats?.revenueMonth === (today.getMonth() + 1) &&
    stats?.revenueYear === today.getFullYear();

  const subscriptionCount = activeProducts.filter(p => p.isSubscription).length;
  const packageCount = activeProducts.length - subscriptionCount;

  const displayStats = [
    {
      label: "Today's Bookings",
      value: isToday ? String(stats?.bookingsToday || 0) : "0",
      icon: Calendar,
      change: `${stats?.bookingsTotal || 0} total`
    },
    {
      label: "Active Services",
      value: String(activeProducts.length),
      icon: Package,
      change: `${packageCount} packages, ${subscriptionCount} subscription`
    },
    {
      label: "New Leads",
      value: isThisWeek ? String(stats?.leadsThisWeek || 0) : "0",
      icon: Users,
      change: `${stats?.leadsTotal || 0} total`
    },
    {
      label: "Revenue (MTD)",
      value: `$${isThisMonth ? Number(stats?.revenueMtd || 0).toLocaleString() : "0"}`,
      icon: DollarSign,
      change: `$${Number(stats?.revenueTotal || 0).toLocaleString()} total`
    },
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
        {displayStats.map((stat) => (
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
