import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

export default function ChromeCalendar({ className }) {
  return (
    <motion.div
      className={cn("relative flex items-center justify-center", className)}
      whileHover={{
        scale: 1.18,
        rotateZ: -8,
        rotateY: 18,
        rotateX: -6,
        filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.45))',
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
          {/* --- Main body chrome gradient (silver satin look) --- */}
          <linearGradient id="cc-body" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"  stopColor="#d8d8d8" />
            <stop offset="18%" stopColor="#f4f4f4" />
            <stop offset="38%" stopColor="#9e9e9e" />
            <stop offset="55%" stopColor="#e8e8e8" />
            <stop offset="75%" stopColor="#b0b0b0" />
            <stop offset="100%" stopColor="#6e6e6e" />
          </linearGradient>

          {/* --- Side bevel (darker edge) --- */}
          <linearGradient id="cc-bevel" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"  stopColor="#c0c0c0" />
            <stop offset="100%" stopColor="#6a6a6a" />
          </linearGradient>

          {/* --- Ring chrome --- */}
          <linearGradient id="cc-ring" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"  stopColor="#f0f0f0" />
            <stop offset="25%" stopColor="#8a8a8a" />
            <stop offset="50%" stopColor="#f5f5f5" />
            <stop offset="75%" stopColor="#707070" />
            <stop offset="100%" stopColor="#e0e0e0" />
          </linearGradient>

          {/* --- Ring inner shadow --- */}
          <radialGradient id="cc-ring-inner" cx="50%" cy="40%" r="60%">
            <stop offset="0%"  stopColor="#ffffff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.6" />
          </radialGradient>

          {/* --- Button raised chrome --- */}
          <linearGradient id="cc-btn" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"  stopColor="#d0d0d0" />
            <stop offset="35%" stopColor="#a0a0a0" />
            <stop offset="100%" stopColor="#787878" />
          </linearGradient>

          {/* --- Button inset (pressed) --- */}
          <linearGradient id="cc-btn-inset" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"  stopColor="#5a5a5a" />
            <stop offset="100%" stopColor="#909090" />
          </linearGradient>

          {/* --- Body drop shadow --- */}
          <filter id="cc-drop" x="-20%" y="-20%" width="150%" height="160%">
            <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#000" floodOpacity="0.45"/>
          </filter>

          {/* --- Button micro-shadow --- */}
          <filter id="cc-btn-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="2" floodColor="#000" floodOpacity="0.5"/>
          </filter>

          {/* --- Gloss overlay --- */}
          <linearGradient id="cc-gloss" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"  stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="55%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* =================== MAIN BODY =================== */}
        <rect
          x="10" y="22" width="100" height="90"
          rx="16"
          fill="url(#cc-body)"
          filter="url(#cc-drop)"
        />

        {/* Right side bevel */}
        <rect x="107" y="30" width="5" height="74" rx="2.5" fill="url(#cc-bevel)" opacity="0.7" />

        {/* Top gloss panel */}
        <rect x="10" y="22" width="100" height="45" rx="16" fill="url(#cc-gloss)" />

        {/* Top-edge highlight */}
        <path d="M 27 23.5 L 93 23.5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.8" />

        {/* Leather-texture band across the top of body */}
        <rect x="10" y="22" width="100" height="30" rx="16" fill="#c8c8c8" opacity="0.25"/>

        {/* =================== RINGS =================== */}
        {/* Left Ring outer torus */}
        <ellipse cx="38" cy="22" rx="10" ry="19" fill="url(#cc-ring)" />
        <ellipse cx="38" cy="22" rx="10" ry="19" fill="url(#cc-ring-inner)" />
        {/* Left Ring hole */}
        <ellipse cx="38" cy="22" rx="5.5" ry="12" fill="#1a1a1a" />
        <ellipse cx="36.5" cy="18" rx="2.5" ry="5" fill="#ffffff" opacity="0.18" />

        {/* Right Ring outer torus */}
        <ellipse cx="82" cy="22" rx="10" ry="19" fill="url(#cc-ring)" />
        <ellipse cx="82" cy="22" rx="10" ry="19" fill="url(#cc-ring-inner)" />
        {/* Right Ring hole */}
        <ellipse cx="82" cy="22" rx="5.5" ry="12" fill="#1a1a1a" />
        <ellipse cx="80.5" cy="18" rx="2.5" ry="5" fill="#ffffff" opacity="0.18" />

        {/* =================== DATE GRID BUTTONS (3x4) =================== */}
        {/* Row 1 */}
        {[22,42,62,82].map((x, i) => (
          <g key={`r1-${i}`} filter="url(#cc-btn-shadow)">
            <rect x={x} y="60" width="16" height="13" rx="3.5" fill="url(#cc-btn)" />
            <rect x={x} y="60" width="16" height="5"  rx="3.5" fill="url(#cc-btn-inset)" opacity="0.5" />
            <line x1={x+2} y1="61.5" x2={x+14} y2="61.5" stroke="#e0e0e0" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
          </g>
        ))}

        {/* Row 2 */}
        {[22,42,62,82].map((x, i) => (
          <g key={`r2-${i}`} filter="url(#cc-btn-shadow)">
            <rect x={x} y="78" width="16" height="13" rx="3.5" fill="url(#cc-btn)" />
            <rect x={x} y="78" width="16" height="5"  rx="3.5" fill="url(#cc-btn-inset)" opacity="0.5" />
            <line x1={x+2} y1="79.5" x2={x+14} y2="79.5" stroke="#e0e0e0" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
          </g>
        ))}

        {/* Row 3 */}
        {[22,42,62,82].map((x, i) => (
          <g key={`r3-${i}`} filter="url(#cc-btn-shadow)">
            <rect x={x} y="96" width="16" height="11" rx="3.5" fill="url(#cc-btn)" />
            <rect x={x} y="96" width="16" height="4"  rx="3.5" fill="url(#cc-btn-inset)" opacity="0.45" />
            <line x1={x+2} y1="97.5" x2={x+14} y2="97.5" stroke="#e0e0e0" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
          </g>
        ))}
      </svg>
    </motion.div>
  )
}
