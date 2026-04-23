import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Preloader } from "@/components/ui/preloader";
import {
  HeroSection,
  StatsBar,
  ServicesSection,
  ConvenienceSection,
  PricingSection,
  SubscriptionSection,
  WhyChooseUsSection,
  LocationsSection,
  WhatsAppButton,
} from "@/components/home";

export default function Home() {
  return (
    <>
      <Preloader />
      <Header />
      <main>
        <HeroSection />
        <StatsBar />
        <ServicesSection />
        <ConvenienceSection />
        <PricingSection />
        <SubscriptionSection />
        <WhyChooseUsSection />
        <LocationsSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
