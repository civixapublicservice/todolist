import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Sparkles, ArrowRight } from 'lucide-react'
import ThemeToggle from '../components/ui/ThemeToggle'

export default function AuthLayout() {
  const { user } = useAuth()

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8 relative overflow-hidden bg-[#F4F4F5] dark:bg-[#09090B] transition-colors duration-500">
      
      {/* Ultra-subtle background elements to prevent it feeling "dead" */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-indigo-600/5 blur-[120px]" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-blue-600/5 blur-[120px]" />
      </div>

      <div className="absolute top-6 right-6 z-50">
         <ThemeToggle />
      </div>

      {/* Main Large Presentation Card */}
      <div className="w-full max-w-[1080px] bg-white dark:bg-[#121214] rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)] border border-zinc-200/50 dark:border-zinc-800/50 flex overflow-hidden relative z-10 min-h-[640px] animate-fade-in-up transition-all duration-300">
        
        {/* Left Side: Premium Image / Branding (Hidden on mobile/tablet) */}
        <div className="hidden lg:flex lg:w-[45%] relative bg-zinc-950 overflow-hidden flex-col justify-between p-12">
          {/* High-quality abstract background image */}
          <div className="absolute inset-0">
             <img 
               src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
               alt="Abstract modern background" 
               className="w-full h-full object-cover opacity-60 mix-blend-luminosity hover:mix-blend-normal hover:scale-105 transition-all duration-1000" 
             />
             <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
          </div>

          {/* Logo overlay */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white drop-shadow-lg">TaskFlow</span>
          </div>

          {/* Marketing text overlay */}
          <div className="relative z-10 max-w-sm">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold mb-6">
              <span>TaskFlow 2.0 is live</span>
              <ArrowRight className="w-3 h-3" />
            </div>
            <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight mb-4 drop-shadow-lg">
              Master your day,<br/> effortlessly.
            </h2>
            <p className="text-zinc-300/90 text-sm leading-relaxed drop-shadow-md font-medium">
              Join thousands of professionals who use TaskFlow to manage their workflows and achieve their goals with unmatched precision.
            </p>
          </div>
        </div>

        {/* Right Side: Form Content */}
        <div className="w-full lg:w-[55%] flex flex-col justify-center px-6 sm:px-16 py-12 relative">
          
          {/* Mobile Logo (only visible when left side is hidden) */}
          <div className="flex lg:hidden items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground">TaskFlow</span>
          </div>

          <div className="w-full max-w-[400px] mx-auto">
            <Outlet />
          </div>
          
        </div>
      </div>
    </div>
  )
}
