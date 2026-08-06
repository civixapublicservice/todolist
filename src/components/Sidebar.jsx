import { useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, CheckSquare, BarChart3, Calendar as CalendarIcon, Settings, ChevronRight } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { motion } from 'framer-motion'
import { cn } from '../utils/cn'
import ThreeDLogo from './ui/ThreeDLogo'
import ThreeDAvatar from './ui/ThreeDAvatar'

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { id: 'tasks', label: 'My Tasks', path: '/tasks', icon: CheckSquare },
    { id: 'analytics', label: 'Activity', path: '/activity', icon: BarChart3 },
    { id: 'calendar', label: 'Calendar', path: '/calendar', icon: CalendarIcon },
    { id: 'settings', label: 'Settings', path: '/settings', icon: Settings },
  ]

  const currentPath = location.pathname

  return (
    <motion.aside 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 apple-glass-panel m-4 mr-2 rounded-[32px] flex flex-col justify-between hidden md:flex shrink-0 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
      
      <div className="p-5 flex flex-col h-full relative z-10">
        {/* Branding */}
        <motion.div 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center space-x-3 px-3 mb-8 mt-2 cursor-pointer group"
          onClick={() => navigate('/')}
        >
          <ThreeDLogo className="w-10 h-10 group-hover:scale-110 transition-transform duration-500" />
          <span className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-foreground to-muted-foreground drop-shadow-sm">
            TaskFlow
          </span>
        </motion.div>

        {/* Navigation */}
        <nav className="space-y-2 flex-1 mt-4">
          {navItems.map((item, index) => {
            const Icon = item.icon
            const isActive = currentPath === item.path
            return (
              <motion.button
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                key={item.id}
                onClick={() => navigate(item.path)}
                className={cn(
                  "relative w-full flex items-center justify-between px-3 py-3 rounded-2xl text-sm tracking-wide transition-all duration-300 group",
                  isActive ? "text-foreground font-bold" : "text-foreground/90 font-semibold hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 apple-glass-active rounded-2xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <div className="relative z-10 flex items-center space-x-3">
                  <div className={cn(
                    "p-1.5 rounded-xl transition-colors duration-300",
                    isActive ? "bg-primary/15 text-primary dark:bg-primary/30 dark:text-primary" : "group-hover:bg-foreground/10 text-foreground/80"
                  )}>
                    <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 1.5} />
                  </div>
                  <span>{item.label}</span>
                </div>
                {isActive && (
                  <ChevronRight className="h-4 w-4 relative z-10 opacity-70" />
                )}
              </motion.button>
            )
          })}
        </nav>

        {/* Footer utilities */}
        <motion.div 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-auto pt-4"
        >
          {/* User Profile */}
          <div className="flex items-center space-x-3.5 px-3 py-3 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/20 dark:hover:border-white/10 transition-all cursor-pointer group">
            <ThreeDAvatar className="w-12 h-12 shrink-0 drop-shadow-md" animate={false} />
            <div className="flex flex-col min-w-0 text-left justify-center">
              <span className="text-[17px] font-bold tracking-tight truncate text-foreground group-hover:text-primary transition-colors leading-tight mb-0.5">{user?.name || 'adadadadada'}</span>
              <span className="text-sm font-medium tracking-wide text-muted-foreground/90 truncate leading-tight">{user?.email || 'aaxa12@gmail.com'}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.aside>
  )
}
