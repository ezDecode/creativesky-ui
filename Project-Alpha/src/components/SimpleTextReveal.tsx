/**
 * SimpleTextReveal - Paragraph-level one-time reveal animation
 * 
 * Designed for AboutMe content - reveals once on scroll, no continuous jitter.
 * Respects prefers-reduced-motion and provides smooth paragraph-level animation.
 */

import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

interface SimpleTextRevealProps {
  title: string;
  text: string;
}

const SimpleTextReveal: React.FC<SimpleTextRevealProps> = ({ title, text }) => {
  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  // Title animation variants
  const titleVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: prefersReducedMotion ? 0 : 30,
      filter: prefersReducedMotion ? 'blur(0px)' : 'blur(10px)'
    },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: 'blur(0px)',
      transition: { 
        duration: prefersReducedMotion ? 0.3 : 0.8, 
        ease: [0.16, 1, 0.3, 1] 
      }
    }
  };

  // Paragraph animation variants - single reveal, no continuous animation
  const paragraphVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: prefersReducedMotion ? 0 : 20,
      filter: prefersReducedMotion ? 'blur(0px)' : 'blur(8px)'
    },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: 'blur(0px)',
      transition: { 
        duration: prefersReducedMotion ? 0.3 : 1.0, 
        ease: [0.16, 1, 0.3, 1],
        delay: prefersReducedMotion ? 0 : 0.2
      }
    }
  };

  return (
    <section className="relative w-full min-h-screen flex items-center py-24">
      <div className="w-full md:w-[80%] lg:w-[60%] mx-auto px-[5%]">
        {/* Title - Reveals once on scroll into view */}
        <motion.h1
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={titleVariants}
          className="text-white font-light mb-10"
          style={{
            fontFamily: "var(--font-heading, 'Migra', sans-serif)",
            fontSize: "clamp(2.6rem,6vw,5.4rem)",
          }}
        >
          {title}
        </motion.h1>

        {/* Paragraph - Reveals once on scroll into view, no word-level jitter */}
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={paragraphVariants}
          className="text-neutral-300"
          style={{
            fontFamily: "var(--font-body, 'Saans', sans-serif)",
            fontWeight: 400,
            fontSize: "clamp(1.25rem,1.7vw,1.65rem)",
            lineHeight: "1.85",
          }}
        >
          {text}
        </motion.p>
      </div>
    </section>
  );
};

export default SimpleTextReveal;
