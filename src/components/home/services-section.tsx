import { ArrowRight } from "lucide-react";
import Link from "next/link";

const services = [
  {
    title: "Exterior Restoration",
    description:
      "Foam cannon bath, clay bar decontamination, and high-gloss ceramic wax seal.",
    price: "$149+",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBFXUP9TLr1OqHGgpylashkvyFVocLwNYoC79jqx_XJaBc7HSv6u4uWHa5yvZsXs67vgbAYH20RwnaExoABU1qtOZTovedXjz_gMyBciaVKHPHL-QV6_IVzMcKAk8XEJzcKIUi3HkUqELNIWl3AP2E-VCCRLTJkbwVo3JVGDQWlscyY9NT4tyMwpcZJTdxgtuP5ORtAqSvXSN5z5GJrOOdNL5eW489ye6UUS2shk8C8nXDVVAj5SQNNVGGwqUHSq3bHixqF4WKCKrY",
    badge: "MOST POPULAR",
  },
  {
    title: "Interior Car Detailing",
    description:
      "Steam sterilization, deep extraction, and premium leather hydration for a new-car feel.",
    price: "$129+",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCuLxJvvC7-lSQJ7KeoMuYbuhofd5A4N49S0cgllIt9pV4k-t9K-J81WA6j7NEw-lh6QxTSqy5pNeLv0wcDrkwUwcyMkmPtbSpGkK2daQR6TEZ2UuZUcPwnoejF8HclXwJzPLTPruI2dJwsbMZWVujrISpAh5ezY8Ajl8gfz3ROy2FxTPrjgx5ojHg2sXmxpAB3WudiN6EBBnd8CoxcDTLz6KpJwyhX9ael84MX_05iANCyrODhc9r3smd5922fsDN2wPQjzBucWNo",
  },
  {
    title: "Full Showroom Package",
    description:
      "The ultimate mobile detailing miami experience. Total rejuvenation inside and out.",
    price: "$299+",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCu49TbrV4EskusIGSaYydVDK53Cj3oVjXnld0fIPR-Z7n6iLQ7yVXKPdFWAchuRJZmPUV1ZGRkjiMQEph5JPU8WsPHppsT78OmXh_l9O6y9QOqRnAYS2M0x3UVcxnsKpd8_-uAA2fQqfeehZ0uqfiSj96r5tIMLIIfpzO88Z3QVfgqerVWfTkzvu9obcN4_aMYi3TnroA2lDs-Ev7QmN6y5OI5b-tlKqZtXHvVu1UbFQHkolRgju0dOWVTFIXBYOuhBHPktnfmno8",
  },
];

export function ServicesSection() {
  return (
    <section className="py-10 bg-surface" id="services">
      <div className="max-w-[1280px] mx-auto px-5">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-bold text-on-surface mb-4">
              Our Mobile Car Detailing Services in Miami
            </h2>
            <p className="text-on-surface-variant max-w-xl normal-case not-italic">
              Precision-driven packages designed for car detailing miami fl
              enthusiasts who demand perfection.
            </p>
          </div>
          <div className="hidden md:block h-px flex-1 bg-outline-variant mx-12 mb-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Link
              href="/booking"
              key={service.title}
              className="group machined-border bg-surface-container-low p-1 hover:border-primary-container/50 transition-all fast-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-center bg-cover group-hover:scale-105 transition-transform duration-500"
                  style={{ backgroundImage: `url('${service.image}')` }}
                />
                {service.badge && (
                  <div className="absolute top-4 left-4 bg-primary-container text-on-primary text-[10px] font-black px-2 py-1">
                    {service.badge}
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 not-italic normal-case">
                  {service.title}
                </h3>
                <p className="text-sm text-on-surface-variant mb-6 h-12 normal-case not-italic">
                  {service.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-primary-container font-bold">
                    {service.price}
                  </span>
                  <ArrowRight className="text-primary-container" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
