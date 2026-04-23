import { Wrench, Zap, Shield, Leaf } from "lucide-react";

const reasons = [
  {
    icon: Wrench,
    title: "PRECISION TOOLS",
    description:
      "Rupes and Flex polishers paired with high-end chemical formulations.",
  },
  {
    icon: Zap,
    title: "RAPID DEPLOY",
    description:
      "Our fleet of mobile car detailing Miami units is always ready for same-day service.",
  },
  {
    icon: Shield,
    title: "FULLY INSURED",
    description:
      "Peace of mind for your exotics, luxury sedans, and daily drivers.",
  },
  {
    icon: Leaf,
    title: "ECO-FRIENDLY",
    description:
      "Water-saving technologies that protect both your car and the Miami coastline.",
  },
];

export function WhyChooseUsSection() {
  return (
    <section className="py-10">
      <div className="max-w-[1280px] mx-auto px-5">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Why Miami Drivers Choose Refreshed By Revved
          </h2>
          <p className="text-on-surface-variant normal-case not-italic">
            The standard for elite mobile detailing miami.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason, index) => (
            <div
              key={reason.title}
              className="text-center p-6 fast-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <reason.icon className="size-12 text-primary-container mb-4 mx-auto" />
              <h4 className="font-bold mb-2 not-italic normal-case">
                {reason.title}
              </h4>
              <p className="text-sm text-outline normal-case not-italic">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
