"use client";

import * as React from "react";
import { Icon } from "@iconify/react";
import Prism from "prismjs";

import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-bash";

import "./prism-theme.css";
import "./code-scrollbar.css";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: "js" | "jsx" | "ts" | "tsx" | "bash";
  filename?: string;
  showBorder?: boolean;
}

export function CodeBlock({
  code,
  language = "tsx",
  filename,
  showBorder = false,
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);
  const codeRef = React.useRef<HTMLElement>(null);

  // Prism runs ONLY after hydration
  React.useEffect(() => {
    if (!codeRef.current) return;
    Prism.highlightElement(codeRef.current);
  }, [code, language]);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-muted/10",
        showBorder && "border"
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center justify-between bg-muted/20 px-4 py-2",
          showBorder && "border-b border-border/50"
        )}
      >
        <span className="text-[11px] font-medium text-muted-foreground">
          {filename ?? language.toUpperCase()}
        </span>

        <Button
          size="icon"
          variant="ghost"
          onClick={copyToClipboard}
          className="h-7 w-7 text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
        >
          {copied ? (
            <Icon icon="solar:check-circle-linear" className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <Icon icon="solar:copy-linear" className="h-3.5 w-3.5" />
          )}
          <span className="sr-only">Copy code</span>
        </Button>
      </div>

      {/* Code viewport */}
      <div className="relative max-h-[520px] overflow-auto code-scrollbar">
        <pre
          // These attributes MUST exist on first render
          tabIndex={0}
          className={cn(
            "p-5 text-[12px] font-mono leading-relaxed",
            `language-${language}`
          )}
        >
          <code
            ref={codeRef}
            className={`language-${language}`}
          >
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
}
