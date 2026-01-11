'use client';

import React, { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
    /** GSAP scrub smoothness (higher = smoother) */
    scrubSmooth?: number;
}

// ===========================================================================
// CONFIGURATION (Inlined)
// ===========================================================================

const ANIMATION_CONFIG = {
    leadCount: { desktop: 8, mobile: 5 },
    scrollDistance: { desktop: 150, mobile: 100 },
    paddingDuration: 2,
    scrub: { smoothTouch: 0.5, smooth: 2.5 },
    phases: {
        emergence: { duration: 1.0, ease: "power1.out" },
        focus: { duration: 3.0, ease: "sine.inOut", focusOffset: 0.4 },
        reveal: { boxDuration: 1.6, textDuration: 2.0, textDelay: 0.02, ease: "power1.inOut" }
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
// COMPONENT
// ===========================================================================

/**
 * ScrollRevealText Component (GSAP Implementation)
 * 
 * A scroll-locked text reveal animation powered by GSAP ScrollTrigger.
 * Words are hidden behind animated glassmorphic pill overlays that emerge,
 * glow, then dissolve to reveal the text underneath.
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <ScrollRevealTextGSAP phrase="Your text here" />
 * 
 * // With highlights
 * <ScrollRevealTextGSAP 
 *   phrase="Highlight these important words"
 *   highlightWords={["important", "words"]}
 *   primaryColor="#00ff88"
 * />
 * ```
 */
export function ScrollRevealTextGSAP({
    phrase = "",
    highlightWords = [],
    title = "",
    primaryColor = "#ff6b00",
    config = {}
}: ScrollRevealTextProps) {
    const outerRef = useRef<HTMLDivElement>(null);
    const pinRef = useRef<HTMLDivElement>(null);

    // Memoized animation setup function
    const setupAnimations = useCallback((isMobile: boolean) => {
        const LEAD_COUNT = config.leadCount ?? (isMobile
            ? ANIMATION_CONFIG.leadCount.mobile
            : ANIMATION_CONFIG.leadCount.desktop);
        const SCROLL_DISTANCE = config.scrollDistance ?? (isMobile
            ? ANIMATION_CONFIG.scrollDistance.mobile
            : ANIMATION_CONFIG.scrollDistance.desktop);
        const PADDING_DURATION = ANIMATION_CONFIG.paddingDuration;
        const SCRUB_SMOOTH = config.scrubSmooth ?? ANIMATION_CONFIG.scrub.smooth;
        const { phases } = ANIMATION_CONFIG;

        if (!pinRef.current) return;

        const wordContainers = Array.from(
            pinRef.current.querySelectorAll(`.${styles.wordContainer}`)
        ) as HTMLElement[];

        // Calculate total scroll distance with padding
        const totalScrollDistance = (wordContainers.length + LEAD_COUNT) * SCROLL_DISTANCE;

        // Create master timeline
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: outerRef.current,
                start: "top top",
                end: `+=${totalScrollDistance}`,
                pin: true,
                pinSpacing: true,
                scrub: SCRUB_SMOOTH,
                anticipatePin: 1,
                invalidateOnRefresh: true,
            }
        });

        // Phase 0: Entry padding (page pins, brief pause before animation)
        tl.to({}, { duration: PADDING_DURATION });

        // Animate each word container
        wordContainers.forEach((container, index) => {
            const box = container.querySelector(`.${styles.box}`) as HTMLElement;
            const text = container.querySelector(`.${styles.text}`) as HTMLElement;

            if (!box || !text) return;

            // Check if this word should be highlighted
            const highlighted = isWordHighlighted(text.textContent || '', highlightWords);

            // Apply highlight styling
            if (highlighted) {
                text.classList.add(styles.highlighted);
                box.classList.add(styles.primary);
                if (primaryColor !== "#ff6b00") {
                    text.style.color = primaryColor;
                }
            }

            // Set initial state
            gsap.set(box, {
                opacity: 0,
                scale: 0.95,
                transformOrigin: "center center"
            });
            gsap.set(text, { opacity: 0 });

            // Timeline position with padding offset
            const baseTime = PADDING_DURATION + index;

            // Phase 1: Gentle Emergence (box fades in subtly)
            tl.to(box, {
                opacity: 0.25,
                scale: 0.98,
                duration: phases.emergence.duration,
                ease: phases.emergence.ease
            }, baseTime);

            // Phase 2: Focus (box becomes fully visible with glow)
            const focusStart = baseTime + (LEAD_COUNT * phases.focus.focusOffset);
            const rgb = hexToRgb(primaryColor);

            tl.to(box, {
                opacity: 1,
                scale: 1,
                backgroundColor: highlighted
                    ? `rgba(${rgb}, 0.55)`
                    : "rgba(255, 255, 255, 0.45)",
                boxShadow: highlighted
                    ? `0 0 50px rgba(${rgb}, 0.5)`
                    : "0 0 50px rgba(255, 255, 255, 0.2)",
                duration: phases.focus.duration,
                ease: phases.focus.ease
            }, focusStart);

            // Phase 3: Reveal (box dissolves, text appears)
            const revealTime = baseTime + LEAD_COUNT;

            // Box dissolve animation
            tl.to(box, {
                opacity: 0,
                scale: 1.02,
                filter: "blur(8px)",
                duration: phases.reveal.boxDuration,
                ease: phases.reveal.ease
            }, revealTime);

            // Text reveal - pure opacity fade
            tl.to(text, {
                opacity: 1,
                duration: phases.reveal.textDuration,
                ease: "power1.out"
            }, revealTime + phases.reveal.textDelay);
        });

        // Phase 4: Exit padding (hold before unpin)
        tl.to({}, { duration: PADDING_DURATION });

        return tl;
    }, [highlightWords, primaryColor, config]);

    // Setup animations on mount
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        if (!outerRef.current || !pinRef.current) return;

        // Use matchMedia for responsive animations
        const mm = gsap.matchMedia();

        mm.add({
            isDesktop: "(min-width: 800px)",
            isMobile: "(max-width: 799px)"
        }, (context) => {
            const { isMobile } = context.conditions as { isMobile: boolean };
            setupAnimations(isMobile);
        });

        // Cleanup on unmount
        return () => {
            mm.revert();
            ScrollTrigger.getAll().forEach(trigger => {
                if (trigger.trigger === outerRef.current) {
                    trigger.kill(true);
                }
            });
            if (pinRef.current) {
                gsap.killTweensOf(pinRef.current.querySelectorAll('*'));
            }
        };
    }, [phrase, setupAnimations]);

    // Split phrase into words
    const words = phrase.split(" ");

    return (
        <div ref={outerRef} className={styles.container}>
            <div ref={pinRef} className={styles.pin}>
                <div className={styles.content}>
                    {title && <h1 className={styles.title}>{title}</h1>}

                    <div className={styles.body}>
                        {words.map((word, index) => (
                            <span key={index} className={styles.wordContainer}>
                                <span className={styles.text}>{word}</span>
                                <span className={styles.box} aria-hidden="true" />
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ScrollRevealTextGSAP;
