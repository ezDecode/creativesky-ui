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

const ScrollRevealTextDemo: React.FC = () => {
    return (
        <div className="w-full h-[600px] rounded-xl overflow-hidden bg-[#0d0d0d] relative flex flex-col">
            {/* Controls / Header within the demo frame */}
            <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-start pointer-events-none">
                <a
                    href="https://text-box-scroll.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/5 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full pointer-events-auto hover:bg-white/10 transition-colors flex items-center gap-2 group"
                >
                    <span className="text-xs font-mono text-white/60 group-hover:text-white/90 transition-colors">Open Live Demo</span>
                    <svg className="w-3 h-3 text-white/40 group-hover:text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </a>
            </div>

            {/* 
            Scrollable Container 
            This div is essential. It provides the scrollable viewport for the sticky component.
            We use h-full overflow-y-auto to emulate a full page scroll.
          */}
            <div className="w-full h-full overflow-y-auto relative scrollbar-hide">
                <ScrollRevealTextFramer
                    phrase="Experience the smooth revelation of text as you scroll deeper."
                    highlightWords={["smooth", "scroll", "deeper"]}
                    primaryColor="#8b5cf6"
                    config={{
                        // Adjusted for the smaller demo frame
                        leadCount: 2,
                        scrollDistance: 120,
                        springStiffness: 120,
                        springDamping: 25
                    }}
                />

                {/* Extra spacing at bottom to ensure full scroll */}
                <div className="h-[20vh] w-full flex items-center justify-center text-white/20 pb-10">
                    <span className="text-sm">End of demo</span>
                </div>
            </div>
        </div>
    );
};

export default ScrollRevealTextDemo;
