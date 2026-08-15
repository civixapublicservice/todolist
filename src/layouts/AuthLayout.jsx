import { Outlet, Navigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Sparkles } from 'lucide-react'
import ThemeToggle from '../components/ui/ThemeToggle'

export default function AuthLayout() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="bg-mesh-auth">
      
      {/* Top right theme toggle */}
      <div className="absolute top-6 right-6 z-50">
         <ThemeToggle />
      </div>

      <div className="glass-auth-card flex flex-col my-10">
        {/* Logo */}
        <div className="flex flex-col items-center justify-center mb-8 relative z-20">
          <Link to="/" className="inline-flex items-center space-x-3 text-foreground hover:text-primary transition-colors">
            <div className="bg-primary/10 dark:bg-primary/20 p-2.5 rounded-2xl">
               <Sparkles className="w-7 h-7 text-primary" />
            </div>
            <span className="text-3xl font-extrabold tracking-tight">TaskFlow</span>
          </Link>
        </div>

        {/* Content */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-20">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
