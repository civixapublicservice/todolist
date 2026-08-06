import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { CheckCircle2, Home, ListTodo, Calendar, Search, Bell, MoreHorizontal, Users, Zap, Target, ArrowRight, BarChart3, Activity } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

// The Login Visual Preview - Grounded with quick stats and hover states
const LoginPreview = () => (
  <div className="relative z-10 w-full max-w-[600px] flex flex-col pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
    
    {/* Quick Stats Widget */}
    <div className="flex gap-6 mb-8">
      <div className="flex-1 bg-[#121214] border border-zinc-800 rounded-2xl p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700">
        <div className="flex items-center space-x-3 text-zinc-400 mb-4">
          <Activity className="h-5 w-5" />
          <span className="text-sm font-bold uppercase tracking-wider text-zinc-300">Active Tasks</span>
        </div>
        <div className="flex items-baseline space-x-3">
          <span className="text-5xl font-extrabold text-white tracking-tight">12</span>
          <span className="text-sm font-semibold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-md">+3 this week</span>
        </div>
      </div>
      <div className="flex-1 bg-[#121214] border border-zinc-800 rounded-2xl p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700">
        <div className="flex items-center space-x-3 text-zinc-400 mb-4">
          <BarChart3 className="h-5 w-5" />
          <span className="text-sm font-bold uppercase tracking-wider text-zinc-300">Productivity</span>
        </div>
        <div className="flex items-baseline space-x-3">
          <span className="text-5xl font-extrabold text-white tracking-tight">94%</span>
          <span className="text-sm font-semibold text-zinc-400">Last 7 days</span>
        </div>
      </div>
    </div>

    {/* Mini Dashboard Container */}
    <div className="border border-zinc-800 rounded-t-2xl shadow-2xl bg-zinc-950 overflow-hidden flex transform transition-all duration-500 min-h-[380px]">
      {/* Mini Sidebar */}
      <div className="w-16 sm:w-40 bg-zinc-900/30 border-r border-zinc-800 p-4 flex flex-col gap-4">
        <div className="h-6 w-6 bg-white/20 text-white rounded-md flex items-center justify-center mb-2">
          <CheckCircle2 className="h-4 w-4" />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center space-x-2 px-2 py-1.5 rounded-md bg-white/10 text-white transition-colors">
            <Home className="h-3.5 w-3.5 shrink-0" />
            <span className="text-xs font-medium hidden sm:block">Dashboard</span>
          </div>
          <div className="flex items-center space-x-2 px-2 py-1.5 rounded-md text-zinc-500 hover:text-zinc-300 transition-colors">
            <ListTodo className="h-3.5 w-3.5 shrink-0" />
            <span className="text-xs font-medium hidden sm:block">Sprint</span>
          </div>
        </div>
      </div>

      {/* Mini Main Content */}
      <div className="flex-1 bg-zinc-950 flex flex-col h-[280px]">
        <div className="h-12 border-b border-zinc-800 px-4 flex items-center justify-between">
          <div className="flex items-center text-xs text-zinc-500 font-medium">
            <span>Workspace</span>
            <span className="mx-2">/</span>
            <span className="text-zinc-200">Active Sprint</span>
          </div>
          <div className="flex items-center gap-3">
            <Search className="h-3.5 w-3.5 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer" />
            <Bell className="h-3.5 w-3.5 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer" />
          </div>
        </div>

        <div className="p-4 flex-1 overflow-hidden">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-[10px] font-semibold tracking-wider uppercase">In Progress</span>
              <span className="text-[10px] bg-zinc-900 px-1.5 py-0.5 rounded text-zinc-500">2</span>
            </div>
            
            {/* Interactive Cards */}
            <div className="group bg-[#121214] border border-zinc-800 rounded-lg p-3 shadow-sm hover:border-zinc-600 transition-all duration-300 hover:shadow-md cursor-pointer border-l-2 border-l-blue-500 hover:-translate-y-0.5">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-zinc-200 font-medium group-hover:text-white transition-colors">Build Authentication UI</span>
                <MoreHorizontal className="h-3 w-3 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
              </div>
              <div className="flex items-center gap-2 mt-3">
                <div className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-medium">Frontend</div>
                <div className="h-4 w-4 rounded-full bg-zinc-800 border border-zinc-700 ml-auto flex items-center justify-center">
                   <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></div>
                </div>
              </div>
            </div>

            <div className="group bg-[#121214] border border-zinc-800 rounded-lg p-3 shadow-sm hover:border-zinc-600 transition-all duration-300 hover:shadow-md cursor-pointer hover:-translate-y-0.5 opacity-70">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-zinc-200 font-medium group-hover:text-white transition-colors">Update Design System</span>
                <MoreHorizontal className="h-3 w-3 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

// The Register Visual Preview - Focused on features and team scaling
const RegisterPreview = () => (
  <div className="relative z-10 w-full max-w-[600px] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="mb-10">
      <div className="inline-flex items-center space-x-2 bg-white/10 text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-white/20">
        <Zap className="h-4 w-4" />
        <span>Supercharge your workflow</span>
      </div>
      <h2 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-50 mb-6 leading-tight">
        Join teams shipping faster.
      </h2>
      <p className="text-zinc-300 text-lg lg:text-xl leading-relaxed max-w-md font-medium">
        TaskFlow combines powerful task management, seamless collaboration, and real-time insights into one unified platform.
      </p>
    </div>

    <div className="flex flex-col gap-8">
      {/* Collaboration Widget */}
      <div className="bg-[#121214] border border-zinc-800 rounded-2xl p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3 text-zinc-200">
            <Users className="h-5 w-5 text-zinc-400" />
            <span className="text-base font-bold text-white">Team Activity</span>
          </div>
          <span className="text-xs text-emerald-400 font-medium bg-emerald-400/10 px-2 py-0.5 rounded flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Live
          </span>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-3 group">
            <div className="h-7 w-7 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold shrink-0">SJ</div>
            <div>
              <p className="text-xs text-zinc-200 leading-tight">Sarah pushed 3 commits to <span className="font-mono text-zinc-400">auth-ui</span></p>
              <p className="text-[10px] text-zinc-500 mt-1 font-medium">2 mins ago</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 group">
            <div className="h-7 w-7 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-bold shrink-0">MK</div>
            <div>
              <p className="text-xs text-zinc-200 leading-tight">Mike completed task <span className="font-medium text-zinc-300">Design System</span></p>
              <p className="text-[10px] text-zinc-500 mt-1 font-medium">15 mins ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Widget */}
      <div className="bg-[#121214] border border-zinc-800 rounded-2xl p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700">
        <div className="flex items-center space-x-3 text-zinc-200 mb-6">
          <Target className="h-5 w-5 text-zinc-400" />
          <span className="text-base font-bold text-white">Q3 Goals</span>
        </div>
        
        <div className="flex items-end space-x-2 mb-4">
          <span className="text-5xl font-extrabold text-zinc-50 tracking-tight leading-none">85</span>
          <span className="text-zinc-400 text-lg font-bold mb-0.5">%</span>
        </div>
        
        <div className="h-3 w-full bg-zinc-800 rounded-full overflow-hidden mb-4">
          <div className="h-full bg-white w-[85%] rounded-full transition-all duration-1000 ease-out" style={{ width: '85%' }}></div>
        </div>
        <p className="text-sm text-zinc-400 font-medium">
          On track to deliver v2.0 ahead of schedule.
        </p>
      </div>
    </div>
  </div>
)

export default function AuthLayout() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const isRegister = location.pathname.includes('/register')

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      
      {/* Left Side: Dynamic Branding Panel */}
      <div className="hidden lg:flex w-full lg:w-[42%] xl:w-[40%] shrink-0 flex-col justify-center gap-12 bg-[#0a0a0b] px-12 xl:px-20 py-12 text-zinc-50 overflow-y-auto relative custom-scrollbar z-0">
        {/* Subtle Background Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}
        />
        
        {/* Universal Branding Header (if not on register where header is larger) */}
        {!isRegister && (
          <div className="relative z-10 mb-6 animate-in fade-in duration-500">
            <div className="flex items-center space-x-3 text-2xl font-bold tracking-tight mb-5 group cursor-pointer w-fit">
              <CheckCircle2 className="h-8 w-8 text-white transition-transform duration-300 group-hover:scale-110" />
              <span>TaskFlow</span>
            </div>
            <p className="text-zinc-300 text-lg leading-relaxed font-medium">
              The minimal, high-performance workspace for your team. Plan, track, and execute tasks with uncompromising speed.
            </p>
          </div>
        )}

        {/* Dynamic Route-Based Preview */}
        {isRegister ? <RegisterPreview /> : <LoginPreview />}
      </div>

      {/* Right Side: Form Outlet - Flex 1 */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 bg-background relative z-10">
        
        {/* Curvy Divider */}
        <div className="absolute top-0 bottom-0 left-0 -ml-[80px] w-[160px] hidden lg:block pointer-events-none z-20">
          <svg viewBox="0 0 160 1024" preserveAspectRatio="none" className="h-full w-full">
            <path fill="#0a0a0b" d="M0 0H40C40 250 120 250 120 512C120 774 40 774 40 1024H0V0Z" />
            <path fill="currentColor" className="text-background" d="M160 0H40C40 250 120 250 120 512C120 774 40 774 40 1024H160V0Z" />
          </svg>
        </div>

        {/* Decorative Top Accent for Mobile */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent lg:hidden"></div>

        <div className="mx-auto w-full max-w-[520px] animate-in fade-in zoom-in-[0.98] duration-500">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center space-x-2 text-xl font-bold text-foreground mb-10">
            <CheckCircle2 className="h-6 w-6 text-primary" />
            <span>TaskFlow</span>
          </div>
          
          <Outlet />
          
        </div>
      </div>

    </div>
  )
}
