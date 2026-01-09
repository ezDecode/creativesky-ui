"use client";

import React, { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./scroll-reveal-text.module.css";

// ===========================================================================
// UTILITY FUNCTIONS
// ===========================================================================

/**
 * Converts hex color to RGB string for use in rgba()
 * @param {string} hex - Hex color code (e.g., "#ff6b00")
 * @returns {string} RGB values as comma-separated string
 */
function hexToRgb(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return "255, 107, 0";

    return [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ].join(", ");
}

// ===========================================================================
// ANIMATION CONFIGURATION
// ===========================================================================

const ANIMATION_CONFIG = {
    // Lead words count (how many boxes visible ahead of the revealing word)
    leadCount: {
        desktop: 7,
        mobile: 5
    },

    // Scroll distance per word (higher = slower/smoother pacing)
    scrollDistance: {
        desktop: 150,
        mobile: 100
    },

    // Buffer time at animation start/end
    paddingDuration: 2,

    // Scrub configuration for ultra-smooth scrolling
    scrub: {
        smoothTouch: 0.2,
        smooth: 1.5
    },

    // Animation phases timing
    phases: {
        emergence: {
            duration: 1.0,
            ease: "power1.out"
        },
        focus: {
            duration: 3.0,
            ease: "sine.inOut",
            focusOffset: 0.4
        },
        reveal: {
            boxDuration: 1.6,
            textDuration: 2.0,
            textDelay: 0.02,
            ease: "power1.inOut"
        }
    }
};

// ===========================================================================
// COMPONENT TYPES
// ===========================================================================

interface ScrollRevealTextProps {
    /** The text content to be revealed word by word */
    phrase?: string;
    /** Array of words to highlight with accent color */
    highlightWords?: string[];
    /** Optional heading displayed above the text */
    title?: string;
    /** Hex color for highlighted words and glow */
    primaryColor?: string;
}

// ===========================================================================
// COMPONENT
// ===========================================================================

/**
 * ScrollRevealText Component
 * 
 * A scroll-locked text reveal animation component. Words are hidden behind
 * animated pill-shaped boxes that fade in, glow, then dissolve to reveal text.
 */
const ScrollRevealText: React.FC<ScrollRevealTextProps> = ({
    phrase = "",
    highlightWords = [],
    title = "",
    primaryColor = "#ff6b00"
}) => {
    const outerRef = useRef<HTMLDivElement>(null);
    const pinRef = useRef<HTMLDivElement>(null);

    // Memoized animation setup function
    const setupAnimations = useCallback((isMobile: boolean) => {
        const config = ANIMATION_CONFIG;
        const LEAD_COUNT = isMobile ? config.leadCount.mobile : config.leadCount.desktop;
        const SCROLL_DISTANCE = isMobile ? config.scrollDistance.mobile : config.scrollDistance.desktop;
        const PADDING_DURATION = config.paddingDuration;

        const wordContainers = Array.from(
            pinRef.current!.querySelectorAll(`.${styles.wordContainer}`)
        );

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
                scrub: isMobile ? 0.5 : 1.5,
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

            // Check if this word should be highlighted
            const isHighlighted = highlightWords.some(hw =>
                text.textContent?.toLowerCase().includes(hw.toLowerCase())
            );

            // Apply highlight styling
            if (isHighlighted) {
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
            gsap.set(text, {
                opacity: 0
            });

            // Timeline position with padding offset
            const baseTime = PADDING_DURATION + index;
            const { phases } = config;

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
                backgroundColor: isHighlighted
                    ? `rgba(${rgb}, 0.55)`
                    : "rgba(255, 255, 255, 0.45)",
                boxShadow: isHighlighted
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
    }, [highlightWords, primaryColor]);

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
        return () => mm.revert();
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
};

export default ScrollRevealText;
