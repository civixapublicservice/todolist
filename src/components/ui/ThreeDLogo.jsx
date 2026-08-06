import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

export default function ThreeDLogo({ className }) {
  return (
    <motion.div 
      className={cn("relative flex items-center justify-center", className)}
      animate={{ 
        rotateY: [0, 10, -10, 0],
      }}
      transition={{ 
        repeat: Infinity, 
        duration: 5, 
        ease: "easeInOut" 
      }}
      style={{ perspective: 1000 }}
    >
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full drop-shadow-2xl overflow-visible"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Base coin gradient */}
          <linearGradient id="coin-base" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="50%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          {/* Chrome border gradient */}
          <linearGradient id="coin-rim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="20%" stopColor="#94a3b8" />
            <stop offset="50%" stopColor="#334155" />
            <stop offset="80%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>

          {/* Bold glowing checkmark gradient */}
          <linearGradient id="glow-check" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>

          <filter id="shadow-deep" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#000000" floodOpacity="0.6" />
          </filter>
          
          <filter id="shadow-inset">
            <feOffset dx="0" dy="3"/>
            <feGaussianBlur stdDeviation="3" result="offset-blur"/>
            <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
            <feFlood floodColor="black" floodOpacity="0.8" result="color"/>
            <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
            <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
          </filter>
          
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <g filter="url(#shadow-deep)">
          {/* Outer Chrome Rim */}
          <rect x="10" y="10" width="80" height="80" rx="28" fill="url(#coin-rim)" />
          
          {/* Inner Dark Glass Base */}
          <rect x="14" y="14" width="72" height="72" rx="24" fill="url(#coin-base)" filter="url(#shadow-inset)" />

          {/* Massive Bold Checkmark */}
          <g filter="url(#glow)">
            <path 
              d="M 28 50 L 42 64 L 72 32" 
              stroke="url(#glow-check)" 
              strokeWidth="12" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
            {/* White highlight on checkmark */}
            <path 
              d="M 28 50 L 42 64 L 72 32" 
              stroke="#ffffff" 
              strokeWidth="4" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              opacity="0.9"
            />
          </g>
        </g>
      </svg>
    </motion.div>
  )
}
