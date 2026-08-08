import { motion } from 'framer-motion'
import { useId } from 'react'
import { cn } from '../../utils/cn'

export default function ThreeDCalendar({ className }) {
  const uid = useId().replace(/:/g, "");
  return (
    <motion.div 
      className={cn("relative flex items-center justify-center overflow-visible", className)}
      whileHover={{ scale: 1.15, rotateZ: -6, rotateY: 15 }}
      whileTap={{ scale: 0.9 }}
      style={{ perspective: 800 }}
    >
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full drop-shadow-xl overflow-visible"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`cal-body-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4f525a" />
            <stop offset="100%" stopColor="#32343a" />
          </linearGradient>
          
          <linearGradient id={`cal-button-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7a7d86" />
            <stop offset="100%" stopColor="#555861" />
          </linearGradient>
          
          <linearGradient id={`cal-ring-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1a1b1e" />
            <stop offset="50%" stopColor="#3b3d45" />
            <stop offset="100%" stopColor="#121315" />
          </linearGradient>

          <filter id={`btn-shadow-${uid}`}>
            <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#111" floodOpacity="0.7"/>
          </filter>
          
          <filter id={`body-shadow-${uid}`}>
            <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.6"/>
          </filter>
        </defs>

        {/* Main Body */}
        <rect x="12" y="20" width="76" height="74" rx="16" fill={`url(#cal-body-${uid})`} filter={`url(#body-shadow-${uid})`} />
        
        {/* Top Edge Highlight */}
        <path d="M 28 21.5 L 72 21.5" stroke="#717580" strokeWidth="1.5" strokeLinecap="round" />
        
        {/* Header line separator */}
        <line x1="12" y1="42" x2="88" y2="42" stroke="#232428" strokeWidth="2.5" />
        <line x1="12" y1="43.5" x2="88" y2="43.5" stroke="#5a5e67" strokeWidth="1" />

        {/* Rings */}
        <g dropShadow="0 4px 2px rgba(0,0,0,0.5)">
          {/* Left Ring */}
          <rect x="25" y="6" width="12" height="26" rx="6" fill={`url(#cal-ring-${uid})`} filter={`url(#btn-shadow-${uid})`} />
          {/* Right Ring */}
          <rect x="63" y="6" width="12" height="26" rx="6" fill={`url(#cal-ring-${uid})`} filter={`url(#btn-shadow-${uid})`} />
        </g>

        {/* Buttons (3x3 grid minus bottom right) */}
        <g filter={`url(#btn-shadow-${uid})`}>
          {/* Row 1 */}
          <rect x="23" y="52" width="14" height="12" rx="3.5" fill={`url(#cal-button-${uid})`} />
          <rect x="43" y="52" width="14" height="12" rx="3.5" fill={`url(#cal-button-${uid})`} />
          <rect x="63" y="52" width="14" height="12" rx="3.5" fill={`url(#cal-button-${uid})`} />
          
          {/* Row 2 */}
          <rect x="23" y="69" width="14" height="12" rx="3.5" fill={`url(#cal-button-${uid})`} />
          <rect x="43" y="69" width="14" height="12" rx="3.5" fill={`url(#cal-button-${uid})`} />
          <rect x="63" y="69" width="14" height="12" rx="3.5" fill={`url(#cal-button-${uid})`} />
          
          {/* Row 3 */}
          <rect x="23" y="86" width="14" height="12" rx="3.5" fill={`url(#cal-button-${uid})`} />
          <rect x="43" y="86" width="14" height="12" rx="3.5" fill={`url(#cal-button-${uid})`} />
        </g>
        
        {/* Button top highlights to make them pop out more */}
        <g opacity="0.7">
          <line x1="25" y1="53" x2="35" y2="53" stroke="#aab0be" strokeWidth="1" strokeLinecap="round" />
          <line x1="45" y1="53" x2="55" y2="53" stroke="#aab0be" strokeWidth="1" strokeLinecap="round" />
          <line x1="65" y1="53" x2="75" y2="53" stroke="#aab0be" strokeWidth="1" strokeLinecap="round" />
          
          <line x1="25" y1="70" x2="35" y2="70" stroke="#aab0be" strokeWidth="1" strokeLinecap="round" />
          <line x1="45" y1="70" x2="55" y2="70" stroke="#aab0be" strokeWidth="1" strokeLinecap="round" />
          <line x1="65" y1="70" x2="75" y2="70" stroke="#aab0be" strokeWidth="1" strokeLinecap="round" />
          
          <line x1="25" y1="87" x2="35" y2="87" stroke="#aab0be" strokeWidth="1" strokeLinecap="round" />
          <line x1="45" y1="87" x2="55" y2="87" stroke="#aab0be" strokeWidth="1" strokeLinecap="round" />
        </g>
      </svg>
    </motion.div>
  )
}
