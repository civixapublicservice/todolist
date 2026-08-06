import { useState, useEffect, useCallback } from 'react'
import MainLayout from '../layouts/MainLayout'
import StatsBar from '../components/StatsBar'
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
import { AlertCircle, Plus, CheckSquare } from 'lucide-react'

export default function MyTasksPage() {
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
        priority: priorityFilter,
        sort: sortBy,
      })
      setTodos(data)
    } catch (err) {
      setError(err.message || 'Failed to load task records')
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

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto w-full">
        {/* Welcome Banner */}
        <div className="bg-primary text-primary-foreground rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden mb-8 shadow-sm">
          <div className="relative z-10">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-primary-foreground/20 text-primary-foreground text-xs font-medium mb-3">
              <CheckSquare className="h-3.5 w-3.5" />
              <span>Personal Task Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
              My Tasks
            </h1>
            <p className="text-primary-foreground/80 text-sm max-w-md">
              Manage, filter, and track all your personal operational tasks in one place.
            </p>
          </div>

          <button
            className="relative z-10 inline-flex items-center justify-center space-x-2 bg-background text-primary hover:bg-muted px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm whitespace-nowrap shrink-0"
            onClick={() => setShowCreateModal(!showCreateModal)}
          >
            <Plus className="h-4 w-4" />
            <span>{showCreateModal ? 'Close Form' : 'New Task'}</span>
          </button>
          
          {/* Decorative background element */}
          <div className="absolute right-0 top-0 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        </div>

        {error && (
          <div className="flex items-center space-x-2 bg-destructive/10 text-destructive px-4 py-3 rounded-lg mb-6">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {showCreateModal && (
          <section className="mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
            <TodoForm onAddTodo={handleAddTodo} isSubmitting={isCreating} />
          </section>
        )}

        <section className="mb-6">
          <StatsBar todos={todos} />
        </section>

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

        <section>
          <TodoList
            todos={todos}
            onToggle={handleToggleTodo}
            onDelete={handleDeleteTodo}
            onUpdate={handleUpdateTodo}
            isLoading={isLoadingTodos}
          />
        </section>
      </div>
    </MainLayout>
  )
}
