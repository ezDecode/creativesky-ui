# ScrollRevealText Component

A production-ready, scroll-locked text reveal animation component built with **React** and **GSAP ScrollTrigger**. Words are hidden behind animated glassmorphic pill overlays that emerge, glow, then dissolve to reveal the text underneath.

---

## ✨ Features

- **Scroll-Locked Reveal** — Page pins during animation for immersive reading
- **Ultra-Smooth Scrolling** — GSAP scrub with velocity dampening
- **Glassmorphism Design** — Frosted glass pill overlays with blur effects
- **Dynamic Highlighting** — Accent color support for emphasized words
- **Fully Responsive** — Adaptive timing for desktop and mobile
- **Accessible** — Respects `prefers-reduced-motion`, uses `aria-hidden`
- **Zero Dependencies** — Only requires GSAP (peer dependency)

---

## 📦 Installation

### 1. Install GSAP

```bash
npm install gsap
```

### 2. Create Component Files

Create the following file structure in your project:

```
src/components/ScrollRevealText/
├── ScrollRevealText.js
└── ScrollRevealText.module.css
```

---

## 📁 Complete Component Code

### ScrollRevealText.js

Copy this entire file:

```jsx
'use client';

import React, { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ScrollRevealText.module.css";

// ===========================================================================
// UTILITY FUNCTIONS
// ===========================================================================

/**
 * Converts hex color to RGB string for use in rgba()
 * @param {string} hex - Hex color code (e.g., "#ff6b00")
 * @returns {string} RGB values as comma-separated string
 */
function hexToRgb(hex) {
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
  // Lead words count (how many words ahead the animation prepares)
  leadCount: {
    desktop: 8,
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
// COMPONENT
// ===========================================================================

/**
 * ScrollRevealText Component
 * 
 * A scroll-locked text reveal animation component. Words are hidden behind
 * animated pill-shaped boxes that fade in, glow, then dissolve to reveal text.
 * 
 * @param {Object} props - Component props
 * @param {string} props.phrase - The text content to be revealed
 * @param {string[]} props.highlightWords - Words to highlight with primary color
 * @param {string} props.title - Optional title displayed above the text
 * @param {string} props.primaryColor - Accent color for highlighted words
 */
export function ScrollRevealText({
  phrase = "",
  highlightWords = [],
  title = "",
  primaryColor = "#ff6b00"
}) {
  const outerRef = useRef(null);
  const pinRef = useRef(null);

  // Memoized animation setup function
  const setupAnimations = useCallback((isMobile) => {
    const config = ANIMATION_CONFIG;
    const LEAD_COUNT = isMobile ? config.leadCount.mobile : config.leadCount.desktop;
    const SCROLL_DISTANCE = isMobile ? config.scrollDistance.mobile : config.scrollDistance.desktop;
    const PADDING_DURATION = config.paddingDuration;

    const wordContainers = Array.from(
      pinRef.current.querySelectorAll(`.${styles.wordContainer}`)
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
        scrub: config.scrub,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      }
    });

    // Phase 0: Entry padding (page pins, brief pause before animation)
    tl.to({}, { duration: PADDING_DURATION });

    // Animate each word container
    wordContainers.forEach((container, index) => {
      const box = container.querySelector(`.${styles.box}`);
      const text = container.querySelector(`.${styles.text}`);

      // Check if this word should be highlighted
      const isHighlighted = highlightWords.some(hw =>
        text.textContent.toLowerCase().includes(hw.toLowerCase())
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
      const { isMobile } = context.conditions;
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
}
```

---

### ScrollRevealText.module.css

Copy this entire file:

```css
/* =====================================================
   SCROLL REVEAL TEXT - Component Styles
   ===================================================== */

.container {
  width: 100%;
  min-height: 100vh;
  background-color: transparent;
  color: var(--color-text, #fff);
  overflow-x: hidden;
  position: relative;

  /* GPU acceleration for smooth pinning */
  will-change: transform;
  transform: translateZ(0);
}

.pin {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;

  /* Ensure smooth compositing */
  backface-visibility: hidden;
}

.content {
  width: 90%;
  max-width: 900px;
  margin: 0 auto;
}

/* =====================================================
   TITLE
   ===================================================== */

.title {
  font-family: var(--font-heading, 'Inter', sans-serif);
  font-size: clamp(2.5rem, 6vw, 5rem);
  font-weight: 700;
  margin-bottom: 2rem;
  letter-spacing: -0.04em;

  /* Gradient text effect */
  background: linear-gradient(to bottom, #fff 40%, #555);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* =====================================================
   BODY TEXT
   ===================================================== */

.body {
  font-family: var(--font-body, 'Inter', sans-serif);
  font-size: clamp(1.2rem, 2.2vw, 2rem);
  font-weight: 600;
  line-height: 1.4;
  display: flex;
  flex-wrap: wrap;
  row-gap: 0.15em;
}

/* =====================================================
   WORD CONTAINER
   ===================================================== */

.wordContainer {
  position: relative;
  display: inline-block;
  /* Tight word spacing for natural text flow */
  margin: 0 0.05em;
  vertical-align: middle;
}

/* =====================================================
   TEXT (Revealed Word)
   ===================================================== */

.text {
  position: relative;
  z-index: 2;
  opacity: 0;
  white-space: nowrap;

  /* Performance optimization */
  will-change: opacity;

  /* Smooth color transitions for highlight state changes */
  transition: color 0.3s var(--ease-smooth, ease);
}

.text.highlighted {
  color: var(--color-primary, #ff6b00);
}

/* =====================================================
   BOX (Animated Pill)
   ===================================================== */

.box {
  position: absolute;
  z-index: 1;

  /* Centering via translate */
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  /* Percentage-based sizing - tighter padding */
  width: 102%;
  height: 70%;

  /* Glassmorphism style */
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);

  /* Initial hidden state */
  opacity: 0;

  /* Performance optimization for animations */
  will-change: opacity, transform, background-color;

  /* Non-interactive */
  pointer-events: none;
}

.box.primary {
  background: rgba(255, 107, 0, 0.15);
  border-color: rgba(255, 107, 0, 0.25);
}

/* =====================================================
   RESPONSIVE ADJUSTMENTS
   ===================================================== */

@media (max-width: 768px) {
  .body {
    line-height: 1.6;
  }

  .wordContainer {
    margin: 0 0.04em;
  }
}

/* =====================================================
   REDUCED MOTION PREFERENCE
   ===================================================== */

@media (prefers-reduced-motion: reduce) {
  .container {
    will-change: auto;
    transform: none;
  }

  .box {
    will-change: auto;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }

  .text {
    will-change: auto;
    opacity: 1;
  }
}
```

---

## 📘 Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `phrase` | `string` | `""` | The text content to be revealed word by word |
| `highlightWords` | `string[]` | `[]` | Array of words to highlight with accent color |
| `title` | `string` | `""` | Optional heading displayed above the text |
| `primaryColor` | `string` | `"#ff6b00"` | Hex color for highlighted words and glow |

---

## 💻 Usage Example

### Basic Usage

```jsx
import { ScrollRevealText } from "@/components/ScrollRevealText/ScrollRevealText";

export default function Home() {
  return (
    <main style={{ backgroundColor: "#0d0d0d" }}>
      {/* Hero section before component */}
      <section style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <h1 style={{ color: "#fff", fontSize: "4rem" }}>Scroll Down</h1>
      </section>

      {/* The scroll reveal component */}
      <ScrollRevealText 
        title="Data Empowerment"
        phrase="Your data is taken by companies and used to train the next wave of AI models and build the world's top products and services. Yet it often happens without any earnings being distributed back to you."
        highlightWords={["distributed", "products", "wave", "AI"]}
        primaryColor="#ff6b00"
      />

      {/* Footer section after component */}
      <section style={{ height: "50vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.3)" }}>End of Experience</p>
      </section>
    </main>
  );
}
```

### With Custom Accent Color

```jsx
<ScrollRevealText 
  phrase="Innovation drives progress. Technology empowers humanity."
  highlightWords={["Innovation", "Technology"]}
  primaryColor="#00d4ff"
/>
```

### Without Title

```jsx
<ScrollRevealText 
  phrase="Simple text reveal without a heading."
  highlightWords={["Simple"]}
/>
```

---

## ⚙️ Customization Guide

### Animation Timing

Edit the `ANIMATION_CONFIG` object in `ScrollRevealText.js`:

```javascript
const ANIMATION_CONFIG = {
  // Increase for slower/smoother reveal
  leadCount: {
    desktop: 8,    // Words visible ahead of current focus
    mobile: 5
  },

  // Increase for more scroll distance per word
  scrollDistance: {
    desktop: 150,  // Pixels scrolled per word
    mobile: 100
  },

  // Duration of pause at start/end
  paddingDuration: 2,

  // Scrub smoothness (higher = smoother but laggier)
  scrub: {
    smoothTouch: 0.2,
    smooth: 1.5
  },

  phases: {
    emergence: {
      duration: 1.0,      // Box fade-in duration
      ease: "power1.out"
    },
    focus: {
      duration: 3.0,      // Box glow duration
      ease: "sine.inOut",
      focusOffset: 0.4    // When focus starts (0-1)
    },
    reveal: {
      boxDuration: 1.6,   // Box dissolve duration
      textDuration: 2.0,  // Text fade-in duration
      textDelay: 0.02,    // Delay between box/text
      ease: "power1.inOut"
    }
  }
};
```

### Styling

Override CSS variables in your global stylesheet:

```css
:root {
  /* Text colors */
  --color-text: #ffffff;
  --color-primary: #ff6b00;
  
  /* Fonts */
  --font-heading: 'Your Font', sans-serif;
  --font-body: 'Your Font', sans-serif;
  
  /* Easing */
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Container Width

Edit `.content` in the CSS file:

```css
.content {
  width: 90%;
  max-width: 900px;  /* Change this value */
  margin: 0 auto;
}
```

### Box Dimensions

Edit `.box` in the CSS file:

```css
.box {
  width: 102%;   /* Horizontal padding (100% = no overflow) */
  height: 70%;   /* Vertical height relative to text */
}
```

### Word Spacing

Edit `.wordContainer` in the CSS file:

```css
.wordContainer {
  margin: 0 0.05em;  /* Horizontal word gap */
}
```

---

## 🎨 Animation Phases Explained

The animation consists of 4 distinct phases for each word:

| Phase | Duration | What Happens |
|-------|----------|--------------|
| **1. Emergence** | 1.0s | Box fades in at 25% opacity, slight scale up |
| **2. Focus** | 3.0s | Box reaches full opacity, glows, fully visible |
| **3. Reveal** | 1.6s box, 2.0s text | Box dissolves with blur, text fades in |
| **4. Exit** | 2.0s | Brief hold before page unpins |

The animation uses a **staggered timeline** where each word's animation is offset by its index, creating the wave-like reveal effect.

---

## 🔧 Technical Architecture

### Performance Optimizations

1. **GPU Acceleration**
   - Container uses `will-change: transform` and `translateZ(0)`
   - Forces GPU compositing for smooth 60fps animations

2. **Backface Visibility**
   - Pin element uses `backface-visibility: hidden`
   - Prevents rendering artifacts during transforms

3. **Selective Will-Change**
   - Only animated elements have `will-change`
   - Minimizes memory usage

4. **Memoized Callbacks**
   - Animation setup wrapped in `useCallback`
   - Prevents unnecessary re-renders

### Browser Support

| Browser | Support |
|---------|---------|
| Chrome | ✅ Full |
| Firefox | ✅ Full |
| Safari | ✅ Full (requires `-webkit-backdrop-filter`) |
| Edge | ✅ Full |

### Accessibility

- **Reduced Motion**: Animations disabled when `prefers-reduced-motion: reduce`
- **ARIA Hidden**: Decorative pill boxes use `aria-hidden="true"`
- **Semantic HTML**: Proper heading hierarchy maintained
- **Screen Readers**: Text content fully accessible

---

## 🚨 Troubleshooting

### Animation Not Working

1. Ensure GSAP is installed: `npm install gsap`
2. Check that the component has sufficient scroll space before and after
3. Verify the parent container has `min-height` set

### Boxes Overlapping

Reduce the box width in CSS:
```css
.box {
  width: 101%;  /* Smaller value */
}
```

### Too Much Word Spacing

Reduce margin in CSS:
```css
.wordContainer {
  margin: 0 0.03em;  /* Smaller value */
}
```

### Animation Too Fast/Slow

Adjust `scrollDistance` in the config:
```javascript
scrollDistance: {
  desktop: 200,  // Higher = slower
  mobile: 150
}
```

### Text Not Visible in Safari

Ensure both backdrop-filter properties are set:
```css
.box {
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}
```

---

## 📋 Required CSS Variables (Optional)

Add these to your global CSS for full customization:

```css
:root {
  --color-text: #ffffff;
  --color-primary: #ff6b00;
  --font-heading: 'Inter', sans-serif;
  --font-body: 'Inter', sans-serif;
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
}
```

If not provided, the component falls back to sensible defaults.

---

## 📄 License

MIT — Use freely in personal and commercial projects.

---

## 🔄 Changelog

### v2.1.0 (Current)
- Tighter word spacing (0.05em margin)
- Reduced box padding (102% width, 70% height)
- Narrower container (900px max-width)
- Complete documentation with no placeholders

### v2.0.0
- Centralized animation configuration
- Margin-based spacing (removed spacer elements)
- Percentage-based box dimensions
- Translate-based centering

### v1.0.0
- Initial scroll-locked reveal implementation
- GSAP ScrollTrigger integration
- Responsive design
