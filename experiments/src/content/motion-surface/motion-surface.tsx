"use client";

import { motion } from "framer-motion";
import {
  Children,
  cloneElement,
  isValidElement,
  useId,
  useState,
  type ReactNode,
} from "react";

type SharedLayoutChildProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
};

function isSharedLayoutChild(
  child: React.ReactNode
): child is React.ReactElement<SharedLayoutChildProps> {
  return isValidElement(child);
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export interface MotionSurfaceProps {
  children: ReactNode;
  activeIndex?: number | null;
  enableHover?: boolean;
  activeClassName?: string;
  hoverClassName?: string;
}

/**
 * MotionSurface
 *
 * A shared layout animation container for list items.
 * - Animates a background indicator between items
 * - Supports hover and explicit active states
 * - Uses Framer Motion's layoutId for smooth transitions
 */
export function MotionSurface({
  children,
  activeIndex = null,
  enableHover = true,
  activeClassName = "bg-muted",
  hoverClassName = "bg-muted/60",
}: MotionSurfaceProps) {
  const uniqueId = useId();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  return (
    <div className="relative flex w-full flex-col">
      {Children.toArray(children)
        .filter(isSharedLayoutChild)
        .map((child, index) => {
          const isActive = activeIndex === index || hoverIndex === index;
          const isExplicitlyActive = activeIndex === index;

          return cloneElement(
            child,
            {
              key: index,
              className: cn("relative", child.props.className),
              onMouseEnter: enableHover
                ? (e) => {
                    setHoverIndex(index);
                    child.props.onMouseEnter?.(e);
                  }
                : child.props.onMouseEnter,
              onMouseLeave: enableHover
                ? (e) => {
                    setHoverIndex((h) => (h === index ? null : h));
                    child.props.onMouseLeave?.(e);
                  }
                : child.props.onMouseLeave,
              onFocus: enableHover
                ? (e) => {
                    setHoverIndex(index);
                    child.props.onFocus?.(e);
                  }
                : child.props.onFocus,
              onBlur: enableHover
                ? (e) => {
                    setHoverIndex((h) => (h === index ? null : h));
                    child.props.onBlur?.(e);
                  }
                : child.props.onBlur,
            },
            <>
              {isActive && (
                <motion.div
                  layoutId={`background-${uniqueId}`}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 28,
                  }}
                  className={cn(
                    "absolute inset-y-0 -left-3 -right-3 w-auto h-full rounded-lg pointer-events-none z-0",
                    isExplicitlyActive ? activeClassName : hoverClassName
                  )}
                />
              )}
              <div className="relative z-10">{child.props.children}</div>
            </>
          );
        })}
    </div>
  );
}
