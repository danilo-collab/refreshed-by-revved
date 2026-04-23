import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const plans = [
  {
    tier: "Quick Clean",
    name: "Essential Wash",
    price: "$99.99",
    features: [
      "Interior Blow Out + Vacuum",
      "Interior Wipe Down",
      "Wheel Wash",
      "Complete Foam Bath",
      "Tire Shine",
    ],
    featured: false,
  },
  {
    tier: "Deep Clean",
    name: "Full Detail",
    price: "$179.99",
    features: [
      "Everything in Essential",
      "Interior Contact Wash",
      "Interior Trim Cleanse",
      "Steering Wheel Cleanse",
      "Floor Mat Treatment",
      "Wheel Wells & Brake Cleanse",
    ],
    featured: true,
  },
  {
    tier: "Premium",
    name: "VIP Showroom",
    price: "$284.99",
    features: [
      "Everything in Full Detail",
      "Carpet & Floor Mat Extraction",
      "Full Paint Decontamination",
      "Complete Vehicle Ceramic Coating",
    ],
    featured: false,
  },
  {
    tier: "Subscription",
    name: "Monthly Plan",
    price: "$249.99",
    priceLabel: "/mo",
    features: [
      "4 Essential Washes per month",
      "Priority Scheduling",
      "Cancel Anytime",
      "Best Value for Regulars",
    ],
    featured: false,
  },
];

export function PricingSection() {
  return (
    <section className="py-10" id="pricing">
      <div className="max-w-[1280px] mx-auto px-5">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Simple Pricing for Every Level of Detail
          </h2>
          <p className="text-on-surface-variant normal-case not-italic">
            Transparent rates for elite car detailing miami fl quality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 machined-border">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`p-8 ${
                index < 3 ? "lg:border-r border-outline-variant" : ""
              } ${
                index < 2 ? "md:border-r lg:border-r" : ""
              } ${
                plan.featured
                  ? "bg-surface-container-high relative"
                  : "bg-surface-container/30"
              } fast-fade-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.featured && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-primary-container shadow-[0_0_10px_rgba(0,221,233,0.5)]" />
              )}

              <div className="mb-8">
                <span
                  className={`text-[10px] font-bold uppercase tracking-[0.2em] ${
                    plan.featured ? "text-primary-container" : "text-outline"
                  }`}
                >
                  {plan.tier}
                </span>
                <h3 className="text-3xl font-bold mt-2 not-italic normal-case">
                  {plan.name}
                </h3>
              </div>

              <div className="text-3xl font-bold text-white mb-8 font-headline not-italic">
                {plan.price}{" "}
                <span className="text-sm font-normal text-outline">
                  {(plan as { priceLabel?: string }).priceLabel || "/ detail"}
                </span>
              </div>

              <ul className="space-y-4 mb-10 text-sm text-on-surface-variant">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 normal-case not-italic"
                  >
                    <CheckCircle className="text-primary-container size-5" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link href="/booking">
                <Button
                  className={`w-full py-4 h-auto font-bold ${
                    plan.featured
                      ? "bg-primary-container text-on-primary cyan-glow hover:bg-primary-container/90"
                      : "border border-outline-variant text-white bg-transparent hover:bg-surface-container"
                  }`}
                >
                  {plan.featured ? `BOOK ${plan.name.toUpperCase()}` : `SELECT ${plan.name.toUpperCase()}`}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
