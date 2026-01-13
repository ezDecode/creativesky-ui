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
}

export function CraftNavDrawer({ components, trigger }: CraftNavDrawerProps) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = React.useState(false);
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
            <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
                {trigger || (
                    <button className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/10 bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
                        <Icon icon="lucide:layout-grid" className="w-4 h-4" />
                        <span className="text-sm font-medium">Explore Components</span>
                    </button>
                )}
            </div>

            {/* Expanded Menu */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop - subtle blur only */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 bg-background/20 backdrop-blur-[2px] lg:hidden"
                            onClick={() => setIsOpen(false)}
                        />

                        <motion.div
                            initial={{ 
                                opacity: 0, 
                                scale: 0.8, 
                                y: -10,
                                transformOrigin: "top left" 
                            }}
                            animate={{ 
                                opacity: 1, 
                                scale: 1, 
                                y: 4,
                            }}
                            exit={{ 
                                opacity: 0, 
                                scale: 0.9, 
                                y: -10,
                                transition: { duration: 0.15 }
                            }}
                            transition={{ 
                                type: "spring", 
                                damping: 15, // Lower damping for more "rubber" bounce
                                stiffness: 200, 
                                mass: 0.8
                            }}
                            className="absolute left-0 top-full z-50 w-72 max-h-[70vh] bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col origin-top-left"
                        >
                            <div className="p-4 border-b border-border/10 flex items-center justify-between bg-muted/30">
                                <div>
                                    <h3 className="text-sm font-semibold">Craft Library</h3>
                                    <p className="text-[10px] text-muted-foreground">
                                        {components.length} components
                                    </p>
                                </div>
                                <button 
                                    onClick={() => setIsOpen(false)}
                                    className="p-1.5 rounded-full hover:bg-muted transition-colors"
                                >
                                    <Icon icon="lucide:x" className="w-4 h-4 text-muted-foreground" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-2 scrollbar-none">
                                <motion.div 
                                    initial="hidden"
                                    animate="show"
                                    variants={{
                                        hidden: { opacity: 0 },
                                        show: {
                                            opacity: 1,
                                            transition: {
                                                staggerChildren: 0.03
                                            }
                                        }
                                    }}
                                    className="flex flex-col gap-0.5"
                                >
                                    <motion.div variants={{ hidden: { opacity: 0, x: -5 }, show: { opacity: 1, x: 0 } }}>
                                        <Link
                                            href="/craft"
                                            className={cn(
                                                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group",
                                                pathname === "/craft"
                                                    ? "bg-primary text-primary-foreground"
                                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                            )}
                                        >
                                            <Icon 
                                                icon="lucide:home" 
                                                className={cn("w-4 h-4", pathname === "/craft" ? "text-primary-foreground" : "text-muted-foreground")} 
                                            />
                                            Introduction
                                        </Link>
                                    </motion.div>

                                    <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} className="px-3 pt-3 pb-1">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">Components</span>
                                    </motion.div>

                                    {sortedComponents.map((component) => {
                                        const isActive = pathname === `/craft/${component.id}`;
                                        return (
                                            <motion.div 
                                                key={component.id}
                                                variants={{ 
                                                    hidden: { opacity: 0, x: -5 }, 
                                                    show: { opacity: 1, x: 0 } 
                                                }}
                                            >
                                                <Link
                                                    href={`/craft/${component.id}`}
                                                    className={cn(
                                                        "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all group",
                                                        isActive
                                                            ? "bg-foreground text-background"
                                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {component.title}
                                                    </div>
                                                    {isActive && (
                                                        <Icon icon="lucide:check" className="w-3 h-3 opacity-50" />
                                                    )}
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
