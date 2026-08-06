import { Outlet, Navigate } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export default function AuthLayout() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="bg-auth">
      
      {/* Decorative Light Elements for Deep Space vibe */}
      <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none mix-blend-screen"></div>
      <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none mix-blend-screen"></div>

      <div className="w-full flex flex-col items-center justify-center relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <Outlet />
      </div>
      
    </div>
  )
}
