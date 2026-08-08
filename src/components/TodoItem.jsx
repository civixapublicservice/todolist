import { useState } from 'react'
import { Trash2, Edit2, Check, Calendar as CalendarIcon, CheckCircle2, Clock, Bell } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '../utils/cn'
import ToggleSwitch from './ui/ToggleSwitch'
import { formatFriendlyDate, getLocalHHMM, getLocalYYYYMMDD, convert12HourTo24Hour, convert24HourTo12Hour } from '../utils/dateUtils'

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
    todo.dueDate ? getLocalYYYYMMDD(todo.dueDate) : ''
  )
  const [editDueTime, setEditDueTime] = useState(
    todo.dueDate ? getLocalHHMM(todo.dueDate) : ''
  )
  const [editReminderEnabled, setEditReminderEnabled] = useState(todo.reminderEnabled || false)
  const [editReminderTime, setEditReminderTime] = useState(todo.reminderTime || '15m')
  const [editReminderType, setEditReminderType] = useState(todo.reminderType || 'BOTH')
  const [isUpdating, setIsUpdating] = useState(false)

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) {
      alert('Todo title cannot be empty')
      return
    }

    let finalDueDate = null
    if (editDueDate) {
      if (!editDueTime) {
        alert('Please set a specific time for the deadline')
        return
      }

      const [y, m, d] = editDueDate.split('-').map(Number)
      const [h, min] = editDueTime.split(':').map(Number)
      const localDateTime = new Date(y, m - 1, d, h, min)
      if (localDateTime < new Date()) {
        const todayStr = new Date().toLocaleDateString('en-CA')
        if (editDueDate < todayStr) {
          alert("You can't schedule a task for a past date.")
        } else {
          alert("Please select a future time for today's task.")
        }
        return
      }
      finalDueDate = localDateTime.toISOString()
    }

    setIsUpdating(true)
    try {
      await onUpdate(todo.id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        priority: editPriority,
        dueDate: finalDueDate,
        reminderEnabled: finalDueDate ? editReminderEnabled : false,
        reminderTime: editReminderTime,
        reminderType: editReminderType,
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
    setEditDueDate(todo.dueDate ? getLocalYYYYMMDD(todo.dueDate) : '')
    setEditDueTime(todo.dueDate ? getLocalHHMM(todo.dueDate) : '')
    setEditReminderEnabled(todo.reminderEnabled || false)
    setEditReminderTime(todo.reminderTime || '15m')
    setEditReminderType(todo.reminderType || 'BOTH')
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
      <motion.div 
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass-card shadow-glow border border-primary/50 p-6 flex flex-col justify-between min-h-[260px] relative overflow-hidden bg-background/80"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
        <div className="flex flex-col gap-4 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-glass-border pb-3">
            <span className="text-sm font-semibold text-foreground bg-primary/10 px-2 py-1 rounded-md text-primary">Edit Task</span>
            <div className="flex items-center space-x-2">
              <select
                aria-label="Edit Priority"
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value)}
                className="block pl-3 pr-8 py-1.5 text-xs glass-input appearance-none min-w-[100px]"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
              <div className="flex flex-col sm:flex-row gap-1">
                <input
                  type="date"
                  aria-label="Edit Due Date"
                  min={new Date().toLocaleDateString('en-CA')}
                  value={editDueDate}
                  onChange={(e) => {
                    setEditDueDate(e.target.value)
                    if (!e.target.value) setEditDueTime('')
                    else if (!editDueTime && e.target.value) setEditDueTime('17:00')
                  }}
                  className="block px-2 py-1.5 text-xs glass-input"
                />
                {editDueDate && (
                  <div className="flex items-center glass-input rounded-md px-1.5 h-[28px] sm:h-[30px]">
                    <select
                      aria-label="Edit Due Time Hour"
                      value={convert24HourTo12Hour(editDueTime || '17:00').hour}
                      onChange={(e) => {
                        const current = convert24HourTo12Hour(editDueTime || '17:00');
                        setEditDueTime(convert12HourTo24Hour(e.target.value, current.minute, current.period));
                      }}
                      className="bg-transparent text-xs cursor-pointer appearance-none outline-none focus:text-primary"
                    >
                      {Array.from({length: 12}, (_, i) => i + 1).map(h => (
                        <option key={h} value={h.toString()}>{h.toString()}</option>
                      ))}
                    </select>
                    <span className="text-muted-foreground mx-0.5 text-xs">:</span>
                    <select
                      aria-label="Edit Due Time Minute"
                      value={convert24HourTo12Hour(editDueTime || '17:00').minute}
                      onChange={(e) => {
                        const current = convert24HourTo12Hour(editDueTime || '17:00');
                        setEditDueTime(convert12HourTo24Hour(current.hour, e.target.value, current.period));
                      }}
                      className="bg-transparent text-xs cursor-pointer appearance-none outline-none focus:text-primary"
                    >
                      {Array.from({length: 60}, (_, i) => i.toString().padStart(2, '0')).map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    <select
                      aria-label="Edit Due Time Period"
                      value={convert24HourTo12Hour(editDueTime || '17:00').period}
                      onChange={(e) => {
                        const current = convert24HourTo12Hour(editDueTime || '17:00');
                        setEditDueTime(convert12HourTo24Hour(current.hour, current.minute, e.target.value));
                      }}
                      className="bg-transparent text-xs font-medium cursor-pointer appearance-none outline-none focus:text-primary ml-1"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              aria-label="Edit Task Title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="block w-full px-3 py-2 text-sm glass-input font-bold"
              autoFocus
              maxLength={100}
              disabled={isUpdating}
            />
            <textarea
              aria-label="Edit Task Description"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="block w-full px-3 py-2 text-sm glass-input resize-none h-[60px] font-semibold"
              maxLength={500}
              disabled={isUpdating}
            />
          </div>

          {editDueDate && (
            <div className="bg-foreground/5 rounded-xl p-3 border border-glass-border space-y-3 mt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold">Reminder</span>
                </div>
                <ToggleSwitch checked={editReminderEnabled} onChange={setEditReminderEnabled} />
              </div>
              
              {editReminderEnabled && (
                <div className="flex gap-2 pt-2 border-t border-glass-border">
                  <select
                    value={editReminderTime}
                    onChange={(e) => setEditReminderTime(e.target.value)}
                    className="flex-1 glass-input text-xs py-1.5 px-2"
                  >
                    <option value="5m">5 mins before</option>
                    <option value="15m">15 mins before</option>
                    <option value="30m">30 mins before</option>
                    <option value="1h">1 hour before</option>
                    <option value="2h">2 hours before</option>
                    <option value="1d">1 day before</option>
                  </select>
                  <select
                    value={editReminderType}
                    onChange={(e) => setEditReminderType(e.target.value)}
                    className="flex-1 glass-input text-xs py-1.5 px-2"
                  >
                    <option value="BOTH">Email & Browser</option>
                    <option value="EMAIL">Email</option>
                    <option value="BROWSER">Browser</option>
                  </select>
                </div>
              )}
            </div>
          )}
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
      </motion.div>
    )
  }

  const progressPercent = todo.completed ? 100 : (todo.id.length % 5) * 20 + 20

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className={cn(
        "glass-card group relative flex flex-col justify-between min-h-[260px] cursor-default transition-all duration-300",
        todo.completed ? "opacity-75 bg-muted/20" : ""
      )}
    >
      
      {todo.completed && (
        <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px] rounded-[var(--radius-lg)] z-0 pointer-events-none" />
      )}

      {/* Top Header - Meta info */}
      <div className="flex items-start sm:items-center justify-between mb-4 relative z-10 gap-2">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center space-x-1.5 text-xs text-foreground/70 font-semibold bg-foreground/5 px-2 py-1 rounded-md border border-glass-border">
            <CalendarIcon className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
            <span>{todo.dueDate ? formatFriendlyDate(todo.dueDate) : 'No Date'}</span>
          </div>
          <div className={cn("px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase border", getPriorityClasses(todo.priority))}>
            {todo.priority || 'MEDIUM'}
          </div>
          {todo.reminderEnabled && !todo.completed && (
            <div className="flex items-center justify-center p-1 rounded-full bg-accent/10 border border-accent/20 text-accent tooltip-trigger relative group" title={todo.reminderSent ? "Reminder Sent" : "Reminder Active"}>
              <Bell className="h-3.5 w-3.5" strokeWidth={todo.reminderSent ? 1 : 2.5} />
            </div>
          )}
        </div>

        {/* Actions (Always visible on mobile, hover on desktop) */}
        <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            aria-label="Edit task"
            className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-white/10"
            title="Edit task"
          >
            <Edit2 className="h-4 w-4" strokeWidth={2} />
          </button>
          <button
            onClick={() => {
              if (window.confirm('Delete this task?')) onDelete(todo.id)
            }}
            aria-label="Delete task"
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
                aria-label={todo.completed ? "Mark as active" : "Mark as completed"}
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

    </motion.div>
  )
}