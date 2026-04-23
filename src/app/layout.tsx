import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-headline",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Refreshed By Revved | Miami's Premium Mobile Car Detailing",
  description:
    "Experience elite mobile car detailing in Miami. We bring showroom-quality interior and exterior detailing directly to your location. Book your detail today.",
  keywords: [
    "mobile car detailing miami",
    "car detailing miami fl",
    "interior car detailing miami",
    "mobile detailing near me",
    "ceramic coating miami",
  ],
  openGraph: {
    title: "Refreshed By Revved | Miami's Premium Mobile Car Detailing",
    description:
      "Elite mobile car detailing in Miami. Showroom-quality results at your location.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-body">
        {children}
      </body>
    </html>
  );
}
