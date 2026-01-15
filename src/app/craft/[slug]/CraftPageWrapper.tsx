"use client";

import * as React from "react";
import { CodePanel } from "@/components/craft/CodePanel";
import { AnimatePresence } from "framer-motion";

// Simple context for code panel state
const CodePanelContext = React.createContext<{
    showCode: boolean;
    toggleCode: () => void;
}>({ showCode: false, toggleCode: () => { } });

export const useCodePanel = () => React.useContext(CodePanelContext);

interface CraftPageWrapperProps {
    slug: string;
    children: React.ReactNode;
}

export function CraftPageWrapper({ slug, children }: CraftPageWrapperProps) {
    const [showCode, setShowCode] = React.useState(false);
    const toggleCode = React.useCallback(() => setShowCode(prev => !prev), []);

    // ESC to close
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && showCode) setShowCode(false);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [showCode]);

    return (
        <CodePanelContext.Provider value={{ showCode, toggleCode }}>
            {children}

            {/* Code Panel Overlay - SAME size as preview column */}
            <AnimatePresence>
                {showCode && (
                    <div className="fixed top-0 left-0 bottom-0 w-full lg:w-1/2 z-[100] p-2">
                        <CodePanel componentName={slug} />
                    </div>
                )}
            </AnimatePresence>
        </CodePanelContext.Provider>
    );
}
