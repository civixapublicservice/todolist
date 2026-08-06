import { useState } from 'react'
import { Trash2, Edit2, Check, X, Calendar as CalendarIcon, Tag, CheckCircle2, Clock } from 'lucide-react'

export default function TodoItem({
  todo,
  onToggle,
  onDelete,
  onUpdate,
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [editDescription, setEditDescription] = useState(todo.description || '')
  const [editPriority, setEditPriority] = useState(todo.priority || 'MEDIUM')
  const [editDueDate, setEditDueDate] = useState(
    todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : ''
  )
  const [isUpdating, setIsUpdating] = useState(false)

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) {
      alert('Todo title cannot be empty')
      return
    }

    setIsUpdating(true)
    try {
      await onUpdate(todo.id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        priority: editPriority,
        dueDate: editDueDate || null,
      })
      setIsEditing(false)
    } catch (err) {
      alert(err.message || 'Failed to update task')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCancelEdit = () => {
    setEditTitle(todo.title)
    setEditDescription(todo.description || '')
    setEditPriority(todo.priority || 'MEDIUM')
    setEditDueDate(todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : '')
    setIsEditing(false)
  }

  const getPriorityClasses = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-destructive/10 text-destructive border border-destructive/20 font-bold'
      case 'MEDIUM':
        return 'bg-primary/20 text-foreground border border-primary/30 font-bold'
      case 'LOW':
        return 'bg-muted text-muted-foreground border border-border font-bold'
      default:
        return 'bg-primary/20 text-foreground border border-primary/30 font-bold'
    }
  }

  if (isEditing) {
    return (
      <div className="bg-card rounded-xl shadow-md border border-border p-6 flex flex-col justify-between min-h-[260px] ring-2 ring-primary">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
            <span className="text-sm font-semibold text-foreground">Edit Task</span>
            <div className="flex items-center space-x-2">
              <select
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value)}
                className="block pl-3 pr-8 py-1 text-xs bg-muted border border-border rounded-md text-foreground focus:outline-none focus:bg-card focus:border-ring focus:ring-1 focus:ring-ring transition-colors appearance-none"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
              <input
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                className="block px-2 py-1 text-xs bg-muted border border-border rounded-md text-foreground focus:outline-none focus:bg-card focus:border-ring focus:ring-1 focus:ring-ring transition-colors"
              />
            </div>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="block w-full px-3 py-2 text-sm bg-background border border-border rounded-md text-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors disabled:opacity-50"
              autoFocus
              maxLength={100}
              disabled={isUpdating}
            />
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="block w-full px-3 py-2 text-sm bg-background border border-border rounded-md text-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors disabled:opacity-50 resize-none h-[60px]"
              maxLength={500}
              disabled={isUpdating}
            />
          </div>
        </div>
        
        <div className="flex items-center justify-end space-x-2 mt-4 pt-4 border-t border-border">
          <button
            onClick={handleCancelEdit}
            disabled={isUpdating}
            className="inline-flex items-center justify-center bg-muted text-muted-foreground hover:bg-muted/80 px-4 py-2 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveEdit}
            disabled={isUpdating}
            className="inline-flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
          >
            {isUpdating ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    )
  }

  // Calculate a fake progress percentage just for visual flair as requested by image reference
  // 100% if completed, otherwise random looking but deterministic based on ID length
  const progressPercent = todo.completed ? 100 : (todo.id.length % 5) * 20 + 20

  return (
    <div className={`group relative flex flex-col justify-between bg-card rounded-xl border border-border p-6 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 min-h-[260px] ${todo.completed ? 'opacity-70 bg-muted/30' : ''}`}>
      
      {/* Top Header - Meta info */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center space-x-1.5 text-xs text-muted-foreground font-medium">
            <CalendarIcon className="h-3.5 w-3.5" strokeWidth={2} />
            <span>{todo.dueDate ? new Date(todo.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No Date'}</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-border" />
          <div className={`px-2.5 py-0.5 rounded-full text-[10px] tracking-wider uppercase ${getPriorityClasses(todo.priority)}`}>
            {todo.priority || 'MEDIUM'}
          </div>
        </div>

        {/* Hover Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-lg bg-muted hover:bg-muted/80"
            title="Edit task"
          >
            <Edit2 className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
          <button
            onClick={() => {
              if (window.confirm('Delete this task?')) onDelete(todo.id)
            }}
            className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-lg bg-muted hover:bg-destructive/10"
            title="Delete task"
          >
            <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col mb-6">
        <div className="flex gap-4 items-start">
          {/* Visual Icon */}
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-primary/10 text-primary-foreground">
            {todo.completed ? <CheckCircle2 className="h-6 w-6" strokeWidth={2} /> : <Clock className="h-6 w-6" strokeWidth={2} />}
          </div>
          <div className="flex-1 min-w-0 pt-1">
            <h3 className={`text-lg font-bold leading-tight truncate ${todo.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
              {todo.title}
            </h3>
            {todo.description && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {todo.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer Progress */}
      <div className="mt-auto">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Task Progress</span>
            <div className="flex items-center gap-1.5">
              <span>{todo.completed ? 'Done' : 'Active'}</span>
              <button 
                onClick={() => onToggle(todo.id)}
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${todo.completed ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground hover:border-primary'}`}
              >
                {todo.completed && <Check className="h-2.5 w-2.5" strokeWidth={2.5} />}
              </button>
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden flex gap-1">
            <div className="h-full bg-primary rounded-full transition-all duration-1000 ease-in-out" style={{ width: `${progressPercent}%` }} />
            {/* Visual segments for styling to match reference */}
            {!todo.completed && (
              <div className="h-full bg-muted-foreground/20 rounded-full w-[20%]" />
            )}
          </div>
        </div>
      </div>

    </div>
  )
}