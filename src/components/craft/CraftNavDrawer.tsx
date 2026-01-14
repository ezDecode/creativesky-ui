"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { RegistryComponent } from "@/lib/types";
import { Icon } from "@iconify/react";

interface CraftNavDrawerProps {
    components: RegistryComponent[];
    trigger?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function CraftNavDrawer({ components, trigger, open: externalOpen, onOpenChange }: CraftNavDrawerProps) {
    const pathname = usePathname();
    const [internalOpen, setInternalOpen] = React.useState(false);
    
    const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
    const setIsOpen = (value: boolean) => {
        if (onOpenChange) onOpenChange(value);
        setInternalOpen(value);
    };

    const containerRef = React.useRef<HTMLDivElement>(null);

    // Close on escape key
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Close on route change
    React.useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Close on click outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const sortedComponents = React.useMemo(
        () => [...components].sort((a, b) => a.title.localeCompare(b.title)),
        [components]
    );

    return (
        <div className="relative" ref={containerRef}>
            {/* Trigger Button */}
            {trigger !== null && (
                <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
                    {trigger || (
                        <button className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/10 bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
                            <Icon icon="lucide:layout-grid" className="w-4 h-4" />
                            <span className="text-sm font-medium">Explore Components</span>
                        </button>
                    )}
                </div>
            )}

            {/* Expanded Menu */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop - ultra subtle */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 bg-background/5 lg:hidden"
                            onClick={() => setIsOpen(false)}
                        />

                        <motion.div
                            initial={{ 
                                opacity: 0, 
                                scale: 0.7, 
                                y: -10,
                                transformOrigin: "top left" 
                            }}
                            animate={{ 
                                opacity: 1, 
                                scale: 1, 
                                y: 8,
                            }}
                            exit={{ 
                                opacity: 0, 
                                scale: 0.85, 
                                y: -5,
                                transition: { duration: 0.2, ease: "circIn" }
                            }}
                            transition={{ 
                                type: "spring", 
                                damping: 12, // More rubbery
                                stiffness: 220, 
                                mass: 0.7
                            }}
                            className="absolute left-0 top-full z-50 min-w-[200px] w-max max-w-[calc(100vw-2rem)] bg-background/95 backdrop-blur-2xl border border-border/40 rounded-xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.25)] dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col origin-top-left"
                        >
                            <div className="flex-1 overflow-y-auto p-2 scrollbar-none">
                                <motion.div 
                                    initial="hidden"
                                    animate="show"
                                    variants={{
                                        hidden: { opacity: 0 },
                                        show: {
                                            opacity: 1,
                                            transition: {
                                                staggerChildren: 0.04
                                            }
                                        }
                                    }}
                                    className="flex flex-col gap-0.5"
                                >

                                    {sortedComponents.map((component) => {
                                        const isActive = pathname === `/craft/${component.id}`;
                                        return (
                                            <motion.div 
                                                key={component.id}
                                                variants={{ 
                                                    hidden: { opacity: 0, x: -8, scale: 0.95 }, 
                                                    show: { opacity: 1, x: 0, scale: 1 } 
                                                }}
                                            >
                                                <Link
                                                    href={`/craft/${component.id}`}
                                                    className={cn(
                                                        "flex items-center px-3 py-2 rounded-lg text-[12px] font-medium transition-all group whitespace-nowrap",
                                                        isActive
                                                            ? "bg-foreground text-background"
                                                            : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                                                    )}
                                                >
                                                    {component.title}
                                                </Link>
                                            </motion.div>
                                        );
                                    })}
                                </motion.div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
