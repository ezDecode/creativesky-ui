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
    /** Words to highlight with primary color and glow */
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
    springConfig: { stiffness: number; damping: number; restDelta: number };
}

// ===========================================================================
// CONFIGURATION - Refined for smoother feel
// ===========================================================================

const ANIMATION_CONFIG = {
    leadCount: { desktop: 8, mobile: 5 },
    scrollDistance: { desktop: 150, mobile: 100 },
    paddingDuration: 2,
    // Refined spring config for buttery-smooth animations
    spring: {
        stiffness: 80,      // Lower = smoother, less snappy
        damping: 25,        // Lower = more fluid motion
        restDelta: 0.0001   // More precise rest detection
    },
    phases: {
        emergence: { start: 0, end: 0.12 },    // Slightly faster emergence
        focus: { start: 0.12, end: 0.65 },     // Extended focus phase
        reveal: { start: 0.65, end: 1.0 }      // Longer reveal for smoothness
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
// ANIMATED WORD COMPONENT - Refined with smoother transitions
// ===========================================================================

function AnimatedWord({
    word,
    index,
    totalWords,
    scrollProgress,
    isHighlighted,
    primaryColor,
    leadCount,
    springConfig,
}: AnimatedWordProps) {
    const rgb = hexToRgb(primaryColor);
    const { phases } = ANIMATION_CONFIG;

    // Calculate this word's animation window within the total scroll
    const wordWindowSize = 1 / (totalWords + leadCount);
    const wordStart = index * wordWindowSize;
    const wordEnd = (index + leadCount + 1) * wordWindowSize;

    // Phase boundaries within this word's window
    const phaseToScroll = (phase: number) => wordStart + (wordEnd - wordStart) * phase;

    // Per-word spring for ultra-smooth individual animations
    const wordProgress = useSpring(scrollProgress, {
        stiffness: springConfig.stiffness * 1.2,  // Slightly stiffer for words
        damping: springConfig.damping * 0.9,
        restDelta: springConfig.restDelta
    });

    // Box opacity: 0 → 0.3 → 1 → 0 (smoother emergence)
    const boxOpacity = useTransform(
        wordProgress,
        [
            phaseToScroll(phases.emergence.start),
            phaseToScroll(phases.emergence.end),
            phaseToScroll(phases.focus.end),
            phaseToScroll(phases.reveal.end)
        ],
        [0, 0.3, 1, 0]
    );

    // Box scale: 0.92 → 0.97 → 1 → 1.03 (more subtle scale animation)
    const boxScale = useTransform(
        wordProgress,
        [
            phaseToScroll(phases.emergence.start),
            phaseToScroll(phases.emergence.end),
            phaseToScroll(phases.focus.end),
            phaseToScroll(phases.reveal.end)
        ],
        [0.92, 0.97, 1, 1.03]
    );

    // Box blur: 0 → 10px (during reveal - softer fade)
    const boxBlur = useTransform(
        wordProgress,
        [phaseToScroll(phases.reveal.start), phaseToScroll(phases.reveal.end)],
        [0, 10]
    );

    // Box background opacity - refined for glassmorphism
    const bgOpacity = useTransform(
        wordProgress,
        [
            phaseToScroll(phases.emergence.start),
            phaseToScroll(phases.focus.start),
            phaseToScroll(phases.focus.end)
        ],
        [0.08, 0.25, isHighlighted ? 0.5 : 0.4]
    );

    // Box shadow - subtle only, no glow
    const shadowOpacity = useTransform(
        wordProgress,
        [phaseToScroll(phases.focus.start), phaseToScroll(phases.focus.end)],
        [0, 0.15]
    );

    // Text opacity: 0 → 1 (during reveal phase)
    const textOpacity = useTransform(
        wordProgress,
        [phaseToScroll(phases.reveal.start), phaseToScroll(phases.reveal.end)],
        [0, 1]
    );

    // Text subtle Y movement for added depth
    const textY = useTransform(
        wordProgress,
        [phaseToScroll(phases.reveal.start), phaseToScroll(phases.reveal.end)],
        [4, 0]
    );

    return (
        <span
            className="relative inline-block align-middle"
            style={{
                margin: '0 0.12em',
                fontFamily: 'var(--font-body, "PolySans", sans-serif)'
            }}
        >
            {/* Text element */}
            <motion.span
                className="relative z-[2] whitespace-nowrap"
                style={{
                    opacity: textOpacity,
                    y: textY,
                    color: isHighlighted ? primaryColor : undefined,
                    textShadow: isHighlighted ? `0 0 20px ${primaryColor}40` : undefined,
                    willChange: 'opacity, transform',
                    transition: 'color 0.3s ease'
                }}
            >
                {word}
            </motion.span>

            {/* Glassmorphic pill/box element */}
            <motion.span
                aria-hidden="true"
                className="absolute z-[1] left-1/2 top-1/2 pointer-events-none rounded-full"
                style={{
                    width: '102%',
                    height: '72%',
                    x: "-50%",
                    y: "-50%",
                    opacity: boxOpacity,
                    scale: boxScale,
                    filter: useTransform(boxBlur, (v) => `blur(${v}px)`),
                    backgroundColor: useTransform(
                        bgOpacity,
                        (v) => isHighlighted
                            ? `rgba(${rgb}, ${v})`
                            : `rgba(255, 255, 255, ${v})`
                    ),
                    boxShadow: useTransform(
                        shadowOpacity,
                        (v) => `0 2px 10px rgba(0, 0, 0, ${v})`
                    ),
                    backdropFilter: 'blur(6px)',
                    WebkitBackdropFilter: 'blur(6px)',
                    border: isHighlighted
                        ? `1px solid rgba(${rgb}, 0.3)`
                        : '1px solid rgba(255, 255, 255, 0.1)',
                    willChange: 'opacity, transform, background-color'
                }}
            />
        </span>
    );
}

// ===========================================================================
// MAIN COMPONENT - Tailwind CSS Version (Refined)
// ===========================================================================

/**
 * ScrollRevealTextFramer Component
 * 
 * A scroll-locked text reveal animation powered by Framer Motion.
 * Uses Tailwind CSS for styling with refined, buttery-smooth animations.
 * 
 * SCROLL MECHANICS:
 * - Container height creates scroll distance for animation
 * - Sticky positioning pins content at viewport top
 * - useScroll tracks container position as 0-1 progress
 * - useSpring applies physics smoothing for natural feel
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

    // Merge config with defaults - prioritize user config
    const leadCount = config.leadCount ?? (isMobile
        ? ANIMATION_CONFIG.leadCount.mobile
        : ANIMATION_CONFIG.leadCount.desktop);

    const scrollDistance = config.scrollDistance ?? (isMobile
        ? ANIMATION_CONFIG.scrollDistance.mobile
        : ANIMATION_CONFIG.scrollDistance.desktop);

    // Refined spring config for ultra-smooth scrolling
    const springConfig = {
        stiffness: config.springStiffness ?? ANIMATION_CONFIG.spring.stiffness,
        damping: config.springDamping ?? ANIMATION_CONFIG.spring.damping,
        restDelta: ANIMATION_CONFIG.spring.restDelta
    };

    // Total scroll distance for the animation
    const totalScrollDistance = (words.length + leadCount) * scrollDistance +
        (ANIMATION_CONFIG.paddingDuration * scrollDistance);

    // Track scroll progress using the container as target
    const { scrollYProgress } = useScroll({
        target: containerRef,
        container: scrollContainerRef,
        offset: ["start start", "end end"]
    });

    // Apply spring smoothing for buttery-smooth feel
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: springConfig.stiffness,
        damping: springConfig.damping,
        restDelta: 0.001,
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
            className="w-full relative isolate"
            style={{
                height: `calc(${totalScrollDistance}px + ${containerHeight})`,
                backgroundColor: 'var(--color-bg, #0d0d0d)',
                color: 'var(--color-text, #fff)'
            }}
        >
            {/* Sticky inner container - pins content while scrolling */}
            <div
                className="w-full flex items-center justify-center sticky top-0 z-[1]"
                style={{
                    height: containerHeight,
                    backfaceVisibility: 'hidden',
                    backgroundColor: 'var(--color-bg, #0d0d0d)',
                    WebkitBackfaceVisibility: 'hidden'
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
                    {/* Title with gradient text */}
                    {title && (
                        <h1
                            className="font-bold leading-[1.15]"
                            style={{
                                fontFamily: 'var(--font-heading, "PolySans", sans-serif)',
                                fontSize: isMobile
                                    ? 'clamp(1.5rem, 8vw, 2.25rem)'
                                    : 'clamp(2.5rem, 5vw, 5rem)',
                                marginBottom: isMobile ? '1.25rem' : '2rem',
                                letterSpacing: '-0.03em',
                                background: 'linear-gradient(to bottom, #fff 40%, #555)',
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                color: 'transparent'
                            }}
                        >
                            {title}
                        </h1>
                    )}

                    {/* Body text container */}
                    <div
                        className="flex flex-wrap max-w-full"
                        style={{
                            fontFamily: 'var(--font-body, "PolySans", sans-serif)',
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
                                springConfig={springConfig}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ScrollRevealTextFramer;
