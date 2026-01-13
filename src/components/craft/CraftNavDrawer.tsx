"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerTrigger,
    DrawerClose
} from "@/components/ui/drawer";
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
    const [open, setOpen] = React.useState(false);

    // Close drawer on route change
    React.useEffect(() => {
        setOpen(false);
    }, [pathname]);

    const sortedComponents = React.useMemo(
        () => [...components].sort((a, b) => a.title.localeCompare(b.title)),
        [components]
    );

    return (
        <Drawer open={open} onOpenChange={setOpen} direction="bottom">
            <DrawerTrigger asChild>
                {trigger || (
                    <button
                        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-border/10 bg-foreground text-background shadow-2xl transition-transform hover:scale-105 active:scale-95"
                        aria-label="Open components menu"
                    >
                        <Icon icon="lucide:menu" className="w-6 h-6" />
                    </button>
                )}
            </DrawerTrigger>

            <DrawerContent className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-lg bg-background/80 backdrop-blur-xl border border-border/50 rounded-[2rem] shadow-2xl overflow-hidden">
                <motion.div 
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="flex flex-col h-full max-h-[70vh]"
                >
                    <DrawerHeader className="px-6 py-4 border-b border-border/10 flex items-center justify-between shrink-0">
                        <div>
                            <DrawerTitle className="text-base font-semibold">Craft Library</DrawerTitle>
                            <DrawerDescription className="text-xs">
                                {components.length} components available
                            </DrawerDescription>
                        </div>
                        <DrawerClose className="p-2 rounded-full hover:bg-muted transition-colors">
                            <Icon icon="lucide:x" className="w-4 h-4 text-muted-foreground" />
                        </DrawerClose>
                    </DrawerHeader>

                    <div className="flex-1 overflow-y-auto px-2 py-4 scrollbar-none">
                        <motion.div 
                            initial="hidden"
                            animate="show"
                            variants={{
                                hidden: { opacity: 0 },
                                show: {
                                    opacity: 1,
                                    transition: {
                                        staggerChildren: 0.05
                                    }
                                }
                            }}
                            className="grid grid-cols-1 gap-1"
                        >
                            <motion.div variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } }}>
                                <Link
                                    href="/craft"
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all group",
                                        pathname === "/craft"
                                            ? "bg-primary text-primary-foreground"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )}
                                >
                                    <Icon 
                                        icon="lucide:home" 
                                        className={cn("w-4 h-4 transition-transform group-hover:scale-110", pathname === "/craft" ? "text-primary-foreground" : "text-muted-foreground")} 
                                    />
                                    Introduction
                                </Link>
                            </motion.div>

                            <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} className="px-4 pt-4 pb-2">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">Components</span>
                            </motion.div>

                            {sortedComponents.map((component) => {
                                const isActive = pathname === `/craft/${component.id}`;
                                return (
                                    <motion.div 
                                        key={component.id}
                                        variants={{ 
                                            hidden: { opacity: 0, x: -10 }, 
                                            show: { opacity: 1, x: 0 } 
                                        }}
                                    >
                                        <Link
                                            href={`/craft/${component.id}`}
                                            className={cn(
                                                "flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-all group",
                                                isActive
                                                    ? "bg-foreground text-background"
                                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-1.5 h-1.5 rounded-full transition-all duration-300",
                                                    isActive ? "bg-background scale-110" : "bg-border group-hover:bg-muted-foreground"
                                                )} />
                                                {component.title}
                                            </div>
                                            {isActive && (
                                                <Icon icon="lucide:chevron-right" className="w-4 h-4 opacity-50" />
                                            )}
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </div>
                </motion.div>
            </DrawerContent>
        </Drawer>
    );
}
