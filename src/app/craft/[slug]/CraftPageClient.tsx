"use client";

import * as React from "react";
import { CodePanelProvider, useCodePanel } from "@/components/craft/CodePanelContext";
import { CodePanel } from "@/components/craft/CodePanel";
import { AnimatePresence } from "framer-motion";

interface CraftPageClientProps {
    slug: string;
    children: React.ReactNode;
}

function CodePanelColumn({ slug }: { slug: string }) {
    const { showCode, setShowCode } = useCodePanel();

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && showCode) {
                setShowCode(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [showCode, setShowCode]);

    return (
        <AnimatePresence>
            {showCode && (
                <div className="relative lg:order-1">
                    {/* Same structure as the preview column */}
                    <div className="sticky top-0 h-dvh lg:h-screen p-2">
                        <CodePanel componentName={slug} />
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
}

export function CraftPageClient({ slug, children }: CraftPageClientProps) {
    return (
        <CodePanelProvider>
            {children}
            {/* Code Panel - positioned fixed over the docs section */}
            <CodePanelColumn slug={slug} />
        </CodePanelProvider>
    );
}
