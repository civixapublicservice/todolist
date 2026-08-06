import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

export default function ChromeAvatar({ className, animate = true }) {
  return (
    <motion.div 
      className={cn("relative flex items-center justify-center cursor-pointer", className)}
      whileHover={animate ? { scale: 1.08, rotateY: 15, rotateX: -5 } : {}}
      whileTap={animate ? { scale: 0.92, rotateY: 0 } : {}}
      style={{ perspective: 1000 }}
    >
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full drop-shadow-2xl overflow-visible"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Highly reflective chrome gradient */}
          <linearGradient id="chrome-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="15%" stopColor="#a8b0bc" />
            <stop offset="35%" stopColor="#1a1c23" />
            <stop offset="50%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#7a828e" />
            <stop offset="100%" stopColor="#05070a" />
          </linearGradient>
          
          {/* Inner highlight for rim lighting */}
          <linearGradient id="chrome-highlight" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1"/>
            <stop offset="30%" stopColor="#ffffff" stopOpacity="0"/>
            <stop offset="70%" stopColor="#ffffff" stopOpacity="0"/>
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.5"/>
          </linearGradient>

          {/* Dark glassy interior */}
          <linearGradient id="dark-glass" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#313946" />
            <stop offset="40%" stopColor="#161a22" />
            <stop offset="100%" stopColor="#080a0e" />
          </linearGradient>
          
          {/* Inset shadow for 3D depth inside the glass */}
          <filter id="inset-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feOffset dx="0" dy="5"/>
            <feGaussianBlur stdDeviation="5" result="offset-blur"/>
            <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
            <feFlood floodColor="black" floodOpacity="0.9" result="color"/>
            <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
            <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
          </filter>
          
          <filter id="glare-blur">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
        </defs>

        <g filter="url(#inset-shadow)">
          {/* Head base */}
          <circle cx="50" cy="30" r="23" fill="url(#dark-glass)" stroke="url(#chrome-gradient)" strokeWidth="6" />
          {/* Head inner highlight */}
          <circle cx="50" cy="30" r="20" fill="none" stroke="url(#chrome-highlight)" strokeWidth="1.5" />
          {/* Head top glare */}
          <path d="M 33 20 A 15 15 0 0 1 67 20" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.7" filter="url(#glare-blur)" />

          {/* Body base */}
          <path 
            d="M 12 88 C 12 66, 25 54, 41 60 Q 50 63, 59 60 C 75 54, 88 66, 88 88 Q 88 96, 76 96 L 24 96 Q 12 96, 12 88 Z" 
            fill="url(#dark-glass)" 
            stroke="url(#chrome-gradient)" 
            strokeWidth="6"
            strokeLinejoin="round"
          />
          {/* Body inner highlight */}
          <path 
            d="M 17 86 C 17 69, 28 60, 42 65 Q 50 68, 58 65 C 72 60, 83 69, 83 86 Q 83 91, 75 91 L 25 91 Q 17 91, 17 86 Z" 
            fill="none" 
            stroke="url(#chrome-highlight)" 
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Body top glare */}
          <path d="M 28 62 C 38 58, 62 58, 72 62" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" filter="url(#glare-blur)" />
        </g>
      </svg>
    </motion.div>
  )
}
