"use client";

import * as React from "react";
import { Footer } from "./Footer";

interface ShellProps {
  children: React.ReactNode;
  leftRail?: React.ReactNode;
}

export function Shell({ children, leftRail }: ShellProps) {
  return (
    <div className="relative min-h-screen w-full bg-background">
      <div className="mx-auto w-full max-w-5xl px-5 pt-24 pb-20 lg:grid lg:grid-cols-[11rem_minmax(auto,42rem)_11rem] lg:px-0">
        {/* Left rail: empty on mobile, shows content on desktop */}
        <aside className="hidden lg:block">
          {leftRail}
        </aside>

        {/* Main content area */}
        <main className="min-w-0">
          {children}
          <Footer />
        </main>

        {/* Right rail: empty on mobile, spacer on desktop */}
        <div className="hidden lg:block" aria-hidden />
      </div>
    </div>
  );
}
