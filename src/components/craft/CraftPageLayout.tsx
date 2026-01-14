"use client";

import React, { ReactNode } from "react";
import { CraftPageProvider } from "./CraftPageContext";
import { CraftHeader } from "./CraftHeader";

interface CraftPageLayoutProps {
  title: string;
  slug: string;
  pricing: string;
  children: ReactNode;
}

export function CraftPageLayout({ title, slug, pricing, children }: CraftPageLayoutProps) {
  return (
    <CraftPageProvider>
      <main className="min-h-screen bg-background text-foreground selection:bg-primary/30">
        <CraftHeader title={title} slug={slug} pricing={pricing} />
        {children}
      </main>
    </CraftPageProvider>
  );
}
