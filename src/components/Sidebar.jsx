import { useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, CheckSquare, BarChart3, Calendar as CalendarIcon, Settings } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

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
    <aside className="w-64 bg-secondary text-secondary-foreground flex flex-col justify-between h-full hidden md:flex shrink-0">
      <div className="p-4 flex flex-col h-full">
        {/* Branding */}
        <div className="flex items-center space-x-3 px-3 mb-8 mt-2">
          <div className="bg-primary p-1.5 rounded-lg shadow-sm">
            <CheckSquare className="h-5 w-5 text-primary-foreground" strokeWidth={2} />
          </div>
          <span className="text-xl font-bold tracking-tight">TaskFlow</span>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPath === item.path
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ease-in-out ${
                  isActive
                    ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                    : 'text-secondary-foreground/80 font-medium hover:bg-secondary-foreground/10 hover:text-secondary-foreground'
                }`}
              >
                <Icon className={`h-[18px] w-[18px] shrink-0 ${isActive ? 'text-primary-foreground' : 'text-secondary-foreground/70'}`} strokeWidth={isActive ? 2 : 1.5} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Footer utilities */}
        <div className="mt-auto pt-4 border-t border-secondary-foreground/10 space-y-1">
          {/* User Profile */}
          <div className="flex items-center space-x-3 px-3 py-2.5 rounded-lg mb-2 hover:bg-secondary-foreground/10 transition-colors cursor-pointer">
            <div className="h-8 w-8 rounded-full bg-secondary-foreground/10 border border-secondary-foreground/20 text-secondary-foreground flex items-center justify-center font-bold shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex flex-col min-w-0 text-left">
              <span className="text-sm font-semibold truncate">{user?.name || 'User'}</span>
              <span className="text-xs text-secondary-foreground/70 truncate">{user?.email || 'user@taskflow.com'}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
