import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Package, Clock, DollarSign, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data - would come from API
const mockProducts = [
  {
    id: "1",
    name: "Essential Wash",
    slug: "essential-wash",
    price: 99.99,
    durationMinutes: 60,
    description: "Interior Blow Out + Vacuum, Wipe Down, Wheel Wash, Foam Bath, Tire Shine",
    isActive: true,
    isSubscription: false,
  },
  {
    id: "2",
    name: "Full Detail",
    slug: "full-detail",
    price: 179.99,
    durationMinutes: 120,
    description: "Everything in Essential plus Interior Contact Wash, Trim Cleanse, Wheel Foam Bath",
    isActive: true,
    isSubscription: false,
  },
  {
    id: "3",
    name: "VIP Showroom Detail",
    slug: "vip-showroom",
    price: 284.99,
    durationMinutes: 180,
    description: "Complete interior & exterior rejuvenation with Ceramic Coating",
    isActive: true,
    isSubscription: false,
  },
  {
    id: "4",
    name: "Monthly Plan",
    slug: "monthly-plan",
    price: 249.99,
    durationMinutes: 60,
    description: "4 Essential Washes per month",
    isActive: true,
    isSubscription: true,
  },
];

export default async function AdminProductsPage() {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Products & Services</h1>
          <p className="text-on-surface-variant mt-2 normal-case not-italic">
            Manage your service offerings
          </p>
        </div>
        <Button className="bg-primary-container text-on-primary font-bold px-6 py-2 chamfer-clip cyan-glow">
          ADD SERVICE
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockProducts.map((product) => (
          <div
            key={product.id}
            className="machined-border bg-surface-container-low p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="size-12 bg-surface-container-high machined-border flex items-center justify-center">
                  <Package className="text-primary-container" />
                </div>
                <div>
                  <h3 className="text-xl font-bold not-italic normal-case">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    {product.isSubscription && (
                      <span className="text-xs bg-primary-container/20 text-primary-container px-2 py-0.5 font-bold uppercase">
                        Subscription
                      </span>
                    )}
                    <span
                      className={`text-xs px-2 py-0.5 font-bold uppercase ${
                        product.isActive
                          ? "bg-green-500/20 text-green-500"
                          : "bg-red-500/20 text-red-500"
                      }`}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
              <button className="p-2 hover:bg-surface-container machined-border border-transparent hover:border-outline-variant transition-colors">
                <Edit className="size-5 text-on-surface-variant" />
              </button>
            </div>

            <p className="text-sm text-on-surface-variant mb-4 normal-case not-italic">
              {product.description}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-outline-variant">
              <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                <Clock className="size-4 text-primary-container" />
                <span>{product.durationMinutes} min</span>
              </div>
              <div className="flex items-center gap-1 text-xl font-bold text-primary-container">
                <DollarSign className="size-5" />
                <span>{product.price.toFixed(2)}</span>
                {product.isSubscription && (
                  <span className="text-sm font-normal text-outline">/mo</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
