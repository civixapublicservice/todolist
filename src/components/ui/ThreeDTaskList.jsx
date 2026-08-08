import { motion } from 'framer-motion'
import { useId } from 'react'
import { cn } from '../../utils/cn'

export default function ThreeDTaskList({ className }) {
  const uid = useId().replace(/:/g, "");
  return (
    <motion.div
      className={cn("relative flex items-center justify-center", className)}
      whileHover={{
        scale: 1.18,
        rotateZ: 6,
        rotateY: -18,
        rotateX: -6,
        filter: 'drop-shadow(0 14px 28px rgba(30,100,220,0.45))',
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
          {/* Blue body gradient */}
          <linearGradient id={`tl-body-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"  stopColor="#5eaef8" />
            <stop offset="40%" stopColor="#2e7de9" />
            <stop offset="100%" stopColor="#1454c0" />
          </linearGradient>

          {/* Top gloss */}
          <linearGradient id={`tl-gloss-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"  stopColor="#ffffff" stopOpacity="0.45" />
            <stop offset="55%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Row bar gradient */}
          <linearGradient id={`tl-bar-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"  stopColor="#d8eaff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#a8c8f8" stopOpacity="0.85" />
          </linearGradient>

          {/* White circle dot */}
          <radialGradient id={`tl-dot-${uid}`} cx="35%" cy="30%" r="65%">
            <stop offset="0%"  stopColor="#ffffff" />
            <stop offset="100%" stopColor="#c8dcf8" />
          </radialGradient>

          {/* Drop shadow */}
          <filter id={`tl-drop-${uid}`} x="-15%" y="-15%" width="140%" height="155%">
            <feDropShadow dx="0" dy="7" stdDeviation="6" floodColor="#1040a0" floodOpacity="0.45"/>
          </filter>

          {/* Bar shadow */}
          <filter id={`tl-bar-shadow-${uid}`}>
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0a2060" floodOpacity="0.3"/>
          </filter>
        </defs>

        {/* Main rounded-square body */}
        <rect x="8" y="8" width="104" height="104" rx="26" fill={`url(#tl-body-${uid})`} filter={`url(#tl-drop-${uid})`} />

        {/* Top-edge gloss panel */}
        <rect x="8" y="8" width="104" height="60" rx="26" fill={`url(#tl-gloss-${uid})`} />

        {/* Left edge highlight */}
        <path d="M 9.5 34 L 9.5 86" stroke="#7ac0ff" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>

        {/* ── Row 1 ── */}
        <g filter={`url(#tl-bar-shadow-${uid})`}>
          <rect x="24" y="28" width="72" height="18" rx="9" fill={`url(#tl-bar-${uid})`} />
        </g>
        <circle cx="33" cy="37" r="8" fill={`url(#tl-dot-${uid})`} />
        {/* dot glare */}
        <circle cx="30.5" cy="34.5" r="2.5" fill="#ffffff" opacity="0.75"/>

        {/* ── Row 2 ── */}
        <g filter={`url(#tl-bar-shadow-${uid})`}>
          <rect x="24" y="51" width="72" height="18" rx="9" fill={`url(#tl-bar-${uid})`} />
        </g>
        <circle cx="33" cy="60" r="8" fill={`url(#tl-dot-${uid})`} />
        <circle cx="30.5" cy="57.5" r="2.5" fill="#ffffff" opacity="0.75"/>

        {/* ── Row 3 ── */}
        <g filter={`url(#tl-bar-shadow-${uid})`}>
          <rect x="24" y="74" width="72" height="18" rx="9" fill={`url(#tl-bar-${uid})`} />
        </g>
        <circle cx="33" cy="83" r="8" fill={`url(#tl-dot-${uid})`} />
        <circle cx="30.5" cy="80.5" r="2.5" fill="#ffffff" opacity="0.75"/>
      </svg>
    </motion.div>
  )
}
