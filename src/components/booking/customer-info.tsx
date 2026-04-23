"use client";

import { User, Mail, Phone } from "lucide-react";

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
              placeholder="john@example.com"
              className="w-full pl-12 pr-4 py-4 bg-surface-container machined-border text-on-surface placeholder:text-outline focus:border-primary-container focus:outline-none transition-colors"
            />
          </div>
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
              placeholder="(305) 555-1234"
              className="w-full pl-12 pr-4 py-4 bg-surface-container machined-border text-on-surface placeholder:text-outline focus:border-primary-container focus:outline-none transition-colors"
            />
          </div>
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
