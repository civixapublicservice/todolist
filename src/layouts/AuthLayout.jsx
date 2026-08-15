import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Sparkles, CheckCircle2 } from 'lucide-react'
import ThemeToggle from '../components/ui/ThemeToggle'

export default function AuthLayout() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Left Form Section */}
      <div className="w-full lg:w-[50%] xl:w-[45%] min-h-screen flex flex-col relative transition-colors duration-300">
        <div className="absolute top-6 right-6 z-50 lg:hidden">
           <ThemeToggle />
        </div>
        
        {/* Header / Logo */}
        <div className="flex items-center gap-3 p-6 sm:p-10">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-foreground">TaskFlow</span>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex flex-col justify-center items-center px-6 sm:px-12 lg:px-16 pb-16">
          <div className="w-full max-w-[420px] animate-fade-in-up">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Right Branding Section (Hidden on Mobile, fills remaining desktop space) */}
      <div className="hidden lg:flex flex-col lg:w-[50%] xl:w-[55%] bg-zinc-950 relative overflow-hidden text-white p-12 lg:p-16">
        <div className="absolute top-6 right-6 z-50">
           <ThemeToggle />
        </div>
        
        {/* Minimalist gradient background for branding */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/30 via-zinc-950 to-zinc-950"></div>
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>

        <div className="relative z-10 h-full flex flex-col justify-between max-w-2xl mx-auto w-full">
          <div className="pt-20 xl:pt-32">
            <h2 className="text-4xl xl:text-5xl font-bold tracking-tight mb-6 leading-tight">
              Manage your tasks with <br/><span className="text-indigo-400">unmatched precision.</span>
            </h2>
            <div className="space-y-6 mt-12 xl:mt-16">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-indigo-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-zinc-100">Minimalist Design</h3>
                  <p className="text-zinc-400 mt-1">Experience a clutter-free interface that helps you focus on what actually matters.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-indigo-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-zinc-100">Lightning Fast</h3>
                  <p className="text-zinc-400 mt-1">Built with modern web technologies for a perfectly smooth, lag-free experience.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-indigo-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-zinc-100">Professional Grade</h3>
                  <p className="text-zinc-400 mt-1">Enterprise-level reliability designed for your most important projects.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pb-8 mt-12">
            <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-6 xl:p-8 backdrop-blur-md">
              <p className="text-zinc-300 italic leading-relaxed">"TaskFlow completely transformed how our team handles project management. The clean interface and blazing fast performance is exactly what we needed."</p>
              <div className="flex items-center gap-4 mt-6">
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center font-bold text-indigo-400 border border-indigo-500/20">
                  SD
                </div>
                <div>
                  <p className="font-semibold text-sm text-zinc-100">Sarah Developer</p>
                  <p className="text-xs text-zinc-500">Lead Engineer @ TechCorp</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
