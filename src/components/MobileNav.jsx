import { useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, CheckSquare, Activity, CalendarDays, Settings } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '../utils/cn'

export default function MobileNav() {
  const location = useLocation()
  const navigate = useNavigate()

  const navItems = [
    { id: 'dashboard', label: 'Home', path: '/', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tasks', path: '/tasks', icon: CheckSquare },
    { id: 'activity', label: 'Activity', path: '/activity', icon: Activity },
    { id: 'calendar', label: 'Calendar', path: '/calendar', icon: CalendarDays },
    { id: 'settings', label: 'Settings', path: '/settings', icon: Settings },
  ]

  const currentPath = location.pathname

  return (
    <div className="md:hidden fixed bottom-4 pb-safe left-4 right-4 z-50">
      <div className="flex items-center justify-around h-16 px-1 bg-background/85 dark:bg-[#121212]/85 backdrop-blur-3xl border border-white/20 dark:border-white/10 shadow-2xl rounded-3xl">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPath === item.path
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={cn(
                "relative flex flex-col items-center justify-center w-[60px] h-14 rounded-2xl transition-all duration-300 group",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="mobileNavIndicator"
                  className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-2xl"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <div className="relative z-10 flex flex-col items-center">
                <Icon strokeWidth={isActive ? 2.5 : 2} className={cn("w-5 h-5 mb-1 transition-transform duration-300", isActive ? "scale-110" : "group-hover:scale-110")} />
                <span className={cn("text-[10px] font-bold tracking-wide transition-all duration-300", isActive ? "opacity-100" : "opacity-80 font-medium")}>{item.label}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
