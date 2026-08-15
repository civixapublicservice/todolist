import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Sparkles } from 'lucide-react'
import ThemeToggle from '../components/ui/ThemeToggle'

export default function AuthLayout() {
  const { user } = useAuth()

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden bg-[#F8FAFC] dark:bg-[#09090B] transition-colors duration-500">
      
      {/* Soft, beautiful, light animated background blobs (No Black!) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-indigo-200/40 dark:bg-indigo-900/20 blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob" />
        <div className="absolute top-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-purple-200/40 dark:bg-purple-900/20 blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000" />
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] rounded-full bg-blue-200/40 dark:bg-blue-900/20 blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000" />
      </div>

      {/* Header spanning full width to beautifully anchor the page */}
      <div className="w-full flex justify-between items-center p-6 sm:p-10 relative z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">TaskFlow</span>
        </div>
        <ThemeToggle />
      </div>

      {/* Centered Form - Highly convenient and perfectly sized */}
      <div className="flex-1 flex items-center justify-center p-4 relative z-10 pb-20">
        <div className="w-full max-w-[460px] bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl rounded-[2rem] shadow-2xl shadow-indigo-500/5 dark:shadow-none border border-white/60 dark:border-zinc-800/60 p-8 sm:p-12 animate-fade-in-up transition-all duration-300">
          <Outlet />
        </div>
      </div>

    </div>
  )
}
