import { useState, useEffect } from 'react'
import { Plus, AlertCircle, Tag, Calendar as CalendarIcon, Sparkles, Bell, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../utils/cn'
import ToggleSwitch from './ui/ToggleSwitch'
import CustomDatePicker from './ui/CustomDatePicker'
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
  const [isPriorityOpen, setIsPriorityOpen] = useState(false)

  const getIsHourDisabled = (hString, currentPeriod) => {
    if (dueDate !== new Date().toLocaleDateString('en-CA')) return false;
    const now = new Date();
    const hNum = parseInt(hString);
    let h24 = hNum;
    if (currentPeriod === 'AM') {
      if (hNum === 12) h24 = 0;
    } else {
      if (hNum !== 12) h24 += 12;
    }
    return h24 < now.getHours();
  }

  const getIsMinuteDisabled = (mString, currentHourString, currentPeriod) => {
    if (dueDate !== new Date().toLocaleDateString('en-CA')) return false;
    const now = new Date();
    const hNum = parseInt(currentHourString);
    let h24 = hNum;
    if (currentPeriod === 'AM') {
      if (hNum === 12) h24 = 0;
    } else {
      if (hNum !== 12) h24 += 12;
    }
    
    if (h24 < now.getHours()) return true;
    if (h24 === now.getHours() && parseInt(mString) < now.getMinutes()) return true;
    return false;
  }

  const getIsPeriodDisabled = (pString) => {
    if (dueDate !== new Date().toLocaleDateString('en-CA')) return false;
    const now = new Date();
    if (pString === 'AM' && now.getHours() >= 12) return true;
    return false;
  }

  const setPreset = (type) => {
    const now = new Date()
    let targetDate = new Date(now)
    let targetTime = '17:00' // Default to 5 PM
    
    switch(type) {
      case 'today':
        targetTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
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
    
    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const day = String(targetDate.getDate()).padStart(2, '0');
    setDueDate(`${year}-${month}-${day}`)
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
      // Allow a 5-minute grace period for submission to prevent annoying errors if user takes time to type
      if (localDateTime < new Date(new Date().getTime() - 5 * 60000)) {
        const todayStr = new Date().toLocaleDateString('en-CA')
        if (dueDate < todayStr) {
          setError("You can't schedule a task for a past date.")
        } else {
          setError("Please select a future time for today's task.")
        }
        return
      }

      if (reminderEnabled) {
        const triggerDate = calculateTriggerTime(`${dueDate}T${dueTime}`, reminderTime)
        // Allow a 1-minute grace period for reminder time to account for typing time
        if (triggerDate && triggerDate < new Date(Date.now() - 60000)) {
          setError(`The reminder time has already passed. Please choose a later time or a shorter reminder interval.`)
          return
        }
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
        "bg-card rounded-xl border border-glass-border transition-all duration-300 relative shadow-sm",
        isFocused ? "shadow-md border-border" : ""
      )}
    >
      <div className="p-4 sm:p-5 pb-3">
        {error && (
          <div className="flex items-center space-x-2 bg-destructive/10 border border-destructive/20 text-destructive text-sm px-4 py-3 rounded-lg mb-4">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-3">
          <div className="relative group">
            <input
              type="text"
              placeholder="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
              className="block w-full bg-transparent text-lg sm:text-xl font-bold text-foreground placeholder:text-muted-foreground/40 !border-none !outline-none !ring-0 px-0 py-1 transition-all disabled:opacity-50"
              maxLength={100}
              disabled={isSubmitting}
              autoFocus
            />
          </div>

          <div className="relative group">
            <textarea
              placeholder="Add detailed task description or requirements (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
              className="block w-full bg-transparent text-[14px] leading-relaxed text-foreground/80 placeholder:text-muted-foreground/50 !border-none !outline-none !ring-0 px-0 py-1 resize-y min-h-[44px] overflow-hidden disabled:opacity-50"
              rows={1}
              maxLength={500}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-5 py-3 bg-foreground/[0.015] border-t border-glass-border flex flex-col gap-3 rounded-b-xl">
        <div className="flex flex-wrap items-center gap-2">
          {/* Priority Picker */}
          <div className="relative group z-30" onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setIsPriorityOpen(false); }}>
            <button
              type="button"
              onClick={() => setIsPriorityOpen(!isPriorityOpen)}
              className="flex items-center bg-foreground/5 hover:bg-foreground/10 rounded-md px-2.5 py-1.5 transition-colors text-[13px] font-medium"
            >
              <Tag className={cn(
                "h-3.5 w-3.5 mr-1.5 shrink-0 transition-colors",
                priority === 'HIGH' ? "text-rose-500" : priority === 'MEDIUM' ? "text-amber-500" : "text-emerald-500"
              )} />
              {priority === 'HIGH' ? 'High' : priority === 'MEDIUM' ? 'Medium' : 'Low'}
              <span className="text-[10px] ml-1.5 text-muted-foreground/50 transition-transform duration-200" style={{ transform: isPriorityOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
            </button>
            <AnimatePresence>
              {isPriorityOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-1.5 w-32 bg-card border border-border shadow-lg rounded-md p-1 z-[60] overflow-hidden"
                >
                  {[
                    { value: 'LOW', label: 'Low', color: 'text-emerald-500' },
                    { value: 'MEDIUM', label: 'Medium', color: 'text-amber-500' },
                    { value: 'HIGH', label: 'High', color: 'text-rose-500' }
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => { setPriority(opt.value); setIsPriorityOpen(false); }}
                      className={cn(
                        "flex items-center w-full text-left px-2 py-1.5 rounded text-[13px] hover:bg-muted transition-colors",
                        priority === opt.value ? 'bg-primary/10 text-primary font-medium' : 'text-foreground/80'
                      )}
                    >
                      <Tag className={`h-3.5 w-3.5 mr-2 shrink-0 ${opt.color}`} />
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Dates */}
          <div className="flex items-center gap-0.5 bg-foreground/5 p-0.5 rounded-md">
            {(() => {
              const today = new Date();
              const tomorrow = new Date(today);
              tomorrow.setDate(tomorrow.getDate() + 1);
              const isToday = dueDate === today.toLocaleDateString('en-CA');
              const isTomorrow = dueDate === tomorrow.toLocaleDateString('en-CA');
              return (
                <>
                  <button type="button" onClick={() => setPreset('today')} className={cn("px-2.5 py-1 text-[12px] font-medium rounded transition-all", isToday ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-background/50")}>Today</button>
                  <button type="button" onClick={() => setPreset('tomorrow')} className={cn("px-2.5 py-1 text-[12px] font-medium rounded transition-all", isTomorrow ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-background/50")}>Tomorrow</button>
                </>
              );
            })()}
          </div>

          {/* Date Picker */}
          <div className="relative group flex items-center bg-foreground/5 hover:bg-foreground/10 rounded-md px-2 py-1.5 transition-colors cursor-pointer">
            <CustomDatePicker
              value={dueDate}
              onChange={(val) => {
                setDueDate(val);
                if (!val) setDueTime('');
                else if (!dueTime && val) {
                   const now = new Date();
                   const isToday = val === now.toLocaleDateString('en-CA');
                   
                   // Round to nearest 5 minutes
                   let m = Math.ceil(now.getMinutes() / 5) * 5;
                   let h = now.getHours();
                   if (m >= 60) {
                     m = 0;
                     h = (h + 1) % 24;
                   }
                   
                   setDueTime(isToday ? `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}` : '17:00')
                }
              }}
              minDate={new Date().toLocaleDateString('en-CA')}
              placeholder="Set Due Date"
            />
          </div>

          {/* Time Picker */}
          {dueDate && (
            <div className="relative group flex items-center bg-foreground/5 hover:bg-foreground/10 rounded-md px-2 py-1.5 transition-colors">
              <Clock className="h-3.5 w-3.5 text-primary mr-1.5 shrink-0" />
              <div className="flex items-center text-[13px] font-medium text-foreground">
                <select
                  value={convert24HourTo12Hour(dueTime || '17:00').hour}
                  onChange={(e) => {
                    const current = convert24HourTo12Hour(dueTime || '17:00');
                    setDueTime(convert12HourTo24Hour(e.target.value, current.minute, current.period));
                  }}
                  className="bg-transparent cursor-pointer appearance-none !outline-none !ring-0 !border-none p-0 focus:text-primary tabular-nums shrink-0 text-center w-[18px]"
                >
                  {Array.from({length: 12}, (_, i) => i + 1).map(h => (
                    <option key={h} value={h.toString()} disabled={getIsHourDisabled(h.toString(), convert24HourTo12Hour(dueTime || '17:00').period)}>{h.toString()}</option>
                  ))}
                </select>
                <span className="mx-0.5 text-muted-foreground">:</span>
                <select
                  value={convert24HourTo12Hour(dueTime || '17:00').minute}
                  onChange={(e) => {
                    const current = convert24HourTo12Hour(dueTime || '17:00');
                    setDueTime(convert12HourTo24Hour(current.hour, e.target.value, current.period));
                  }}
                  className="bg-transparent cursor-pointer appearance-none !outline-none !ring-0 !border-none p-0 focus:text-primary tabular-nums shrink-0 text-center w-[18px]"
                >
                  {Array.from({length: 12}, (_, i) => (i * 5).toString().padStart(2, '0')).map(m => (
                    <option key={m} value={m} disabled={getIsMinuteDisabled(m, convert24HourTo12Hour(dueTime || '17:00').hour, convert24HourTo12Hour(dueTime || '17:00').period)}>{m}</option>
                  ))}
                </select>
                <select
                  value={convert24HourTo12Hour(dueTime || '17:00').period}
                  onChange={(e) => {
                    const current = convert24HourTo12Hour(dueTime || '17:00');
                    setDueTime(convert12HourTo24Hour(current.hour, current.minute, e.target.value));
                  }}
                  className="bg-transparent font-bold cursor-pointer appearance-none !outline-none !ring-0 !border-none p-0 focus:text-primary ml-1 shrink-0"
                >
                  <option value="AM" disabled={getIsPeriodDisabled('AM')}>AM</option>
                  <option value="PM" disabled={getIsPeriodDisabled('PM')}>PM</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Smart Reminder Area */}
        <AnimatePresence>
          {dueDate && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white dark:bg-black/20 rounded-xl border border-glass-border overflow-hidden">
                <div className="p-3 px-4 border-b border-glass-border flex items-center justify-between bg-foreground/[0.02]">
                  <div className="flex items-center gap-2.5">
                    <div className="text-primary">
                      <Bell className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-semibold text-foreground">Smart Reminder</h4>
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
                          <label className="text-xs font-semibold text-foreground/80">Remind me</label>
                          <select
                            value={reminderTime}
                            onChange={(e) => setReminderTime(e.target.value)}
                            className="w-full bg-foreground/5 hover:bg-foreground/10 border border-transparent rounded-lg text-[13px] font-medium py-1.5 px-2.5 !outline-none !ring-0 transition-colors"
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
                          <label className="text-xs font-semibold text-foreground/80">Delivery Method</label>
                          <select
                            value={reminderType}
                            onChange={(e) => setReminderType(e.target.value)}
                            className="w-full bg-foreground/5 hover:bg-foreground/10 border border-transparent rounded-lg text-[13px] font-medium py-1.5 px-2.5 !outline-none !ring-0 transition-colors"
                          >
                            <option value="BOTH">Email & Browser</option>
                            <option value="EMAIL">Email Only</option>
                            <option value="BROWSER">Browser Only</option>
                          </select>
                        </div>
                      </div>

                      {/* Live Preview */}
                      {(() => {
                        const trigger = dueDate && dueTime ? calculateTriggerTime(`${dueDate}T${dueTime}`, reminderTime) : null;
                        const isPast = trigger && trigger < new Date();
                        
                        return (
                          <div className={cn(
                            "rounded-md py-2 px-3 text-[12px] flex items-center gap-2 border",
                            isPast 
                              ? "bg-destructive/10 border-destructive/20 text-destructive" 
                              : "bg-primary/5 border-primary/20 text-primary/90"
                          )}>
                            <Sparkles className="h-3.5 w-3.5 shrink-0" />
                            <span className="font-medium">
                              {trigger ? (
                                <>
                                  <span className="opacity-80">Notifying via {reminderType === 'EMAIL' ? 'email' : reminderType === 'BROWSER' ? 'browser' : 'email & browser'}.</span>{' '}
                                  <strong className={isPast ? "text-destructive font-bold" : "text-primary font-bold"}>
                                    {isPast ? "Warning: Time passed (" : "Reminding at "}
                                    {formatTriggerPreview(trigger)}
                                    {isPast ? ")" : ""}
                                  </strong>
                                </>
                              ) : (
                                "Select a deadline to see reminder preview."
                              )}
                            </span>
                          </div>
                        );
                      })()}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-1 flex justify-between items-center">
          <div className="text-[12px] font-medium text-muted-foreground/60 hidden sm:flex items-center gap-1.5">
            Press <kbd className="font-sans px-1.5 py-0.5 bg-foreground/5 border border-glass-border rounded text-[10px]">Enter</kbd> to add task
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary w-full sm:w-auto shadow-sm !rounded-lg !py-1.5 !px-4 text-[14px]"
          >
            {isSubmitting ? (
              <>
                <div className="spinner mr-2 border-white border-t-transparent h-3.5 w-3.5"></div>
                <span>Creating...</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 shrink-0 mr-1" />
                <span>Add Task</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  )
}