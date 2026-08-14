import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import FilterBar from '../components/FilterBar'
import TodoForm from '../components/TodoForm'
import TodoList from '../components/TodoList'
import { useTasks } from '../context/TaskContext'
import { AlertCircle, Plus, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

export default function MyTasksPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialSearch = searchParams.get('q') || ''
  
  const { todos: allTodos, isLoading: isLoadingTodos, error: contextError, addTodo, editTodo, toggleTaskCompletion, removeTodo } = useTasks()
  
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch)
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [isCreating, setIsCreating] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [localError, setLocalError] = useState('')

  const error = localError || contextError

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

  // Client-side filtering and sorting instead of re-fetching
  const filteredTodos = useMemo(() => {
    let result = [...allTodos]
    
    if (debouncedSearch) {
      const lowerQuery = debouncedSearch.toLowerCase()
      result = result.filter(t => 
        t.title.toLowerCase().includes(lowerQuery) || 
        (t.description && t.description.toLowerCase().includes(lowerQuery))
      )
    }
    
    if (statusFilter !== 'all') {
      const isCompleted = statusFilter === 'completed'
      result = result.filter(t => t.completed === isCompleted)
    }
    
    if (priorityFilter !== 'all') {
      result = result.filter(t => t.priority === priorityFilter)
    }
    
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    } else if (sortBy === 'title') {
      result.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
    }
    
    return result
  }, [allTodos, debouncedSearch, statusFilter, priorityFilter, sortBy])

  const handleAddTodo = async (todoData) => {
    setIsCreating(true)
    setLocalError('')
    try {
      await addTodo(todoData)
      setShowCreateModal(false)
      toast.success('Task created successfully!')
    } catch (err) {
      setLocalError(err.message || 'Failed to create task')
    } finally {
      setIsCreating(false)
    }
  }

  const handleUpdateTodo = async (id, updates) => {
    setLocalError('')
    try {
      await editTodo(id, updates)
      toast.success('Task updated')
    } catch (err) {
      setLocalError(err.message || 'Failed to update task')
    }
  }

  const handleToggleTodo = async (id) => {
    setLocalError('')
    try {
      await toggleTaskCompletion(id)
    } catch (err) {
      setLocalError(err.message || 'Failed to toggle task completion')
    }
  }

  const handleDeleteTodo = async (id) => {
    setLocalError('')
    try {
      await removeTodo(id)
    } catch (err) {
      setLocalError(err.message || 'Failed to delete task')
    }
  }

  return (
    <>
      <div className="max-w-5xl mx-auto w-full">
        {/* Welcome Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="relative overflow-hidden mb-8 rounded-[1.5rem] bg-gradient-to-r from-primary to-accent dark:bg-none dark:bg-[#0A0A0B] shadow-glow dark:shadow-2xl dark:border dark:border-white/5"
        >
          {/* Light Mode Decorative Elements */}
          <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none mix-blend-overlay block dark:hidden"></div>
          <div className="absolute left-1/2 bottom-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mb-32 pointer-events-none mix-blend-overlay block dark:hidden"></div>

          {/* Dark Mode Sophisticated Glows & Patterns */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none hidden dark:block">
            <div className="absolute -top-[50%] -left-[10%] w-[70%] h-[150%] bg-violet-600/20 blur-[100px] rounded-full mix-blend-screen" />
            <div className="absolute -bottom-[50%] -right-[10%] w-[70%] h-[150%] bg-blue-600/20 blur-[100px] rounded-full mix-blend-screen" />
            {/* Subtle dot pattern */}
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(circle at center, currentColor 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
            {/* Glass reflection line */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>

          <div className="relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-8">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 sm:py-1.5 rounded-full bg-white/20 dark:bg-white/5 border border-white/20 dark:border-white/10 backdrop-blur-md text-white dark:text-white/80 text-xs sm:text-[11px] font-semibold sm:font-bold tracking-wide sm:tracking-widest uppercase mb-3 sm:mb-4">
                <Sparkles className="h-3.5 w-3.5 text-white dark:text-primary" />
                <span>Personal Workspace</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold sm:font-extrabold tracking-tight mb-2 sm:mb-3 text-white">
                My Tasks
              </h1>
              <p className="text-white/90 dark:text-white/60 text-sm sm:text-base max-w-md font-medium leading-relaxed">
                Manage, filter, and track all your personal operational tasks in one highly focused environment.
              </p>
            </div>

            <button
              className="relative group inline-flex items-center justify-center space-x-2 bg-white text-primary dark:text-black hover:bg-white/90 active:scale-95 px-6 sm:px-7 py-3 sm:py-3.5 rounded-2xl sm:rounded-[1.25rem] text-sm font-bold transition-all shadow-lg dark:shadow-xl shrink-0"
              onClick={() => setShowCreateModal(!showCreateModal)}
            >
              <div className="absolute inset-0 rounded-2xl sm:rounded-[1.25rem] bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-10 transition-opacity hidden dark:block" />
              <Plus className={`h-5 w-5 transition-transform duration-300 ${showCreateModal ? 'rotate-45' : ''}`} strokeWidth={2.5} />
              <span>{showCreateModal ? 'Cancel' : 'New Task'}</span>
            </button>
          </div>
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
              initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
              animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
              exit={{ opacity: 0, height: 0, overflow: 'hidden', filter: 'blur(4px)' }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <div className="mb-4">
                <TodoForm onAddTodo={handleAddTodo} isSubmitting={isCreating} />
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        <motion.section 
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut', delay: 0.05 }}
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
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut', delay: 0.1 }}
        >
          <TodoList
            todos={filteredTodos}
            onToggle={handleToggleTodo}
            onDelete={handleDeleteTodo}
            onUpdate={handleUpdateTodo}
            isLoading={isLoadingTodos}
          />
        </motion.section>
      </div>
    </>
  )
}
