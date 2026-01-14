"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

interface CopyCodeButtonProps {
  name: string;
}

export function CopyCodeButton({ name }: CopyCodeButtonProps) {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [code, setCode] = useState<string | null>(null);

  useEffect(() => {
    const fetchSource = async () => {
      try {
        const response = await fetch(`/api/source?type=component&name=${name}`);
        const data = await response.json();
        if (data.fileName) setFileName(data.fileName);
        if (data.code) setCode(data.code);
      } catch (err) {
        console.error("Failed to fetch source info:", err);
      }
    };
    fetchSource();
  }, [name]);

  const handleCopy = async () => {
    if (!code) {
      // If code isn't loaded yet, try to fetch it again
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
      return;
    }

    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      disabled={loading}
      className="group flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-foreground/[0.03] hover:bg-foreground/[0.06] transition-all border border-foreground/[0.08] active:scale-95"
      title="Copy source code"
    >
      <div className="flex items-center gap-2">
        <Icon 
          icon="lucide:file-code" 
          className="size-3.5 text-foreground/40 group-hover:text-foreground/60 transition-colors" 
        />
        <span className="text-[11px] font-mono text-foreground/60 group-hover:text-foreground/80 transition-colors">
          {fileName || "Loading..."}
        </span>
      </div>
      
      <div className="w-px h-3 bg-foreground/10" />

      <div className="flex items-center gap-1.5">
        <Icon 
          icon={loading ? "lucide:loader-2" : copied ? "lucide:check" : "lucide:copy"} 
          className={`size-3.5 ${loading ? "animate-spin" : ""} ${copied ? "text-emerald-500" : "text-foreground/40 group-hover:text-foreground/60"}`} 
        />
        <span className={`text-[11px] font-medium uppercase tracking-wider ${copied ? "text-emerald-500" : "text-foreground/50"}`}>
          {copied ? "Copied" : "Copy"}
        </span>
      </div>
    </button>
  );
}
