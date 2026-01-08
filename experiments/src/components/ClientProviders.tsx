"use client";

import { useEffect, useState } from "react";
import { Dock } from "@/components/layout/Dock";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {children}
      {mounted && <Dock />}
    </>
  );
}
