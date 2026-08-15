import { Outlet, Navigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Sparkles, CheckCircle2 } from 'lucide-react'

export default function AuthLayout() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen w-full flex bg-background text-foreground transition-colors duration-300">
      
      {/* Left Panel - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 relative overflow-hidden bg-gradient-to-br from-primary to-accent text-white">
        {/* Background decorations */}
        <div className="absolute top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-white/10 blur-[100px]" />
        <div className="absolute bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-black/20 blur-[100px]" />

        {/* Top Logo */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center space-x-2 text-white hover:text-white/80 transition-colors">
            <Sparkles className="w-8 h-8" />
            <span className="text-2xl font-bold tracking-tight">TaskFlow</span>
          </Link>
        </div>

        {/* Middle Content */}
        <div className="relative z-10 max-w-lg">
          <h1 className="text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            Manage your <br/>
            tasks with <span className="text-primary-foreground/90">ease.</span>
          </h1>
          <p className="text-lg text-white/80 mb-8 font-medium leading-relaxed">
            Join thousands of teams who use TaskFlow to stay organized, focused, and perfectly aligned on their goals.
          </p>

          <div className="space-y-4">
            {[
              "Smart task prioritization",
              "Real-time team collaboration",
              "Advanced analytics & insights",
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center space-x-3 text-white/90">
                <CheckCircle2 className="w-5 h-5 text-white/60" />
                <span className="font-medium text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="relative z-10 text-sm text-white/50 font-medium">
          &copy; {new Date().getFullYear()} TaskFlow Inc. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Auth Form Area */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 md:p-16 relative">
        {/* Mobile Logo (Visible only on small screens) */}
        <div className="lg:hidden absolute top-8 left-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-foreground hover:text-primary transition-colors">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold tracking-tight">TaskFlow</span>
          </Link>
        </div>

        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
