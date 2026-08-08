import { useState, useEffect } from 'react'
import { Plus, AlertCircle, Tag, Calendar as CalendarIcon, Sparkles, Bell, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../utils/cn'
import ToggleSwitch from './ui/ToggleSwitch'
import { calculateTriggerTime, formatTriggerPreview, convert12HourTo24Hour, convert24HourTo12Hour } from '../utils/dateUtils'

export default function TodoForm({ onAddTodo, isSubmitting }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('MEDIUM')
  const [dueDate, setDueDate] = useState('')
  const [dueTime, setDueTime] = useState('')
  const [reminderEnabled, setReminderEnabled] = useState(false)
  const [reminderTime, setReminderTime] = useState('15m')
  const [reminderType, setReminderType] = useState('BOTH')
  const [error, setError] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const setPreset = (type) => {
    const now = new Date()
    let targetDate = new Date(now)
    let targetTime = '17:00' // Default to 5 PM
    
    switch(type) {
      case 'today':
        break
      case 'tomorrow':
        targetDate.setDate(now.getDate() + 1)
        targetTime = '10:00'
        break
      case 'weekend':
        // Next Saturday
        targetDate.setDate(now.getDate() + ((6 - now.getDay() + 7) % 7 || 7))
        targetTime = '10:00'
        break
      case 'next_week':
        // Next Monday
        targetDate.setDate(now.getDate() + ((1 - now.getDay() + 7) % 7 || 7))
        targetTime = '09:00'
        break
      default:
        break
    }
    
    setDueDate(targetDate.toISOString().split('T')[0])
    setDueTime(targetTime)
    setError('')
  }

  // Clear time if date is cleared
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!dueDate) setDueTime('')
  }, [dueDate])

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

    let finalDueDate = null
    if (dueDate) {
      if (!dueTime) {
        setError('Please set a specific time for the deadline')
        return
      }
      
      const [y, m, d] = dueDate.split('-').map(Number)
      const [h, min] = dueTime.split(':').map(Number)
      const localDateTime = new Date(y, m - 1, d, h, min)
      if (localDateTime < new Date()) {
        const todayStr = new Date().toLocaleDateString('en-CA')
        if (dueDate < todayStr) {
          setError("You can't schedule a task for a past date.")
        } else {
          setError("Please select a future time for today's task.")
        }
        return
      }
      finalDueDate = localDateTime.toISOString()
    }

    try {
      await onAddTodo({
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate: finalDueDate,
        reminderEnabled: !!finalDueDate && reminderEnabled,
        reminderTime,
        reminderType,
      })
      setTitle('')
      setDescription('')
      setPriority('MEDIUM')
      setDueDate('')
      setDueTime('')
      setReminderEnabled(false)
      setReminderTime('15m')
      setReminderType('BOTH')
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
        
        <div className="flex flex-col gap-3 flex-1 sm:items-end">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <div className="relative group flex-1 sm:flex-none">
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
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {/* Quick Presets */}
            <div className="flex w-full sm:w-auto items-center gap-1 bg-foreground/5 p-1 rounded-lg border border-glass-border">
              <button type="button" onClick={() => setPreset('today')} className="flex-1 sm:flex-none px-2 py-1 text-[11px] font-medium rounded-md hover:bg-background hover:shadow-sm transition-all text-muted-foreground hover:text-foreground">Today</button>
              <button type="button" onClick={() => setPreset('tomorrow')} className="flex-1 sm:flex-none px-2 py-1 text-[11px] font-medium rounded-md hover:bg-background hover:shadow-sm transition-all text-muted-foreground hover:text-foreground">Tomorrow</button>
              <button type="button" onClick={() => setPreset('weekend')} className="flex-1 sm:flex-none px-2 py-1 text-[11px] font-medium rounded-md hover:bg-background hover:shadow-sm transition-all text-muted-foreground hover:text-foreground">Weekend</button>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative group flex-1 sm:flex-none">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <input
                  type="date"
                  min={new Date().toLocaleDateString('en-CA')}
                  value={dueDate}
                  onChange={(e) => {
                    setDueDate(e.target.value)
                    if (!dueTime && e.target.value) setDueTime('17:00')
                  }}
                  className="block w-full pl-9 pr-4 py-2 text-sm glass-input cursor-pointer min-w-[150px]"
                  aria-label="Task due date"
                />
              </div>

              {dueDate && (
                <div className="relative group flex-1 sm:flex-none flex items-center gap-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <Clock className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="flex items-center glass-input rounded-md pl-9 pr-2 h-[38px]">
                    <select
                      value={convert24HourTo12Hour(dueTime || '17:00').hour}
                      onChange={(e) => {
                        const current = convert24HourTo12Hour(dueTime || '17:00');
                        setDueTime(convert12HourTo24Hour(e.target.value, current.minute, current.period));
                      }}
                      className="bg-transparent text-sm cursor-pointer appearance-none outline-none focus:text-primary"
                    >
                      {Array.from({length: 12}, (_, i) => i + 1).map(h => (
                        <option key={h} value={h.toString()}>{h.toString()}</option>
                      ))}
                    </select>
                    <span className="text-muted-foreground mx-0.5">:</span>
                    <select
                      value={convert24HourTo12Hour(dueTime || '17:00').minute}
                      onChange={(e) => {
                        const current = convert24HourTo12Hour(dueTime || '17:00');
                        setDueTime(convert12HourTo24Hour(current.hour, e.target.value, current.period));
                      }}
                      className="bg-transparent text-sm cursor-pointer appearance-none outline-none focus:text-primary"
                    >
                      {Array.from({length: 60}, (_, i) => i.toString().padStart(2, '0')).map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    <select
                      value={convert24HourTo12Hour(dueTime || '17:00').period}
                      onChange={(e) => {
                        const current = convert24HourTo12Hour(dueTime || '17:00');
                        setDueTime(convert12HourTo24Hour(current.hour, current.minute, e.target.value));
                      }}
                      className="bg-transparent text-sm font-medium cursor-pointer appearance-none outline-none focus:text-primary ml-1"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
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

      <AnimatePresence>
        {dueDate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 overflow-hidden rounded-xl border border-glass-border bg-foreground/5"
          >
            <div className="p-4 border-b border-glass-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-1.5 rounded-lg text-primary">
                  <Bell className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Smart Reminder</h4>
                  <p className="text-xs text-muted-foreground">Notify me before this is due</p>
                </div>
              </div>
              <ToggleSwitch checked={reminderEnabled} onChange={setReminderEnabled} />
            </div>

            <AnimatePresence>
              {reminderEnabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Remind me</label>
                      <select
                        value={reminderTime}
                        onChange={(e) => setReminderTime(e.target.value)}
                        className="w-full glass-input text-sm py-2 px-3 border-glass-border"
                      >
                        <option value="5m">5 minutes before</option>
                        <option value="15m">15 minutes before</option>
                        <option value="30m">30 minutes before</option>
                        <option value="1h">1 hour before</option>
                        <option value="2h">2 hours before</option>
                        <option value="1d">1 day before</option>
                      </select>
                    </div>

                    <div className="flex-1 space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Delivery Method</label>
                      <select
                        value={reminderType}
                        onChange={(e) => setReminderType(e.target.value)}
                        className="w-full glass-input text-sm py-2 px-3 border-glass-border"
                      >
                        <option value="BOTH">Email & Browser</option>
                        <option value="EMAIL">Email Only</option>
                        <option value="BROWSER">Browser Only</option>
                      </select>
                    </div>
                  </div>

                  {/* Live Preview */}
                  <div className="bg-background/50 rounded-lg p-3 text-xs flex items-center gap-2 text-muted-foreground border border-glass-border/50">
                    <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>
                      {dueDate && dueTime ? (
                        <>
                          You will be notified via {reminderType === 'EMAIL' ? 'email' : reminderType === 'BROWSER' ? 'browser' : 'email & browser'} <br className="sm:hidden" />
                          <strong className="text-primary">{formatTriggerPreview(calculateTriggerTime(`${dueDate}T${dueTime}`, reminderTime))}</strong>.
                        </>
                      ) : (
                        "Select a deadline to see reminder preview."
                      )}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

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