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
        "relative flex items-center justify-center w-11 h-11 rounded-full",
        "bg-white/60 dark:bg-black/40 backdrop-blur-xl",
        "border border-black/5 dark:border-white/10",
        "shadow-sm dark:shadow-none",
        "hover:scale-105 active:scale-95 transition-all duration-300",
        "outline-none focus-visible:ring-2 focus-visible:ring-primary"
      )}
      aria-label="Toggle Theme"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        <Sun 
          className={cn(
            "absolute inset-0 w-5 h-5 text-zinc-800 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
            isDark ? "rotate-90 opacity-0 scale-50" : "rotate-0 opacity-100 scale-100"
          )} 
          strokeWidth={2.5} 
        />
        <Moon 
          className={cn(
            "absolute inset-0 w-5 h-5 text-zinc-100 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
            isDark ? "rotate-0 opacity-100 scale-100" : "-rotate-90 opacity-0 scale-50"
          )} 
          strokeWidth={2.5} 
        />
      </div>
    </button>
  )
}
