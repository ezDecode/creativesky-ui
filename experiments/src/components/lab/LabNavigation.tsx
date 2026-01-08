"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Drawer } from "vaul";
import { cn } from "@/lib/utils";
import { RegistryComponent } from "@/lib/types";
import { useMounted } from "@/hooks/use-mounted";

interface LabNavigationProps {
  components: RegistryComponent[];
  mobileOnly?: boolean;
}

export function LabNavigation({ components, mobileOnly }: LabNavigationProps) {
  /* ───────────── Hooks ───────────── */
  const pathname = usePathname();
  const mounted = useMounted();
  const [open, setOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  const sortedComponents = React.useMemo(
    () => [...components].sort((a, b) => a.title.localeCompare(b.title)),
    [components]
  );

  // Detect mobile vs desktop on mount and resize
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close drawer when route changes (after navigation)
  React.useEffect(() => {
    if (open) {
      setOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!mounted) return null;

  // Mobile-only mode: render mobile trigger and responsive drawer
  if (mobileOnly) {
    return (
      <div className="sticky top-0 z-30 border-b border-border mb-6 bg-background">
        <Drawer.Root 
          open={open} 
          onOpenChange={setOpen} 
          direction={isMobile ? "bottom" : "right"}
          modal={true}
        >
          <Drawer.Trigger asChild>
            <button className="flex w-full items-center gap-3 h-12 px-4 text-sm font-medium text-foreground">
              <HamburgerIcon />
              Components
            </button>
          </Drawer.Trigger>

          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 z-40 bg-black/40" />
            
            <Drawer.Content
              className={cn(
                "fixed z-50 flex flex-col bg-background outline-none",
                // Mobile: Bottom drawer
                isMobile && "bottom-0 left-0 right-0 rounded-t-[16px] border-t border-border max-h-[85vh]",
                // Desktop: Right drawer
                !isMobile && "right-2 top-2 bottom-2 w-[310px] rounded-[16px] border border-border shadow-xl"
              )}
              style={!isMobile ? { '--initial-transform': 'calc(100% + 8px)' } as React.CSSProperties : undefined}
            >
              {/* Mobile handle */}
              {isMobile && (
                <div className="flex justify-center py-4">
                  <div className="w-12 h-1.5 flex-shrink-0 rounded-full bg-muted" aria-hidden="true" />
                </div>
              )}
              
              {/* Desktop header */}
              {!isMobile && (
                <div className="p-6 border-b border-border flex items-center justify-between">
                  <Drawer.Title className="text-lg font-semibold">Navigation</Drawer.Title>
                  <Drawer.Close asChild>
                    <button 
                      className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
                      aria-label="Close navigation"
                    >
                      <CloseIcon />
                    </button>
                  </Drawer.Close>
                </div>
              )}
              
              {/* Accessibility title for mobile (sr-only) */}
              {isMobile && <Drawer.Title className="sr-only">Navigation Menu</Drawer.Title>}
              
              {/* Navigation content */}
              <nav 
                className={cn(
                  "overflow-y-auto overscroll-contain flex-1",
                  isMobile ? "px-4 pb-20 space-y-8" : "px-6 py-4 space-y-8"
                )}
              >
                <NavContent
                  pathname={pathname}
                  components={sortedComponents}
                />
                {/* Bottom safe area spacing for mobile */}
                {isMobile && <div className="h-8" aria-hidden="true" />}
              </nav>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </div>
    );
  }

  // Desktop mode: render sidebar navigation (used in Shell leftRail)
  return (
    <nav className="sticky top-24 space-y-8">
      <NavContent
        pathname={pathname}
        components={sortedComponents}
      />
    </nav>
  );
}

/* ───────────────── Shared Content ───────────────── */

function NavContent({
  pathname,
  components,
}: {
  pathname: string;
  components: RegistryComponent[];
}) {
  return (
    <>
      <NavSection title="Getting started">
        <NavItem
          href="/lab"
          label="Introduction"
          active={pathname === "/lab"}
        />
      </NavSection>

      <NavSection title="Components">
        <ul className="space-y-0.5">
          {components.map((component) => (
            <li key={component.id}>
              <NavItem
                href={`/lab/${component.id}`}
                label={component.title}
                active={pathname === `/lab/${component.id}`}
              />
            </li>
          ))}
        </ul>
      </NavSection>
    </>
  );
}

/* ───────────────── Primitives ───────────────── */

function NavSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2">
      <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
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
        "block text-sm leading-6 transition-colors",
        active
          ? "text-foreground font-medium"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {label}
    </Link>
  );
}

/* ───────────────── Icons ───────────────── */

function HamburgerIcon() {
  return (
    <svg width="14" height="10" viewBox="0 0 18 12" fill="none" aria-hidden="true">
      <path d="M17 1H1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M17 6H1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M17 11H1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path 
        d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" 
        fill="currentColor" 
        fillRule="evenodd" 
        clipRule="evenodd"
      />
    </svg>
  );
}
