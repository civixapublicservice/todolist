import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import MobileNav from '../components/MobileNav'
import { motion, useReducedMotion } from 'framer-motion'

export default function MainLayout({ children }) {
  const shouldReduceMotion = useReducedMotion()
  
  const pageVariants = {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: shouldReduceMotion ? 0 : -10 }
  }

  return (
    <div className="flex h-screen bg-transparent text-foreground overflow-hidden">
      {/* Fixed Left Navigation Sidebar */}
      <Sidebar />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Top Bar */}
        <Header />

        {/* Dynamic Page Content */}
        <motion.main 
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="flex-1 overflow-y-auto p-4 pb-24 md:p-6 lg:p-8 md:pb-6 relative z-0"
        >
          {children}
        </motion.main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  )
}