import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../hooks/useAuth'
import MainLayout from '../layouts/MainLayout'
import StatsBar from '../components/StatsBar'
import FilterBar from '../components/FilterBar'
import TodoForm from '../components/TodoForm'
import TodoList from '../components/TodoList'
import RightWidget from '../components/RightWidget'
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodo,
} from '../services/todoService'
import { AlertCircle, Plus, Sparkles } from 'lucide-react'


export default function Dashboard() {
  const { user } = useAuth()
  const [todos, setTodos] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [isLoadingTodos, setIsLoadingTodos] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [error, setError] = useState('')

  // Debounce search query input (300ms delay)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 300)
    return () => clearTimeout(handler)
  }, [searchQuery])

  const fetchTodoList = useCallback(async () => {
    setIsLoadingTodos(true)
    setError('')
    try {
      const data = await getTodos({
        search: debouncedSearch,
        status: statusFilter,
        sort: sortBy,
      })
      setTodos(data)
    } catch (err) {
      setError(err.message || 'Failed to load task records')
    } finally {
      setIsLoadingTodos(false)
    }
  }, [debouncedSearch, statusFilter, sortBy])

  useEffect(() => {
    fetchTodoList()
  }, [fetchTodoList])

  const handleAddTodo = async ({ title, description, priority }) => {
    setIsCreating(true)
    setError('')
    try {
      const newTodo = await createTodo({ title, description, priority })
      setTodos((prev) => [newTodo, ...prev])
      setShowCreateModal(false)
    } catch (err) {
      setError(err.message || 'Failed to create task')
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
    } catch (err) {
      setError(err.message || 'Failed to update task')
    }
  }

  const handleToggleTodo = async (id) => {
    setError('')
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
    try {
      const updated = await toggleTodo(id)
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)))
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
    } catch (err) {
      fetchTodoList()
      setError(err.message || 'Failed to delete task')
    }
  }

  const displayedTodos = todos.filter((todo) => {
    if (priorityFilter === 'all') return true
    return todo.priority === priorityFilter
  })

  return (
    <MainLayout>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content Column */}
        <div className="flex-1 min-w-0 lg:border-r lg:border-border lg:pr-8">
          {/* Welcome Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-1">
                Dashboard
              </h1>
              <p className="text-muted-foreground text-sm font-medium">
                Welcome back, {user?.name ? user.name.split(' ')[0] : 'Team'}. Here's what's happening today.
              </p>
            </div>

            <button
              className="inline-flex items-center justify-center space-x-2 bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm shrink-0 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
              onClick={() => setShowCreateModal(!showCreateModal)}
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              <span>{showCreateModal ? 'Close Form' : 'New Task'}</span>
            </button>
          </div>

          {/* Section Divider */}
          <div className="border-b border-border mb-10"></div>

          {error && (
            <div className="flex items-center space-x-2 bg-destructive/10 text-destructive px-4 py-3 rounded-lg mb-6">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {/* Collapsible / Modal Create Task Form */}
          {showCreateModal && (
            <section className="mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
              <TodoForm onAddTodo={handleAddTodo} isSubmitting={isCreating} />
            </section>
          )}

          {/* Quick Analytics Stats */}
          <section className="mb-6">
            <StatsBar todos={todos} />
          </section>

          {/* Action Toolbar Filters */}
          <section className="mb-5">
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
          </section>

          {/* Main Task List */}
          <section>
            <TodoList
              todos={displayedTodos}
              onToggle={handleToggleTodo}
              onDelete={handleDeleteTodo}
              onUpdate={handleUpdateTodo}
              isLoading={isLoadingTodos}
            />
          </section>
        </div>

        {/* Right Sidebar Widgets Panel */}
        <div className="w-full lg:w-80 shrink-0">
          <RightWidget todos={todos} />
        </div>
      </div>
    </MainLayout>
  )
}