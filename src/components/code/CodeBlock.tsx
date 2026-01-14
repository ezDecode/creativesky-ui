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
  className?: string;
}

export function CodeBlock({
  code,
  language = "tsx",
  filename,
  showBorder = false,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);
  const codeRef = React.useRef<HTMLElement>(null);

  // Prism runs ONLY after hydration
  React.useEffect(() => {
    if (!codeRef.current) return;
    Prism.highlightElement(codeRef.current);
  }, [code, language]);

  const copyToClipboard = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Fallback for non-secure contexts or unsupported browsers
        const textArea = document.createElement("textarea");
        textArea.value = code;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand("copy");
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error("Fallback: Oops, unable to copy", err);
        }
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl group border border-border/10 bg-zinc-950 dark:bg-zinc-900 shadow-sm ring-1 ring-border/5",
        className
      )}
    >
      {/* Code viewport */}
      <div className="relative max-h-[520px] overflow-auto code-scrollbar">
        <Button
          size="icon"
          variant="ghost"
          onClick={copyToClipboard}
          className="absolute right-4 top-4 z-20 h-8 w-8 text-muted-foreground/50 hover:bg-foreground/10 hover:text-foreground opacity-0 group-hover:opacity-100 transition-all duration-200"
        >
          {copied ? (
            <Icon icon="solar:check-circle-linear" className="h-4 w-4 text-green-500" />
          ) : (
            <Icon icon="solar:copy-linear" className="h-4 w-4" />
          )}
          <span className="sr-only">Copy code</span>
        </Button>

        {filename && (
          <div className="absolute left-4 top-3 z-20">
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/40">
              {filename}
            </span>
          </div>
        )}

        <pre
          // These attributes MUST exist on first render
          tabIndex={0}
          className={cn(
            "p-5 text-[12px] font-mono leading-relaxed",
            `language-${language}`,
            filename && "pt-10"
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
