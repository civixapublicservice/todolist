import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../hooks/useAuth'
import MainLayout from '../layouts/MainLayout'
import StatsBar from '../components/StatsBar'
import RightWidget from '../components/RightWidget'
import { getTodos } from '../services/todoService'
import { AlertCircle, Rocket, Target, ListTodo } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

export default function Dashboard() {
  const { user } = useAuth()
  const [todos, setTodos] = useState([])
  // eslint-disable-next-line no-unused-vars
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTodoList()
  }, [fetchTodoList])

  const completedTasks = todos.filter(t => t.completed).length
  const pendingTasks = todos.filter(t => !t.completed).length
  const totalTasks = todos.length

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
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, type: 'spring', stiffness: 380, damping: 30 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-foreground tracking-tight leading-snug mb-1">
              {(() => {
                const h = new Date().getHours()
                const greeting = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
                const name = user?.name ? user.name.split(' ')[0] : 'there'
                return `${greeting}, ${name}.`
              })()}
            </h1>
            <p className="text-sm text-muted-foreground">
              Here's what's on your plate today.
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
            {totalTasks === 0 ? (
              <>
                <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-6">
                  <ListTodo className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Let's Get Started</h3>
                <p className="text-muted-foreground max-w-sm">Create your first task to kick off your productivity journey.</p>
              </>
            ) : completedTasks >= pendingTasks ? (
              <>
                <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 shadow-glow">
                  <Rocket className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Productivity is soaring!</h3>
                <p className="text-muted-foreground max-w-sm">You have completed more tasks than you have pending. Keep up the incredible momentum!</p>
              </>
            ) : (
              <>
                <div className="h-20 w-20 bg-amber-500/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                  <Target className="h-10 w-10 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Stay Focused</h3>
                <p className="text-muted-foreground max-w-sm">You have {pendingTasks} pending task{pendingTasks !== 1 ? 's' : ''}. Prioritize your most important work and conquer it.</p>
              </>
            )}
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