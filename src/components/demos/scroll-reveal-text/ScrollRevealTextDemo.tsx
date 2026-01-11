"use client";

import React from 'react';

/**
 * ScrollRevealTextDemo
 * 
 * Simple demo card linking to the live deployed version.
 * Live Demo: https://text-box-scroll.vercel.app/
 */

const ScrollRevealTextDemo: React.FC = () => {
    return (
        <div className="flex flex-col gap-6 w-full p-6">
            {/* Desktop Notice */}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <svg className="w-5 h-5 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-amber-200/80">
                    <span className="font-semibold">Best on Desktop</span> — This component uses scroll-locking animations.
                </p>
            </div>

            {/* Demo Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 border border-white/10">
                <div className="h-40 bg-gradient-to-br from-orange-500/10 via-transparent to-purple-500/10 flex items-center justify-center">
                    <div className="flex flex-wrap gap-2 justify-center px-8 opacity-60">
                        {["Scroll", "to", "reveal", "text"].map((word, i) => (
                            <span key={i} className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white/70 text-sm font-medium">
                                {word}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-white">Scroll Reveal Text</h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 font-semibold uppercase">Live</span>
                    </div>

                    <p className="text-sm text-white/60">
                        Scroll-locked text reveal with glassmorphic pills powered by Framer Motion.
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {["Framer Motion", "Scroll-Locked", "Spring Physics"].map((tag) => (
                            <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-white/50">{tag}</span>
                        ))}
                    </div>

                    <a
                        href="https://text-box-scroll.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-sm hover:from-orange-400 hover:to-orange-500 transition-all"
                    >
                        Open Live Demo
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ScrollRevealTextDemo;
