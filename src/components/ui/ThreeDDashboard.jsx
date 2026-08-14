import { motion } from 'framer-motion'
import { useId } from 'react'
import { cn } from '../../utils/cn'

export default function ThreeDDashboard({ className }) {
  const uid = useId().replace(/:/g, "");
  return (
    <motion.div
      className={cn("relative flex items-center justify-center", className)}
      whileHover={{
        scale: 1.18,
        rotateZ: 6,
        rotateY: -18,
        rotateX: -6,
        filter: 'drop-shadow(0 14px 28px rgba(79,70,229,0.45))',
      }}
      whileTap={{ scale: 0.93, rotateZ: 0 }}
      style={{ perspective: 700 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
    >
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Base plate gradient - Indigo/Purple */}
          <linearGradient id={`home-body-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818CF8" />
            <stop offset="40%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#312E81" />
          </linearGradient>

          {/* Top gloss */}
          <linearGradient id={`home-gloss-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
            <stop offset="55%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* House Base */}
          <linearGradient id={`house-base-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.85" />
          </linearGradient>

          {/* House Roof - vibrant cyan */}
          <linearGradient id={`house-roof-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22D3EE" />
            <stop offset="100%" stopColor="#0891B2" />
          </linearGradient>

          {/* Door */}
          <linearGradient id={`house-door-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#312E81" stopOpacity="0.9" />
          </linearGradient>

          {/* Drop shadow for base */}
          <filter id={`home-drop-${uid}`} x="-15%" y="-15%" width="140%" height="155%">
            <feDropShadow dx="0" dy="7" stdDeviation="6" floodColor="#312E81" floodOpacity="0.45"/>
          </filter>

          {/* Shadow for house elements */}
          <filter id={`house-shadow-${uid}`}>
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#1e1b4b" floodOpacity="0.3"/>
          </filter>
        </defs>

        {/* Main rounded-square body */}
        <rect x="8" y="8" width="104" height="104" rx="26" fill={`url(#home-body-${uid})`} filter={`url(#home-drop-${uid})`} />

        {/* Top-edge gloss panel */}
        <rect x="8" y="8" width="104" height="60" rx="26" fill={`url(#home-gloss-${uid})`} />

        {/* Left edge highlight */}
        <path d="M 9.5 34 L 9.5 86" stroke="#C7D2FE" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>

        {/* --- House Elements --- */}
        <g filter={`url(#house-shadow-${uid})`}>
          {/* House Body */}
          <rect x="30" y="50" width="60" height="40" rx="6" fill={`url(#house-base-${uid})`} />
          
          {/* House Roof */}
          <path d="M 22 55 L 60 22 L 98 55 Z" fill={`url(#house-roof-${uid})`} stroke={`url(#house-roof-${uid})`} strokeWidth="6" strokeLinejoin="round" />
          
          {/* Door */}
          <rect x="48" y="65" width="24" height="25" rx="4" fill={`url(#house-door-${uid})`} />
          <circle cx="66" cy="77.5" r="2" fill="#ffffff" />
        </g>
      </svg>
    </motion.div>
  )
}
