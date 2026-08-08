import { motion } from 'framer-motion'
import { useId } from 'react'
import { cn } from '../../utils/cn'

export default function ThreeDSettings({ className }) {
  const uid = useId().replace(/:/g, "");
  return (
    <motion.div
      className={cn("relative flex items-center justify-center", className)}
      whileHover={{ scale: 1.15, rotate: 45, filter: 'drop-shadow(0 0 12px rgba(180,200,255,0.5)) drop-shadow(0 6px 18px rgba(0,0,0,0.5))' }}
      whileTap={{ scale: 0.9, rotate: 90 }}
      style={{ perspective: 600 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
    >
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Chrome gradient for gear body */}
          <linearGradient id={`gear-chrome-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#e8e8e8" />
            <stop offset="20%"  stopColor="#ffffff" />
            <stop offset="40%"  stopColor="#9a9fa8" />
            <stop offset="58%"  stopColor="#d8dde6" />
            <stop offset="78%"  stopColor="#787e8a" />
            <stop offset="100%" stopColor="#4a4e56" />
          </linearGradient>

          {/* Rim bevel gradient */}
          <linearGradient id={`gear-rim-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#b0b8c8" />
            <stop offset="100%" stopColor="#50565e" />
          </linearGradient>

          {/* Inner hole gradient */}
          <radialGradient id={`gear-hole-${uid}`} cx="40%" cy="35%" r="65%">
            <stop offset="0%"   stopColor="#3a3d44" />
            <stop offset="60%"  stopColor="#18191e" />
            <stop offset="100%" stopColor="#0a0b0d" />
          </radialGradient>

          {/* Inner rim highlight */}
          <linearGradient id={`gear-hole-rim-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#707880" stopOpacity="1" />
            <stop offset="100%" stopColor="#20232a" stopOpacity="1" />
          </linearGradient>

          {/* Top gloss */}
          <linearGradient id={`gear-gloss-${uid}`} x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="50%"  stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Drop shadow */}
          <filter id={`gear-drop-${uid}`} x="-25%" y="-25%" width="150%" height="160%">
            <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000000" floodOpacity="0.55"/>
          </filter>

          {/* Inner shadow for depth */}
          <filter id={`gear-inner-${uid}`}>
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>
        </defs>

        {/* ── GEAR SHAPE (8-tooth) ── */}
        {/* We draw the gear as a base circle with 8 rectangular teeth */}
        <g filter={`url(#gear-drop-${uid})`}>
          {/* Base circle */}
          <circle cx="60" cy="60" r="38" fill={`url(#gear-chrome-${uid})`} />

          {/* 8 teeth around the circle */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 45) * Math.PI / 180
            const cx = 60 + Math.cos(angle) * 38
            const cy = 60 + Math.sin(angle) * 38
            return (
              <rect
                key={i}
                x={cx - 7}
                y={cy - 9}
                width={14}
                height={18}
                rx={4}
                fill={`url(#gear-chrome-${uid})`}
                transform={`rotate(${i * 45}, ${cx}, ${cy})`}
              />
            )
          })}
        </g>

        {/* Gloss overlay on gear */}
        <circle cx="60" cy="60" r="38" fill={`url(#gear-gloss-${uid})`} />
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 45) * Math.PI / 180
          const cx = 60 + Math.cos(angle) * 38
          const cy = 60 + Math.sin(angle) * 38
          return (
            <rect
              key={`gloss-${i}`}
              x={cx - 7}
              y={cy - 9}
              width={14}
              height={9}
              rx={4}
              fill="#ffffff"
              fillOpacity={0.3}
              transform={`rotate(${i * 45}, ${cx}, ${cy})`}
            />
          )
        })}

        {/* Top-left specular highlight */}
        <ellipse cx="44" cy="38" rx="10" ry="6" fill="#ffffff" opacity="0.35" transform="rotate(-30, 44, 38)" />

        {/* Inner hole rim */}
        <circle cx="60" cy="60" r="20" fill={`url(#gear-hole-rim-${uid})`} />

        {/* Inner hole */}
        <circle cx="60" cy="60" r="17" fill={`url(#gear-hole-${uid})`} />

        {/* Inner hole top glare */}
        <ellipse cx="55" cy="55" rx="5" ry="3.5" fill="#ffffff" opacity="0.12" transform="rotate(-20, 55, 55)" />
      </svg>
    </motion.div>
  )
}
