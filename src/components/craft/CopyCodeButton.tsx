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
        try {
          if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(data.code);
          } else {
            const textArea = document.createElement("textarea");
            textArea.value = data.code;
            textArea.style.position = "fixed";
            textArea.style.left = "-9999px";
            textArea.style.top = "0";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            textArea.remove();
          }
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error("Clipboard copy failed:", err);
        }
      }
    } catch (err) {
      console.error("Failed to copy code:", err);
    } finally {
      setLoading(false);
    }
  };

  const fileName = `${name}.framer.tsx`;

  return (
    <button
      onClick={handleCopy}
      disabled={loading}
      className={cn(
        "group flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-foreground/[0.03] hover:bg-foreground/[0.06] transition-all border border-foreground/[0.08] active:scale-95",
        copied && "border-green-500/50 bg-green-500/5"
      )}
      title="Copy component code"
    >
      <div className="flex items-center gap-2">
        <Icon 
          icon="lucide:file-code" 
          className="size-3.5 text-foreground/40 group-hover:text-foreground/60 transition-colors" 
        />
        <span className="text-[11px] font-mono text-foreground/60 group-hover:text-foreground/80 transition-colors">
          {fileName}
        </span>
      </div>
      
      <div className="w-px h-3 bg-foreground/10" />
      
      <div className="flex items-center gap-1.5">
        <Icon 
          icon={loading ? "lucide:loader-2" : copied ? "lucide:check" : "lucide:copy"} 
          className={cn(
            "size-3.5 text-foreground/40 group-hover:text-foreground/60 transition-colors",
            loading && "animate-spin",
            copied && "text-green-500"
          )} 
        />
        <span className={cn(
          "text-[11px] font-medium uppercase tracking-wider text-foreground/50 group-hover:text-foreground/70 transition-colors",
          copied && "text-green-500"
        )}>
          {loading ? "..." : copied ? "Copied" : "Copy"}
        </span>
      </div>
    </button>
  );
}
