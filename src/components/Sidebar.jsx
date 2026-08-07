import { useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ChevronRight } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { motion } from 'framer-motion'
import { cn } from '../utils/cn'
import ThreeDLogo from './ui/ThreeDLogo'
import ThreeDAvatar from './ui/ThreeDAvatar'
import ThreeDCalendar from './ui/ThreeDCalendar'
import ThreeDTaskList from './ui/ThreeDTaskList'
import ThreeDActivity from './ui/ThreeDActivity'
import ThreeDSettings from './ui/ThreeDSettings'

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { id: 'tasks', label: 'My Tasks', path: '/tasks', icon: ThreeDTaskList },
    { id: 'activity', label: 'Activity', path: '/activity', icon: ThreeDActivity },
    { id: 'calendar', label: 'Calendar', path: '/calendar', icon: ThreeDCalendar },
    { id: 'settings', label: 'Settings', path: '/settings', icon: ThreeDSettings },
  ]

  const currentPath = location.pathname

  return (
    <motion.aside 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 apple-glass-panel m-4 mr-2 rounded-[32px] flex flex-col justify-between hidden md:flex shrink-0 relative overflow-hidden"
    >

      
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
            const is3D = ['calendar', 'tasks', 'activity', 'settings'].includes(item.id)

            // Per-icon signature 3D hover transform
            const iconHoverVariant = {
              calendar:  { scale: 1.32, rotateZ: -10, rotateY: -18, rotateX: -6,  filter: 'drop-shadow(0 10px 22px rgba(0,0,0,0.55))' },
              tasks:     { scale: 1.32, rotateZ:   8, rotateY: -16, rotateX: -5,  filter: 'drop-shadow(0 10px 22px rgba(30,100,220,0.6))' },
              activity:  { scale: 1.32, rotateZ:   0, rotateY:  20, rotateX: -10, filter: 'drop-shadow(0 0 16px rgba(80,160,255,0.95)) drop-shadow(0 10px 22px rgba(0,40,120,0.5))' },
              settings:  { scale: 1.32, rotateZ:  50, rotateY:   0, rotateX:  0,  filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.5)) drop-shadow(0 0 10px rgba(180,200,255,0.4))' },
            }

            return (
              <motion.button
                key={item.id}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                variants={{
                  rest: { x: 0, y: 0, scale: 1 },
                  hover: { x: 5, y: -8, scale: 1.06 },
                  tap:   { x: 2, y: -2, scale: 0.97 },
                }}
                whileHover="hover"
                whileTap="tap"
                transition={{
                  delay: 0.1 + index * 0.05,
                  type: 'spring',
                  stiffness: 480,
                  damping: 28,
                  mass: 0.6,
                }}
                onClick={() => navigate(item.path)}
                className={cn(
                  "relative w-full flex items-center justify-between px-3 py-3 rounded-2xl text-sm transition-colors duration-200 group",
                  isActive ? "text-foreground" : "text-foreground/90"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 apple-glass-active rounded-2xl"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}

                <div className="relative z-10 flex items-center space-x-3.5">
                  {/* Icon — inherits parent "hover" variant, applies signature 3D tilt */}
                  <motion.div
                    variants={is3D ? {
                      rest: { scale: 1, rotateZ: 0, rotateY: 0, rotateX: 0, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' },
                      hover: iconHoverVariant[item.id] || { scale: 1.3 },
                      tap:   { scale: 0.92, rotateZ: 0, rotateY: 0 },
                    } : {
                      rest:  { scale: 1 },
                      hover: { scale: 1.12 },
                    }}
                    style={{ perspective: 700, transformStyle: 'preserve-3d' }}
                    transition={{ type: 'spring', stiffness: 480, damping: 26, mass: 0.55 }}
                    className={cn(
                      "rounded-xl transition-colors duration-200",
                      isActive
                        ? "bg-primary/15 text-primary dark:bg-primary/30 p-1.5"
                        : "text-foreground/80 p-1.5",
                      is3D && "p-0 !bg-transparent"
                    )}
                  >
                    <Icon
                      className={cn("h-5 w-5", is3D && "w-8 h-8")}
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                  </motion.div>

                  {/* Label — floats up in sync */}
                  <motion.span
                    variants={{
                      rest:  { y: 0, opacity: 1 },
                      hover: { y: -2, opacity: 1 },
                      tap:   { y: 0 },
                    }}
                    transition={{ type: 'spring', stiffness: 480, damping: 28, mass: 0.6 }}
                    className={cn(
                      "text-[16px] transition-colors duration-200",
                      isActive ? "font-black tracking-tight text-foreground" : "font-extrabold tracking-wide text-foreground/90 group-hover:text-foreground"
                    )}
                  >
                    {item.label}
                  </motion.span>
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
