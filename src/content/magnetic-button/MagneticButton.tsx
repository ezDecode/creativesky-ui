"use client";

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface MagneticButtonProps {
	children: React.ReactNode;
	className?: string;
	onClick?: () => void;
	hoverVariant?: 'light' | 'dark' | 'custom';
	customColor?: string;
	style?: React.CSSProperties;
}

const MagneticButton: React.FC<MagneticButtonProps> = ({ 
	children, 
	className = '', 
	onClick,
	hoverVariant = 'light',
	customColor,
	style
}) => {
	const buttonRef = useRef<HTMLButtonElement>(null);
	const flairRef = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		const button = buttonRef.current;
		const flair = flairRef.current;

		if (!button || !flair) return;

		const xSet = gsap.quickSetter(flair, "xPercent") as (v: number) => void;
		const ySet = gsap.quickSetter(flair, "yPercent") as (v: number) => void;

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

		const mouseEnter = (e: MouseEvent | Touch) => {
			const evt = e as MouseEvent;
			const { x, y } = getXY(evt as MouseEvent);
			xSet(x);
			ySet(y);
			gsap.to(flair, { scale: 1, duration: 0.4, ease: 'power2.out' });
		};

		const mouseLeave = (e: MouseEvent | TouchEvent | null) => {
			// For touchend there is no coordinates; just animate exit from current position
			let x = 50;
			let y = 50;
			if (e && 'clientX' in (e as MouseEvent)) {
				const coords = getXY(e as MouseEvent);
				x = coords.x;
				y = coords.y;
			}
			gsap.killTweensOf(flair);
			gsap.to(flair, {
				xPercent: x > 90 ? x + 20 : x < 10 ? x - 20 : x,
				yPercent: y > 90 ? y + 20 : y < 10 ? y - 20 : y,
				scale: 0,
				duration: 0.3,
				ease: 'power2.out',
			});
		};

		const mouseMove = (e: MouseEvent | Touch) => {
			const evt = e as MouseEvent;
			const { x, y } = getXY(evt as MouseEvent);
			gsap.to(flair, {
				xPercent: x,
				yPercent: y,
				duration: 0.25,
				ease: 'power2',
			});
		};

		// Touch handlers (map first touch to mouse handlers)
		const touchStart = (e: TouchEvent) => {
			if (!e.touches || e.touches.length === 0) return;
			const t = e.touches[0];
			mouseEnter(t as unknown as MouseEvent);
		};

		const touchMove = (e: TouchEvent) => {
			if (!e.touches || e.touches.length === 0) return;
			const t = e.touches[0];
			mouseMove(t as unknown as MouseEvent);
		};

		const touchEnd = () => {
			mouseLeave(null);
		};

		button.addEventListener('mouseenter', mouseEnter as EventListener);
		button.addEventListener('mouseleave', mouseLeave as EventListener);
		button.addEventListener('mousemove', mouseMove as EventListener);
		button.addEventListener('touchstart', touchStart as EventListener, { passive: true });
		button.addEventListener('touchmove', touchMove as EventListener, { passive: true });
		button.addEventListener('touchend', touchEnd as EventListener);

		return () => {
			button.removeEventListener('mouseenter', mouseEnter as EventListener);
			button.removeEventListener('mouseleave', mouseLeave as EventListener);
			button.removeEventListener('mousemove', mouseMove as EventListener);
			button.removeEventListener('touchstart', touchStart as EventListener);
			button.removeEventListener('touchmove', touchMove as EventListener);
			button.removeEventListener('touchend', touchEnd as EventListener);
		};
	}, []);

	const flairColor = customColor 
		? '' 
		: hoverVariant === 'light' ? 'bg-white' : 'bg-black';
  
	const textHoverColor = customColor 
		? 'group-hover:text-black' 
		: hoverVariant === 'light' ? 'group-hover:text-black' : 'group-hover:text-white';

	return (
		<button
			type="button"
			ref={buttonRef}
			className={`relative overflow-hidden group focus:outline-none focus:ring-2 focus:ring-offset-2 ${className}`}
			onClick={onClick}
			style={style}
			aria-label={typeof children === 'string' ? children : 'Magnetic button'}
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

