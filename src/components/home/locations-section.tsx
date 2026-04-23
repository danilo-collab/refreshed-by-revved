import { MapPin } from "lucide-react";

const locations = [
  "Coral Gables & Coconut Grove",
  "Miami Beach & Brickell",
  "Doral & Pinecrest",
  "Aventura & Sunny Isles",
];

export function LocationsSection() {
  return (
    <section className="py-10 bg-surface-container-lowest" id="locations">
      <div className="max-w-[1280px] mx-auto px-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-1 fast-fade-in">
            <h2 className="text-4xl font-bold mb-8">
              Mobile Detailing Near You in Miami
            </h2>
            <p className="text-on-surface-variant mb-10 normal-case not-italic">
              We serve the entire Greater Miami area, bringing mobile car
              detailing miami directly to your office, home, or marina.
            </p>

            <div className="space-y-6">
              {locations.map((location, index) => (
                <div
                  key={location}
                  className={`flex items-center gap-4 ${
                    index > 0 ? "border-t border-outline-variant/30 pt-6" : ""
                  }`}
                >
                  <MapPin className="text-primary-container" />
                  <span className="text-sm font-bold uppercase">
                    {location}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 h-[500px] bg-surface-container machined-border overflow-hidden relative fast-fade-in">
            <div className="absolute inset-0 bg-[#1a1a1a] flex items-center justify-center">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d114964.88210350524!2d-80.2994982186591!3d25.782390733560662!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d9b0a58e95663f%3A0xe740f9596e191942!2sMiami%2C%20FL!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  filter: "grayscale(1) invert(0.9) contrast(1.2)",
                }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="absolute top-4 right-4 bg-surface px-4 py-2 border border-primary-container/50">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                  5 Units Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
