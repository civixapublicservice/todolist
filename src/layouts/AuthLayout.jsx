import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Sparkles, CheckCircle2 } from 'lucide-react'
import ThemeToggle from '../components/ui/ThemeToggle'

export default function AuthLayout() {
  const { user } = useAuth()

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen w-full flex bg-white dark:bg-zinc-950 transition-colors duration-500">
      
      {/* Left Side: Stunning Productivity Image (Hidden on mobile) */}
      {/* We use a high-quality image, but we DO NOT put text over it to avoid messy contrast issues. It stands alone as art. */}
      <div className="hidden lg:block lg:w-[45%] relative bg-zinc-50 dark:bg-zinc-900 overflow-hidden">
        <img 
          src="/auth-bg.png" 
          alt="Productive workspace" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-10000 hover:scale-105"
        />
        {/* Extremely subtle inner shadow just to blend the edges into the UI, no heavy colors */}
        <div className="absolute inset-0 bg-black/5 dark:bg-black/20 pointer-events-none" />
      </div>

      {/* Right Side: Auth Form Container */}
      {/* Pure, clean background to make the form the absolute focus */}
      <div className="w-full lg:w-[55%] flex flex-col relative overflow-y-auto bg-white dark:bg-[#09090B]">
        
        {/* Top bar for theme toggle & logo - always visible on this side */}
        <div className="w-full p-6 sm:p-10 flex justify-between items-center absolute top-0 left-0 right-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">TaskFlow</span>
          </div>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>

        {/* Form itself */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12 pt-28 pb-12">
          {/* Constrain width so it looks perfectly balanced and readable */}
          <div className="w-full max-w-[380px] animate-fade-in-up">
            <Outlet />
          </div>
        </div>
        
      </div>
    </div>
  )
}
