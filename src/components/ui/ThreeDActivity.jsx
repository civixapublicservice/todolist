import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

export default function ThreeDActivity({ className }) {
  return (
    <motion.div
      className={cn("relative flex items-center justify-center", className)}
      initial="rest"
      animate="rest"
      variants={{
        rest: {
          scale: 1, rotateY: 0, rotateX: 0,
          filter: 'none',
          transition: { type: 'spring', stiffness: 300, damping: 20, filter: { duration: 0 } }
        },
        hover: {
          scale: 1.18, rotateY: 20, rotateX: -8,
          filter: 'drop-shadow(0 0 8px rgba(80,160,255,0.55)) drop-shadow(0 6px 14px rgba(0,40,120,0.35))',
          transition: { type: 'spring', stiffness: 300, damping: 20 }
        }
      }}
      whileHover="hover"
      whileTap={{ scale: 0.92 }}
      style={{ perspective: 700 }}
    >
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Dark navy background */}
          <radialGradient id="act-bg" cx="40%" cy="35%" r="70%">
            <stop offset="0%"  stopColor="#0d2045" />
            <stop offset="100%" stopColor="#050d1e" />
          </radialGradient>

          {/* Bar 3D gradient — blue steel */}
          <linearGradient id="act-bar" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"  stopColor="#1a4a8a" />
            <stop offset="45%" stopColor="#2e6fc0" />
            <stop offset="100%" stopColor="#0d2c5e" />
          </linearGradient>

          {/* Bar top face */}
          <linearGradient id="act-bar-top" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"  stopColor="#4a90d8" />
            <stop offset="100%" stopColor="#2060a8" />
          </linearGradient>

          {/* Glow arrow gradient */}
          <linearGradient id="act-arrow" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%"  stopColor="#60b0ff" stopOpacity="0.6" />
            <stop offset="60%" stopColor="#a0d8ff" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>

          {/* Arrow glow filter — tighter spread */}
          <filter id="act-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Soft glow for arrowhead — reduced */}
          <filter id="act-tip-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Drop shadow — tight, no bleed */}
          <filter id="act-drop" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#0a1a40" floodOpacity="0.4"/>
          </filter>

          {/* Clip to icon bounds */}
          <clipPath id="act-clip">
            <circle cx="60" cy="60" r="50"/>
          </clipPath>
        </defs>

        {/* Background circle — clipped, no bleed */}
        <circle cx="60" cy="60" r="50" fill="url(#act-bg)" filter="url(#act-drop)" clipPath="url(#act-clip)" />
        {/* Subtle rim highlight */}
        <circle cx="60" cy="60" r="50" fill="none" stroke="#1a3a6a" strokeWidth="1.5" />
        <path d="M 26 32 A 50 50 0 0 1 94 32" stroke="#2a5090" strokeWidth="1" fill="none" opacity="0.5"/>

        {/* ── BAR CHART (7 bars, rising left to right) ── */}
        {/* Bar heights from left to right: 18, 22, 28, 35, 42, 55, 68 */}
        {[
          { x: 14, h: 18 },
          { x: 26, h: 24 },
          { x: 38, h: 30 },
          { x: 50, h: 38 },
          { x: 62, h: 46 },
          { x: 74, h: 58 },
          { x: 86, h: 68 },
        ].map(({ x, h }, i) => (
          <g key={i}>
            {/* Bar front face */}
            <rect
              x={x} y={100 - h} width={10} height={h}
              fill="url(#act-bar)"
              rx="1.5"
            />
            {/* Bar top face (3D effect) */}
            <rect
              x={x} y={100 - h} width={10} height={3}
              fill="url(#act-bar-top)"
              rx="1"
            />
            {/* Right side face (darker) */}
            <rect
              x={x + 10} y={100 - h + 1.5} width={3} height={h - 1.5}
              fill="#0d2c5e"
              rx="0.5"
              opacity="0.8"
            />
          </g>
        ))}

        {/* ── TREND ARROW LINE ── */}
        {/* Glow trail line — no static filter */}
        <path
          d="M 16 90 L 38 72 L 58 80 L 95 28"
          stroke="url(#act-arrow)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.7"
        />
        {/* Sharp bright line on top */}
        <path
          d="M 16 90 L 38 72 L 58 80 L 95 28"
          stroke="#c8e8ff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* ── ARROWHEAD ── no static filter */}
        <circle cx="95" cy="28" r="8" fill="#60b0ff" opacity="0.18" />
        <circle cx="95" cy="28" r="5" fill="#a0d0ff" opacity="0.35" />
        {/* Solid bright arrowhead */}
        <polygon points="95,18 104,32 86,32" fill="white" opacity="0.9" />
        <polygon points="95,20 102,31 88,31" fill="#c0e4ff" />
      </svg>
    </motion.div>
  )
}
