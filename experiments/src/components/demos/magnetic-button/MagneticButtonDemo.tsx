"use client";

import React from 'react';
import MagneticButton from '../../../content/magnetic-button/magnetic-button';

const MagneticButtonDemo: React.FC = () => {
	return (
		<div className="flex w-full h-56 items-center justify-center">
			<MagneticButton
				onClick={() => console.log('Magnetic button clicked')}
				hoverVariant="custom"
				customColor="#fff" // you can apply any color here
				className="px-8 py-2 rounded-full text-white shadow-lg"
				style={{
                    border: '2px solid #fff', // update here the same color as customColor
					fontSize: '1rem',
					fontWeight: 600,
					transition: 'all 0.33s cubic-bezier(0.22, 1, 0.36, 1)'
				}}
			>
				Hover Me
			</MagneticButton>
		</div>
	);
};

export default MagneticButtonDemo;

