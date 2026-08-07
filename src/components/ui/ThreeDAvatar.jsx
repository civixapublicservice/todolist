import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

export default function ThreeDAvatar({ className, animate = true }) {
  return (
    <motion.div 
      className={cn("relative flex items-center justify-center cursor-pointer", className)}
      whileHover={animate ? { scale: 1.05, rotateY: 15, rotateX: -10 } : {}}
      whileTap={animate ? { scale: 0.95 } : {}}
      style={{ perspective: 1000 }}
    >
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full rounded-full drop-shadow-2xl overflow-hidden"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Ultra-realistic film grain / noise */}
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/>
            <feColorMatrix type="matrix" values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 0.25 0" />
          </filter>

          {/* Glass dome lighting (dark edge, transparent center, rim light) */}
          <radialGradient id="glass-dome" cx="50%" cy="40%" r="60%" fx="40%" fy="30%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
            <stop offset="45%" stopColor="#111111" stopOpacity="0.7" />
            <stop offset="85%" stopColor="#000000" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.5" />
          </radialGradient>

          {/* Sharp top edge glare */}
          <linearGradient id="sharp-glare" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="15%" stopColor="#ffffff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          
          {/* Studio softbox reflection left */}
          <linearGradient id="softbox-left" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Studio softbox reflection right */}
          <linearGradient id="softbox-right" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          
          <filter id="blur-soft">
            <feGaussianBlur stdDeviation="1.2" />
          </filter>
        </defs>

        {/* Background Grain */}
        <circle cx="50" cy="50" r="50" fill="#4a4a4a" />
        <circle cx="50" cy="50" r="50" filter="url(#noise)" opacity="0.75" />

        {/* --- HEAD DOME --- */}
        <g transform="translate(0, -3)">
          {/* Base sphere */}
          <circle cx="50" cy="45" r="19" fill="url(#glass-dome)" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.4" />
          
          {/* Top sharp crack/glare */}
          <path d="M 37 29 Q 50 25 63 29" stroke="url(#sharp-glare)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M 34 31 Q 50 27 66 31" stroke="#ffffff" strokeWidth="1" fill="none" opacity="0.9" />
          
          {/* Left Softbox Reflection */}
          <path d="M 35 52 Q 33 45 37 38 L 42 39 Q 38 45 39 51 Z" fill="url(#softbox-left)" filter="url(#blur-soft)" />
          
          {/* Right Softbox Reflection */}
          <path d="M 65 52 Q 67 45 63 38 L 58 39 Q 62 45 61 51 Z" fill="url(#softbox-right)" filter="url(#blur-soft)" />
        </g>

        {/* --- BODY DOME --- */}
        <g transform="translate(0, 8)">
          {/* Base dome */}
          <circle cx="50" cy="100" r="34" fill="url(#glass-dome)" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.4" />
          
          {/* Top sharp crack/glare */}
          <path d="M 29 73 Q 50 64 71 73" stroke="url(#sharp-glare)" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 25 76 Q 50 67 75 76" stroke="#ffffff" strokeWidth="1.5" fill="none" opacity="0.8" />
          
          {/* Left Softbox */}
          <path d="M 23 98 Q 20 86 28 79 L 34 83 Q 26 89 28 98 Z" fill="url(#softbox-left)" filter="url(#blur-soft)" opacity="0.8" />
          
          {/* Right Softbox */}
          <path d="M 77 98 Q 80 86 72 79 L 66 83 Q 74 89 72 98 Z" fill="url(#softbox-right)" filter="url(#blur-soft)" opacity="0.8" />
        </g>
      </svg>
    </motion.div>
  )
}
