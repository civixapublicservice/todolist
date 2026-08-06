import { useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, CheckSquare, BarChart3, Calendar as CalendarIcon, Settings, ChevronRight } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { motion } from 'framer-motion'
import { cn } from '../utils/cn'

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
      className="w-64 apple-glass-panel m-4 mr-0 rounded-[32px] flex flex-col justify-between hidden md:flex shrink-0 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
      
      <div className="p-5 flex flex-col h-full relative z-10">
        {/* Branding */}
        <motion.div 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center space-x-3 px-2 mb-8 mt-2 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-[14px] shadow-glow">
            <CheckSquare className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
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
                  isActive ? "text-foreground font-bold" : "text-foreground/70 font-medium hover:text-foreground"
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
                    isActive ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary" : "group-hover:bg-foreground/5 text-foreground/70"
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
          <div className="flex items-center space-x-3 px-3 py-3 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/20 dark:hover:border-white/10 transition-all cursor-pointer group">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-accent shadow-sm flex items-center justify-center text-white font-bold shrink-0 ring-2 ring-background group-hover:shadow-glow transition-all">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex flex-col min-w-0 text-left">
              <span className="text-sm font-semibold tracking-tight truncate text-foreground group-hover:text-primary transition-colors">{user?.name || 'User'}</span>
              <span className="text-xs font-medium tracking-wide text-muted-foreground truncate">{user?.email || 'user@taskflow.com'}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.aside>
  )
}
