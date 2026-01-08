import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  isScrolled: boolean;
}

/* =========================
   HyperText Component
========================= */

interface HyperTextProps {
  text: string;
  className?: string;
  duration?: number;
}

const DEFAULT_CHARACTER_SET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:".split("");
const getRandomInt = (max: number): number => Math.floor(Math.random() * max);

const HyperText: React.FC<HyperTextProps> = ({
  text,
  className = '',
  duration = 800,
}) => {
  const [displayText, setDisplayText] = useState<string[]>(text.split(""));
  const [isAnimating, setIsAnimating] = useState(false);
  const iterationCount = useRef(0);

  const handleMouseEnter = () => {
    if (!isAnimating) {
      iterationCount.current = 0;
      setIsAnimating(true);
    }
  };

  useEffect(() => {
    if (!isAnimating) return;

    const maxIterations = text.length;
    const startTime = performance.now();
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      iterationCount.current = progress * maxIterations;

      setDisplayText(() =>
        text.split("").map((letter, index) => {
          if (letter === " " || letter === ":" ) return letter;
          if (index < iterationCount.current) return text[index];
          return DEFAULT_CHARACTER_SET[getRandomInt(DEFAULT_CHARACTER_SET.length)];
        })
      );

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [text, duration, isAnimating]);

  return (
    <span className={className} onMouseEnter={handleMouseEnter}>
      <AnimatePresence>
        {displayText.map((letter, index) => (
          <motion.span key={index} className="font-mono">
            {letter}
          </motion.span>
        ))}
      </AnimatePresence>
    </span>
  );
};

/* =========================
   Navbar Component
========================= */

const Navbar: React.FC<NavbarProps> = ({ isScrolled }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isAboutPage = location.pathname === '/about';

  /* ----- Time State (About Page Only) ----- */
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    if (!isAboutPage) return;

    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [isAboutPage]);

  const timeString = now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const dayString = now.toLocaleDateString([], { weekday: 'long' });

  return (
    <div className="fixed top-0 left-0 right-0 z-100 flex justify-center pointer-events-none">
      <div className="w-full md:w-[80%] lg:w-[60%] mt-6 pointer-events-none">
        <div className="px-[5%] pointer-events-none">

          <motion.nav
            initial={{ y: -20, opacity: 0, filter: 'blur(10px)' }}
            animate={{
              y: 0,
              opacity: 1,
              filter: 'blur(0px)',
              backgroundColor: isScrolled
                ? 'rgba(10, 10, 10, 0.7)'
                : 'rgba(255, 255, 255, 0.03)',
            }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.2,
            }}
            className="relative w-full backdrop-blur-2xl pointer-events-auto overflow-hidden"
            style={{
              boxShadow:
                'inset 0 1px 0 0 rgba(255,255,255,0.1), 0 8px 24px -4px rgba(0,0,0,0.5)',
            }}
          >
            <div className="absolute inset-0 bg-linear-to-b from-white/8 to-transparent opacity-50 pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between gap-6 md:gap-12 px-6 py-4">

              {/* LEFT — LOGO */}
              <motion.div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => navigate('/')}
                whileTap={{ scale: 0.98 }}
              >
                <img
                  src="/assets/ForSiteMainWhite.png"
                  alt="Logo"
                  className="w-7 h-7 md:w-8 md:h-8 object-contain"
                />
                <span
                  className="text-white text-base md:text-lg font-medium tracking-tight"
                  style={{ fontFamily: "var(--font-ui, 'Saans', sans-serif)" }}
                >
                  CreativeSky
                </span>
              </motion.div>

              {/* RIGHT — CONTEXT CONTENT */}
              {!isAboutPage ? (
                /* HOME / HERO — EMAIL */
                <motion.a
                  href="mailto:ezdecode@gmail.com"
                  className="text-white/70 hover:text-white text-sm md:text-base font-medium transition-colors"
                  style={{ fontFamily: "var(--font-ui, 'Saans', sans-serif)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <HyperText
                    text="EZDECODE@GMAIL.COM"
                    className="text-white"
                    duration={600}
                  />
                </motion.a>
              ) : (
                /* ABOUT PAGE — TIME + DAY */
                <div
                  className="text-right leading-tight"
                  style={{ fontFamily: "var(--font-ui, 'Saans', sans-serif)" }}
                >
                  <div className="text-white text-sm md:text-base">
                    <HyperText text={timeString} duration={400} />
                  </div>
                  <div className="text-white/50 text-xs md:text-sm">
                    {dayString}
                  </div>
                </div>
              )}

            </div>
          </motion.nav>

        </div>
      </div>
    </div>
  );
};

export default Navbar;
