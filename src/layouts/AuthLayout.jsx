import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { CheckCircle2, Home, ListTodo, Calendar, Search, Bell, MoreHorizontal, Users, Zap, Target, ArrowRight, BarChart3, Activity } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const LoginPreview = () => (
  <div className="relative z-10 w-full max-w-[600px] flex flex-col pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
    
    {/* Quick Stats Widget */}
    <div className="flex gap-6 mb-8">
      <div className="flex-1 glass-card p-6">
        <div className="flex items-center space-x-3 text-white/70 mb-4">
          <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
            <Activity className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-bold uppercase tracking-wider text-white">Active Tasks</span>
        </div>
        <div className="flex items-baseline space-x-3">
          <span className="text-5xl font-extrabold text-white tracking-tight drop-shadow-md">12</span>
          <span className="text-sm font-semibold text-emerald-300 bg-emerald-400/20 px-2.5 py-1 rounded-[var(--radius-sm)]">+3 this week</span>
        </div>
      </div>
      <div className="flex-1 glass-card p-6">
        <div className="flex items-center space-x-3 text-white/70 mb-4">
          <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
            <BarChart3 className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-bold uppercase tracking-wider text-white">Productivity</span>
        </div>
        <div className="flex items-baseline space-x-3">
          <span className="text-5xl font-extrabold text-white tracking-tight drop-shadow-md">94%</span>
          <span className="text-sm font-semibold text-white/70">Last 7 days</span>
        </div>
      </div>
    </div>

    {/* Mini Dashboard Container */}
    <div className="glass-panel overflow-hidden flex transform transition-all duration-500 min-h-[380px] shadow-float border border-white/20">
      {/* Mini Sidebar */}
      <div className="w-16 sm:w-40 bg-black/20 border-r border-white/10 p-4 flex flex-col gap-4">
        <div className="h-8 w-8 bg-gradient-to-br from-primary to-secondary text-white rounded-[var(--radius-sm)] flex items-center justify-center mb-2 shadow-glow">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center space-x-3 px-3 py-2 rounded-[var(--radius-sm)] bg-white/20 text-white transition-colors shadow-sm">
            <Home className="h-4 w-4 shrink-0" />
            <span className="text-sm font-medium hidden sm:block">Dashboard</span>
          </div>
          <div className="flex items-center space-x-3 px-3 py-2 rounded-[var(--radius-sm)] text-white/60 hover:text-white hover:bg-white/10 transition-colors">
            <ListTodo className="h-4 w-4 shrink-0" />
            <span className="text-sm font-medium hidden sm:block">Sprint</span>
          </div>
        </div>
      </div>

      {/* Mini Main Content */}
      <div className="flex-1 bg-black/10 flex flex-col h-[320px]">
        <div className="h-14 border-b border-white/10 px-5 flex items-center justify-between">
          <div className="flex items-center text-sm text-white/60 font-medium">
            <span>Workspace</span>
            <span className="mx-2">/</span>
            <span className="text-white">Active Sprint</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors">
              <Search className="h-4 w-4 text-white" />
            </div>
            <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors relative">
              <Bell className="h-4 w-4 text-white" />
              <div className="absolute top-2 right-2 h-1.5 w-1.5 bg-accent rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="p-5 flex-1 overflow-hidden">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-white/70 mb-2">
              <span className="text-[11px] font-bold tracking-wider uppercase">In Progress</span>
              <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-full text-white font-medium">2</span>
            </div>
            
            {/* Interactive Cards */}
            <div className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-[var(--radius-md)] p-4 shadow-sm hover:border-primary/50 transition-all duration-300 hover:shadow-glow cursor-pointer hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-accent"></div>
              <div className="flex justify-between items-start mb-3 ml-2">
                <span className="text-sm text-white font-semibold group-hover:text-primary-foreground transition-colors">Build Authentication UI</span>
                <MoreHorizontal className="h-4 w-4 text-white/50 group-hover:text-white transition-colors" />
              </div>
              <div className="flex items-center gap-2 mt-2 ml-2">
                <div className="text-[11px] px-2 py-1 rounded-full bg-primary/30 text-white font-medium border border-primary/50">Frontend</div>
                <div className="h-5 w-5 rounded-full bg-black/40 border border-white/20 ml-auto flex items-center justify-center">
                   <div className="h-1.5 w-1.5 rounded-full bg-white animate-ping"></div>
                </div>
              </div>
            </div>

            <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-[var(--radius-md)] p-4 shadow-sm hover:border-white/30 transition-all duration-300 hover:shadow-md cursor-pointer hover:-translate-y-0.5">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm text-white/70 font-medium group-hover:text-white transition-colors">Update Design System</span>
                <MoreHorizontal className="h-4 w-4 text-white/40 group-hover:text-white/70 transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

const RegisterPreview = () => (
  <div className="relative z-10 w-full max-w-[600px] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="mb-10">
      <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-primary/30 shadow-glow">
        <Zap className="h-4 w-4 text-accent" />
        <span>Supercharge your workflow</span>
      </div>
      <h2 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight drop-shadow-lg">
        Join teams shipping faster.
      </h2>
      <p className="text-white/80 text-lg lg:text-xl leading-relaxed max-w-md font-medium">
        TaskFlow combines powerful task management, seamless collaboration, and real-time insights into one premium glassmorphic platform.
      </p>
    </div>

    <div className="flex flex-col gap-8">
      {/* Collaboration Widget */}
      <div className="glass-card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3 text-white">
            <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-bold text-white">Team Activity</span>
          </div>
          <span className="text-xs text-emerald-300 font-medium bg-emerald-400/20 px-3 py-1 rounded-full flex items-center gap-2 border border-emerald-400/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            Live
          </span>
        </div>
        
        <div className="space-y-5">
          <div className="flex items-start space-x-4 group">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-glow">SJ</div>
            <div>
              <p className="text-sm text-white/90 leading-tight">Sarah pushed 3 commits to <span className="font-mono text-accent bg-accent/10 px-1 rounded">auth-ui</span></p>
              <p className="text-xs text-white/50 mt-1.5 font-medium">2 mins ago</p>
            </div>
          </div>
          <div className="flex items-start space-x-4 group">
            <div className="h-9 w-9 rounded-full bg-white/20 text-white flex items-center justify-center text-xs font-bold shrink-0 border border-white/30">MK</div>
            <div>
              <p className="text-sm text-white/90 leading-tight">Mike completed task <span className="font-medium text-white">Design System</span></p>
              <p className="text-xs text-white/50 mt-1.5 font-medium">15 mins ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Widget */}
      <div className="glass-card">
        <div className="flex items-center space-x-3 text-white mb-6">
          <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
            <Target className="h-4 w-4 text-white" />
          </div>
          <span className="text-base font-bold text-white">Q3 Goals</span>
        </div>
        
        <div className="flex items-end space-x-2 mb-5">
          <span className="text-5xl font-extrabold text-white tracking-tight leading-none drop-shadow-md">85</span>
          <span className="text-white/60 text-xl font-bold mb-1">%</span>
        </div>
        
        <div className="h-3 w-full bg-black/30 rounded-full overflow-hidden mb-5 border border-white/10">
          <div className="h-full bg-gradient-to-r from-primary to-accent w-[85%] rounded-full shadow-glow" style={{ width: '85%' }}></div>
        </div>
        <p className="text-sm text-white/70 font-medium">
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
    <div className="h-screen bg-gradient-to-br from-[#0F172A] to-[#1E1B4B] flex flex-col md:flex-row font-sans overflow-hidden">
      
      {/* Left Side: Dynamic Branding Panel */}
      <div className="hidden lg:flex w-full lg:w-[45%] xl:w-[42%] shrink-0 flex-col justify-center gap-12 px-12 xl:px-20 py-12 text-white relative z-0">
        
        {/* Animated Background Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] pointer-events-none mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/20 blur-[120px] pointer-events-none mix-blend-screen"></div>

        {/* Universal Branding Header */}
        {!isRegister && (
          <div className="relative z-10 mb-8 animate-in fade-in duration-500">
            <div className="flex items-center space-x-4 text-3xl font-extrabold tracking-tight mb-6 group cursor-pointer w-fit">
              <div className="h-12 w-12 rounded-[var(--radius-md)] bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                <CheckCircle2 className="h-7 w-7 text-white" />
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 drop-shadow-sm">TaskFlow</span>
            </div>
            <p className="text-white/80 text-xl leading-relaxed font-medium max-w-md">
              The premium, high-performance workspace for your team. Plan, track, and execute tasks with uncompromising elegance.
            </p>
          </div>
        )}

        {/* Dynamic Route-Based Preview */}
        {isRegister ? <RegisterPreview /> : <LoginPreview />}
      </div>

      {/* Right Side: Form Outlet - Flex 1 */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 bg-background relative z-10 lg:rounded-l-[40px] shadow-[-20px_0_40px_rgba(0,0,0,0.3)] transition-colors duration-500 overflow-y-auto custom-scrollbar">
        
        {/* Decorative Top Accent for Mobile */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent lg:hidden"></div>

        <div className="mx-auto w-full max-w-[480px] animate-in fade-in scale-in duration-500 relative z-10">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center space-x-3 text-2xl font-extrabold text-foreground mb-12">
            <div className="h-10 w-10 rounded-[var(--radius-sm)] bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow">
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
            <span>TaskFlow</span>
          </div>
          
          <Outlet />
          
        </div>
      </div>

    </div>
  )
}
