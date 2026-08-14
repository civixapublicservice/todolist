import { useAuth } from '../hooks/useAuth'
import { useTasks } from '../context/TaskContext'
import StatsBar from '../components/StatsBar'
import RightWidget from '../components/RightWidget'
import { AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

export default function Dashboard() {
  const { user } = useAuth()
  const { todos, isLoading: isLoadingTodos, error } = useTasks()

  const completedTasks = todos.filter(t => t.completed).length
  const pendingTasks = todos.filter(t => !t.completed).length
  const totalTasks = todos.length

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="flex flex-col xl:flex-row gap-8 max-w-[1400px] mx-auto w-full"
      >
        {/* Main Content Column */}
        <div className="flex-1 min-w-0 xl:pr-4">
          
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut', delay: 0.05 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-black tracking-tight leading-snug mb-2">
              {(() => {
                const h = new Date().getHours()
                const greeting = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
                return (
                  <>
                    <span className="text-foreground">{greeting}, </span>
                    <span className="bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
                      {user?.name ? user.name.split(' ')[0] : 'there'}
                    </span>
                    <span className="text-foreground">.</span>
                  </>
                )
              })()}
            </h1>
            <p className="text-[15px] font-medium text-muted-foreground">
              Here's what's on your plate today. Let's make it a great one.
            </p>
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-6"
              >
                <div className="flex items-center space-x-2 bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl glass">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span className="text-sm font-medium">{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Analytics Stats */}
          <motion.section
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut', delay: 0.1 }}
          >
            <StatsBar todos={todos} />
          </motion.section>
          
          {/* Productivity Ring Widget */}
          <motion.section
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut', delay: 0.15 }}
            className="relative overflow-hidden bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-glass-border shadow-sm hover:shadow-lg transition-all duration-500 rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between min-h-[200px] group"
          >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-indigo-500/5 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Left Side: Text */}
            <div className="relative z-10 flex flex-col items-center sm:items-start text-center sm:text-left mb-8 sm:mb-0">
              <h3 className="text-2xl sm:text-3xl font-black text-foreground mb-3">
                {totalTasks === 0 ? "Let's Get Started" : completedTasks >= pendingTasks ? "Productivity is soaring!" : "Stay Focused"}
              </h3>
              <p className="text-[15px] sm:text-base font-semibold text-muted-foreground max-w-[320px] leading-relaxed">
                {totalTasks === 0 
                  ? "Create your first task to kick off your productivity journey." 
                  : completedTasks >= pendingTasks 
                    ? "You have completed more tasks than you have pending. Keep up the incredible momentum!"
                    : <>You have <span className="font-black text-amber-500">{pendingTasks}</span> pending task{pendingTasks !== 1 ? 's' : ''}. Prioritize your most important work and conquer it.</>}
              </p>
            </div>

            {/* Right Side: Circular Progress */}
            <div className="relative z-10 flex items-center justify-center shrink-0">
              <div className="relative w-40 h-40">
                {/* SVG Ring */}
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="currentColor"
                    className="text-muted/30"
                    strokeWidth="8"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "0 251.2" }}
                    animate={{ strokeDasharray: `${totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 251.2} 251.2` }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#6366f1" /> {/* Indigo */}
                      <stop offset="100%" stopColor="#8b5cf6" /> {/* Violet */}
                    </linearGradient>
                  </defs>
                </svg>
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-foreground leading-none">
                    {totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)}%
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1.5 opacity-80">Completed</span>
                </div>
              </div>
            </div>
          </motion.section>

        </div>

        {/* Right Sidebar Widgets Panel */}
        <div className="w-full xl:w-80 shrink-0">
          <RightWidget todos={todos} />
        </div>
      </motion.div>
    </>
  )
}