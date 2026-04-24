import Link from "next/link";
import { CheckCircle, Calendar, ArrowLeft } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export default function BookingSuccessPage() {
  return (
    <>
      <Header />
      <main className="min-h-[60vh] flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full text-center">
          <div className="machined-border bg-surface-container-low p-8">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="size-8 text-green-400" />
            </div>

            <h1 className="text-2xl font-bold mb-2">Booking Confirmed!</h1>
            <p className="text-on-surface-variant mb-6 normal-case not-italic">
              Your detailing appointment has been scheduled. We&apos;ll contact you
              shortly to confirm the details.
            </p>

            <div className="flex items-center justify-center gap-2 text-primary-container mb-8">
              <Calendar className="size-5" />
              <span className="font-medium">Check your email for confirmation</span>
            </div>

            <div className="space-y-3">
              <Link href="/" className="block">
                <Button className="w-full bg-primary-container text-on-primary font-bold py-4 h-auto chamfer-clip cyan-glow hover:bg-primary-container/90">
                  <ArrowLeft className="size-5 mr-2" />
                  BACK TO HOME
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
