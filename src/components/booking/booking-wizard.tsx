"use client";

import { useState } from "react";
import { ServiceSelection } from "./service-selection";
import { AddonSelection } from "./addon-selection";
import { LocationInput } from "./location-input";
import { DateTimeSelection } from "./datetime-selection";
import { BookingSummary } from "./booking-summary";
import { CustomerInfo } from "./customer-info";
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

// Mock services - will be fetched from API
const MOCK_SERVICES: Service[] = [
  {
    id: "1",
    name: "Essential Wash",
    price: 99.99,
    durationMinutes: 60,
    description: "Interior Blow Out + Vacuum, Wipe Down, Wheel Wash, Complete Foam Bath, Tire Shine",
  },
  {
    id: "2",
    name: "Full Detail",
    price: 179.99,
    durationMinutes: 120,
    description: "Everything in Essential plus Interior Contact Wash, Trim Cleanse, Steering Wheel Cleanse, Floor Mat Treatment, Wheel Wells & Brake Cleanse, Wheel Foam Bath, Contactless Pre Wash",
  },
  {
    id: "3",
    name: "VIP Showroom Detail",
    price: 284.99,
    durationMinutes: 180,
    description: "Everything in Full Detail plus Carpet & Floor Mat Extraction, Full Paint Decontamination, Complete Vehicle Ceramic Coating",
  },
  {
    id: "4",
    name: "Monthly Plan",
    price: 249.99,
    durationMinutes: 60,
    description: "4 Essential Washes per month - Subscription-based recurring service",
  },
];

const MOCK_ADDONS: Addon[] = [
  { id: "a1", name: "Engine Bay Detail", price: 49.99, durationMinutes: 30 },
  { id: "a2", name: "Headlight Restoration", price: 79.99, durationMinutes: 45 },
  { id: "a3", name: "Odor Elimination", price: 39.99, durationMinutes: 20 },
  { id: "a4", name: "Pet Hair Removal", price: 29.99, durationMinutes: 30 },
];

export function BookingWizard() {
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
          bookingData.customerEmail.trim() !== "" &&
          bookingData.customerPhone.trim() !== ""
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
    // TODO: Submit booking to API
    console.log("Submitting booking:", bookingData);
    alert("Booking submitted! (API integration pending)");
  };

  const totalPrice =
    (bookingData.service?.price || 0) +
    bookingData.addons.reduce((sum, addon) => sum + addon.price, 0);

  const totalDuration =
    (bookingData.service?.durationMinutes || 0) +
    bookingData.addons.reduce((sum, addon) => sum + addon.durationMinutes, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2">
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
              services={MOCK_SERVICES}
              selectedService={bookingData.service}
              onSelect={(service) => updateBookingData({ service })}
            />
          )}
          {currentStep === 2 && (
            <AddonSelection
              addons={MOCK_ADDONS}
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
                disabled={!canProceed()}
                className={cn(
                  "px-8 py-3 font-bold chamfer-clip transition-all",
                  canProceed()
                    ? "bg-primary-container text-on-primary cyan-glow hover:bg-primary-container/90"
                    : "bg-surface-container text-outline cursor-not-allowed"
                )}
              >
                CONFIRM BOOKING
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
