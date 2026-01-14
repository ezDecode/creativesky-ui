"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";

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
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground/5 hover:bg-foreground/10 transition-colors border border-foreground/10"
      title="Copy component code"
    >
      <Icon 
        icon={loading ? "lucide:loader-2" : copied ? "lucide:check" : "lucide:copy"} 
        className={`size-3.5 ${loading ? "animate-spin" : ""}`} 
      />
      <span className="text-[11px] font-mono uppercase tracking-wider">
        {loading ? "Loading..." : copied ? "Copied" : "Copy Code"}
      </span>
    </button>
  );
}
