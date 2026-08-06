import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import FilterBar from '../components/FilterBar'
import TodoForm from '../components/TodoForm'
import TodoList from '../components/TodoList'
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodo,
} from '../services/todoService'
import { AlertCircle, Plus, CheckSquare, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

export default function MyTasksPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialSearch = searchParams.get('q') || ''
  
  const [todos, setTodos] = useState([])
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch)
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [isLoadingTodos, setIsLoadingTodos] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      if (searchQuery !== (searchParams.get('q') || '')) {
         if (searchQuery) {
           setSearchParams({ q: searchQuery }, { replace: true })
         } else {
           setSearchParams({}, { replace: true })
         }
      }
    }, 300)
    return () => clearTimeout(handler)
  }, [searchQuery, setSearchParams, searchParams])

  useEffect(() => {
    const q = searchParams.get('q')
    if (q !== null && q !== searchQuery) {
      setSearchQuery(q)
      setDebouncedSearch(q)
    }
  }, [searchParams])

  const fetchTodoList = useCallback(async () => {
    setIsLoadingTodos(true)
    setError('')
    try {
      const data = await getTodos({
        search: debouncedSearch,
        status: statusFilter,
        priority: priorityFilter,
        sort: sortBy,
      })
      setTodos(data)
    } catch (err) {
      setError(err.message || 'Failed to load task records')
      toast.error('Failed to load tasks')
    } finally {
      setIsLoadingTodos(false)
    }
  }, [debouncedSearch, statusFilter, priorityFilter, sortBy])

  useEffect(() => {
    fetchTodoList()
  }, [fetchTodoList])

  const handleAddTodo = async (todoData) => {
    setIsCreating(true)
    setError('')
    try {
      const newTodo = await createTodo(todoData)
      setTodos((prev) => [newTodo, ...prev])
      setShowCreateModal(false)
      toast.success('Task created successfully!', { icon: '🎉' })
    } catch (err) {
      setError(err.message || 'Failed to create task')
      toast.error('Failed to create task')
      throw err
    } finally {
      setIsCreating(false)
    }
  }

  const handleUpdateTodo = async (id, updates) => {
    setError('')
    try {
      const updated = await updateTodo(id, updates)
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)))
      toast.success('Task updated')
    } catch (err) {
      setError(err.message || 'Failed to update task')
      toast.error('Failed to update task')
    }
  }

  const handleToggleTodo = async (id) => {
    setError('')
    const taskBefore = todos.find(t => t.id === id)
    const wasCompleted = taskBefore?.completed
    
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
    
    try {
      const updated = await toggleTodo(id)
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)))
      if (!wasCompleted) {
        toast.success('Task completed! Keep it up.', { icon: '✨' })
      }
    } catch (err) {
      fetchTodoList()
      setError(err.message || 'Failed to toggle task completion')
    }
  }

  const handleDeleteTodo = async (id) => {
    setError('')
    setTodos((prev) => prev.filter((t) => t.id !== id))
    try {
      await deleteTodo(id)
      toast.success('Task deleted')
    } catch (err) {
      fetchTodoList()
      setError(err.message || 'Failed to delete task')
    }
  }

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto w-full">
        {/* Welcome Banner */}
        <motion.div 
          initial={{ opacity: 0, y: -20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="bg-gradient-to-r from-primary to-accent text-white rounded-[var(--radius-lg)] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden mb-8 shadow-glow"
        >
          <div className="relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold tracking-wide uppercase mb-3 border border-white/20">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Personal Workspace</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2 text-white">
              My Tasks
            </h1>
            <p className="text-white/80 text-sm max-w-md font-medium">
              Manage, filter, and track all your personal operational tasks in one beautiful place.
            </p>
          </div>

          <button
            className="relative z-10 inline-flex items-center justify-center space-x-2 bg-white text-primary hover:bg-white/90 hover:scale-105 active:scale-95 px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-lg whitespace-nowrap shrink-0"
            onClick={() => setShowCreateModal(!showCreateModal)}
          >
            <Plus className={`h-5 w-5 transition-transform duration-300 ${showCreateModal ? 'rotate-45' : ''}`} strokeWidth={2.5} />
            <span>{showCreateModal ? 'Cancel' : 'New Task'}</span>
          </button>
          
          {/* Decorative background elements */}
          <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none mix-blend-overlay"></div>
          <div className="absolute left-1/2 bottom-0 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl -mb-32 pointer-events-none mix-blend-overlay"></div>
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

        <AnimatePresence>
          {showCreateModal && (
            <motion.section 
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20, filter: 'blur(4px)' }}
              transition={{ duration: 0.3 }}
              className="mb-8 overflow-hidden"
            >
              <div className="glass-card border border-glass-border">
                <TodoForm onAddTodo={handleAddTodo} isSubmitting={isCreating} />
              </div>
            </motion.section>
          )}
        </AnimatePresence>


        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6 relative z-10"
        >
          <div className="glass-panel border border-glass-border p-4 shadow-sm">
            <FilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              priorityFilter={priorityFilter}
              onPriorityChange={setPriorityFilter}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <TodoList
            todos={todos}
            onToggle={handleToggleTodo}
            onDelete={handleDeleteTodo}
            onUpdate={handleUpdateTodo}
            isLoading={isLoadingTodos}
          />
        </motion.section>
      </div>
    </MainLayout>
  )
}
