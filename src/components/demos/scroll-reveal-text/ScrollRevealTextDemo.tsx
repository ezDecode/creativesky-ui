"use client";

import React from 'react';
import { ScrollRevealTextFramer } from '@/content/scroll-reveal-text/scroll-reveal-text.framer';

/**
 * ScrollRevealTextDemo
 * 
 * Demonstrates the ScrollRevealText component within a scrollable frame.
 * Since the component uses scroll-locking, it's best viewed in a container 
 * that allows scrolling (like the DemoContainer).
 */

const ScrollRevealTextDemo: React.FC<{ scrollContainerRef?: React.RefObject<HTMLDivElement> }> = ({ scrollContainerRef }) => {
    return (
        <ScrollRevealTextFramer
            phrase="A wandering teacup hummed softly while invisible kites drifted past a forgotten clock, sprinkling echoes of lavender across a sidewalk that never learned where it was going."
            highlightWords={["wandering", "teacup", "kites", "clock", "echoes", "sidewalk", "going"]}
            primaryColor="#ff6b00"
            scrollContainerRef={scrollContainerRef}
        />
    );
};

export default ScrollRevealTextDemo;
