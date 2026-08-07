import { useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '../utils/cn'
import ThreeDCalendar from './ui/ThreeDCalendar'
import ThreeDTaskList from './ui/ThreeDTaskList'
import ThreeDActivity from './ui/ThreeDActivity'
import ThreeDSettings from './ui/ThreeDSettings'

export default function MobileNav() {
  const location = useLocation()
  const navigate = useNavigate()

  const navItems = [
    { id: 'dashboard', label: 'Home', path: '/', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tasks', path: '/tasks', icon: ThreeDTaskList },
    { id: 'activity', label: 'Activity', path: '/activity', icon: ThreeDActivity },
    { id: 'calendar', label: 'Calendar', path: '/calendar', icon: ThreeDCalendar },
    { id: 'settings', label: 'Settings', path: '/settings', icon: ThreeDSettings },
  ]

  const currentPath = location.pathname

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 glass-panel border-t border-glass-border z-50 px-2 pb-safe pt-2 bg-background/90 backdrop-blur-xl">
      <div className="flex items-center justify-around h-14">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPath === item.path
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center p-1 rounded-xl min-w-[64px] transition-all duration-300",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative flex flex-col items-center">
                <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "")} />
                <span className={cn("text-[10px] mt-1 font-medium transition-all duration-300", isActive ? "opacity-100 translate-y-0" : "opacity-70")}>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="mobileNavIndicator"
                    className="absolute -top-1 right-0 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(124,58,237,0.8)]"
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
