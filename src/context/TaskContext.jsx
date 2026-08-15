import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getTodos, createTodo, updateTodo, toggleTodo, deleteTodo as deleteTodoApi } from '../services/todoService'
import { useAuth } from '../hooks/useAuth'
import { toast } from 'sonner'

const TaskContext = createContext(null)

export const TaskProvider = ({ children }) => {
  const { isAuthenticated } = useAuth()
  const [todos, setTodos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated) return
    setIsLoading(true)
    setError('')
    try {
      // Fetch all tasks once
      const data = await getTodos({ search: '', status: 'all', sort: 'newest' })
      setTodos(data)
    } catch (err) {
      setError(err.message || 'Failed to load tasks')
      toast.error('Failed to load tasks')
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const addTodo = async (todoData) => {
    const newTodo = await createTodo(todoData)
    setTodos(prev => [newTodo, ...prev])
    return newTodo
  }

  const editTodo = async (id, updates) => {
    const previousTodos = [...todos]
    // Optimistic update
    setTodos(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
    try {
      const updated = await updateTodo(id, updates)
      setTodos(prev => prev.map(t => t.id === id ? updated : t))
      return updated
    } catch (err) {
      setTodos(previousTodos) // Rollback on error
      toast.error(err.message || 'Failed to update task')
      throw err
    }
  }

  const toggleTaskCompletion = async (id) => {
    const previousTodos = [...todos]
    const taskBefore = todos.find(t => t.id === id)
    const wasCompleted = taskBefore?.completed
    
    // Optimistic toggle
    setTodos(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
      
      // Check if this action completed all tasks
      if (!wasCompleted) {
        const allCompletedNow = updated.length > 0 && updated.every(t => t.completed);
        if (allCompletedNow) {
          import('canvas-confetti').then((confettiModule) => {
            const confetti = confettiModule.default;
            const colors = ['#7c3aed', '#a855f7', '#c084fc', '#ffffff'];
            confetti({ particleCount: 400, spread: 120, origin: { x: 0, y: 0.7 }, angle: 60, startVelocity: 60, colors });
            confetti({ particleCount: 400, spread: 120, origin: { x: 1, y: 0.7 }, angle: 120, startVelocity: 60, colors });
          });
        }
      }
      
      return updated;
    })
    
    // Instant optimistic toast
    if (!wasCompleted) {
      toast.success('Task completed! Keep it up.')
    }

    try {
      const updated = await toggleTodo(id)
      setTodos(prev => prev.map(t => t.id === id ? updated : t))
      return updated
    } catch (err) {
      setTodos(previousTodos) // Rollback on error
      toast.error(err.message || 'Failed to toggle task')
      throw err
    }
  }

  const removeTodo = async (id) => {
    const previousTodos = [...todos]
    // Optimistic delete
    setTodos(prev => prev.filter(t => t.id !== id))
    try {
      await deleteTodoApi(id)
      toast.success('Task deleted')
    } catch (err) {
      setTodos(previousTodos) // Rollback on error
      toast.error(err.message || 'Failed to delete task')
      throw err
    }
  }

  return (
    <TaskContext.Provider value={{
      todos,
      isLoading,
      error,
      fetchTasks,
      addTodo,
      editTodo,
      toggleTaskCompletion,
      removeTodo
    }}>
      {children}
    </TaskContext.Provider>
  )
}

export const useTasks = () => {
  const context = useContext(TaskContext)
  if (!context) throw new Error('useTasks must be used within TaskProvider')
  return context
}
