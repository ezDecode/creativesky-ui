"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { animate, stagger } from "animejs";
import clsx from "clsx";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

export type AdaptiveTooltipItem = {
  icon: ReactNode;
  label: string;
  shortcut?: ReactNode[];
  hasBadge?: boolean;
};

export interface AdaptiveTooltipProps {
  items: AdaptiveTooltipItem[];
  enablePinning?: boolean;
  className?: string;
}

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * AdaptiveTooltip
 *
 * An intelligent tooltip system that adapts to user intent.
 * - Intent-aware delay based on confidence
 * - Keyboard pinning support
 * - Micro-reveal animation for content
 * - Shared layout animation between tooltips
 */
export function AdaptiveTooltip({
  items,
  enablePinning = true,
  className,
}: AdaptiveTooltipProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [pinned, setPinned] = useState(false);

  const iconRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const intentTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const decayTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ---------------------------------------------------------------------- */
  /* INTENT + CONFIDENCE (INLINE, EDITABLE)                                  */
  /* ---------------------------------------------------------------------- */

  const intentDelay = 100 - confidence * 70; // tweakable

  const handleEnter = useCallback(
    (index: number) => {
      setConfidence((c) => Math.min(c + 0.3, 1));

      if (intentTimeout.current) clearTimeout(intentTimeout.current);
      intentTimeout.current = setTimeout(() => {
        setActiveIndex(index);
      }, Math.max(intentDelay, 0));

      if (decayTimeout.current) clearTimeout(decayTimeout.current);
      decayTimeout.current = setTimeout(() => setConfidence(0), 4000);
    },
    [intentDelay]
  );

  const handleLeave = useCallback(() => {
    if (intentTimeout.current) clearTimeout(intentTimeout.current);
    if (!pinned) setActiveIndex(null);
  }, [pinned]);

  /* ---------------------------------------------------------------------- */
  /* KEYBOARD PINNING                                                        */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    if (!enablePinning) return;

    const onDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.shiftKey) setPinned(true);
    };
    const onUp = () => setPinned(false);

    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);

    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, [enablePinning]);

  /* ---------------------------------------------------------------------- */
  /* CONTENT MICRO-REVEAL (ANIME.JS)                                         */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    if (!contentRef.current) return;

    const id = setTimeout(() => {
      animate(contentRef.current!.children, {
        opacity: [0, 1],
        translateY: [2, 0],
        delay: stagger(14),
        duration: 180,
        easing: "easeOutQuad",
      });
    }, 40);

    return () => clearTimeout(id);
  }, [activeIndex]);

  /* ---------------------------------------------------------------------- */

  return (
    <LayoutGroup id="adaptive-tooltip">
      <div className={clsx("relative flex gap-3", className)}>
        {items.map((item, index) => (
          <button
            key={index}
            ref={(el) => {
              iconRefs.current[index] = el;
            }}
            onMouseEnter={() => handleEnter(index)}
            onMouseLeave={handleLeave}
            className="relative grid h-10 w-10 place-items-center rounded-lg bg-neutral-900 text-neutral-100"
          >
            {item.icon}
            {item.hasBadge && (
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
            )}
          </button>
        ))}

        <AnimatePresence>
          {activeIndex !== null && (
            <motion.div
              layoutId="tooltip"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{
                type: "spring",
                stiffness: 560,
                damping: 36,
                mass: 0.35,
              }}
              style={{
                left:
                  iconRefs.current[activeIndex]
                    ? iconRefs.current[activeIndex]!.offsetLeft +
                      iconRefs.current[activeIndex]!.offsetWidth / 2
                    : 0,
              }}
              className="absolute bottom-full z-50 mb-2 -translate-x-1/2"
            >
              <motion.div
                layout
                transition={{ duration: 0.12, ease: "easeOut" }}
                className="rounded-xl bg-neutral-800 px-4 py-3 text-sm text-neutral-100 shadow-2xl"
              >
                <div ref={contentRef} className="flex flex-col gap-1">
                  <span className="tooltip-item font-medium">
                    {items[activeIndex].label}
                  </span>

                  {items[activeIndex].shortcut && (
                    <div className="tooltip-item flex gap-1 text-xs text-neutral-400">
                      {items[activeIndex].shortcut!.map((k, i) => (
                        <kbd
                          key={i}
                          className="rounded bg-neutral-700 px-1.5 py-0.5"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  )}

                  {pinned && (
                    <div className="tooltip-item pt-2 text-xs text-neutral-400">
                      Pinned via keyboard intent
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
}
