"use client";

import { useState, useCallback } from "react";
import { User, Mail, Phone } from "lucide-react";

// US phone validation - accepts: (305) 555-1234, 305-555-1234, 3055551234, +1 305 555 1234
const US_PHONE_REGEX = /^(\+1\s?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

export function isValidUSPhone(phone: string): boolean {
  const cleaned = phone.replace(/\s/g, "");
  return US_PHONE_REGEX.test(cleaned);
}

export function formatUSPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits[0] === "1") {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return phone;
}

interface CustomerInfoProps {
  name: string;
  email: string;
  phone: string;
  onNameChange: (name: string) => void;
  onEmailChange: (email: string) => void;
  onPhoneChange: (phone: string) => void;
}

export function CustomerInfo({
  name,
  email,
  phone,
  onNameChange,
  onEmailChange,
  onPhoneChange,
}: CustomerInfoProps) {
  const [touched, setTouched] = useState({ name: false, email: false, phone: false });

  const handlePhoneBlur = useCallback(() => {
    setTouched((t) => ({ ...t, phone: true }));
    if (phone.trim()) {
      onPhoneChange(formatUSPhone(phone));
    }
  }, [phone, onPhoneChange]);

  const emailError = touched.email && email.trim() && !isValidEmail(email);
  const phoneError = touched.phone && phone.trim() && !isValidUSPhone(phone);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Your Contact Details</h2>
      <p className="text-on-surface-variant mb-6 normal-case not-italic">
        We&apos;ll send your booking confirmation and updates to these contacts.
      </p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold uppercase tracking-wider mb-2">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-outline size-5" />
            <input
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              placeholder="John Doe"
              className="w-full pl-12 pr-4 py-4 bg-surface-container machined-border text-on-surface placeholder:text-outline focus:border-primary-container focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold uppercase tracking-wider mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-outline size-5" />
            <input
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              placeholder="john@example.com"
              className={`w-full pl-12 pr-4 py-4 bg-surface-container machined-border text-on-surface placeholder:text-outline focus:outline-none transition-colors ${
                emailError ? "border-error focus:border-error" : "focus:border-primary-container"
              }`}
            />
          </div>
          {emailError && (
            <p className="text-error text-sm mt-1 normal-case not-italic">
              Please enter a valid email address
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold uppercase tracking-wider mb-2">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-outline size-5" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              onBlur={handlePhoneBlur}
              placeholder="(305) 555-1234"
              className={`w-full pl-12 pr-4 py-4 bg-surface-container machined-border text-on-surface placeholder:text-outline focus:outline-none transition-colors ${
                phoneError ? "border-error focus:border-error" : "focus:border-primary-container"
              }`}
            />
          </div>
          {phoneError && (
            <p className="text-error text-sm mt-1 normal-case not-italic">
              Please enter a valid US phone number
            </p>
          )}
        </div>

        <div className="bg-surface-container-high p-4 machined-border">
          <p className="text-sm text-on-surface-variant normal-case not-italic">
            <strong className="text-primary-container">Privacy:</strong> Your information
            is secure and will only be used for booking communications. We never share
            your data with third parties.
          </p>
        </div>
      </div>
    </div>
  );
}
