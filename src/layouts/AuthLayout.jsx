import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { Sparkles, CheckCircle2 } from 'lucide-react'
import ThemeToggle from '../components/ui/ThemeToggle'
import { useThemeContext } from '../context/ThemeContext'
import { useEffect } from 'react'

export default function AuthLayout() {
  const { user } = useAuth()
  const location = useLocation()
  const { setForceTheme } = useThemeContext()

  useEffect(() => {
    setForceTheme('light')
    return () => setForceTheme(null)
  }, [setForceTheme])

  if (user) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen w-full flex bg-white transition-colors duration-500 force-light">
      
      {/* Left Side: Stunning Productivity Image (Hidden on mobile) */}
      {/* We use a high-quality image, but we DO NOT put text over it to avoid messy contrast issues. It stands alone as art. */}
      <div className="hidden lg:block lg:w-[45%] relative bg-zinc-50 overflow-hidden">
        <img 
          src="/auth-bg.png" 
          alt="Productive workspace" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-10000 hover:scale-105"
        />
        {/* Extremely subtle inner shadow just to blend the edges into the UI, no heavy colors */}
        <div className="absolute inset-0 bg-black/5 pointer-events-none" />
      </div>

      {/* Right Side: Auth Form Container */}
      {/* Pure, clean background to make the form the absolute focus */}
      <div className="w-full lg:w-[55%] flex flex-col relative bg-background overflow-hidden">
        {/* Decorative subtle background pattern */}
        <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-50" />
        
        {/* Animated ambient blobs */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-2000 pointer-events-none" />

        {/* Top Header */}
        <div className="w-full p-6 sm:p-12 pb-0 sm:pb-0 flex justify-between items-center z-50">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <span className="font-bold text-lg sm:text-xl text-foreground tracking-tight">TaskFlow</span>
          </div>
        </div>
        {/* Form itself */}
        <div className="flex-1 flex flex-col p-6 sm:p-12 pt-8 sm:pt-8 z-10 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col items-center w-full h-full"
            >
              {/* Constrain width so it looks perfectly balanced and readable. Increased to 440px per user request */}
              <div className="w-full max-w-[440px] flex-1 flex flex-col">
                <Outlet />
              </div>
            </motion.div>
          </AnimatePresence>
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
