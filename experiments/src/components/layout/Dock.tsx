"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { animate } from "animejs";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { useMounted } from "@/hooks/use-mounted";

const NAV_ITEMS = [
  { title: "Home", href: "/", iconSrc: "/dockIcons/home.svg" },
  { title: "Vault", href: "/vault", iconSrc: "/dockIcons/Vault.svg" },
  { title: "Component", href: "/lab", iconSrc: "/dockIcons/Code.svg" },
];

const MENTION_ACTIONS = [
  {
    label: "Write Something",
    href: "mailto:ezdecode@gmail.com",
    icon: "/dockIcons/Mail.svg",
  },
  {
    label: "Share",
    href: "https://linkedin.com",
    icon: "/dockIcons/share.svg",
    external: true,
  },
];

export function Dock() {
  const pathname = usePathname();
  const mounted = useMounted();

  const popupRef = React.useRef<HTMLDivElement | null>(null);

  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const [mentionOpen, setMentionOpen] = React.useState(false);

  // Sync active index with route
  React.useEffect(() => {
    const idx = NAV_ITEMS.findIndex(
      (item) =>
        pathname === item.href ||
        (item.href !== "/" && pathname.startsWith(item.href))
    );
    if (idx !== -1) setActiveIndex(idx);
  }, [pathname]);

  // OPEN popup animation
  React.useEffect(() => {
    if (!mentionOpen || !popupRef.current) return;

    const el = popupRef.current;

    el.style.opacity = "0";
    el.style.transform = "translateY(12px) scale(0.96)";

    animate(el, {
      opacity: [0, 1],
      translateY: [12, 0],
      scale: [0.96, 1],
      duration: 280,
      easing: "cubicBezier(0.22, 1, 0.36, 1)",
    });
  }, [mentionOpen]);

  const closePopup = () => {
    if (!popupRef.current) return;

    const el = popupRef.current;

    animate(el, {
      opacity: [1, 0],
      translateY: [0, 10],
      scale: [1, 0.97],
      duration: 200,
      easing: "easeInOutQuad",
      complete: () => setMentionOpen(false),
    });
  };

  if (!mounted) return null;

  return (
    <div className="fixed bottom-10 inset-x-0 z-50 flex justify-center">
      <div className="relative">
        {/* MAIN DOCK */}
        <div
          className="relative flex items-center px-2 py-1.5 rounded-2xl bg-white/5 dark:bg-black/6 border border-black/5 dark:border-white/10 backdrop-blur-[12px] transition-colors duration-200 ease-out"
          style={{ WebkitBackdropFilter: "blur(12px)" }}
        >
          
          {/* ACTIVE BACKGROUND (SPRING) */}
          {activeIndex !== null && (
            <motion.div
              className="absolute top-1.5 bottom-1.5 w-12 rounded-xl bg-black/10 dark:bg-white/10"
              animate={{ x: activeIndex * 48 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 35,
              }}
            />
          )}

          {/* NAV ITEMS */}
          {NAV_ITEMS.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => {
                setActiveIndex(index);
                setMentionOpen(false);
              }}
              className="relative z-10 flex h-12 w-12 items-center justify-center rounded-xl"
            >
              <img
                src={item.iconSrc}
                alt=""
                className={cn(
                  "w-7 h-7 opacity-80 transition-opacity dark:brightness-0 dark:invert",
                  activeIndex === index && "opacity-100"
                )}
              />
            </Link>
          ))}

          {/* MENTION BUTTON */}
          <div className="relative">
            <button
              onClick={() =>
                mentionOpen ? closePopup() : setMentionOpen(true)
              }
              className="relative z-10 flex h-12 w-12 items-center justify-center rounded-xl"
            >
              <img
                src="/dockIcons/Mention.svg"
                alt="Mention"
                className="w-7 h-7 opacity-80 dark:brightness-0 dark:invert"
              />
            </button>

            {mentionOpen && (
              <div
                ref={popupRef}
                className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 will-change-transform"
              >
                <div className="flex items-center gap-1 rounded-2xl bg-neutral-800 p-1">
                  {MENTION_ACTIONS.map((action) => (
                    <Link
                      key={action.label}
                      href={action.href}
                      target={action.external ? "_blank" : undefined}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-white bg-black/20 hover:bg-black/10 whitespace-nowrap"
                    >
                      <span className="flex h-4 w-4 items-center justify-center">
                        <img
                          src={action.icon}
                          alt={action.label}
                          className="h-4 w-4 brightness-0 invert"
                        />
                      </span>

                      <span className="leading-none translate-y-[0.5px]">
                        {action.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
