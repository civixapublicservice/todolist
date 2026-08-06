import { useState, useRef, useEffect, useCallback } from 'react'
import { Moon, Sun, LogOut, CheckSquare, Bell, User, Settings as SettingsIcon, Search } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../utils/cn'
import { getNotifications, markAllNotificationsAsRead, markNotificationAsRead } from '../services/notificationService'
import ThemeToggle from './ui/ThemeToggle'
import ChromeAvatar from './ui/ChromeAvatar'

export default function Header() {
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [showNotifDropdown, setShowNotifDropdown] = useState(false)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  
  const [notifications, setNotifications] = useState([])
  
  const userDropdownRef = useRef(null)
  const notifDropdownRef = useRef(null)

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const data = await getNotifications(false) // get all
      setNotifications(data)
    } catch (err) {
      console.error('Failed to fetch notifications', err)
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
    // Could set up an interval or websocket here, but simple fetch on mount is fine for now
  }, [fetchNotifications])

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false)
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target)) {
        setShowNotifDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '')
  }, [searchParams])

  const unreadCount = notifications.filter(n => !n.read).length

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead()
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    } catch (err) {
      console.error('Failed to mark all as read')
    }
  }

  const handleNotificationClick = async (id, read) => {
    if (read) return
    try {
      await markNotificationAsRead(id)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    } catch (err) {
      console.error('Failed to mark as read')
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const query = searchQuery.trim()
    navigate(query ? `/tasks?q=${encodeURIComponent(query)}` : `/tasks`)
  }

  return (
    <header className="h-20 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 z-40 relative">

      {/* Left side: Project Logo & Name (Mobile) */}
      <Link to="/" className="relative z-10 flex items-center space-x-3 transition-opacity hover:opacity-80 md:hidden">
        <div className="bg-gradient-to-br from-primary to-accent p-1.5 rounded-xl shadow-glow">
          <CheckSquare className="h-5 w-5 text-white" strokeWidth={2.5} />
        </div>
        <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
          TaskFlow
        </span>
      </Link>
      
      {/* Spacer for desktop since logo is in sidebar */}
      <div className="hidden md:block flex-1 relative z-10"></div>

      {/* Right side: Utilities */}
      <div className="flex items-center space-x-3 sm:space-x-5 ml-auto relative z-10">
        
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative group">
          <motion.input
            type="text"
            placeholder="Search... (Enter)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            whileFocus={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={cn(
              "pl-11 pr-5 py-2.5 outline-none cursor-text min-w-[280px] text-sm font-medium tracking-wide transition-all duration-300",
              "rounded-full backdrop-blur-xl border border-white/40 dark:border-white/10",
              "bg-white/20 dark:bg-black/20",
              "text-foreground placeholder:text-muted-foreground",
              "shadow-[0_4px_12px_-2px_rgba(0,0,0,0.15),inset_0_4px_8px_rgba(255,255,255,0.6),inset_0_-4px_8px_rgba(0,0,0,0.05)]",
              "dark:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.5),inset_0_4px_8px_rgba(255,255,255,0.15),inset_0_-4px_8px_rgba(0,0,0,0.4)]",
              "focus:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.2),inset_0_6px_12px_rgba(255,255,255,0.8),inset_0_-4px_8px_rgba(0,0,0,0.05)]",
              "dark:focus:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.6),inset_0_6px_12px_rgba(255,255,255,0.25),inset_0_-4px_8px_rgba(0,0,0,0.4)]",
              "focus:ring-2 focus:ring-primary/50"
            )}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors drop-shadow-sm z-10 pointer-events-none" />
        </form>

        {/* Notifications */}
        <div className="relative" ref={notifDropdownRef}>
          <motion.button 
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={unreadCount > 0 ? { rotate: [0, -20, 20, -15, 15, -10, 10, 0] } : {}}
            transition={unreadCount > 0 ? { repeat: Infinity, duration: 1.5, ease: "easeInOut", repeatDelay: 2 } : {}}
            className={cn(
              "relative flex items-center justify-center w-11 h-11 rounded-full z-10",
              "backdrop-blur-xl border border-white/40 dark:border-white/10",
              "bg-white/20 dark:bg-black/20",
              "shadow-[0_4px_12px_-2px_rgba(0,0,0,0.15),inset_0_4px_8px_rgba(255,255,255,0.6),inset_0_-4px_8px_rgba(0,0,0,0.05)]",
              "dark:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.5),inset_0_4px_8px_rgba(255,255,255,0.15),inset_0_-4px_8px_rgba(0,0,0,0.4)]",
              "focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
            )}
          >
            <Bell className="w-5 h-5 text-foreground drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" strokeWidth={2} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-destructive border-2 border-background flex items-center justify-center shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
            )}
          </motion.button>
          
          <AnimatePresence>
            {showNotifDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-3 w-80 apple-glass-dropdown rounded-3xl overflow-hidden z-50 origin-top-right p-2"
              >
                <div className="px-4 py-3 border-b border-glass-border mb-2 flex items-center justify-between">
                  <p className="text-sm font-semibold tracking-tight text-foreground">Notifications</p>
                  {unreadCount > 0 && (
                    <button 
                      onClick={handleMarkAllRead}
                      className="text-xs text-primary hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                
                <div className="max-h-[300px] overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground text-sm">
                      No notifications yet.
                    </div>
                  ) : (
                    notifications.map(notif => (
                      <div 
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif.id, notif.read)}
                        className={cn(
                          "w-full flex flex-col px-3 py-2 text-sm rounded-xl transition-colors cursor-pointer text-left",
                          notif.read ? "text-muted-foreground hover:bg-foreground/5" : "bg-primary/5 text-foreground border border-primary/20 hover:bg-primary/10"
                        )}
                      >
                        <p className="font-medium text-xs tracking-wide mb-0.5">{notif.title}</p>
                        <p className="text-xs opacity-80">{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        <div className="h-8 w-px bg-glass-border hidden sm:block mx-1"></div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={userDropdownRef}>
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center space-x-2 focus:outline-none rounded-[2rem] transition-all"
          >
            <ChromeAvatar className="w-12 h-12" />
          </button>

          <AnimatePresence>
            {showUserDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-3 w-64 apple-glass-dropdown rounded-3xl overflow-hidden z-50 origin-top-right p-2"
              >
                <div className="px-4 py-3 border-b border-glass-border mb-2">
                  <p className="text-sm font-semibold tracking-tight text-foreground truncate">{user?.name || 'User'}</p>
                  <p className="text-xs font-medium tracking-wide text-muted-foreground truncate">{user?.email || 'user@taskflow.com'}</p>
                </div>
                
                <div className="space-y-1">
                  <button 
                    onClick={() => { navigate('/settings'); setShowUserDropdown(false); }}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-foreground/80 hover:text-foreground hover:bg-foreground/5 rounded-xl transition-colors"
                  >
                    <User className="h-4 w-4" />
                    <span>My Profile</span>
                  </button>
                  <button 
                    onClick={() => { navigate('/settings'); setShowUserDropdown(false); }}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-foreground/80 hover:text-foreground hover:bg-foreground/5 rounded-xl transition-colors"
                  >
                    <SettingsIcon className="h-4 w-4" />
                    <span>Account Settings</span>
                  </button>
                </div>

                <div className="mt-2 pt-2 border-t border-glass-border">
                  <button
                    onClick={logout}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
