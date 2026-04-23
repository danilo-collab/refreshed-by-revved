"use client";

import { CheckCircle, Sparkles, Car, Crown, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as PricingCard from "@/components/ui/pricing-card";
import Link from "next/link";
import { cn } from "@/lib/utils";

const plans = [
  {
    icon: <Car className="size-5" />,
    tier: "Quick Clean",
    name: "Essential Wash",
    price: "$99.99",
    priceLabel: "/ detail",
    description: "Perfect for regular maintenance",
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
    icon: <Sparkles className="size-5" />,
    tier: "Deep Clean",
    name: "Full Detail",
    price: "$179.99",
    priceLabel: "/ detail",
    description: "Most popular for car enthusiasts",
    badge: "Popular",
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
    icon: <Crown className="size-5" />,
    tier: "Premium",
    name: "VIP Showroom",
    price: "$284.99",
    priceLabel: "/ detail",
    description: "The ultimate showroom finish",
    features: [
      "Everything in Full Detail",
      "Carpet & Floor Mat Extraction",
      "Full Paint Decontamination",
      "Complete Ceramic Coating",
    ],
    featured: false,
  },
  {
    icon: <RefreshCw className="size-5" />,
    tier: "Subscription",
    name: "Monthly Plan",
    price: "$249.99",
    priceLabel: "/mo",
    description: "Best value for regulars",
    features: [
      "4 Essential Washes per month",
      "Priority Scheduling",
      "Cancel Anytime",
      "Save $150+ Monthly",
    ],
    featured: false,
  },
];

export function PricingSection() {
  return (
    <section className="py-16" id="pricing">
      <div className="max-w-[1280px] mx-auto px-5">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Simple Pricing for Every Level of Detail
          </h2>
          <p className="text-on-surface-variant normal-case not-italic max-w-xl mx-auto">
            Transparent rates for elite mobile car detailing. No hidden fees.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan, index) => (
            <PricingCard.Card
              key={plan.name}
              className={cn(
                "fast-fade-in flex flex-col",
                plan.featured &&
                  "ring-2 ring-primary-container/50 shadow-[0_0_30px_rgba(0,240,255,0.15)]"
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <PricingCard.Header glassEffect={plan.featured}>
                <PricingCard.Plan>
                  <PricingCard.PlanName>
                    <span className="text-primary-container">{plan.icon}</span>
                    <span className="text-on-surface-variant uppercase text-[10px] tracking-[0.15em] font-bold">
                      {plan.tier}
                    </span>
                  </PricingCard.PlanName>
                  {plan.badge && (
                    <PricingCard.Badge>{plan.badge}</PricingCard.Badge>
                  )}
                </PricingCard.Plan>

                <h3 className="text-xl font-bold text-on-surface mb-2 not-italic normal-case">
                  {plan.name}
                </h3>

                <PricingCard.Price>
                  <PricingCard.MainPrice>{plan.price}</PricingCard.MainPrice>
                  <PricingCard.Period>{plan.priceLabel}</PricingCard.Period>
                </PricingCard.Price>

                <Link href="/booking" className="block">
                  <Button
                    className={cn(
                      "w-full font-bold h-11",
                      plan.featured
                        ? "bg-primary-container text-on-primary cyan-glow hover:bg-primary-container/90"
                        : "border border-outline-variant text-white bg-transparent hover:bg-surface-container"
                    )}
                  >
                    {plan.featured ? "BOOK NOW" : "SELECT"}
                  </Button>
                </Link>
              </PricingCard.Header>

              <PricingCard.Body className="flex-1">
                <PricingCard.Description className="mb-4">
                  {plan.description}
                </PricingCard.Description>
                <PricingCard.List>
                  {plan.features.map((feature) => (
                    <PricingCard.ListItem key={feature}>
                      <CheckCircle
                        className="text-primary-container size-4 flex-shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span>{feature}</span>
                    </PricingCard.ListItem>
                  ))}
                </PricingCard.List>
              </PricingCard.Body>
            </PricingCard.Card>
          ))}
        </div>
      </div>
    </section>
  );
}
