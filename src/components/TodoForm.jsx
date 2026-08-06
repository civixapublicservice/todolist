import { useState } from 'react'
import { Plus, AlertCircle, Tag, Calendar as CalendarIcon } from 'lucide-react'


export default function TodoForm({ onAddTodo, isSubmitting }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('MEDIUM')
  const [dueDate, setDueDate] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!title.trim()) {
      setError('Todo title is required')
      return
    }

    if (title.trim().length < 2) {
      setError('Todo title must be at least 2 characters')
      return
    }

    try {
      await onAddTodo({
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate: dueDate || null,
      })
      setTitle('')
      setDescription('')
      setPriority('MEDIUM')
      setDueDate('')
    } catch (err) {
      setError(err.message || 'Failed to create todo')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl shadow-sm p-4 sm:p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-lg font-semibold text-foreground">Create New Task</h3>
        
        <div className="flex items-center space-x-2 flex-wrap sm:flex-nowrap">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
              <Tag className="h-4 w-4 text-muted-foreground" />
            </div>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="block w-full pl-8 pr-8 py-1.5 text-sm bg-muted border border-border rounded-md text-foreground focus:outline-none focus:bg-card focus:border-ring focus:ring-1 focus:ring-ring transition-colors appearance-none"
              aria-label="Task priority"
            >
              <option value="LOW">Low Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="HIGH">High Priority</option>
            </select>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="block w-full pl-8 pr-3 py-1.5 text-sm bg-muted border border-border rounded-md text-foreground focus:outline-none focus:bg-card focus:border-ring focus:ring-1 focus:ring-ring transition-colors"
              aria-label="Task due date"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center space-x-2 bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-md mb-6">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Task title (e.g. Complete quarterly report)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="block w-full px-3 py-2 sm:py-2.5 text-sm sm:text-base bg-background border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors disabled:opacity-50"
            maxLength={100}
            disabled={isSubmitting}
          />
          <div className="absolute right-2.5 bottom-2.5 text-xs text-muted-foreground">
            {title.length}/100
          </div>
        </div>

        <div className="relative">
          <textarea
            placeholder="Add detailed task description or requirements (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block w-full px-3 py-2 text-sm bg-background border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors disabled:opacity-50 resize-y min-h-[80px]"
            rows={3}
            maxLength={500}
            disabled={isSubmitting}
          />
          <div className="absolute right-2.5 bottom-2.5 text-xs text-muted-foreground bg-background px-1">
            {description.length}/500
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center space-x-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full border-2 border-current border-t-transparent h-4 w-4 shrink-0"></div>
              <span>Creating Task...</span>
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 shrink-0" />
              <span>Add Task</span>
            </>
          )}
        </button>
      </div>
    </form>
  )
}