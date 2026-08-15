import { useState, useRef, useEffect } from 'react'
import { LogOut, CheckSquare, Bell, User, Settings as SettingsIcon, Search, X, Trash2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../utils/cn'
import { useNotifications } from '../hooks/useNotifications'
import ThemeToggle from './ui/ThemeToggle'
import UserAvatar from './ui/UserAvatar'
import Logo from './ui/Logo'

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [showNotifDropdown, setShowNotifDropdown] = useState(false)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  
  const { notifications, unreadCount, handleMarkAsRead, handleMarkAllRead, handleDelete, handleDeleteAll } = useNotifications()
  
  const userDropdownRef = useRef(null)
  const notifDropdownRef = useRef(null)
  const notifDropdownContentRef = useRef(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false)
      }
      
      const isOutsideNotifBtn = notifDropdownRef.current && !notifDropdownRef.current.contains(event.target)
      const isOutsideNotifContent = !notifDropdownContentRef.current || !notifDropdownContentRef.current.contains(event.target)
      
      if (isOutsideNotifBtn && isOutsideNotifContent) {
        setShowNotifDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchQuery(searchParams.get('q') || '')
  }, [searchParams])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const query = searchQuery.trim()
    navigate(query ? `/tasks?q=${encodeURIComponent(query)}` : `/tasks`)
  }

  return (
    <header className="h-16 sm:h-20 flex items-center justify-between gap-5 sm:gap-7 px-4 sm:px-6 lg:px-8 shrink-0 z-40 relative">

      {/* Left side: Project Logo & Name (Mobile) */}
      <Link to="/" className="relative z-10 flex items-center space-x-3 transition-opacity hover:opacity-80 md:hidden">
        <Logo className="w-8 h-8" />
        <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
          TaskFlow
        </span>
      </Link>
      
      {/* Spacer for desktop since logo is in sidebar */}
      <div className="hidden md:block flex-1 relative z-10"></div>

      {/* Right side: Utilities */}
      <div className="flex items-center gap-2 sm:gap-3 ml-auto relative z-10">
        
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
              "pl-11 pr-5 py-2.5 outline-none cursor-text w-full max-w-[280px] min-w-[150px] text-sm font-medium tracking-wide transition-all duration-300",
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
              "relative flex items-center justify-center w-9 h-9 sm:w-[38px] sm:h-[38px] rounded-full z-10 shrink-0",
              "backdrop-blur-xl border border-white/40 dark:border-white/10",
              "bg-white/20 dark:bg-black/20",
              "shadow-[0_4px_12px_-2px_rgba(0,0,0,0.15),inset_0_4px_8px_rgba(255,255,255,0.6),inset_0_-4px_8px_rgba(0,0,0,0.05)]",
              "dark:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.5),inset_0_4px_8px_rgba(255,255,255,0.15),inset_0_-4px_8px_rgba(0,0,0,0.4)]",
              "focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
            )}
          >
            <Bell className="w-[18px] h-[18px] text-foreground drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" strokeWidth={2} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-destructive border-2 border-background flex items-center justify-center shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
            )}
          </motion.button>
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        <div className="h-6 w-px bg-glass-border hidden sm:block"></div>

        {/* User Profile Trigger */}
        <div className="relative" ref={userDropdownRef}>
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center space-x-2 focus:outline-none rounded-[2rem] transition-all"
          >
            <UserAvatar user={user} className="w-9 h-9 sm:w-[38px] sm:h-[38px] shrink-0" />
          </button>
        </div>
      </div>

      {/* User Profile Dropdown Content - Positioned relative to the header */}
      <AnimatePresence>
        {showUserDropdown && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-[76px] right-4 sm:right-6 lg:right-8 w-[calc(100vw-2rem)] max-w-[260px] bg-background/95 dark:bg-[#121212]/95 backdrop-blur-3xl border border-black/5 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-3xl overflow-hidden z-50 origin-top p-1.5"
          >
            {/* Premium Header Area with Avatar */}
            <div className="flex items-center space-x-3 px-3 py-3 mb-1 bg-muted/30 dark:bg-muted/10 rounded-2xl">
              <UserAvatar user={user} className="w-10 h-10 shrink-0" />
              <div className="flex flex-col min-w-0">
                <p className="text-[15px] font-bold tracking-tight text-foreground truncate leading-tight">{user?.name || 'User'}</p>
                <p className="text-xs font-medium text-muted-foreground truncate">{user?.email || 'user@taskflow.com'}</p>
              </div>
            </div>
            
            {/* Minimalist Options */}
            <div className="space-y-0.5 px-0.5">
              <button 
                onClick={() => { navigate('/settings'); setShowUserDropdown(false); }}
                className="w-full flex items-center space-x-3 px-3 py-2.5 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-foreground/5 rounded-xl transition-colors"
              >
                <SettingsIcon className="h-4 w-4" />
                <span>Settings</span>
              </button>
            </div>

            {/* Sign Out Action */}
            <div className="mt-1 pt-1 border-t border-border/50 px-0.5">
              <button
                onClick={() => { logout(); setShowUserDropdown(false); }}
                className="w-full flex items-center space-x-3 px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications Dropdown - Positioned relative to the header */}
      <AnimatePresence>
        {showNotifDropdown && (
          <motion.div
            ref={notifDropdownContentRef}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-[76px] right-4 sm:right-6 lg:right-8 w-[calc(100vw-2rem)] max-w-[380px] sm:w-80 apple-glass-dropdown rounded-3xl overflow-hidden z-50 origin-top p-2 shadow-2xl"
          >
            <div className="px-4 py-3 border-b border-glass-border mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold tracking-tight text-foreground">Notifications</p>
              <div className="flex items-center gap-3">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-primary hover:underline font-medium"
                  >
                    Mark all read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={handleDeleteAll}
                    className="text-xs text-destructive hover:underline font-medium flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    Clear all
                  </button>
                )}
              </div>
            </div>

            <div className="max-h-[60vh] sm:max-h-[300px] overflow-y-auto space-y-1 pr-1 custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground text-sm">
                  No notifications yet.
                </div>
              ) : (
                notifications.map(notif => (
                  <div
                    key={notif.id}
                    className={cn(
                      "w-full flex items-start justify-between px-3 py-2 text-sm rounded-xl transition-colors text-left group",
                      notif.isRead ? "text-muted-foreground hover:bg-foreground/5" : "bg-primary/5 text-foreground border border-primary/20 hover:bg-primary/10"
                    )}
                  >
                    <div 
                      className="flex-1 cursor-pointer pr-2" 
                      onClick={() => handleMarkAsRead(notif.id, notif.isRead)}
                    >
                      <p className="font-bold text-xs tracking-wide mb-0.5">{notif.type === 'REMINDER' ? 'Task Reminder' : 'Notification'}</p>
                      <p className="text-xs opacity-80">{notif.message}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(notif.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-foreground/10 rounded-full transition-all text-muted-foreground hover:text-destructive shrink-0"
                      title="Clear notification"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
