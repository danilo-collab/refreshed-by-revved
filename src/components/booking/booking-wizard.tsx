"use client";

import { useState, useEffect } from "react";
import { ServiceSelection } from "./service-selection";
import { AddonSelection } from "./addon-selection";
import { LocationInput } from "./location-input";
import { DateTimeSelection } from "./datetime-selection";
import { BookingSummary } from "./booking-summary";
import { CustomerInfo, isValidEmail, isValidUSPhone } from "./customer-info";
import { cn } from "@/lib/utils";

export interface Service {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
  description: string;
}

export interface Addon {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
}

export interface BookingData {
  service: Service | null;
  addons: Addon[];
  address: string;
  addressNotes: string;
  date: Date | null;
  time: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

const STEPS = [
  { id: 1, label: "Service" },
  { id: 2, label: "Add-ons" },
  { id: 3, label: "Location" },
  { id: 4, label: "Schedule" },
  { id: 5, label: "Details" },
];

export function BookingWizard() {
  const [services, setServices] = useState<Service[]>([]);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    service: null,
    addons: [],
    address: "",
    addressNotes: "",
    date: null,
    time: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
  });

  // Fetch products and addons from API
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();

        // Transform API data to match component interfaces
        const transformedServices: Service[] = data.products.map((p: {
          id: string;
          name: string;
          price: string;
          durationMinutes: number;
          shortDescription: string | null;
        }) => ({
          id: p.id,
          name: p.name,
          price: parseFloat(p.price),
          durationMinutes: p.durationMinutes,
          description: p.shortDescription || "",
        }));

        const transformedAddons: Addon[] = data.addons.map((a: {
          id: string;
          name: string;
          price: string;
          durationMinutes: number;
        }) => ({
          id: a.id,
          name: a.name,
          price: parseFloat(a.price),
          durationMinutes: a.durationMinutes,
        }));

        setServices(transformedServices);
        setAddons(transformedAddons);
      } catch (err) {
        setError("Failed to load services. Please refresh the page.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const updateBookingData = (data: Partial<BookingData>) => {
    setBookingData((prev) => ({ ...prev, ...data }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return bookingData.service !== null;
      case 2:
        return true; // Add-ons are optional
      case 3:
        return bookingData.address.trim() !== "";
      case 4:
        return bookingData.date !== null && bookingData.time !== "";
      case 5:
        return (
          bookingData.customerName.trim() !== "" &&
          isValidEmail(bookingData.customerEmail) &&
          isValidUSPhone(bookingData.customerPhone)
        );
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceed() && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!bookingData.service || !bookingData.date) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Parse time and create scheduled date/end date
      const [hours, minutes] = bookingData.time.split(":").map(Number);
      const scheduledDate = new Date(bookingData.date);
      scheduledDate.setHours(hours, minutes, 0, 0);

      const scheduledEndDate = new Date(scheduledDate);
      scheduledEndDate.setMinutes(scheduledEndDate.getMinutes() + totalDuration);

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: bookingData.service.id,
          customerName: bookingData.customerName,
          customerEmail: bookingData.customerEmail,
          customerPhone: bookingData.customerPhone,
          address: bookingData.address,
          addressNotes: bookingData.addressNotes || undefined,
          scheduledDate: scheduledDate.toISOString(),
          scheduledEndDate: scheduledEndDate.toISOString(),
          totalPrice: totalPrice.toFixed(2),
          totalDurationMinutes: totalDuration,
          addonIds: bookingData.addons.map((a) => a.id),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create booking");
      }

      const booking = await response.json();
      // Redirect to checkout
      window.location.href = `/api/checkout/${booking.id}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit booking");
      setIsSubmitting(false);
    }
  };

  const totalPrice =
    (bookingData.service?.price || 0) +
    bookingData.addons.reduce((sum, addon) => sum + addon.price, 0);

  const totalDuration =
    (bookingData.service?.durationMinutes || 0) +
    bookingData.addons.reduce((sum, addon) => sum + addon.durationMinutes, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="size-12 border-4 border-primary-container border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-on-surface-variant">Loading services...</p>
        </div>
      </div>
    );
  }

  if (error && services.length === 0) {
    return (
      <div className="machined-border bg-surface-container-low p-8 text-center">
        <p className="text-error mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-primary-container text-on-primary font-bold chamfer-clip"
        >
          TRY AGAIN
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2">
        {/* Error Banner */}
        {error && (
          <div className="bg-error/10 border border-error/30 text-error px-4 py-3 mb-6 rounded">
            {error}
          </div>
        )}

        {/* Step Indicators */}
        <div className="flex items-center justify-between mb-8">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div
                className={cn(
                  "flex items-center justify-center size-10 rounded-full text-sm font-bold transition-colors",
                  currentStep === step.id
                    ? "bg-primary-container text-on-primary"
                    : currentStep > step.id
                    ? "bg-primary-container/30 text-primary-container"
                    : "bg-surface-container text-on-surface-variant"
                )}
              >
                {step.id}
              </div>
              <span
                className={cn(
                  "ml-2 text-sm font-medium hidden sm:inline",
                  currentStep === step.id
                    ? "text-primary-container"
                    : "text-on-surface-variant"
                )}
              >
                {step.label}
              </span>
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-px mx-4",
                    currentStep > step.id
                      ? "bg-primary-container"
                      : "bg-outline-variant"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="machined-border bg-surface-container-low p-6 md:p-8">
          {currentStep === 1 && (
            <ServiceSelection
              services={services}
              selectedService={bookingData.service}
              onSelect={(service) => updateBookingData({ service })}
            />
          )}
          {currentStep === 2 && (
            <AddonSelection
              addons={addons}
              selectedAddons={bookingData.addons}
              onToggle={(addon) => {
                const exists = bookingData.addons.find((a) => a.id === addon.id);
                if (exists) {
                  updateBookingData({
                    addons: bookingData.addons.filter((a) => a.id !== addon.id),
                  });
                } else {
                  updateBookingData({
                    addons: [...bookingData.addons, addon],
                  });
                }
              }}
            />
          )}
          {currentStep === 3 && (
            <LocationInput
              address={bookingData.address}
              addressNotes={bookingData.addressNotes}
              onAddressChange={(address) => updateBookingData({ address })}
              onNotesChange={(addressNotes) => updateBookingData({ addressNotes })}
            />
          )}
          {currentStep === 4 && (
            <DateTimeSelection
              selectedDate={bookingData.date}
              selectedTime={bookingData.time}
              onDateChange={(date) => updateBookingData({ date })}
              onTimeChange={(time) => updateBookingData({ time })}
              serviceDuration={totalDuration}
            />
          )}
          {currentStep === 5 && (
            <CustomerInfo
              name={bookingData.customerName}
              email={bookingData.customerEmail}
              phone={bookingData.customerPhone}
              onNameChange={(customerName) => updateBookingData({ customerName })}
              onEmailChange={(customerEmail) => updateBookingData({ customerEmail })}
              onPhoneChange={(customerPhone) => updateBookingData({ customerPhone })}
            />
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-outline-variant">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={cn(
                "px-6 py-3 font-bold transition-colors",
                currentStep === 1
                  ? "text-outline cursor-not-allowed"
                  : "text-on-surface hover:text-primary-container"
              )}
            >
              BACK
            </button>
            {currentStep < STEPS.length ? (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className={cn(
                  "px-8 py-3 font-bold chamfer-clip transition-all",
                  canProceed()
                    ? "bg-primary-container text-on-primary cyan-glow hover:bg-primary-container/90"
                    : "bg-surface-container text-outline cursor-not-allowed"
                )}
              >
                CONTINUE
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canProceed() || isSubmitting}
                className={cn(
                  "px-8 py-3 font-bold chamfer-clip transition-all flex items-center gap-2",
                  canProceed() && !isSubmitting
                    ? "bg-primary-container text-on-primary cyan-glow hover:bg-primary-container/90"
                    : "bg-surface-container text-outline cursor-not-allowed"
                )}
              >
                {isSubmitting ? (
                  <>
                    <div className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    PROCESSING...
                  </>
                ) : (
                  "CONFIRM BOOKING"
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar Summary */}
      <div className="lg:col-span-1">
        <BookingSummary
          service={bookingData.service}
          addons={bookingData.addons}
          totalPrice={totalPrice}
          totalDuration={totalDuration}
          date={bookingData.date}
          time={bookingData.time}
          address={bookingData.address}
        />
      </div>
    </div>
  );
}
