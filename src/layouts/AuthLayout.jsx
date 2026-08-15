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
      <div className="w-full lg:w-[55%] flex flex-col relative bg-background overflow-hidden">
        {/* Decorative subtle background pattern */}
        <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-50 dark:opacity-40" />
        
        {/* Animated ambient blobs */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob pointer-events-none dark:mix-blend-screen dark:bg-primary/20" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-2000 pointer-events-none dark:mix-blend-screen dark:bg-purple-500/20" />

        {/* Top Header */}
        <div className="absolute top-0 right-0 w-full p-6 sm:p-12 flex justify-between items-center z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <span className="font-bold text-lg text-foreground tracking-tight">TaskFlow</span>
          </div>
          <div className="lg:ml-auto">
            <ThemeToggle />
          </div>
        </div>

        {/* Form itself */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 z-10 relative">
          {/* Constrain width so it looks perfectly balanced and readable. Increased to 440px per user request */}
          <div className="w-full max-w-[440px] animate-fade-in-up">
            <Outlet />
          </div>
        </div>

        {/* Professional Footer */}
        <div className="relative z-10 w-full p-6 sm:px-12 pb-8 flex flex-col sm:flex-row items-center justify-between text-xs font-medium text-muted-foreground/60 animate-fade-in-up">
          <p>© 2026 TaskFlow Inc.</p>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Help</a>
          </div>
        </div>
      </div>
    </div>
  )
}
