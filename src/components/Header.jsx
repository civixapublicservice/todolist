import { Moon, Sun, LogOut, CheckSquare } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import { Link } from 'react-router-dom'

export default function Header() {
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()

  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-card border-b border-border shrink-0">
      {/* Left side: Project Logo & Name */}
      <Link to="/" className="flex items-center space-x-3 transition-opacity hover:opacity-80 md:hidden">
        <div className="bg-primary p-1.5 rounded-lg shadow-sm">
          <CheckSquare className="h-5 w-5 text-primary-foreground" strokeWidth={2} />
        </div>
        <span className="text-xl font-bold tracking-tight text-foreground">TaskFlow</span>
      </Link>
      
      {/* Spacer for desktop since logo is in sidebar */}
      <div className="hidden md:block flex-1"></div>

      {/* Right side: Utilities */}
      <div className="flex items-center space-x-2 sm:space-x-4 ml-auto">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary/10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun className="h-5 w-5" strokeWidth={1.5} /> : <Moon className="h-5 w-5" strokeWidth={1.5} />}
        </button>

        <div className="h-6 w-px bg-border hidden sm:block"></div>

        {/* User Profile */}
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/30 text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="hidden sm:flex flex-col min-w-0 text-left mr-2">
            <span className="text-sm font-semibold text-foreground truncate max-w-[100px] lg:max-w-[150px]">{user?.name || 'User'}</span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-destructive hover:text-destructive-foreground hover:bg-destructive rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-1 focus:ring-offset-card"
          title="Sign Out"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.5} />
          <span className="hidden sm:inline">Log out</span>
        </button>
      </div>
    </header>
  )
}
