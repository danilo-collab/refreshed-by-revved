"use client";

import Link from "next/link";
import { Logo } from "@/components/icons/logo";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "#services", label: "Services" },
  { href: "#pricing", label: "Pricing" },
  { href: "#locations", label: "Locations" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-xl border-b border-outline-variant px-5 py-4">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Logo className="size-8" />
          <span className="text-xl font-bold tracking-tighter font-headline text-on-surface normal-case not-italic">
            Revved Detailing
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary-container transition-colors"
            >
              {link.label}
            </a>
          ))}
          <Link href="/booking">
            <Button className="bg-primary-container text-on-primary font-bold px-6 py-2 chamfer-clip cyan-glow active:scale-95 transition-all hover:bg-primary-container/90">
              BOOK NOW
            </Button>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-on-surface"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden absolute top-full left-0 right-0 bg-surface border-b border-outline-variant p-4 space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block text-sm font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary-container transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Link href="/booking" onClick={() => setMobileMenuOpen(false)}>
            <Button className="w-full bg-primary-container text-on-primary font-bold py-3 chamfer-clip cyan-glow">
              BOOK NOW
            </Button>
          </Link>
        </nav>
      )}
    </header>
  );
}
