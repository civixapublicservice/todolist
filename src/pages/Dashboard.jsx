import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../hooks/useAuth'
import MainLayout from '../layouts/MainLayout'
import StatsBar from '../components/StatsBar'
import RightWidget from '../components/RightWidget'
import { getTodos } from '../services/todoService'
import { AlertCircle, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

export default function Dashboard() {
  const { user } = useAuth()
  const [todos, setTodos] = useState([])
  const [isLoadingTodos, setIsLoadingTodos] = useState(true)
  const [error, setError] = useState('')

  const fetchTodoList = useCallback(async () => {
    setIsLoadingTodos(true)
    setError('')
    try {
      // Fetch all tasks for analytics overview
      const data = await getTodos({
        search: '',
        status: 'all',
        sort: 'newest',
      })
      setTodos(data)
    } catch (err) {
      setError(err.message || 'Failed to load task records')
      toast.error('Failed to load tasks')
    } finally {
      setIsLoadingTodos(false)
    }
  }, [])

  useEffect(() => {
    fetchTodoList()
  }, [fetchTodoList])

  return (
    <MainLayout>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col xl:flex-row gap-8 max-w-[1400px] mx-auto w-full"
      >
        {/* Main Content Column */}
        <div className="flex-1 min-w-0 xl:pr-4">
          
          {/* Welcome Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase mb-3 border border-primary/20">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Dashboard Overview</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-2 pb-1">
                Welcome back, {user?.name ? user.name.split(' ')[0] : 'Team'}
              </h1>
              <p className="text-muted-foreground text-sm font-medium">
                Here's a high-level overview of your workspace.
              </p>
            </motion.div>
          </div>

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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <StatsBar todos={todos} />
          </motion.section>
          
          {/* We can place additional analytics or a big chart here in the future */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-card border border-border shadow-sm rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[300px]"
          >
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-xl font-bold text-foreground mb-2">Productivity is up!</h3>
            <p className="text-muted-foreground">You are making great progress this week. Check 'My Tasks' to continue.</p>
          </motion.section>

        </div>

        {/* Right Sidebar Widgets Panel */}
        <div className="w-full xl:w-80 shrink-0">
          <RightWidget todos={todos} />
        </div>
      </motion.div>
    </MainLayout>
  )
}