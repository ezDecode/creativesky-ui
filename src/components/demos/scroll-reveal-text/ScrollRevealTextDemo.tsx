"use client";

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

/**
 * ScrollRevealTextDemo
 * 
 * A contained demo that shows the animation concept without requiring 
 * full-page scrolling. Uses a slider to simulate scroll progress.
 * Shows 6-7 boxes ahead of the currently revealing word.
 */
const ScrollRevealTextDemo: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(0);
    const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);
    const boxesRef = useRef<(HTMLSpanElement | null)[]>([]);

    const phrase = "Your data is taken by companies and used to train the next wave of AI models and build the world's top products.";
    const highlightWords = ["wave", "AI", "products"];
    const primaryColor = "#ff6b00";
    const words = phrase.split(" ");

    // Number of boxes visible ahead (6-7 boxes)
    const LEAD_COUNT = 7;

    // Animation based on progress
    useEffect(() => {
        const totalWords = words.length;

        words.forEach((_, index) => {
            const box = boxesRef.current[index];
            const text = wordsRef.current[index];
            if (!box || !text) return;

            // Calculate word progress based on slider
            // Each word starts emerging LEAD_COUNT positions before it reveals
            const wordRevealPoint = (index + LEAD_COUNT) / (totalWords + LEAD_COUNT);
            const wordStartPoint = index / (totalWords + LEAD_COUNT);

            // How far through this word's animation cycle are we?
            const cycleLength = wordRevealPoint - wordStartPoint;
            const wordProgress = Math.max(0, Math.min(1, (progress - wordStartPoint) / cycleLength));

            // Box animation phases
            if (wordProgress <= 0) {
                // Not yet visible
                gsap.set(box, { opacity: 0, scale: 0.95, filter: 'blur(0px)' });
                gsap.set(text, { opacity: 0 });
            } else if (wordProgress < 0.15) {
                // Emerging phase (fade in at higher opacity)
                const emerging = wordProgress / 0.15;
                gsap.set(box, {
                    opacity: emerging * 0.52,
                    scale: 0.95 + emerging * 0.02,
                    filter: 'blur(0px)'
                });
                gsap.set(text, { opacity: 0 });
            } else if (wordProgress < 0.85) {
                // Visible phase (6-7 boxes in this range, higher opacity)
                const visibleProgress = (wordProgress - 0.15) / 0.7;
                gsap.set(box, {
                    opacity: 0.52 + visibleProgress * 0.48,
                    scale: 0.97 + visibleProgress * 0.03,
                    filter: 'blur(0px)'
                });
                gsap.set(text, { opacity: 0 });
            } else {
                // Reveal phase (box dissolves, text appears)
                const reveal = (wordProgress - 0.85) / 0.15;
                gsap.set(box, {
                    opacity: Math.max(0, 1 - reveal),
                    scale: 1 + reveal * 0.02,
                    filter: `blur(${reveal * 8}px)`
                });
                gsap.set(text, { opacity: reveal });
            }
        });
    }, [progress, words]);

    // Check if word should be highlighted
    const isHighlighted = (word: string) =>
        highlightWords.some(hw => word.toLowerCase().includes(hw.toLowerCase()));

    // Convert hex to rgb
    const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!result) return "255, 107, 0";
        return [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ].join(", ");
    };

    const rgb = hexToRgb(primaryColor);

    return (
        <div
            ref={containerRef}
            className="w-full min-h-[400px] flex flex-col items-center justify-center p-8 rounded-xl"
            // style={{ backgroundColor: '#0d0d0d' }}
        >
            {/* Title with gradient */}
            <h2
                className="text-3xl md:text-4xl font-bold mb-6 text-left w-full max-w-2xl mx-auto font-inherit"
                style={{
                    background: 'linear-gradient(to bottom, #fff 40%, #555)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.04em'
                }}
            >
                Data Empowerment
            </h2>

            {/* Words display */}
            <div className="max-w-2xl mx-auto mb-8">
                <div
                    className="flex flex-wrap justify-start gap-y-2 font-inherit"
                    style={{
                        fontSize: 'clamp(1rem, 2vw, 1.5rem)',
                        fontWeight: 600,
                        lineHeight: 1.5
                    }}
                >
                    {words.map((word, index) => {
                        const highlighted = isHighlighted(word);
                        return (
                            <span
                                key={index}
                                className="relative inline-block mx-0.5"
                            >
                                <span
                                    ref={el => { wordsRef.current[index] = el; }}
                                    className="relative z-10"
                                    style={{
                                        opacity: 0,
                                        color: highlighted ? primaryColor : '#fff',
                                        transition: 'color 0.3s ease'
                                    }}
                                >
                                    {word}
                                </span>
                                <span
                                    ref={el => { boxesRef.current[index] = el; }}
                                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                                    style={{
                                        width: '105%',
                                        height: '75%',
                                        background: highlighted
                                            ? `rgba(${rgb}, 0.15)`
                                            : 'rgba(255, 255, 255, 0.12)',
                                        backdropFilter: 'blur(6px)',
                                        WebkitBackdropFilter: 'blur(6px)',
                                        // No border - removed as requested
                                        borderRadius: '999px',
                                        boxShadow: highlighted
                                            ? `0 0 30px rgba(${rgb}, 0.3)`
                                            : '0 4px 15px rgba(0, 0, 0, 0.15)',
                                        opacity: 0
                                    }}
                                    aria-hidden="true"
                                />
                            </span>
                        );
                    })}
                </div>
            </div>

            {/* Progress slider */}
            <div className="w-full max-w-md">
                <label className="block text-white/50 text-sm mb-2 text-center font-inherit">
                    Drag to simulate scroll ({Math.round(progress * 100)}%)
                </label>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress * 100}
                    onChange={(e) => setProgress(Number(e.target.value) / 100)}
                    className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-orange-500"
                    style={{
                        background: `linear-gradient(to right, ${primaryColor} ${progress * 100}%, rgba(255,255,255,0.1) ${progress * 100}%)`
                    }}
                />
                <p className="text-white/30 text-xs mt-2 text-center font-inherit">
                    In production, this animation is controlled by page scroll • 7 boxes visible ahead
                </p>
            </div>
        </div>
    );
};

export default ScrollRevealTextDemo;
