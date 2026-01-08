"use client";

import React, { useRef, useState, useEffect } from 'react';
// import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { Variants } from 'framer-motion';
import Navbar from './Navbar';
import MagneticButton from './MagneticButton';

interface HeroSectionProps {
  startAnimation: boolean;
  isScrolled: boolean;
  isMobile: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ startAnimation, isScrolled }) => {
  const navigate = useNavigate();
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ['start start', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0.5, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0.5, 1], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  
  const [showAboutPreview, setShowAboutPreview] = useState(false);
  const [isTouchDevice] = useState(() => 'ontouchstart' in window || navigator.maxTouchPoints > 0);


  // Animation variants
  const containerVariants: Variants = { 
    hidden: { opacity: 0 }, 
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.08, 
        delayChildren: 0.2 
      } 
    } 
  };

  const wordVariants: Variants = { 
    hidden: { 
      filter: 'blur(10px)', 
      opacity: 0, 
      y: 20 
    }, 
    visible: { 
      filter: 'blur(0px)', 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1] 
      } 
    } 
  };

  const imageVariants: Variants = { 
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      rotate: -10
    }, 
    visible: { 
      opacity: 1, 
      scale: 1,
      rotate: 0,
      transition: { 
        duration: 1, 
        ease: [0.16, 1, 0.3, 1], 
        delay: 0.5 
      } 
    } 
  };

  const fadeInUpVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1] 
      }
    }
  };

  // Social buttons container with stagger
  const socialContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 1.2
      }
    }
  };

  // Individual button animation with blur
  const buttonVariants: Variants = {
    hidden: {
      filter: 'blur(10px)',
      opacity: 0,
      y: 20
    },
    visible: {
      filter: 'blur(0px)',
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <div ref={targetRef} id="home" className="relative min-h-screen w-full">
      <Navbar isScrolled={isScrolled} />
      
      <motion.div 
        style={{ opacity, scale, y }} 
        className="flex flex-col items-center justify-center min-h-screen w-full relative py-24"
      >
        {/* Editorial Content Vessel: 60% on desktop, responsive on smaller screens */}
        <div className="w-full md:w-[80%] lg:w-[60%] mx-auto relative">
          {/* Inner padding: 10% total (5% left + 5% right) */}
          <div className="px-[5%]">
            
            {/* Main Heading */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={startAnimation ? 'visible' : 'hidden'}
              className="mb-6 md:mb-7"
            >
              <h1 
                className="text-white font-light text-left cursor-default" 
                style={{ fontFamily: "var(--font-heading, 'Migra', sans-serif)", fontWeight: 200, lineHeight: '1.1', letterSpacing: '-0.02em' }}
              >
              <div className="flex flex-col justify-start items-start gap-y-2 md:gap-y-2">
                {/* First line: "Designing with [icon]" */}
                <div className="flex flex-wrap justify-start items-center gap-x-3 md:gap-x-4 text-[clamp(2.5rem,6vw,5.6rem)]">
                  {["Designing", "with"].map((word, index) => (
                    <motion.span 
                      key={`line1-${index}`} 
                      className="inline-block"
                      variants={wordVariants}
                    >
                      {word}
                    </motion.span>
                  ))}
                  
                  <motion.span 
                    variants={imageVariants} 
                    className="inline-flex items-center justify-center relative group cursor-pointer transition-colors duration-300"
                    style={{ top: '8%' }}
                    onMouseEnter={() => !isTouchDevice && setShowAboutPreview(true)}
                    onMouseLeave={() => !isTouchDevice && setShowAboutPreview(false)}
                    onClick={() => navigate('/about')}
                  >
                    <img 
                      src="/assets/ForSiteMainWhite.png" 
                      alt="Design element" 
                      className="h-[clamp(2.2rem,5.7vw,5.2rem)] w-auto object-contain"
                    />
                    
                    {/* About Me Preview - Desktop Hover Only */}
                    {showAboutPreview && !isTouchDevice && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute top-full mt-4 left-1/2 -translate-x-1/2 bg-neutral-900/95 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl z-150 pointer-events-none"
                        style={{ width: '280px' }}
                      >
                        <p className="text-neutral-300 text-xs leading-relaxed mb-3" style={{ fontFamily: "var(--font-body, 'Saans', sans-serif)" }}>
                          Full-stack developer bridging design and engineering with modern frameworks.
                        </p>
                        <div className="flex gap-1.5">
                          <span className="px-2.5 py-1 bg-white/10 rounded-full text-[10px] text-white">Developer</span>
                          <span className="px-2.5 py-1 bg-white/10 rounded-full text-[10px] text-white">Designer</span>
                          <span className="px-2.5 py-1 bg-white/10 rounded-full text-[10px] text-white">Systems</span>
                        </div>
                      </motion.div>
                    )}
                  </motion.span>
                </div>
                
                {/* Second line: "humans at the centre." */}
                <div className="flex flex-wrap justify-start items-center gap-x-3 md:gap-x-4 text-[clamp(2.5rem,6vw,5.6rem)]">
                  {["humans", "at", "the", "centre."].map((word, index) => (
                    <motion.span 
                      key={`line2-${index}`} 
                      className="inline-block"
                      variants={wordVariants}
                    >
                      {word}
                    </motion.span>
                  ))}
                </div>
              </div>
            </h1>
          </motion.div>

            {/* Description */}
            <motion.div
              initial="hidden"
              animate={startAnimation ? 'visible' : 'hidden'}
              variants={fadeInUpVariants}
              transition={{ delay: 0.8 }}
              className="mb-8 mt-6 md:mt-7"
            >
              <div 
                className="text-left tracking-normal text-[clamp(1.27rem,1.51vw,1.44rem)] font-light typography-condensed" 
                style={{ fontFamily: "var(--font-body, 'Saans', sans-serif)", fontWeight: 400, color: '#fff', lineHeight: '1.7' }}
              >
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={startAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                >
                  I build systems that balance ambition with pragmatism. My work spans reusable foundations that scale, intelligent visual experiences that adapt, and cloud-native reliability that endures. Each layer reveals a deeper understanding of what it means to engineer for humans, not just machines.{' '}
                  <span 
                    onClick={() => navigate('/projects')}
                    className="inline-block text-white/80 hover:text-white transition-all duration-200 cursor-pointer"
                    style={{ fontFamily: "var(--font-body, 'Saans', sans-serif)" }}
                  >
                    See more...
                  </span>
                </motion.span>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Social Links Container - Full Width Vessel */}
        <div className="w-full md:w-[80%] lg:w-[60%] mx-auto">
          <div className="px-[5%]">

            {/* Social Links - No gaps between buttons */}
            <motion.div
              initial="hidden"
              animate={startAnimation ? 'visible' : 'hidden'}
              variants={socialContainerVariants}
              className="flex items-center flex-wrap"
              style={{ gap: 0 }}
              role="group"
              aria-label="Social media links"
            >
              <motion.div variants={buttonVariants}>
                <MagneticButton
                  onClick={() => window.open('https://github.com/ezDecode', '_blank')}
                  hoverVariant="dark"
                  customColor="#b3efb2"
                  className="border border-white/30 rounded-none text-white/80 hover:rounded-full transition-[border-radius] duration-200"
                  style={{ 
                    fontSize: '1.02rem',
                    fontWeight: 450,
                    paddingLeft: '2.55rem',
                    paddingRight: '2.975rem',
                    paddingTop: '0.6375rem',
                    paddingBottom: '0.6375rem',
                    border: '1px solid rgba(255,255,255,0.22)'
                  }}
                >
                  <span className="flex items-center gap-2.5" style={{ fontFamily: "var(--font-body, 'Saans', sans-serif)" }}>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <span className="sr-only">GitHub - </span>ezDecode
                  </span>
                </MagneticButton>
              </motion.div>
              
              <motion.div variants={buttonVariants}>
                <MagneticButton
                  onClick={() => window.open('https://www.linkedin.com/in/akash-choudhury037/', '_blank')}
                  hoverVariant="dark"
                  customColor="#42cafd"
                  className="border border-white/30 rounded-none text-white/80 hover:rounded-full transition-[border-radius] duration-200"
                  style={{ 
                    fontSize: '1.02rem',
                    fontWeight: 450,
                    paddingLeft: '2.55rem',
                    paddingRight: '2.975rem',
                    paddingTop: '0.6375rem',
                    paddingBottom: '0.6375rem',
                    marginLeft: '-1px',
                    border: '1px solid rgba(255,255,255,0.22)'
                  }}
                >
                  <span className="flex items-center gap-2.5" style={{ fontFamily: "var(--font-body, 'Saans', sans-serif)" }}>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <span className="sr-only">LinkedIn - </span>@akash-choudhury037
                  </span>
                </MagneticButton>
              </motion.div>
              
              <motion.div variants={buttonVariants}>
                <MagneticButton
                  onClick={() => window.location.href = 'mailto:ezdecode@gmail.com'}
                  hoverVariant="dark"
                  customColor="#3157ffff"
                  className="border border-white/30 rounded-none text-white/80 hover:rounded-full transition-[border-radius] duration-200"
                  style={{ 
                    fontSize: '1.02rem',
                    fontWeight: 450,
                    paddingLeft: '2.55rem',
                    paddingRight: '2.975rem',
                    paddingTop: '0.6375rem',
                    paddingBottom: '0.6375rem',
                    marginLeft: '-1px',
                    border: '1px solid rgba(255,255,255,0.22)'
                  }}
                >
                  <span className="flex items-center gap-2.5" style={{ fontFamily: "var(--font-body, 'Saans', sans-serif)" }}>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
                    </svg>
                    <span className="sr-only">Email - </span>Gmail
                  </span>
                </MagneticButton>
              </motion.div>
              
              <motion.div variants={buttonVariants}>
                <MagneticButton
                  onClick={() => navigate('/about')}
                  hoverVariant="dark"
                  customColor="#f0e100"
                  className="border border-white/30 rounded-none text-white/80 hover:rounded-full transition-[border-radius] duration-200"
                  style={{ 
                    fontSize: '1.02rem',
                    fontWeight: 450,
                    paddingLeft: '2.55rem',
                    paddingRight: '2.975rem',
                    paddingTop: '0.6375rem',
                    paddingBottom: '0.6375rem',
                    marginLeft: '-1px',
                    border: '1px solid rgba(255,255,255,0.22)'
                  }}
                >
                  <span className="flex items-center gap-2.5" style={{ fontFamily: "var(--font-body, 'Saans', sans-serif)" }}>
                    <img 
                      src="/assets/ForSiteMainWhite.png" 
                      alt="" 
                      aria-hidden="true"
                      className="w-5 h-5 object-contain"
                    />
                    About Me
                  </span>
                </MagneticButton>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
