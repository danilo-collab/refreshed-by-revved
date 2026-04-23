import { Clock, MapPin, BadgeCheck } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "SCHEDULE ONLINE",
    description:
      "Book your slot in 60 seconds through our performance-optimized mobile detailing app.",
  },
  {
    icon: MapPin,
    title: "WE ARRIVE FULLY EQUIPPED",
    description:
      "Our mobile units carry their own filtered water, power, and high-velocity detailing tools.",
  },
  {
    icon: BadgeCheck,
    title: "DRIVE PERFECTION",
    description:
      "Inspect your vehicle to ensure it meets our 50-point precision detailing checklist.",
  },
];

export function ConvenienceSection() {
  return (
    <section className="py-10 bg-surface-container-lowest border-y border-outline-variant overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 fast-fade-in">
            <h2 className="text-4xl font-bold mb-8">
              We Bring the Detail Shop to Your Driveway
            </h2>
            <div className="space-y-8">
              {features.map((feature) => (
                <div key={feature.title} className="flex gap-4">
                  <div className="size-12 bg-surface-container-high machined-border flex items-center justify-center shrink-0">
                    <feature.icon className="text-primary-container" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-2 not-italic normal-case">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-on-surface-variant normal-case not-italic">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2 relative">
            <div className="chamfer-clip border-2 border-primary-container p-2">
              <div
                className="aspect-square bg-center bg-cover"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuArVDBjOjmgDFNPE3QtRIPwzyFZ3iCNb3Og5hcqba-VUIKajY_Smjrrs82YccjxLyZJyQeg6_F39UX3kYBVvadACkZceH6R6_HpysjyDKAXHBaWjbjumqxcN0GF5kL6C_klVUL_o8FDzI3GI2srUuZGCAdBIKrdCT39HfIt6rD4APwij-aR2oqnYLyU5KBaur0ViIZXzBN6F5ZO5hN1gFfaxYjjq5RxBaZIEU-LXdlDb0hMbR-eYXB3YGZh8vTYqzrSG_8mr_NGwS8')",
                }}
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-surface-container-high p-6 machined-border max-w-[240px]">
              <p className="text-primary-container font-black text-2xl mb-1 font-headline not-italic">
                PRO GRADE
              </p>
              <p className="text-xs text-on-surface-variant normal-case not-italic">
                Autonomous water and power supply in every mobile unit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
