import { useState, useEffect, useCallback } from 'react'
import MainLayout from '../layouts/MainLayout'
import { getTodos } from '../services/todoService'
import { ChevronLeft, ChevronRight, Clock, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../utils/cn'

export default function CalendarPage() {
  const [todos, setTodos] = useState([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchCalendarTodos = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const data = await getTodos()
      setTodos(data)
    } catch (err) {
      setError(err.message || 'Failed to fetch calendar tasks')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCalendarTodos()
  }, [fetchCalendarTodos])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const isSameDay = (d1, d2) => {
    if (!d1 || !d2) return false
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    )
  }

  const getTodosForDate = (date) => {
    return todos.filter((todo) => {
      const todoDate = todo.dueDate ? new Date(todo.dueDate) : new Date(todo.createdAt)
      return isSameDay(todoDate, date)
    })
  }

  const selectedDateTodos = getTodosForDate(selectedDate)

  const calendarGrid = []
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarGrid.push(null)
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarGrid.push(new Date(year, month, day))
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: -20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="bg-gradient-to-r from-primary to-accent text-white rounded-[var(--radius-lg)] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden mb-8 shadow-glow"
        >
          <div className="relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold tracking-wide uppercase mb-3 border border-white/20">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Schedule Planning</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2 text-white">Task Calendar</h1>
            <p className="text-white/80 text-sm max-w-md font-medium">
              View deadlines and manage your scheduled workload month by month.
            </p>
          </div>
          <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none mix-blend-overlay"></div>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="flex items-center space-x-2 bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl glass">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col lg:flex-row gap-6 items-start"
        >
          {/* Calendar View Card */}
          <div className="glass-panel border border-glass-border rounded-xl p-4 sm:p-6 shadow-sm flex-1 w-full">
            {/* Header controls */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                {monthNames[month]} {year}
              </h2>
              <div className="flex gap-2">
                <button
                  className="p-2.5 glass-button rounded-xl transition-all shadow-sm hover:shadow-md"
                  onClick={prevMonth}
                  title="Previous Month"
                >
                  <ChevronLeft className="h-5 w-5 text-foreground" />
                </button>
                <button
                  className="p-2.5 glass-button rounded-xl transition-all shadow-sm hover:shadow-md"
                  onClick={nextMonth}
                  title="Next Month"
                >
                  <ChevronRight className="h-5 w-5 text-foreground" />
                </button>
              </div>
            </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 text-center font-bold text-xs sm:text-sm text-muted-foreground uppercase tracking-wider mb-4">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-2 sm:gap-3">
              {calendarGrid.map((date, idx) => {
                if (!date) {
                  return <div key={`empty-${idx}`} className="min-h-[70px] sm:min-h-[100px]"></div>
                }

                const dayTodos = getTodosForDate(date)
                const hasTodos = dayTodos.length > 0
                const isSelected = isSameDay(date, selectedDate)
                const isToday = isSameDay(date, new Date())

                return (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    key={date.toISOString()}
                    onClick={() => setSelectedDate(date)}
                    className={cn(
                      "min-h-[70px] sm:min-h-[100px] p-2 sm:p-3 rounded-2xl border flex flex-col justify-between cursor-pointer transition-all duration-300 relative overflow-hidden",
                      isSelected
                        ? "border-primary bg-primary/10 shadow-glow ring-2 ring-primary/50"
                        : isToday
                        ? "border-primary/50 bg-primary/5"
                        : "border-glass-border glass hover:bg-white/5"
                    )}
                  >
                    <div
                      className={cn(
                        "text-xs sm:text-sm z-10 relative",
                        isToday ? "font-bold text-primary" : "font-semibold text-foreground",
                        isSelected ? "text-primary" : ""
                      )}
                    >
                      {date.getDate()}
                    </div>
                    {hasTodos && (
                      <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-primary font-bold mt-2 bg-primary/10 px-2 py-1 rounded-md w-fit z-10 relative border border-primary/20">
                        <Clock className="h-3 w-3 shrink-0" strokeWidth={2.5} />
                        <span className="hidden sm:inline">
                          {dayTodos.length} task{dayTodos.length > 1 ? 's' : ''}
                        </span>
                        <span className="sm:hidden">{dayTodos.length}</span>
                      </div>
                    )}
                    {isSelected && (
                      <motion.div 
                        layoutId="selected-date"
                        className="absolute inset-0 bg-primary/5 z-0"
                      />
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Day Task Details Side Card */}
          <div className="glass-panel border border-glass-border rounded-xl p-6 shadow-sm w-full lg:w-80 shrink-0 sticky top-6">
            <h3 className="text-xl font-bold text-foreground mb-1">
              Tasks for {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </h3>
            <p className="text-sm font-medium text-muted-foreground mb-6">
              {selectedDateTodos.length} scheduled item{selectedDateTodos.length !== 1 ? 's' : ''}
            </p>

            {isLoading ? (
              <div className="py-12 text-center flex flex-col items-center">
                <div className="animate-spin rounded-full border-4 border-primary border-t-transparent h-8 w-8 mb-4"></div>
                <span className="text-sm font-medium tracking-wide text-muted-foreground">Loading tasks...</span>
              </div>
            ) : selectedDateTodos.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground flex flex-col items-center glass rounded-2xl border border-glass-border border-dashed">
                <CheckCircle2 className="h-10 w-10 text-muted-foreground/50 mb-4" />
                <p className="text-sm font-medium">No tasks scheduled for this date.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <AnimatePresence>
                  {selectedDateTodos.map((todo) => (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={todo.id}
                      className={cn(
                        "p-4 rounded-xl border relative overflow-hidden transition-all duration-300 hover:shadow-glow",
                        todo.completed ? "glass border-glass-border opacity-70 bg-muted/20" : "bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 shadow-sm"
                      )}
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-accent" />
                      <div
                        className={cn(
                          "font-bold text-sm text-foreground",
                          todo.completed ? "line-through text-muted-foreground" : ""
                        )}
                      >
                        {todo.title}
                      </div>
                      {todo.description && (
                        <div className="text-xs font-medium text-muted-foreground/80 mt-2 line-clamp-2">
                          {todo.description}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </MainLayout>
  )
}
