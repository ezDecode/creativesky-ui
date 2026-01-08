import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScroll, useMotionValueEvent } from 'framer-motion';

import HeroSection from './components/HeroSection';
import AboutMe from './components/AboutMe';
import ProjectsPage from './components/ProjectsPage';

gsap.registerPlugin(ScrollTrigger);

const AppContent: React.FC = () => {
  const animationReady = true;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkDeviceSize = () => setIsMobile(window.innerWidth < 768);
    checkDeviceSize();
    window.addEventListener('resize', checkDeviceSize);
    return () => window.removeEventListener('resize', checkDeviceSize);
  }, []);
  
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const lenisRef = useRef<Lenis | null>(null);
  
  // Reset scroll position on route change
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
  }, [location.pathname]);

  useEffect(() => {
    if (lenisRef.current) return;
    
    // Initialize Lenis with specified settings
    const lenis = new Lenis({ 
      lerp: 0.08,
      wheelMultiplier: 0.8,
      smoothWheel: true
    });
    lenisRef.current = lenis;
    
    // Disable GSAP lag smoothing to avoid double timing
    gsap.ticker.lagSmoothing(0);
    
    // Pipe Lenis RAF through gsap.ticker
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    
    // Call ScrollTrigger.update on Lenis scroll
    lenis.on('scroll', ScrollTrigger.update);
    
    // Handle navigation clicks
    const handleNavClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const href = target.getAttribute('data-scroll-to');
      if (href) {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
          lenis.scrollTo(element as HTMLElement, { 
            offset: 0, 
            duration: 1.5, 
            easing: (t) => 1 - Math.pow(1 - t, 3) 
          });
        }
      }
    };
    document.addEventListener('click', handleNavClick);
    
    return () => {
      document.removeEventListener('click', handleNavClick);
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <>
      {/* Static Background Layer */}
      <div 
        id="bg-layer" 
        className="fixed inset-0 -z-10"
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}
      >
        <div className="absolute inset-0 bg-linear-to-b from-black via-black to-neutral-950" />
        <div className="absolute top-1/4 left-1/4 w-[clamp(24rem,35vw,48rem)] h-[clamp(24rem,35vw,48rem)] bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[clamp(24rem,35vw,48rem)] h-[clamp(24rem,35vw,48rem)] bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* Scrolling Content Layer */}
      <main id="content-layer" className="relative z-1 min-h-screen">
        <Routes>
          <Route path="/" element={<HeroSection startAnimation={animationReady} isScrolled={isScrolled} isMobile={isMobile} />} />
          <Route path="/about" element={<AboutMe />} />
          <Route path="/projects" element={<ProjectsPage />} />
        </Routes>
      </main>
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;