import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface IntentionalTextRevealProps {
  title: string;
  text: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const LOOKAHEAD_COUNT = 10; // Window size for visible words ahead of current
const ACTIVE_BUFFER = 3; // Extra words to keep in active animation pool

// Opacity curve for text reveal - mimics editorial reading flow
// Word 1 (current): 100% → Word 2: 30% → Word 3: 18% → fades to 2%
const TEXT_OPACITY_CURVE = [1.0, 0.3, 0.18, 0.14, 0.12, 0.1, 0.06, 0.04, 0.03, 0.02];

// Background opacity curve - softer gradient for pill highlights
// Creates depth hierarchy without competing with text
const BG_OPACITY_CURVE = [0.95, 0.95, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2];

// Subtle scale for depth on highlight boxes (0.98 → 1.0 at current word)
const SCALE_RANGE = { min: 0.98, max: 1.0 };

// Adaptive scrub values based on scroll velocity
const SCRUB_CONFIG = {
  slow: 1.4,    // Smooth, editorial pacing for deliberate scrolling
  medium: 1.0,  // Balanced responsiveness
  fast: 0.6     // Snappy for quick navigation
};

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Easing function for smooth interpolation
 * Cubic ease-in-out for natural motion feel
 */
const smoothEase = (t: number): number => {
  return t < 0.5 
    ? 4 * t * t * t 
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

/**
 * Calculate opacity for text based on distance from current word
 * Uses pre-defined curve with interpolation for sub-word precision
 */
const calculateTextOpacity = (distance: number): number => {
  if (distance < 0) return 1; // Past words fully visible
  if (distance >= TEXT_OPACITY_CURVE.length) return 0; // Too far ahead
  
  const index = Math.floor(distance);
  const fraction = distance - index;
  
  const current = TEXT_OPACITY_CURVE[index] || 0;
  const next = TEXT_OPACITY_CURVE[index + 1] || 0;
  
  return current + (next - current) * smoothEase(fraction);
};

/**
 * Calculate background opacity for highlight pills
 * Separate curve for visual hierarchy
 */
const calculateBgOpacity = (distance: number): number => {
  if (distance < 0) return 0; // Past words have no highlight
  if (distance >= BG_OPACITY_CURVE.length) return 0;
  
  const index = Math.floor(distance);
  const fraction = distance - index;
  
  const current = BG_OPACITY_CURVE[index] || 0;
  const next = BG_OPACITY_CURVE[index + 1] || 0;
  
  return current + (next - current) * smoothEase(fraction);
};

/**
 * Calculate scale for depth effect on highlight boxes
 */
const calculateScale = (distance: number): number => {
  if (distance < 0) return SCALE_RANGE.max; // Past words at max scale
  if (distance >= LOOKAHEAD_COUNT) return SCALE_RANGE.min;
  
  const progress = distance / LOOKAHEAD_COUNT;
  return SCALE_RANGE.max - (SCALE_RANGE.max - SCALE_RANGE.min) * smoothEase(progress);
};

/**
 * Determine if word should be in active animation window
 */
const isInActiveWindow = (wordIndex: number, currentIndex: number): boolean => {
  const distance = wordIndex - currentIndex;
  return distance >= -ACTIVE_BUFFER && distance <= LOOKAHEAD_COUNT + ACTIVE_BUFFER;
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const IntentionalTextReveal: React.FC<IntentionalTextRevealProps> = ({
  title,
  text,
}) => {
  const outerRef = useRef<HTMLDivElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  
  // Cache for GSAP tweens - reused across scroll updates
  const tweensRef = useRef<Map<number, { text: gsap.core.Tween; bg: gsap.core.Tween }>>(new Map());
  
  // Scroll velocity tracking for adaptive scrub
  const lastScrollY = useRef(0);
  const scrollVelocity = useRef(0);

  useEffect(() => {
    if (!outerRef.current || !pinRef.current) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      const words = Array.from(
        pinRef.current!.querySelectorAll<HTMLSpanElement>(".word")
      );

      const totalWords = words.length;

      // Calculate scroll distance based on content density
      const scrollHeight = Math.max(
        window.innerHeight * 2.5,
        totalWords * 100
      );

      // ═══════════════════════════════════════════════════════════════════
      // CREATE CACHED TWEENS FOR EACH WORD
      // ═══════════════════════════════════════════════════════════════════
      
      words.forEach((word, i) => {
        const textEl = word.querySelector("span")!;
        
        // Text opacity tween (0 → 1)
        const textTween = gsap.to(textEl, {
          opacity: 1,
          duration: 1,
          paused: true,
          ease: "none"
        });
        
        // Background + scale tween (combined for efficiency)
        const bgTween = gsap.to(word, {
          backgroundColor: "rgba(255,255,255,0.95)",
          scale: SCALE_RANGE.max,
          duration: 1,
          paused: true,
          ease: "none"
        });
        
        tweensRef.current.set(i, { text: textTween, bg: bgTween });
      });

      // ═══════════════════════════════════════════════════════════════════
      // SCROLLTRIGGER SETUP
      // ═══════════════════════════════════════════════════════════════════

      const scrollTrigger = ScrollTrigger.create({
        trigger: outerRef.current,
        start: "top top",
        end: `+=${scrollHeight}`,
        pin: pinRef.current,
        
        // Adaptive scrub - disabled on mobile or reduced motion
        scrub: prefersReducedMotion || isMobile 
          ? false 
          : SCRUB_CONFIG.medium,
        
        fastScrollEnd: true,
        anticipatePin: 1,
        
        // Disable heavy effects on mobile
        onUpdate: isMobile || prefersReducedMotion 
          ? undefined 
          : (self) => {
              const progress = self.progress;
              const currentY = self.scroll();
              
              // Calculate scroll velocity for adaptive scrub
              scrollVelocity.current = Math.abs(currentY - lastScrollY.current);
              lastScrollY.current = currentY;
              
              // Determine current word index with sub-word precision
              const preciseIndex = progress * totalWords;
              const currentIndex = Math.floor(preciseIndex);
              
              // ═══════════════════════════════════════════════════════════
              // OPTIMIZED UPDATE LOOP - ONLY ACTIVE WINDOW
              // ═══════════════════════════════════════════════════════════
              
              words.forEach((word, i) => {
                const distance = i - preciseIndex;
                
                // Skip words outside active window (performance optimization)
                if (!isInActiveWindow(i, currentIndex)) {
                  // Ensure words are in correct end state
                  if (distance < -ACTIVE_BUFFER) {
                    // Past words: fully revealed, no background
                    const tweens = tweensRef.current.get(i);
                    if (tweens) {
                      tweens.text.progress(1);
                      tweens.bg.progress(0);
                      gsap.set(word, { scale: SCALE_RANGE.max, backgroundColor: "rgba(255,255,255,0)" });
                    }
                  } else {
                    // Future words: hidden
                    const tweens = tweensRef.current.get(i);
                    if (tweens) {
                      tweens.text.progress(0);
                      tweens.bg.progress(0);
                    }
                  }
                  return;
                }
                
                // ═══════════════════════════════════════════════════════════
                // ANIMATE ACTIVE WORDS - UPDATE TWEEN PROGRESS
                // ═══════════════════════════════════════════════════════════
                
                const tweens = tweensRef.current.get(i);
                if (!tweens) return;
                
                // Text opacity animation
                const textOpacity = calculateTextOpacity(distance);
                tweens.text.progress(textOpacity);
                
                // Background highlight animation (only for upcoming words)
                if (distance >= 0) {
                  const bgOpacity = calculateBgOpacity(distance);
                  const scale = calculateScale(distance);
                  
                  // Update background color with calculated opacity
                  gsap.set(word, {
                    backgroundColor: `rgba(255,255,255,${bgOpacity})`,
                    scale: scale
                  });
                } else {
                  // Past words: no highlight
                  gsap.set(word, {
                    backgroundColor: "rgba(255,255,255,0)",
                    scale: SCALE_RANGE.max
                  });
                }
              });
            },
        
        // Final state when scroll completes
        onLeave: () => {
          words.forEach((word, i) => {
            const tweens = tweensRef.current.get(i);
            if (tweens) {
              tweens.text.progress(1);
              tweens.bg.progress(0);
            }
            gsap.set(word, {
              opacity: 1,
              backgroundColor: "rgba(255,255,255,0)",
              scale: SCALE_RANGE.max
            });
          });
        },
      });

      // ═══════════════════════════════════════════════════════════════════
      // ADAPTIVE SCRUB ADJUSTMENT (VELOCITY-BASED)
      // ═══════════════════════════════════════════════════════════════════
      
      if (!prefersReducedMotion && !isMobile) {
        const updateScrub = () => {
          const velocity = scrollVelocity.current;
          
          let newScrub: number;
          if (velocity > 50) {
            newScrub = SCRUB_CONFIG.fast;
          } else if (velocity > 20) {
            newScrub = SCRUB_CONFIG.medium;
          } else {
            newScrub = SCRUB_CONFIG.slow;
          }
          
          // Smooth transition between scrub values
          gsap.to(scrollTrigger, {
            scrub: newScrub,
            duration: 0.3,
            overwrite: true
          });
        };
        
        const scrubInterval = setInterval(updateScrub, 200);
        
        return () => {
          clearInterval(scrubInterval);
        };
      }
    }, outerRef);

    return () => {
      ctx.revert();
      tweensRef.current.clear();
    };
  }, [text]);

  return (
    <section ref={outerRef} className="relative w-full">
      <div
        ref={pinRef}
        className="sticky top-0 h-screen flex items-center"
      >
        <div className="w-full md:w-[80%] lg:w-[60%] mx-auto px-[5%]">
          <h1
            className="text-white font-light mb-10"
            style={{
              fontFamily: "var(--font-heading, 'Migra', sans-serif)",
              fontSize: "clamp(2.6rem,6vw,5.4rem)",
            }}
          >
            {title}
          </h1>

          <p
            className="text-neutral-300"
            style={{
              fontFamily: "var(--font-body, 'Saans', sans-serif)",
              fontWeight: 600,
              fontSize: "clamp(1.25rem,1.7vw,1.65rem)",
              lineHeight: "1.85",
            }}
          >
            {text.split(" ").map((w, i) => (
              <span key={i} className="inline-block">
                <span
                  className="word inline-block"
                  style={{
                    padding: "0 0.14em",
                    margin: "0 2px",
                    lineHeight: "1em",
                    borderRadius: "999px",
                    backgroundColor: "rgba(255,255,255,0)",
                    willChange: "transform, background-color",
                    transformOrigin: "center center"
                  }}
                >
                  <span style={{ opacity: 0 }}>{w}</span>
                </span>{" "}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
};

export default IntentionalTextReveal;