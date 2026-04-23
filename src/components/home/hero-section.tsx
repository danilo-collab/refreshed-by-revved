import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative min-h-0 py-12 md:py-16 flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10" />
        <div
          className="w-full h-full bg-center bg-cover"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBRhTswY1vWyJs20U8WC2MWWaldCnbirzrWoMFKmMtY-YddxTZfRj4DBvhUY-C4b8WZC8zkWknbQ5qIR03shouO1xylT-HLYv3I1wHkUUDE9FNSTb3_RnR0zaTubtVjl8pUkZDA5rzOsYO2DEJyfLgwFjoXBM9NkRxMcMuIXWMsQhfQW_z4hhcy-1ZpE5sX4YeLw41uV-cekm0-f3qADzRIzYAo3ewcFgndg_ifoWslLFVMZQeQLDm5ACCIOsj3Fj0ZEvnxX7tbdGk')",
          }}
        />
      </div>

      <div className="relative z-20 max-w-[1280px] mx-auto px-5 w-full">
        <div className="max-w-4xl fast-fade-in">
          {/* Live Operations Badge */}
          <div className="inline-flex items-center gap-2 bg-primary-container/10 border border-primary-container/30 px-3 py-1 mb-4">
            <span className="size-2 rounded-full bg-primary-container animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-container">
              Live Operations: Miami, FL
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold leading-[0.9] mb-4 text-on-surface">
            Miami&apos;s Premium{" "}
            <span className="text-primary-container">Mobile Car Detailing</span>{" "}
            &amp; Showroom Finishes
          </h1>

          {/* Subheading */}
          <p className="text-lg text-on-surface-variant mb-6 max-w-xl font-body normal-case not-italic">
            Experience the absolute best mobile car detailing Miami has to
            offer. We bring elite interior car detailing and ceramic restoration
            directly to your location. Performance results for performance
            machines.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/booking">
              <Button className="bg-primary-container text-on-primary font-black text-lg px-10 py-4 h-auto chamfer-clip cyan-glow hover:translate-x-1 transition-transform hover:bg-primary-container/90">
                BOOK DETAIL NOW
              </Button>
            </Link>
            <a href="#services">
              <Button
                variant="outline"
                className="border border-outline-variant bg-surface-container-low text-white font-bold px-10 py-4 h-auto chamfer-clip hover:bg-surface-container-high transition-colors"
              >
                VIEW SERVICES
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
