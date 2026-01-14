"use client";

import React from 'react';
import { ScrollRevealTextFramer } from "@/content/scroll-reveal-text/ScrollRevealText";

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
            phrase="Meanwhile, beneath the surface of yesterday's dreams, a constellation of possibility whispered secrets to the patient minds who dared to listen. Every moment transforms into a doorway, every question becomes an invitation to discover what we never knew we were searching for."
            highlightWords={["dreams", "constellation", "whispered", "patient", "transforms", "doorway", "invitation", "discover"]}
            primaryColor="#6366f1"
            scrollContainerRef={scrollContainerRef}
        />
    );
};

export default ScrollRevealTextDemo;
