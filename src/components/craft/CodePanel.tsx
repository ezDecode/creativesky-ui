"use client";

import * as React from "react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Prism from "prismjs";

import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-bash";

import "@/components/code/prism-theme.css";
import "@/components/code/code-scrollbar.css";

interface CodePanelProps {
    componentName: string;
    className?: string;
}

function toPascalCase(str: string): string {
    return str
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join("");
}

export function CodePanel({ componentName, className }: CodePanelProps) {
    const [componentCode, setComponentCode] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [copied, setCopied] = React.useState(false);

    const filename = `${toPascalCase(componentName)}.tsx`;

    React.useEffect(() => {
        const fetchCode = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/source?type=component&name=${componentName}`);
                if (res.ok) {
                    const data = await res.json();
                    setComponentCode(data.code);
                } else {
                    throw new Error("Failed to fetch component code");
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error");
            } finally {
                setLoading(false);
            }
        };
        fetchCode();
    }, [componentName]);

    const handleCopy = async () => {
        if (!componentCode) return;
        try {
            await navigator.clipboard.writeText(componentCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0, transition: { type: "tween", ease: "easeIn", duration: 0.2 } }}
            exit={{ opacity: 0, y: -20, transition: { type: "tween", ease: "easeOut", duration: 0.2 } }}
            className={cn(
                "relative w-full h-full overflow-hidden bg-zinc-800 rounded-xl border border-border/10",
                className
            )}
        >
            {/* Filename + Copy at top right */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-3">
                <span className="text-sm text-muted-foreground font-mono">
                    {filename}
                </span>
                <button
                    onClick={handleCopy}
                    className={cn(
                        "flex items-center justify-center size-8 rounded-lg transition-all",
                        copied
                            ? "bg-green-500/20 text-green-400"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <Icon icon={copied ? "lucide:check" : "lucide:copy"} className="size-4" />
                </button>
            </div>

            {/* Code */}
            <div
                className="absolute inset-0 overflow-auto p-6 pt-14 scrollbar-hide"
                style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                }}
            >
                <style jsx global>{`
                    .scrollbar-hide::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="flex items-center gap-3 text-muted-foreground">
                            <div className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            <span>Loading code...</span>
                        </div>
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground">{error}</p>
                    </div>
                ) : componentCode ? (
                    <pre
                        className="p-0 m-0 text-sm font-mono leading-relaxed bg-transparent"
                        tabIndex={0}
                    >
                        <code
                            ref={(el) => {
                                if (el) Prism.highlightElement(el);
                            }}
                            className="language-tsx"
                        >
                            {componentCode}
                        </code>
                    </pre>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground">No code available.</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
