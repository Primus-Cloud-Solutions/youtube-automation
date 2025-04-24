import React from 'react';

const Logo = ({ size = 40, className = '' }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer space circle */}
      <circle cx="50" cy="50" r="50" fill="url(#space-gradient)" />
      
      {/* Play button triangle */}
      <path 
        d="M65 50L40 65V35L65 50Z" 
        fill="url(#play-gradient)" 
        filter="url(#glow)" 
      />
      
      {/* Orbit ring */}
      <ellipse 
        cx="50" 
        cy="50" 
        rx="40" 
        ry="40" 
        stroke="url(#orbit-gradient)" 
        strokeWidth="2" 
        strokeDasharray="4 4" 
        fill="none" 
      />
      
      {/* Small planet */}
      <circle 
        cx="85" 
        cy="30" 
        r="8" 
        fill="url(#planet-gradient)" 
        filter="url(#planet-glow)" 
      />
      
      {/* Definitions */}
      <defs>
        <linearGradient id="space-gradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1E1E3F" />
          <stop offset="1" stopColor="#0F0F23" />
        </linearGradient>
        
        <linearGradient id="play-gradient" x1="40" y1="35" x2="65" y2="65" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#4299E1" />
          <stop offset="1" stopColor="#805AD5" />
        </linearGradient>
        
        <linearGradient id="orbit-gradient" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#4299E1" stopOpacity="0.6" />
          <stop offset="1" stopColor="#805AD5" stopOpacity="0.6" />
        </linearGradient>
        
        <linearGradient id="planet-gradient" x1="77" y1="22" x2="93" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#F687B3" />
          <stop offset="1" stopColor="#ED64A6" />
        </linearGradient>
        
        <filter id="glow" x="35" y="30" width="35" height="40" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
          <feOffset />
          <feGaussianBlur stdDeviation="2" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.258824 0 0 0 0 0.6 0 0 0 0 0.882353 0 0 0 0.5 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
        
        <filter id="planet-glow" x="72" y="17" width="26" height="26" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
          <feOffset />
          <feGaussianBlur stdDeviation="2" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.964706 0 0 0 0 0.392157 0 0 0 0 0.65098 0 0 0 0.5 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
      </defs>
    </svg>
  );
};

export default Logo;
