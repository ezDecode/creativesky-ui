"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

interface CopyCodeButtonProps {
  name: string;
}

export function CopyCodeButton({ name }: CopyCodeButtonProps) {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCopy = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/source?type=component&name=${name}`);
      const data = await response.json();
      
      if (data.code) {
        await navigator.clipboard.writeText(data.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy code:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCopy}
      disabled={loading}
      className="group relative flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-foreground/[0.03] hover:bg-foreground/[0.06] active:bg-foreground/[0.08] transition-all duration-200 border border-foreground/5 hover:border-foreground/10 shadow-sm overflow-hidden"
      title="Copy component code"
    >
        <div className="relative size-4 flex items-center justify-center">
          <Icon 
            icon={loading ? "lucide:loader-2" : "lucide:copy"} 
            className={cn(
              "size-4 transition-all duration-300",
              loading ? "animate-spin opacity-100" : "opacity-70 group-hover:opacity-100",
              copied ? "scale-0 opacity-0" : "scale-100"
            )} 
          />
          <Icon 
            icon="lucide:check" 
            className={cn(
              "absolute inset-0 size-4 text-emerald-500 transition-all duration-300",
              copied ? "scale-100 opacity-100" : "scale-50 opacity-0"
            )} 
          />
        </div>
        <span className="text-[12px] font-semibold uppercase tracking-wider text-foreground/60 group-hover:text-foreground/80 transition-colors">
          {loading ? "Fetching..." : copied ? "Copied!" : "Copy Code"}
        </span>
    </button>
  );
}
