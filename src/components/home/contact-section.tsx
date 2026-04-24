"use client";

import { useState, useRef } from "react";
import { Send, Upload, X, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Max 5 photos
    const remaining = 5 - photos.length;
    const filesToProcess = Array.from(files).slice(0, remaining);

    filesToProcess.forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      if (file.size > 5 * 1024 * 1024) return; // 5MB limit

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPhotos((prev) => [...prev, result]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          photos,
          source: "contact_form",
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit");
      }

      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
      setPhotos([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className="py-16 bg-surface" id="contact">
        <div className="max-w-[1280px] mx-auto px-5">
          <div className="max-w-2xl mx-auto text-center machined-border bg-surface-container-low p-12">
            <CheckCircle className="size-16 text-primary-container mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Message Sent!</h2>
            <p className="text-on-surface-variant normal-case not-italic mb-6">
              We&apos;ll get back to you within 24 hours.
            </p>
            <Button
              onClick={() => setSubmitted(false)}
              className="bg-primary-container text-on-primary font-bold chamfer-clip"
            >
              SEND ANOTHER MESSAGE
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-surface" id="contact">
      <div className="max-w-[1280px] mx-auto px-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info */}
          <div className="fast-fade-in">
            <h2 className="text-4xl font-bold mb-6">Get in Touch</h2>
            <p className="text-on-surface-variant mb-8 normal-case not-italic">
              Have questions about our services? Want a custom quote for your
              vehicle? Send us a message and we&apos;ll get back to you within 24
              hours.
            </p>

            <div className="space-y-6">
              <div className="machined-border bg-surface-container-low p-6">
                <h3 className="font-bold mb-2">Upload Vehicle Photos</h3>
                <p className="text-sm text-on-surface-variant normal-case not-italic">
                  Share photos of your car for accurate quotes. Show us the
                  current condition, any problem areas, or specific details you
                  want addressed.
                </p>
              </div>

              <div className="machined-border bg-surface-container-low p-6">
                <h3 className="font-bold mb-2">Quick Response</h3>
                <p className="text-sm text-on-surface-variant normal-case not-italic">
                  We typically respond within a few hours during business hours.
                  For urgent requests, call or text us directly.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="machined-border bg-surface-container-low p-8 fast-fade-in"
          >
            {error && (
              <div className="bg-error/10 border border-error/30 text-error px-4 py-3 mb-6 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 bg-surface-container machined-border text-on-surface placeholder:text-outline focus:border-primary-container focus:outline-none transition-colors"
                  placeholder="Your name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 bg-surface-container machined-border text-on-surface placeholder:text-outline focus:border-primary-container focus:outline-none transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-surface-container machined-border text-on-surface placeholder:text-outline focus:border-primary-container focus:outline-none transition-colors"
                  placeholder="(305) 555-0000"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                  Message *
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-surface-container machined-border text-on-surface placeholder:text-outline focus:border-primary-container focus:outline-none transition-colors resize-none"
                  placeholder="Tell us about your vehicle and what services you're interested in..."
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                  Vehicle Photos (Optional)
                </label>

                {/* Photo Previews */}
                {photos.length > 0 && (
                  <div className="flex flex-wrap gap-3 mb-4">
                    {photos.map((photo, index) => (
                      <div
                        key={index}
                        className="relative size-20 rounded overflow-hidden border border-outline-variant"
                      >
                        <img
                          src={photo}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute top-1 right-1 size-5 bg-error rounded-full flex items-center justify-center"
                        >
                          <X className="size-3 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {photos.length < 5 && (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-surface-container machined-border text-on-surface-variant hover:border-primary-container transition-colors cursor-pointer"
                    >
                      <Upload className="size-5" />
                      <span className="text-sm">
                        Upload Photos ({photos.length}/5)
                      </span>
                    </label>
                    <p className="text-xs text-outline mt-2">
                      Max 5 photos, 5MB each. JPG, PNG accepted.
                    </p>
                  </div>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary-container text-on-primary font-bold py-4 h-auto chamfer-clip cyan-glow hover:bg-primary-container/90 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    SENDING...
                  </>
                ) : (
                  <>
                    <Send className="size-5" />
                    SEND MESSAGE
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
