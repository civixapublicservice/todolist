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
      {/* We use a high-quality, professional workspace image to establish the "todo/productivity" context */}
      <div className="hidden lg:block lg:w-1/2 relative bg-zinc-50 dark:bg-zinc-900 overflow-hidden">
        <img 
          src="/auth-bg.png" 
          alt="Productive workspace" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-10000 hover:scale-105"
        />
        {/* Soft, light overlay to make text highly readable without adding ANY heavy black colors */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/40 to-transparent dark:from-black/90 dark:via-black/50" />
        
        {/* Branding over the image */}
        <div className="absolute bottom-0 left-0 p-12 xl:p-16 w-full text-zinc-900 dark:text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 backdrop-blur-md flex items-center justify-center border border-primary/20 shadow-xl dark:bg-white/10 dark:border-white/20">
              <Sparkles className="w-7 h-7 text-primary dark:text-white" />
            </div>
            <span className="text-3xl font-extrabold tracking-tight drop-shadow-sm">TaskFlow</span>
          </div>
          
          <h2 className="text-4xl xl:text-5xl font-bold leading-tight mb-6 max-w-lg">
            Organize your work and life, finally.
          </h2>
          
          <div className="space-y-4 max-w-md">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <p className="text-lg font-medium">Intuitive task management</p>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <p className="text-lg font-medium">Seamless cross-device sync</p>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <p className="text-lg font-medium">Beautiful, distraction-free design</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Auth Form Container */}
      {/* Pure, clean background to make the form the absolute focus */}
      <div className="w-full lg:w-1/2 flex flex-col relative overflow-y-auto bg-white dark:bg-[#09090B]">
        
        {/* Top bar for theme toggle & mobile logo */}
        <div className="w-full p-6 sm:p-8 flex justify-between items-center absolute top-0 left-0 right-0 z-10">
          <div className="flex lg:hidden items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground">TaskFlow</span>
          </div>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>

        {/* Form itself */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12 pt-28 pb-12">
          {/* Constrain width so it looks perfectly balanced and readable */}
          <div className="w-full max-w-[400px] animate-fade-in-up">
            <Outlet />
          </div>
        </div>
        
      </div>
    </div>
  )
}
