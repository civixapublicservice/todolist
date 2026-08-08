import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { motion, useReducedMotion } from 'framer-motion'

export default function AuthLayout() {
  const { isAuthenticated } = useAuth()
  const shouldReduceMotion = useReducedMotion()
  
  const pageVariants = {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: shouldReduceMotion ? 0 : -10 }
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="bg-auth">
      
      <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none mix-blend-screen"></div>
      <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none mix-blend-screen"></div>

      <motion.div 
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="w-full flex flex-col items-center justify-center relative z-10"
      >
        <Outlet />
      </motion.div>
      
    </div>
  )
}
