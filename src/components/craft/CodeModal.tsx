"use client";

import * as React from "react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { CodeBlock } from "@/components/code/CodeBlock";
import { cn } from "@/lib/utils";

interface CodeModalProps {
    open: boolean;
    onClose: () => void;
    componentName: string;
    className?: string;
}

function toPascalCase(str: string): string {
    return str
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join("");
}

export function CodeModal({ open, onClose, componentName, className }: CodeModalProps) {
    const [activeTab, setActiveTab] = React.useState<"demo" | "component">("demo");
    const [demoCode, setDemoCode] = React.useState<string | null>(null);
    const [componentCode, setComponentCode] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    // Fetch code when modal opens
    React.useEffect(() => {
        if (!open || !componentName) return;

        const fetchCode = async () => {
            setLoading(true);
            setError(null);

            try {
                // Fetch both demo and component code in parallel
                const [demoRes, componentRes] = await Promise.all([
                    fetch(`/api/source?type=demo&name=${componentName}`),
                    fetch(`/api/source?type=component&name=${componentName}`),
                ]);

                if (demoRes.ok) {
                    const demoData = await demoRes.json();
                    setDemoCode(demoData.code);
                }

                if (componentRes.ok) {
                    const componentData = await componentRes.json();
                    setComponentCode(componentData.code);
                }

                if (!demoRes.ok && !componentRes.ok) {
                    throw new Error("Failed to fetch source code");
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error");
            } finally {
                setLoading(false);
            }
        };

        fetchCode();
    }, [open, componentName]);

    // Close on escape key
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && open) {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [open, onClose]);

    // Prevent body scroll when modal is open
    React.useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    const currentCode = activeTab === "demo" ? demoCode : componentCode;
    const currentFilename = activeTab === "demo"
        ? `${toPascalCase(componentName)}Demo.tsx`
        : `${toPascalCase(componentName)}.tsx`;

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-xl"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className={cn(
                            "fixed z-[101] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
                            "w-[95vw] max-w-4xl h-[85vh] max-h-[800px]",
                            "bg-zinc-900 rounded-2xl border border-border/20 shadow-2xl",
                            "flex flex-col overflow-hidden",
                            className
                        )}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border/10">
                            <div className="flex items-center gap-4">
                                <h2 className="text-lg font-medium text-foreground">Source Code</h2>

                                {/* Tabs */}
                                <div className="flex items-center gap-1 bg-muted/30 rounded-xl p-1">
                                    <button
                                        onClick={() => setActiveTab("demo")}
                                        className={cn(
                                            "px-4 py-1.5 text-sm font-medium rounded-lg transition-all",
                                            activeTab === "demo"
                                                ? "bg-primary/20 text-primary"
                                                : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        Demo
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("component")}
                                        className={cn(
                                            "px-4 py-1.5 text-sm font-medium rounded-lg transition-all",
                                            activeTab === "component"
                                                ? "bg-primary/20 text-primary"
                                                : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        Component
                                    </button>
                                </div>
                            </div>

                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="flex items-center justify-center size-8 rounded-lg bg-muted/30 hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-all"
                            >
                                <Icon icon="lucide:x" className="size-4" />
                                <span className="sr-only">Close</span>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-auto p-4">
                            {loading ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="flex items-center gap-3 text-muted-foreground">
                                        <div className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                        <span>Loading source code...</span>
                                    </div>
                                </div>
                            ) : error ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="flex flex-col items-center gap-3 text-center">
                                        <div className="p-3 rounded-full bg-red-500/10 text-red-500">
                                            <Icon icon="solar:danger-triangle-bold" className="size-6" />
                                        </div>
                                        <p className="text-muted-foreground">{error}</p>
                                    </div>
                                </div>
                            ) : currentCode ? (
                                <CodeBlock
                                    code={currentCode}
                                    language="tsx"
                                    filename={currentFilename}
                                    className="h-full"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <p className="text-muted-foreground">
                                        No {activeTab} code available for this component.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between px-6 py-3 border-t border-border/10 bg-muted/20">
                            <p className="text-xs text-muted-foreground">
                                <Icon icon="lucide:info" className="inline size-3 mr-1" />
                                Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">ESC</kbd> to close
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {componentName}
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
