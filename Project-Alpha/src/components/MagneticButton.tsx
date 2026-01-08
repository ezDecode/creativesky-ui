"use client";

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverVariant?: 'light' | 'dark';
  customColor?: string;
  style?: React.CSSProperties; // --- ADD STYLE PROP ---
}

const MagneticButton: React.FC<MagneticButtonProps> = ({ 
  children, 
  className = '', 
  onClick,
  hoverVariant = 'light',
  customColor,
  style // --- ACCEPT STYLE PROP ---
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const flairRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    const flair = flairRef.current;

    if (!button || !flair) return;

    const xSet = gsap.quickSetter(flair, "xPercent");
    const ySet = gsap.quickSetter(flair, "yPercent");

    const getXY = (e: MouseEvent) => {
      const { left, top, width, height } = button.getBoundingClientRect();
      const xTransformer = gsap.utils.pipe(
        gsap.utils.mapRange(0, width, 0, 100),
        gsap.utils.clamp(0, 100)
      );
      const yTransformer = gsap.utils.pipe(
        gsap.utils.mapRange(0, height, 0, 100),
        gsap.utils.clamp(0, 100)
      );
      return {
        x: xTransformer(e.clientX - left),
        y: yTransformer(e.clientY - top),
      };
    };

    const mouseEnter = (e: MouseEvent) => {
      const { x, y } = getXY(e);
      xSet(x);
      ySet(y);
      gsap.to(flair, { scale: 1, duration: 0.4, ease: 'power2.out' });
    };

    const mouseLeave = (e: MouseEvent) => {
      const { x, y } = getXY(e);
      gsap.killTweensOf(flair);
      gsap.to(flair, {
        xPercent: x > 90 ? x + 20 : x < 10 ? x - 20 : x,
        yPercent: y > 90 ? y + 20 : y < 10 ? y - 20 : y,
        scale: 0,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const mouseMove = (e: MouseEvent) => {
      const { x, y } = getXY(e);
      gsap.to(flair, {
        xPercent: x,
        yPercent: y,
        duration: 0.4,
        ease: 'power2',
      });
    };

    button.addEventListener('mouseenter', mouseEnter);
    button.addEventListener('mouseleave', mouseLeave);
    button.addEventListener('mousemove', mouseMove);

    return () => {
      button.removeEventListener('mouseenter', mouseEnter);
      button.removeEventListener('mouseleave', mouseLeave);
      button.removeEventListener('mousemove', mouseMove);
    };
  }, []);

  // --- DETERMINE FLAIR COLOR: CUSTOM COLOR OR VARIANT ---
  const flairColor = customColor 
    ? '' // No class if custom color
    : hoverVariant === 'light' ? 'bg-white' : 'bg-black';
  
  // --- TEXT COLOR ON HOVER: BLACK FOR CUSTOM COLORS, OTHERWISE USE VARIANT ---
  const textHoverColor = customColor 
    ? 'group-hover:text-black' 
    : hoverVariant === 'light' ? 'group-hover:text-black' : 'group-hover:text-white';

  return (
    <button
      ref={buttonRef}
      className={`relative overflow-hidden group ${className}`}
      onClick={onClick}
      style={style} // --- APPLY STYLE PROP ---
    >
      <span
        ref={flairRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none transform scale-0"
        style={{ transformOrigin: '0 0' }}
      >
        <span 
          className={`absolute top-0 left-0 w-[170%] aspect-square rounded-full transform -translate-x-1/2 -translate-y-1/2 ${flairColor}`}
          style={customColor ? { backgroundColor: customColor } : {}}
        ></span>
      </span>
      <span className={`relative z-10 transition-colors duration-150 ${textHoverColor}`}>
        {children}
      </span>
    </button>
  );
};

export default MagneticButton;