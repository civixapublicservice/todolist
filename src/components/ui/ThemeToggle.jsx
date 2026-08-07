import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { cn } from '../../utils/cn'

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative flex items-center w-[110px] h-11 rounded-full",
        "bg-foreground/5 border border-foreground/10",
        "shadow-[inset_0_2px_6px_rgba(0,0,0,0.1)]",
        "dark:shadow-[inset_0_2px_6px_rgba(0,0,0,0.4)]",
        "transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "overflow-visible shrink-0 ml-2"
      )}
      aria-label="Toggle Theme"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {/* Text Labels - Fade in/out based on state */}
      <span 
        className={cn(
          "absolute right-4 text-[13px] font-bold tracking-wide transition-opacity duration-300",
          !isDark ? "opacity-100 text-foreground" : "opacity-0"
        )}
      >
        Light
      </span>
      <span 
        className={cn(
          "absolute left-4 text-[13px] font-bold tracking-wide transition-opacity duration-300",
          isDark ? "opacity-100 text-foreground" : "opacity-0"
        )}
      >
        Dark
      </span>

      {/* Glass Thumb */}
      <motion.div
        animate={{
          x: isDark ? 56 : -4, 
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={cn(
          "absolute flex items-center justify-center w-14 h-14 rounded-full z-10 top-1/2 -translate-y-1/2",
          "backdrop-blur-xl border border-white/40 dark:border-white/10",
          // Complex shadow for 3D glass sphere effect
          "bg-white/20 dark:bg-black/20",
          "shadow-[0_8px_16px_-4px_rgba(0,0,0,0.15),inset_0_4px_8px_rgba(255,255,255,0.6),inset_0_-4px_8px_rgba(0,0,0,0.05)]",
          "dark:shadow-[0_8px_16px_-4px_rgba(0,0,0,0.5),inset_0_4px_8px_rgba(255,255,255,0.15),inset_0_-4px_8px_rgba(0,0,0,0.4)]"
        )}
      >
        {isDark ? (
          <Moon className="w-6 h-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" strokeWidth={2} />
        ) : (
          <Sun className="w-6 h-6 text-foreground drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" strokeWidth={2} />
        )}
      </motion.div>
    </button>
  )
}
