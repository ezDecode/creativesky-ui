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
        <div className="w-full relative">
            <ScrollRevealTextFramer
                phrase="Experience the smooth revelation of text as you scroll deeper."
                highlightWords={["smooth", "scroll", "deeper"]}
                primaryColor="#8b5cf6"
                config={{
                    leadCount: 2,
                    scrollDistance: 120,
                    springStiffness: 120,
                    springDamping: 25
                }}
                scrollContainerRef={scrollContainerRef}
            />

            {/* Extra spacing at bottom to ensure full scroll */}
            <div className="h-[50vh] w-full flex items-center justify-center pb-10">
                <span className="text-sm">End of demo</span>
            </div>
        </div>
    );
};

export default ScrollRevealTextDemo;
