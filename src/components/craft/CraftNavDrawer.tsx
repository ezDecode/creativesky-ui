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
    DrawerTrigger
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { RegistryComponent } from "@/lib/types";

interface CraftNavDrawerProps {
    components: RegistryComponent[];
}

export function CraftNavDrawer({ components }: CraftNavDrawerProps) {
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
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <button
                    className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-border/10 bg-foreground text-background shadow-2xl transition-transform hover:scale-105 active:scale-95"
                    aria-label="Open components menu"
                >
                    <MenuIcon />
                </button>
            </DrawerTrigger>

            <DrawerContent>
                <DrawerHeader className="border-b border-border/10 pb-4">
                    <DrawerTitle>Components</DrawerTitle>
                    <DrawerDescription>
                        Navigate through the craft examples.
                    </DrawerDescription>
                </DrawerHeader>

                <nav className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-6">
                        <NavSection title="Getting started">
                            <NavItem
                                href="/craft"
                                label="Introduction"
                                active={pathname === "/craft"}
                            />
                        </NavSection>

                        <NavSection title="Components">
                            <ul className="space-y-1">
                                {sortedComponents.map((component) => (
                                    <li key={component.id}>
                                        <NavItem
                                            href={`/craft/${component.id}`}
                                            label={component.title}
                                            active={pathname === `/craft/${component.id}`}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </NavSection>
                    </div>
                </nav>
            </DrawerContent>
        </Drawer>
    );
}

function NavSection({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                {title}
            </h3>
            {children}
        </section>
    );
}

function NavItem({
    href,
    label,
    active,
}: {
    href: string;
    label: string;
    active: boolean;
}) {
    return (
        <Link
            href={href}
            className={cn(
                "block rounded-md px-3 py-2 text-sm font-medium transition-all",
                active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
        >
            {label}
        </Link>
    );
}

function MenuIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
    );
}
