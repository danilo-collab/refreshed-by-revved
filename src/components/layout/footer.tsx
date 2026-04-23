import Link from "next/link";
import { Logo } from "@/components/icons/logo";
import { Globe, Camera, Phone, Mail, MapPin } from "lucide-react";

const serviceLinks = [
  { href: "/booking", label: "Essential Wash" },
  { href: "/booking", label: "Full Detail" },
  { href: "/booking", label: "VIP Showroom Detail" },
  { href: "/booking", label: "Monthly Plan" },
];

export function Footer() {
  return (
    <footer className="bg-black py-16 border-t border-outline-variant">
      <div className="max-w-[1280px] mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <Logo className="size-6" />
              <span className="text-lg font-bold tracking-tighter font-headline normal-case not-italic">
                REVVED DETAILING
              </span>
            </Link>
            <p className="text-on-surface-variant max-w-sm text-sm mb-6 font-body">
              The elite standard in Miami mobile car detailing. Providing
              high-performance interior car detailing and ceramic restoration
              since 2018.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="size-10 machined-border flex items-center justify-center hover:bg-primary-container hover:text-on-primary transition-all"
              >
                <Globe className="size-5" />
              </a>
              <a
                href="#"
                className="size-10 machined-border flex items-center justify-center hover:bg-primary-container hover:text-on-primary transition-all"
              >
                <Camera className="size-5" />
              </a>
            </div>
          </div>

          <div>
            <h5 className="text-sm font-bold uppercase tracking-widest text-white mb-6 normal-case not-italic">
              SERVICES
            </h5>
            <ul className="space-y-4 text-xs text-on-surface-variant font-bold uppercase tracking-wider">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-primary-container">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-sm font-bold uppercase tracking-widest text-white mb-6 normal-case not-italic">
              CONTACT
            </h5>
            <ul className="space-y-4 text-xs text-on-surface-variant font-bold uppercase tracking-wider">
              <li className="flex items-center gap-2">
                <Phone className="size-4 text-primary-container" />
                (305) 555-REVVED
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 text-primary-container" />
                GO@REVVED.AUTO
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="size-4 text-primary-container" />
                MIAMI, FL
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-outline font-bold uppercase tracking-[0.2em]">
          <div>© {new Date().getFullYear()} REVVED DETAILING MIAMI. ALL RIGHTS RESERVED.</div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-primary-container">
              PRIVACY POLICY
            </a>
            <a href="#" className="hover:text-primary-container">
              TERMS OF SERVICE
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
