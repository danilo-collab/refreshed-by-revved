"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Player } from "@remotion/player";
import { Button } from "@/components/ui/button";
import { ElegantShape } from "@/components/ui/elegant-shape";
import { GridPixelateWipe } from "@/components/ui/grid-pixelate-wipe";

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.3 + i * 0.15,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  }),
};

function HeroFromPanel() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(135deg, #0a0a0a 0%, #0f1419 50%, #0a0a0a 100%)",
      }}
    >
      {/* Cyan accent grid lines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0, 240, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 240, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
      {/* Center glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          height: "80%",
          background: "radial-gradient(ellipse, rgba(0, 240, 255, 0.08) 0%, transparent 60%)",
        }}
      />
    </div>
  );
}

function HeroToPanel() {
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBRhTswY1vWyJs20U8WC2MWWaldCnbirzrWoMFKmMtY-YddxTZfRj4DBvhUY-C4b8WZC8zkWknbQ5qIR03shouO1xylT-HLYv3I1wHkUUDE9FNSTb3_RnR0zaTubtVjl8pUkZDA5rzOsYO2DEJyfLgwFjoXBM9NkRxMcMuIXWMsQhfQW_z4hhcy-1ZpE5sX4YeLw41uV-cekm0-f3qADzRIzYAo3ewcFgndg_ifoWslLFVMZQeQLDm5ACCIOsj3Fj0ZEvnxX7tbdGk')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Left gradient overlay for text readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to right, rgba(10, 10, 10, 0.95) 0%, rgba(10, 10, 10, 0.7) 40%, transparent 70%)",
        }}
      />
    </div>
  );
}

function HeroBackgroundScene() {
  return (
    <GridPixelateWipe
      cols={16}
      rows={9}
      pattern="wave"
      transitionStart={20}
      transitionDuration={50}
      cellFadeFrames={6}
      from={<HeroFromPanel />}
      to={<HeroToPanel />}
    />
  );
}

export function HeroSection() {
  return (
    <section className="relative min-h-0 py-8 md:py-12 flex items-center overflow-hidden">
      {/* Pixelate Wipe Background */}
      <div className="absolute inset-0 z-0">
        <Player
          component={HeroBackgroundScene}
          durationInFrames={120}
          fps={30}
          compositionWidth={1920}
          compositionHeight={1080}
          controls={false}
          autoPlay
          loop
          clickToPlay={false}
          acknowledgeRemotionLicense
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-container/[0.03] via-transparent to-primary-container/[0.02] blur-3xl z-[1]" />

      {/* Floating Shapes */}
      <div className="absolute inset-0 overflow-hidden z-[2] pointer-events-none">
        <ElegantShape
          delay={0.2}
          width={500}
          height={120}
          rotate={12}
          gradient="from-primary-container/[0.12]"
          className="left-[-15%] md:left-[-8%] top-[10%] md:top-[15%]"
        />
        <ElegantShape
          delay={0.4}
          width={400}
          height={100}
          rotate={-15}
          gradient="from-primary-container/[0.10]"
          className="right-[-10%] md:right-[-5%] top-[60%] md:top-[65%]"
        />
        <ElegantShape
          delay={0.3}
          width={250}
          height={70}
          rotate={-8}
          gradient="from-primary-container/[0.08]"
          className="left-[5%] md:left-[8%] bottom-[5%] md:bottom-[8%]"
        />
        <ElegantShape
          delay={0.5}
          width={180}
          height={50}
          rotate={20}
          gradient="from-primary-container/[0.10]"
          className="right-[10%] md:right-[15%] top-[5%] md:top-[10%]"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-[1280px] mx-auto px-5 w-full">
        <div className="max-w-4xl">
          {/* Main Heading */}
          <motion.h1
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="text-5xl md:text-7xl font-bold leading-[0.9] mb-4 text-on-surface"
          >
            Miami&apos;s Premium{" "}
            <span className="text-primary-container">Mobile Car Detailing</span>{" "}
            &amp; Showroom Finishes
          </motion.h1>

          {/* Subheading */}
          <motion.p
            custom={1}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="text-lg text-on-surface-variant mb-6 max-w-xl font-body normal-case not-italic"
          >
            Experience the absolute best mobile car detailing Miami has to
            offer. We bring elite interior car detailing and ceramic restoration
            directly to your location. Performance results for performance
            machines.
          </motion.p>

          {/* CTAs */}
          <motion.div
            custom={2}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row gap-4"
          >
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
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent z-[5] pointer-events-none" />
    </section>
  );
}
