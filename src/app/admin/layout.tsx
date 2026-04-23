import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // This is handled by middleware, but adding as extra safety
  if (!session && !children) {
    redirect("/admin/login");
  }

  // For login page, don't show sidebar
  return (
    <div className="min-h-screen bg-background">
      {session ? (
        <div className="flex">
          <AdminSidebar user={session.user} />
          <main className="flex-1 p-8">{children}</main>
        </div>
      ) : (
        children
      )}
    </div>
  );
}
