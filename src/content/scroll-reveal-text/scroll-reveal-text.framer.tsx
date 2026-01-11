'use client';

import React, { useRef, useMemo, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import styles from "./scroll-reveal-text.module.css";

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
// CONFIGURATION (Inlined)
// ===========================================================================

const ANIMATION_CONFIG = {
    leadCount: { desktop: 8, mobile: 5 },
    scrollDistance: { desktop: 150, mobile: 100 },
    paddingDuration: 2,
    spring: { stiffness: 100, damping: 30, restDelta: 0.001 },
    phases: {
        emergence: { start: 0, end: 0.15 },
        focus: { start: 0.15, end: 0.7 },
        reveal: { start: 0.7, end: 1.0 }
    }
} as const;

// ===========================================================================
// UTILITIES (Inlined)
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
// ANIMATED WORD COMPONENT
// ===========================================================================

/**
 * Handles individual word animation based on scroll progress.
 * Uses scroll progress to animate through emergence → focus → reveal phases.
 */
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

    // Box opacity: 0 → 0.25 → 1 → 0 (emergence → focus → reveal)
    const boxOpacity = useTransform(
        scrollProgress,
        [
            phaseToScroll(phases.emergence.start),
            phaseToScroll(phases.emergence.end),
            phaseToScroll(phases.focus.end),
            phaseToScroll(phases.reveal.end)
        ],
        [0, 0.25, 1, 0]
    );

    // Box scale: 0.95 → 0.98 → 1 → 1.02
    const boxScale = useTransform(
        scrollProgress,
        [
            phaseToScroll(phases.emergence.start),
            phaseToScroll(phases.emergence.end),
            phaseToScroll(phases.focus.end),
            phaseToScroll(phases.reveal.end)
        ],
        [0.95, 0.98, 1, 1.02]
    );

    // Box blur: 0 → 8px (during reveal)
    const boxBlur = useTransform(
        scrollProgress,
        [phaseToScroll(phases.reveal.start), phaseToScroll(phases.reveal.end)],
        [0, 8]
    );

    // Box background opacity
    const bgOpacity = useTransform(
        scrollProgress,
        [
            phaseToScroll(phases.emergence.start),
            phaseToScroll(phases.focus.start),
            phaseToScroll(phases.focus.end)
        ],
        [0.1, 0.3, isHighlighted ? 0.55 : 0.45]
    );

    // Box shadow intensity
    const shadowOpacity = useTransform(
        scrollProgress,
        [phaseToScroll(phases.focus.start), phaseToScroll(phases.focus.end)],
        [0, isHighlighted ? 0.5 : 0.2]
    );

    // Text opacity: 0 → 1 (during reveal phase)
    const textOpacity = useTransform(
        scrollProgress,
        [phaseToScroll(phases.reveal.start), phaseToScroll(phases.reveal.end)],
        [0, 1]
    );

    return (
        <span className={styles.wordContainer}>
            <motion.span
                className={`${styles.text} ${isHighlighted ? styles.highlighted : ''}`}
                style={{
                    opacity: textOpacity,
                    color: isHighlighted ? primaryColor : undefined
                }}
            >
                {word}
            </motion.span>
            <motion.span
                className={`${styles.box} ${isHighlighted ? styles.primary : ''}`}
                aria-hidden="true"
                style={{
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
                        (v) => isHighlighted
                            ? `0 0 50px rgba(${rgb}, ${v})`
                            : `0 0 50px rgba(255, 255, 255, ${v})`
                    )
                }}
            />
        </span>
    );
}

// ===========================================================================
// MAIN COMPONENT
// ===========================================================================

/**
 * ScrollRevealTextFramer Component (Framer Motion Implementation)
 * 
 * A scroll-locked text reveal animation powered by Framer Motion.
 * Uses CSS sticky positioning for pinning and spring physics for smooth animations.
 * 
 * PINNING MECHANISM:
 * - The outer container is tall (scroll distance + 100vh)
 * - The inner element uses position:sticky with top:0
 * - As user scrolls, the sticky element stays pinned at viewport top
 * - useScroll tracks the container's position relative to viewport
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <ScrollRevealTextFramer phrase="Your text here" />
 * 
 * // With highlights
 * <ScrollRevealTextFramer 
 *   phrase="Highlight these important words"
 *   highlightWords={["important", "words"]}
 *   primaryColor="#00ff88"
 * />
 * ```
 */
export function ScrollRevealTextFramer({
    phrase = "",
    highlightWords = [],
    title = "",
    primaryColor = "#ff6b00",
    config = {}
}: ScrollRevealTextProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const words = useMemo(() => phrase.split(" "), [phrase]);

    // Detect mobile with state to avoid hydration mismatch
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(window.innerWidth < 800);
        const handleResize = () => setIsMobile(window.innerWidth < 800);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const leadCount = config.leadCount ?? (isMobile
        ? ANIMATION_CONFIG.leadCount.mobile
        : ANIMATION_CONFIG.leadCount.desktop);

    const scrollDistance = config.scrollDistance ?? (isMobile
        ? ANIMATION_CONFIG.scrollDistance.mobile
        : ANIMATION_CONFIG.scrollDistance.desktop);

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
        offset: ["start start", "end end"]
    });

    // Apply spring smoothing for buttery-smooth feel
    const smoothProgress = useSpring(scrollYProgress, springConfig);

    return (
        <div
            ref={containerRef}
            className={styles.container}
            style={{ height: `calc(${totalScrollDistance}px + 100vh)` }}
        >
            {/* Sticky inner container - pins content while scrolling */}
            <div
                className={styles.pin}
                style={{
                    position: 'sticky',
                    top: 0,
                }}
            >
                <div className={styles.content}>
                    {title && <h1 className={styles.title}>{title}</h1>}

                    <div className={styles.body}>
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
