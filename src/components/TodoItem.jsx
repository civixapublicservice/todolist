import { useState } from 'react'
import { Trash2, Edit2, Check, X, Calendar as CalendarIcon, Tag, CheckCircle2, Clock } from 'lucide-react'
import { cn } from '../utils/cn'

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
        return 'bg-destructive/10 text-destructive border-destructive/20 shadow-[0_0_10px_rgba(239,68,68,0.15)]'
      case 'MEDIUM':
        return 'bg-primary/20 text-primary border-primary/30 shadow-[0_0_10px_rgba(124,58,237,0.15)]'
      case 'LOW':
        return 'bg-muted text-muted-foreground border-border'
      default:
        return 'bg-primary/20 text-primary border-primary/30'
    }
  }

  if (isEditing) {
    return (
      <div className="glass-card shadow-glow border border-primary/50 p-6 flex flex-col justify-between min-h-[260px] relative overflow-hidden bg-background/80">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
        <div className="flex flex-col gap-4 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-glass-border pb-3">
            <span className="text-sm font-semibold text-foreground bg-primary/10 px-2 py-1 rounded-md text-primary">Edit Task</span>
            <div className="flex items-center space-x-2">
              <select
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value)}
                className="block pl-3 pr-8 py-1.5 text-xs glass-input appearance-none min-w-[100px]"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
              <input
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                className="block px-2 py-1.5 text-xs glass-input"
              />
            </div>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="block w-full px-3 py-2 text-sm glass-input font-medium"
              autoFocus
              maxLength={100}
              disabled={isUpdating}
            />
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="block w-full px-3 py-2 text-sm glass-input resize-none h-[60px]"
              maxLength={500}
              disabled={isUpdating}
            />
          </div>
        </div>
        
        <div className="flex items-center justify-end space-x-2 mt-4 pt-4 border-t border-glass-border relative z-10">
          <button
            onClick={handleCancelEdit}
            disabled={isUpdating}
            className="btn btn-secondary text-xs py-1.5 px-4"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveEdit}
            disabled={isUpdating}
            className="btn btn-primary text-xs py-1.5 px-4"
          >
            {isUpdating ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    )
  }

  const progressPercent = todo.completed ? 100 : (todo.id.length % 5) * 20 + 20

  return (
    <div className={cn(
      "glass-card group relative flex flex-col justify-between min-h-[260px] cursor-default",
      todo.completed ? "opacity-75 bg-muted/20" : ""
    )}>
      
      {todo.completed && (
        <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px] rounded-[var(--radius-lg)] z-0 pointer-events-none" />
      )}

      {/* Top Header - Meta info */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center space-x-1.5 text-xs text-foreground/70 font-semibold bg-foreground/5 px-2 py-1 rounded-md border border-glass-border">
            <CalendarIcon className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
            <span>{todo.dueDate ? new Date(todo.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No Date'}</span>
          </div>
          <div className={cn("px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase border", getPriorityClasses(todo.priority))}>
            {todo.priority || 'MEDIUM'}
          </div>
        </div>

        {/* Hover Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-white/10"
            title="Edit task"
          >
            <Edit2 className="h-4 w-4" strokeWidth={2} />
          </button>
          <button
            onClick={() => {
              if (window.confirm('Delete this task?')) onDelete(todo.id)
            }}
            className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
            title="Delete task"
          >
            <Trash2 className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col mb-6 relative z-10">
        <div className="flex gap-4 items-start">
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-all duration-300",
            todo.completed ? "bg-primary text-white shadow-glow" : "bg-gradient-to-br from-primary/10 to-accent/10 text-primary border border-glass-border"
          )}>
            {todo.completed ? <CheckCircle2 className="h-6 w-6" strokeWidth={2.5} /> : <Clock className="h-6 w-6" strokeWidth={2} />}
          </div>
          <div className="flex-1 min-w-0 pt-1">
            <h3 className={cn(
              "text-lg font-bold leading-tight truncate transition-colors",
              todo.completed ? "line-through text-muted-foreground" : "text-foreground group-hover:text-primary"
            )}>
              {todo.title}
            </h3>
            {todo.description && (
              <p className={cn(
                "text-sm mt-2 line-clamp-2",
                todo.completed ? "text-muted-foreground/70" : "text-muted-foreground"
              )}>
                {todo.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer Progress */}
      <div className="mt-auto relative z-10">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Progress</span>
            <div className="flex items-center gap-2">
              <span className={todo.completed ? "text-primary" : ""}>{todo.completed ? 'Done' : 'Active'}</span>
              <button 
                onClick={() => onToggle(todo.id)}
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-110 active:scale-95",
                  todo.completed ? "bg-primary border-primary text-white shadow-glow" : "border-muted-foreground hover:border-primary hover:bg-primary/10"
                )}
              >
                {todo.completed && <Check className="h-3 w-3" strokeWidth={3} />}
              </button>
            </div>
          </div>
          <div className="w-full bg-foreground/5 rounded-full h-2.5 overflow-hidden flex gap-1 border border-glass-border shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000 ease-out" 
              style={{ width: `${progressPercent}%` }} 
            />
            {!todo.completed && (
              <div className="h-full bg-foreground/10 rounded-full w-[15%]" />
            )}
          </div>
        </div>
      </div>

    </div>
  )
}