import { useState } from 'react'
import { Trash2, Edit2, Check, Calendar as CalendarIcon, CheckCircle2, Clock, Bell } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '../utils/cn'
import ToggleSwitch from './ui/ToggleSwitch'
import CustomSelect from './ui/CustomSelect'
import CustomDatePicker from './ui/CustomDatePicker'
import { formatFriendlyDate, getLocalHHMM, getLocalYYYYMMDD, convert12HourTo24Hour, convert24HourTo12Hour } from '../utils/dateUtils'

export default function TodoItem({
  todo,
  onToggle,
  onDelete,
  onUpdate,
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
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

  return (
    <div 
      className={cn(
        "group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl sm:rounded-[1.5rem] transition-all duration-300 border backdrop-blur-xl",
        isEditing ? "z-50 shadow-2xl scale-[1.01]" : "z-10 hover:z-20 hover:-translate-y-1",
        todo.completed
          ? "bg-foreground/5 dark:bg-white/5 border-transparent shadow-sm"
          : "bg-white/95 dark:bg-black/90 border-glass-border hover:border-primary/30 shadow-md hover:shadow-xl"
      )}
    >
      {showDeleteConfirm ? (
        <div className="flex flex-col items-center justify-center h-full gap-3 py-3 animate-in fade-in zoom-in-95 duration-300">
          <div className="h-12 w-12 bg-destructive/10 rounded-full flex items-center justify-center border border-destructive/20 shadow-sm">
            <Trash2 className="h-5 w-5 text-destructive" />
          </div>
          <div className="text-center px-2">
            <p className="text-[15px] font-black text-foreground leading-tight tracking-tight">Delete this task?</p>
            <p className="text-[13px] font-medium text-muted-foreground mt-1.5 leading-snug break-words line-clamp-1">
              "{todo.title}"
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 mt-3 w-full sm:w-auto">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-6 py-2 rounded-full text-[13px] font-bold bg-background hover:bg-muted border border-border text-foreground transition-colors shadow-sm"
            >
              Cancel
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="px-6 py-2 rounded-full text-[13px] font-bold bg-destructive text-white shadow-[0_0_15px_rgba(239,68,68,0.4)] hover:scale-105 active:scale-95 transition-all border border-destructive/50"
            >
              Delete
            </button>
          </div>
        </div>
      ) : isEditing ? (
        <div className="flex flex-col gap-3 animate-in fade-in duration-300">
          {/* Title & Description inputs */}
          <div className="flex flex-col gap-1.5 w-full">
            <input
              type="text"
              placeholder="Task Title..."
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="bg-transparent text-[15px] font-bold leading-snug text-foreground placeholder:text-muted-foreground outline-none border-b border-transparent focus:border-primary/50 transition-colors py-1 w-full"
              autoFocus
              maxLength={100}
              disabled={isUpdating}
            />
            <textarea
              placeholder="Description (optional)..."
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="bg-transparent text-[13px] leading-relaxed font-medium text-foreground/80 placeholder:text-muted-foreground/60 outline-none resize-none h-[40px] border-b border-transparent focus:border-primary/50 transition-colors w-full"
              maxLength={500}
              disabled={isUpdating}
            />
          </div>

          {/* Edit Controls (Priority, Date, Time) */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {/* Priority CustomSelect */}
            <div className="w-[160px]">
              <CustomSelect
                value={editPriority}
                onChange={setEditPriority}
                options={[
                  { value: 'LOW', label: 'Low Priority' },
                  { value: 'MEDIUM', label: 'Medium Priority' },
                  { value: 'HIGH', label: 'High Priority' }
                ]}
                ariaLabel="Edit Priority"
              />
            </div>
            
            {/* Date & Time Picker */}
            <div className="flex flex-wrap items-center bg-foreground/5 hover:bg-foreground/10 rounded-[1.25rem] px-3 py-1.5 transition-colors border border-black/5 dark:border-white/5">
              
              {/* Date Section */}
              <CustomDatePicker
                value={editDueDate}
                onChange={(val) => {
                  setEditDueDate(val)
                  if (!val) setEditDueTime('')
                  else if (!editDueTime && val) setEditDueTime('17:00')
                }}
                minDate={new Date().toLocaleDateString('en-CA')}
                placeholder="Select Date"
              />

              {/* Time Section */}
              {editDueDate && (
                <>
                  <div className="w-[1px] h-4 bg-black/10 dark:bg-white/10 mx-3 shrink-0" />
                  <div className="flex items-center text-[13px] font-medium text-foreground relative z-20">
                    <Clock className="h-4 w-4 text-primary mr-1.5 shrink-0" />
                    <select
                      value={convert24HourTo12Hour(editDueTime || '17:00').hour}
                      onChange={(e) => {
                        const current = convert24HourTo12Hour(editDueTime || '17:00');
                        setEditDueTime(convert12HourTo24Hour(e.target.value, current.minute, current.period));
                      }}
                      className="bg-transparent cursor-pointer appearance-none outline-none focus:text-primary tabular-nums shrink-0 text-center w-[18px]"
                    >
                      {Array.from({length: 12}, (_, i) => i + 1).map(h => (
                        <option key={h} value={h.toString()}>{h.toString()}</option>
                      ))}
                    </select>
                    <span className="mx-0.5 text-muted-foreground">:</span>
                    <select
                      value={convert24HourTo12Hour(editDueTime || '17:00').minute}
                      onChange={(e) => {
                        const current = convert24HourTo12Hour(editDueTime || '17:00');
                        setEditDueTime(convert12HourTo24Hour(current.hour, e.target.value, current.period));
                      }}
                      className="bg-transparent cursor-pointer appearance-none outline-none focus:text-primary tabular-nums shrink-0 text-center w-[18px]"
                    >
                      {Array.from({length: 12}, (_, i) => (i * 5).toString().padStart(2, '0')).map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    <select
                      value={convert24HourTo12Hour(editDueTime || '17:00').period}
                      onChange={(e) => {
                        const current = convert24HourTo12Hour(editDueTime || '17:00');
                        setEditDueTime(convert12HourTo24Hour(current.hour, current.minute, e.target.value));
                      }}
                      className="bg-transparent font-bold cursor-pointer appearance-none outline-none focus:text-primary ml-1 shrink-0"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Reminder Section (if date selected) */}
          {editDueDate && (
            <div className="bg-foreground/5 rounded-xl p-3 border border-glass-border space-y-3 mt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold">Smart Reminder</span>
                </div>
                <ToggleSwitch checked={editReminderEnabled} onChange={setEditReminderEnabled} />
              </div>
              
              {editReminderEnabled && (
                <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-glass-border">
                  <select
                    value={editReminderTime}
                    onChange={(e) => setEditReminderTime(e.target.value)}
                    className="flex-1 bg-background/50 border border-transparent hover:border-glass-border rounded-lg text-xs py-1.5 px-2 outline-none cursor-pointer"
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
                    className="flex-1 bg-background/50 border border-transparent hover:border-glass-border rounded-lg text-xs py-1.5 px-2 outline-none cursor-pointer"
                  >
                    <option value="BOTH">Email & Browser</option>
                    <option value="EMAIL">Email</option>
                    <option value="BROWSER">Browser</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-2 pt-3 mt-1 border-t border-glass-border/40">
            <button
              onClick={handleCancelEdit}
              disabled={isUpdating}
              className="text-xs font-semibold px-4 py-1.5 rounded-full text-muted-foreground hover:bg-foreground/5 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              disabled={isUpdating}
              className="text-xs font-bold px-5 py-1.5 rounded-full bg-primary text-white shadow-glow hover:scale-105 active:scale-95 transition-all"
            >
              {isUpdating ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full gap-3 animate-in fade-in duration-300">
          <div className="flex items-start gap-3">
            {/* Checkbox */}
            <button 
              onClick={() => onToggle(todo.id)}
              aria-label={todo.completed ? "Mark as active" : "Mark as completed"}
              className={cn(
                "mt-0.5 shrink-0 w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-110 active:scale-95",
                todo.completed ? "bg-primary border-primary text-white shadow-glow" : "border-muted-foreground/40 hover:border-primary hover:bg-primary/10"
              )}
            >
              {todo.completed && <Check className="h-3 w-3" strokeWidth={3} />}
            </button>

            {/* Title & Description */}
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                "text-[15px] font-bold leading-snug break-words transition-colors",
                todo.completed ? "line-through text-muted-foreground" : "text-foreground group-hover:text-primary"
              )}>
                {todo.title}
              </h3>
              {todo.description && (
                <p className={cn(
                  "text-[13px] mt-1.5 line-clamp-2 break-words leading-relaxed font-medium",
                  todo.completed ? "text-muted-foreground/60 line-through" : "text-muted-foreground/80"
                )}>
                  {todo.description}
                </p>
              )}
            </div>
          </div>

          {/* Footer / Meta Data */}
          <div className="mt-auto pt-3 flex items-center justify-between border-t border-glass-border/40">
            <div className="flex flex-wrap items-center gap-2">
              {todo.dueDate && (
                <div className={cn(
                  "flex items-center space-x-1.5 text-[11px] font-semibold px-2 py-1 rounded-md border",
                  todo.completed ? "bg-transparent border-glass-border text-muted-foreground" : "bg-primary/5 border-primary/20 text-primary"
                )}>
                  <CalendarIcon className="h-3 w-3" strokeWidth={2} />
                  <span>{formatFriendlyDate(todo.dueDate)}</span>
                </div>
              )}
              <div className={cn("px-2 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase border", todo.completed ? "border-glass-border text-muted-foreground bg-transparent shadow-none" : getPriorityClasses(todo.priority))}>
                {todo.priority || 'MEDIUM'}
              </div>
              {todo.reminderEnabled && !todo.completed && (
                <div className="flex items-center justify-center p-1 rounded-full bg-accent/10 border border-accent/20 text-accent tooltip-trigger relative group" title={todo.reminderSent ? "Reminder Sent" : "Reminder Active"}>
                  <Bell className="h-3 w-3" strokeWidth={todo.reminderSent ? 1 : 2.5} />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setIsEditing(true)}
                aria-label="Edit task"
                className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-foreground/5"
                title="Edit task"
              >
                <Edit2 className="h-3.5 w-3.5" strokeWidth={2} />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                aria-label="Delete task"
                className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
                title="Delete task"
              >
                <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}