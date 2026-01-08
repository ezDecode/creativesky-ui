import type { Metadata } from "next";
import "./globals.css";
import { ClientProviders } from "@/components/ClientProviders";

export const metadata: Metadata = {
  title: "Experiment",
  description: "A premium component library showcase inspired by modern design principles.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          rel="preload"
          href="/font/ZigatoSans.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className="antialiased min-h-screen bg-background text-foreground"
        style={{ fontFamily: "'Zigato Sans', 'Inter Tight', sans-serif" }}
      >
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
