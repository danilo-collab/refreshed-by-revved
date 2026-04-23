import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BookingWizard } from "@/components/booking/booking-wizard";

export const metadata = {
  title: "Book Your Detail | Refreshed By Revved",
  description:
    "Book your premium mobile car detailing service in Miami. Select your service, choose add-ons, pick a time, and we'll come to you.",
};

export default function BookingPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background py-10">
        <div className="max-w-[1280px] mx-auto px-5">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Book Your Mobile Detail in Minutes
            </h1>
            <p className="text-on-surface-variant text-lg max-w-2xl mx-auto normal-case not-italic">
              Select your service, customize with add-ons, and choose your
              preferred time. We&apos;ll bring the detail shop to you.
            </p>
          </div>
          <BookingWizard />
        </div>
      </main>
      <Footer />
    </>
  );
}
