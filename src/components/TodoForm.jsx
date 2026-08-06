import { useState } from 'react'
import { Plus, AlertCircle, Tag, Calendar as CalendarIcon, Sparkles } from 'lucide-react'
import { cn } from '../utils/cn'

export default function TodoForm({ onAddTodo, isSubmitting }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('MEDIUM')
  const [dueDate, setDueDate] = useState('')
  const [error, setError] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!title.trim()) {
      setError('Task title is required')
      return
    }

    if (title.trim().length < 2) {
      setError('Task title must be at least 2 characters')
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
      setError(err.message || 'Failed to create task')
    }
  }

  return (
    <form 
      onSubmit={handleSubmit} 
      className={cn(
        "p-6 transition-all duration-300 relative",
        isFocused ? "shadow-glow bg-white/5 rounded-[var(--radius-lg)]" : ""
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          Task Details
        </h3>
        
        <div className="flex items-center space-x-3 flex-wrap sm:flex-nowrap">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Tag className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="block w-full pl-9 pr-8 py-2 text-sm glass-input appearance-none min-w-[140px] cursor-pointer"
              aria-label="Task priority"
            >
              <option value="LOW">Low Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="HIGH">High Priority</option>
            </select>
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CalendarIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="block w-full pl-9 pr-4 py-2 text-sm glass-input cursor-pointer"
              aria-label="Task due date"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center space-x-2 bg-destructive/10 border border-destructive/20 text-destructive text-sm px-4 py-3 rounded-xl mb-6">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-5">
        <div className="relative group">
          <input
            type="text"
            placeholder="What needs to be done? (e.g. Complete quarterly report)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="block w-full px-4 py-3 sm:py-3.5 text-base glass-input bg-foreground/5 focus:bg-background border-transparent focus:border-primary transition-all duration-300 disabled:opacity-50"
            maxLength={100}
            disabled={isSubmitting}
          />
          <div className="absolute right-3 top-3 text-xs text-muted-foreground font-medium bg-background/80 px-1 rounded backdrop-blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity">
            {title.length}/100
          </div>
        </div>

        <div className="relative group">
          <textarea
            placeholder="Add detailed task description or requirements (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="block w-full px-4 py-3 text-sm glass-input bg-foreground/5 focus:bg-background border-transparent focus:border-primary transition-all duration-300 disabled:opacity-50 resize-y min-h-[100px]"
            rows={3}
            maxLength={500}
            disabled={isSubmitting}
          />
          <div className="absolute right-3 bottom-3 text-xs text-muted-foreground font-medium bg-background/80 px-1 rounded backdrop-blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity">
            {description.length}/500
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary w-full sm:w-auto shadow-md"
        >
          {isSubmitting ? (
            <>
              <div className="spinner mr-2 border-white border-t-transparent"></div>
              <span>Creating Task...</span>
            </>
          ) : (
            <>
              <Plus className="h-5 w-5 shrink-0 mr-1.5" />
              <span>Add Task</span>
            </>
          )}
        </button>
      </div>
    </form>
  )
}