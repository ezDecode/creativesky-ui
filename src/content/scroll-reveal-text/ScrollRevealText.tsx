'use client';

import { useRef, useMemo, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";

// ===========================================================================
// TYPES
// ===========================================================================

export interface ScrollRevealTextProps {
    /** The text content to be revealed word by word (required) */
    phrase: string;
    /** Optional heading displayed above the text */
    title?: string;
    /** Words to highlight with primary color */
    highlightWords?: string[];
    /** Hex color for highlighted words (e.g., "#ff6b00") */
    primaryColor?: string;
    /** Animation configuration overrides */
    config?: AnimationConfig;
    /** Optional ref to the scrollable container (useful for previews) */
    scrollContainerRef?: React.RefObject<HTMLDivElement>;
}

export interface AnimationConfig {
    /** How many words ahead show animated boxes */
    leadCount?: number;
    /** Scroll distance per word in pixels */
    scrollDistance?: number;
    /** Framer Motion spring stiffness */
    springStiffness?: number;
    /** Framer Motion spring damping */
    springDamping?: number;
}

interface AnimatedWordProps {
    word: string;
    index: number;
    totalWords: number;
    scrollProgress: MotionValue<number>;
    isHighlighted: boolean;
    primaryColor: string;
    leadCount: number;
}

// ===========================================================================
// CONFIGURATION - Optimized for smooth, lightweight scrolling
// ===========================================================================

const ANIMATION_CONFIG = {
    leadCount: { desktop: 15, mobile: 10 },
    scrollDistance: { desktop: 60, mobile: 40 },
    paddingDuration: 2,
    // Optimized spring: smoother with less bounce
    spring: {
        stiffness: 60,      // Lower for smoother transitions
        damping: 35,        // Higher for less oscillation/bounce
        restDelta: 0.01     // Less precise = fewer updates = better performance
    },
    phases: {
        emergence: { start: 0, end: 0.15 },
        focus: { start: 0.15, end: 0.60 },
        reveal: { start: 0.60, end: 1.0 }
    }
} as const;

// ===========================================================================
// UTILITIES
// ===========================================================================

/**
 * Converts hex color to RGB string for use in rgba()
 */
const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return "255, 107, 0";
    return [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ].join(", ");
};

/**
 * Checks if a word should be highlighted (case-insensitive, handles punctuation)
 */
const isWordHighlighted = (word: string, highlightWords: string[]): boolean => {
    if (!highlightWords?.length) return false;
    return highlightWords.some(hw =>
        word.toLowerCase().includes(hw.toLowerCase())
    );
};

// ===========================================================================
// ANIMATED WORD COMPONENT - Simplified, no shadows/glows
// ===========================================================================

function AnimatedWord({
    word,
    index,
    totalWords,
    scrollProgress,
    isHighlighted,
    primaryColor,
    leadCount,
}: AnimatedWordProps) {
    const rgb = hexToRgb(primaryColor);
    const { phases } = ANIMATION_CONFIG;

    // Calculate this word's animation window within the total scroll
    const wordWindowSize = 1 / (totalWords + leadCount);
    const wordStart = index * wordWindowSize;
    const wordEnd = (index + leadCount + 1) * wordWindowSize;

    // Phase boundaries within this word's window
    const phaseToScroll = (phase: number) => wordStart + (wordEnd - wordStart) * phase;

    // Box opacity: 0 → 0.4 → 1 → 0 (clean fade)
    const boxOpacity = useTransform(
        scrollProgress,
        [
            phaseToScroll(phases.emergence.start),
            phaseToScroll(phases.emergence.end),
            phaseToScroll(phases.focus.end),
            phaseToScroll(phases.reveal.end)
        ],
        [0, 0.4, 1, 0]
    );

    // Box scale: 0.95 → 1 → 1.02 (subtle, smooth)
    const boxScale = useTransform(
        scrollProgress,
        [
            phaseToScroll(phases.emergence.start),
            phaseToScroll(phases.focus.start),
            phaseToScroll(phases.reveal.end)
        ],
        [0.95, 1, 1.02]
    );


    // Box background opacity - simple fade
    const bgOpacity = useTransform(
        scrollProgress,
        [
            phaseToScroll(phases.emergence.start),
            phaseToScroll(phases.focus.start),
            phaseToScroll(phases.focus.end)
        ],
        [0.05, 0.2, isHighlighted ? 0.35 : 0.25]
    );

    // Text opacity: 0 → 1 (during reveal phase)
    const textOpacity = useTransform(
        scrollProgress,
        [phaseToScroll(phases.reveal.start), phaseToScroll(phases.reveal.end)],
        [0, 1]
    );

    // Text Y movement - subtle rise
    const textY = useTransform(
        scrollProgress,
        [phaseToScroll(phases.reveal.start), phaseToScroll(phases.reveal.end)],
        [3, 0]
    );

    return (
        <span
            className="relative inline-block align-middle"
            style={{
                margin: '0 0.12em',
                fontFamily: 'var(--font-poly, sans-serif)',
            }}
        >
            {/* Text element - NO text shadow */}
            <motion.span
                className="relative z-[2] whitespace-nowrap"
                style={{
                    opacity: textOpacity,
                    y: textY,
                    color: isHighlighted ? primaryColor : undefined,
                    transition: 'color 0.3s ease'
                }}
            >
                {word}
            </motion.span>

            {/* Glassmorphic pill - NO shadow, NO glow */}
            <motion.span
                aria-hidden="true"
                className="absolute z-[1] left-1/2 top-1/2 pointer-events-none rounded-full"
                style={{
                    width: '102%',
                    height: '70%',
                    x: "-50%",
                    y: "-50%",
                    opacity: boxOpacity,
                    scale: boxScale,
                    backgroundColor: useTransform(
                        bgOpacity,
                        (v) => isHighlighted
                            ? `rgba(${rgb}, ${v})`
                            : `rgba(255, 255, 255, ${v})`
                    ),
                    border: isHighlighted
                        ? `1px solid rgba(${rgb}, 0.2)`
                        : '1px solid rgba(255, 255, 255, 0.08)',
                }}
            />
        </span>
    );
}

// ===========================================================================
// MAIN COMPONENT - Lightweight, smooth scrolling
// ===========================================================================

/**
 * ScrollRevealTextFramer Component
 * 
 * A scroll-locked text reveal animation powered by Framer Motion.
 * Optimized for smooth, lightweight scrolling performance.
 * 
 * @example
 * ```tsx
 * <ScrollRevealTextFramer 
 *   phrase="Your text here" 
 *   highlightWords={["text"]}
 *   primaryColor="#00ff88"
 * />
 * ```
 */
export function ScrollRevealTextFramer({
    phrase = "",
    highlightWords = [],
    title = "",
    primaryColor = "#ff6b00",
    config = {},
    scrollContainerRef
}: ScrollRevealTextProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const words = useMemo(() => phrase.split(" "), [phrase]);

    // Detect mobile for responsive adjustments
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 800);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Merge config with defaults
    const leadCount = config.leadCount ?? (isMobile
        ? ANIMATION_CONFIG.leadCount.mobile
        : ANIMATION_CONFIG.leadCount.desktop);

    const scrollDistance = config.scrollDistance ?? (isMobile
        ? ANIMATION_CONFIG.scrollDistance.mobile
        : ANIMATION_CONFIG.scrollDistance.desktop);

    // Optimized spring config
    const springConfig = {
        stiffness: config.springStiffness ?? ANIMATION_CONFIG.spring.stiffness,
        damping: config.springDamping ?? ANIMATION_CONFIG.spring.damping,
        restDelta: ANIMATION_CONFIG.spring.restDelta
    };

    // Total scroll distance for the animation
    const totalScrollDistance = (words.length + leadCount) * scrollDistance +
        (ANIMATION_CONFIG.paddingDuration * scrollDistance);

    // Track scroll progress
    const { scrollYProgress } = useScroll({
        target: containerRef,
        container: (scrollContainerRef && scrollContainerRef.current) ? scrollContainerRef : undefined,
        offset: ["start start", "end end"]
    });

    // Single spring for all words - more efficient
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: springConfig.stiffness,
        damping: springConfig.damping,
        restDelta: springConfig.restDelta,
    });

    // Get container height for sticky element sizing
    const [containerHeight, setContainerHeight] = useState("100vh");

    useEffect(() => {
        if (scrollContainerRef?.current) {
            const updateHeight = () => {
                const height = scrollContainerRef.current?.clientHeight || window.innerHeight;
                setContainerHeight(`${height}px`);
            };
            updateHeight();
            window.addEventListener('resize', updateHeight);
            return () => window.removeEventListener('resize', updateHeight);
        }
    }, [scrollContainerRef]);

    return (
        <div
            ref={containerRef}
            className="w-full relative"
            style={{
                height: `calc(${totalScrollDistance}px + ${containerHeight})`,
                color: 'var(--color-text, #fff)'
            }}
        >
            {/* Sticky inner container - pins content while scrolling */}
            <div
                className="w-full flex items-center justify-center sticky top-0 z-[1]"
                style={{
                    height: containerHeight,
                }}
            >
                {/* Content wrapper with responsive sizing */}
                <div
                    className="w-full mx-auto"
                    style={{
                        maxWidth: isMobile ? '100%' : '680px',
                        padding: isMobile ? '0 1rem' : '0 2rem',
                        overflowWrap: 'break-word',
                        boxSizing: 'border-box'
                    }}
                >
                    {/* Title */}
                    {title && (
                        <h1
                            className="font-bold leading-[1.15]"
                            style={{
                                fontSize: isMobile
                                    ? 'clamp(1.5rem, 8vw, 2.25rem)'
                                    : 'clamp(2.5rem, 5vw, 5rem)',
                                marginBottom: isMobile ? '1.25rem' : '2rem',
                                letterSpacing: '-0.03em',
                            }}
                        >
                            {title}
                        </h1>
                    )}

                    {/* Body text container */}
                    <div
                        className="flex flex-wrap max-w-full"
                        style={{
                            fontSize: isMobile
                                ? 'clamp(1.08rem, 4.8vw, 1.32rem)'
                                : 'clamp(1.44rem, 2.64vw, 2.22rem)',
                            fontWeight: 600,
                            lineHeight: isMobile ? 1.75 : 1.42,
                            rowGap: isMobile ? '0.3em' : '0.18em',
                            wordSpacing: isMobile ? '0.06em' : '0.025em'
                        }}
                    >
                        {words.map((word, index) => (
                            <AnimatedWord
                                key={index}
                                word={word}
                                index={index}
                                totalWords={words.length}
                                scrollProgress={smoothProgress}
                                isHighlighted={isWordHighlighted(word, highlightWords)}
                                primaryColor={primaryColor}
                                leadCount={leadCount}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ScrollRevealTextFramer;
