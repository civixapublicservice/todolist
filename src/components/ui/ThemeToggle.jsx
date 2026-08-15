// Theme Toggle Component
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { cn } from '../../utils/cn'

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative flex items-center w-[92px] h-[38px] rounded-full",
        "bg-foreground/5 border border-foreground/10",
        "shadow-[inset_0_2px_6px_rgba(0,0,0,0.1)]",
        "dark:shadow-[inset_0_2px_6px_rgba(0,0,0,0.4)]",
        "transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "overflow-visible shrink-0"
      )}
      aria-label="Toggle Theme"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {/* Text Labels - Fade in/out based on state */}
      <span 
        className={cn(
          "absolute right-3.5 text-[13px] font-bold tracking-wide transition-opacity duration-200",
          !isDark ? "opacity-100 text-foreground" : "opacity-0"
        )}
      >
        Light
      </span>
      <span 
        className={cn(
          "absolute left-3.5 text-[13px] font-bold tracking-wide transition-opacity duration-200",
          isDark ? "opacity-100 text-foreground" : "opacity-0"
        )}
      >
        Dark
      </span>

      {/* Glass Thumb */}
      <div
        style={{ transform: `translate3d(${isDark ? 54 : -2}px, -50%, 0)` }}
        className={cn(
          "absolute flex items-center justify-center w-[40px] h-[40px] rounded-full z-10 top-1/2",
          "transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]", // Spring-like easing
          "backdrop-blur-xl border border-white/40 dark:border-white/10",
          "bg-white/20 dark:bg-black/20",
          "shadow-[0_8px_16px_-4px_rgba(0,0,0,0.15),inset_0_4px_8px_rgba(255,255,255,0.6),inset_0_-4px_8px_rgba(0,0,0,0.05)]",
          "dark:shadow-[0_8px_16px_-4px_rgba(0,0,0,0.5),inset_0_4px_8px_rgba(255,255,255,0.15),inset_0_-4px_8px_rgba(0,0,0,0.4)]"
        )}
      >
        <div className="relative w-[18px] h-[18px]">
          <Sun 
            className={cn(
              "absolute inset-0 w-full h-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
              isDark ? "rotate-90 opacity-0 scale-50" : "rotate-0 opacity-100 scale-100",
              "text-foreground drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            )} 
            strokeWidth={2.5} 
          />
          <Moon 
            className={cn(
              "absolute inset-0 w-full h-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
              isDark ? "rotate-0 opacity-100 scale-100" : "-rotate-90 opacity-0 scale-50",
              "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
            )} 
            strokeWidth={2.5} 
          />
        </div>
      </div>
    </button>
  )
}
