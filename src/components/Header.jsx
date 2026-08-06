import { useState, useRef, useEffect, useCallback } from 'react'
import { Moon, Sun, LogOut, CheckSquare, Bell, User, Settings as SettingsIcon } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../utils/cn'
import { getNotifications, markAllNotificationsAsRead, markNotificationAsRead } from '../services/notificationService'

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
      <div className="absolute inset-0 apple-glass-panel border-x-0 border-t-0 rounded-none pointer-events-none" />
      
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
        <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative">
          <input
            type="text"
            placeholder="Search... (Enter)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="apple-glass-input px-5 py-2 focus:ring-1 focus:ring-primary/50 rounded-full outline-none transition-all cursor-text min-w-[240px] text-sm font-medium tracking-wide text-foreground placeholder:text-muted-foreground"
          />
        </form>

        {/* Notifications */}
        <div className="relative" ref={notifDropdownRef}>
          <button 
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="relative p-2.5 text-muted-foreground hover:text-primary bg-foreground/5 hover:bg-white/10 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-ring border border-transparent hover:border-glass-border group"
          >
            <Bell className="h-5 w-5 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-destructive border-2 border-background flex items-center justify-center"></span>
            )}
          </button>
          
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
        <button
          onClick={toggleTheme}
          className="relative p-2.5 text-muted-foreground hover:text-primary bg-foreground/5 hover:bg-white/10 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-ring border border-transparent hover:border-glass-border group overflow-hidden"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={isDark ? 'dark' : 'light'}
              initial={{ y: -20, opacity: 0, rotate: -90 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: 20, opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              {isDark ? <Sun className="h-5 w-5" strokeWidth={1.5} /> : <Moon className="h-5 w-5" strokeWidth={1.5} />}
            </motion.div>
          </AnimatePresence>
        </button>

        <div className="h-8 w-px bg-glass-border hidden sm:block mx-1"></div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={userDropdownRef}>
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center space-x-2 focus:outline-none rounded-full ring-offset-2 ring-offset-background focus:ring-2 focus:ring-ring transition-all"
          >
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-accent shadow-sm flex items-center justify-center text-white text-sm font-bold shrink-0 ring-2 ring-background hover:shadow-glow transition-all">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
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
