import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ClientProviders } from "@/components/ClientProviders";

// Primary font for UI (Inter Tight with mathematical scale)
const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

// Secondary font for components (PolySans)
const polySans = localFont({
  src: [
    {
      path: "../../public/font/PolySansNeutral.ttf",
      weight: "400",
      style: "normal",
    }
  ],
  variable: "--font-poly",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Skie — Experiment",
  description: "A premium component library showcase inspired by modern design principles.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${interTight.variable} ${polySans.variable} antialiased min-h-screen bg-background text-foreground font-sans`}
      >
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
