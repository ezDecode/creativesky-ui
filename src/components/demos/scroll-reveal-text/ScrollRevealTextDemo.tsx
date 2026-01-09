"use client";

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

/**
 * ScrollRevealTextDemo
 * 
 * A contained demo that shows the animation concept by scrolling within the box.
 * Shows 7 boxes ahead of the currently revealing word.
 */
const ScrollRevealTextDemo: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(0);
    const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);
    const boxesRef = useRef<(HTMLSpanElement | null)[]>([]);

    const phrase = "Your data is taken by companies and used to train the next wave of Al models and build the world's top products and services. Yet it often happens without any earnings being distributed back to you.It's time for a change. With Navigate you join a decentralized intelligence platform that puts the power back in your hands and rewards you for the data you contribute.";
    const highlightWords = ["companies", "models", "products", "services", "change", "Navigate", "decentralized", "intelligence", "platform", "power", "hands", "rewards", "contribute"];
    const primaryColor = "#ff6b00";
    const words = phrase.split(" ");

    const LEAD_COUNT = 7;

    // Handle scroll to update progress
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const element = e.currentTarget;
        const scrollTop = element.scrollTop;
        const scrollHeight = element.scrollHeight - element.clientHeight;

        if (scrollHeight > 0) {
            const progressValue = Math.max(0, Math.min(1, scrollTop / scrollHeight));
            setProgress(progressValue);
        }
    };

    // Animation based on progress
    useEffect(() => {
        const totalWords = words.length;

        words.forEach((_, index) => {
            const box = boxesRef.current[index];
            const text = wordsRef.current[index];
            if (!box || !text) return;

            const wordRevealPoint = (index + LEAD_COUNT) / (totalWords + LEAD_COUNT);
            const wordStartPoint = index / (totalWords + LEAD_COUNT);
            const cycleLength = wordRevealPoint - wordStartPoint;
            const wordProgress = Math.max(0, Math.min(1, (progress - wordStartPoint) / cycleLength));

            if (wordProgress <= 0) {
                gsap.set(box, { opacity: 0, scale: 0.95, filter: 'blur(0px)' });
                gsap.set(text, { opacity: 0 });
            } else if (wordProgress < 0.15) {
                const emerging = wordProgress / 0.15;
                gsap.set(box, {
                    opacity: emerging * 0.52,
                    scale: 0.95 + emerging * 0.02,
                    filter: 'blur(0px)'
                });
                gsap.set(text, { opacity: 0 });
            } else if (wordProgress < 0.85) {
                const visibleProgress = (wordProgress - 0.15) / 0.7;
                gsap.set(box, {
                    opacity: 0.52 + visibleProgress * 0.48,
                    scale: 0.97 + visibleProgress * 0.03,
                    filter: 'blur(0px)'
                });
                gsap.set(text, { opacity: 0 });
            } else {
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

    const isHighlighted = (word: string) =>
        highlightWords.some(hw => word.toLowerCase().includes(hw.toLowerCase()));

    const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!result) return "255, 107, 0";
        return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)].join(", ");
    };

    const rgb = hexToRgb(primaryColor);

    return (
        <div
            ref={containerRef}
            className="w-full h-[500px] overflow-y-auto relative scrollbar-hide rounded-xl"
            onScroll={handleScroll}
        >
            <div className="h-[200%] relative">
                <div className="sticky top-0 h-[500px] flex flex-col items-center justify-center p-8">
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

                    <div className="max-w-2xl mx-auto mb-8 w-full">
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
                                    <span key={index} className="relative inline-block mx-0.5">
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
                                                    : 'rgba(255, 255, 255, 0.78)',
                                                backdropFilter: 'blur(6px)',
                                                WebkitBackdropFilter: 'blur(6px)',
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

                    <div className="absolute bottom-8 left-0 w-full text-center pointer-events-none transition-opacity duration-300"
                        style={{ opacity: progress > 0.9 ? 0 : 0.5 }}>
                        <p className="text-white/30 text-xs font-inherit">
                            ↓ Scroll inside this box to reveal ↓
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScrollRevealTextDemo;
