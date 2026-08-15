import { useState, useMemo, useCallback } from 'react'
import { useTasks } from '../context/TaskContext'
import { ChevronLeft, ChevronRight, Clock, AlertCircle, Sparkles, CheckCircle2, Check } from 'lucide-react'

import { cn } from '../utils/cn'

export default function CalendarPage() {
  const { todos, isLoading, error, toggleTaskCompletion } = useTasks()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const { firstDayOfMonth, daysInMonth } = useMemo(() => {
    return {
      firstDayOfMonth: new Date(year, month, 1).getDay(),
      daysInMonth: new Date(year, month + 1, 0).getDate()
    }
  }, [year, month])

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const prevMonth = useCallback(() => {
    setCurrentDate(new Date(year, month - 1, 1))
  }, [year, month])

  const nextMonth = useCallback(() => {
    setCurrentDate(new Date(year, month + 1, 1))
  }, [year, month])

  const isSameDay = useCallback((d1, d2) => {
    if (!d1 || !d2) return false
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    )
  }, [])

  const todosByDateString = useMemo(() => {
    const map = new Map()
    todos.forEach((todo) => {
      const todoDate = todo.dueDate ? new Date(todo.dueDate) : new Date(todo.createdAt)
      if (isNaN(todoDate)) return
      const dateString = `${todoDate.getFullYear()}-${todoDate.getMonth()}-${todoDate.getDate()}`
      if (!map.has(dateString)) {
        map.set(dateString, [])
      }
      map.get(dateString).push(todo)
    })
    return map
  }, [todos])

  const getTodosForDate = useCallback((date) => {
    if (!date) return []
    const dateString = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
    return todosByDateString.get(dateString) || []
  }, [todosByDateString])

  const selectedDateTodos = useMemo(() => getTodosForDate(selectedDate), [getTodosForDate, selectedDate])

  const calendarGrid = useMemo(() => {
    const grid = []
    for (let i = 0; i < firstDayOfMonth; i++) {
      grid.push(null)
    }
    for (let day = 1; day <= daysInMonth; day++) {
      grid.push(new Date(year, month, day))
    }
    return grid
  }, [year, month, firstDayOfMonth, daysInMonth])

  return (
    <>
      <div className="max-w-6xl mx-auto w-full">
        <div 
          className="bg-gradient-to-r from-primary to-accent text-white rounded-[var(--radius-lg)] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden mb-8 shadow-glow animate-in fade-in slide-in-from-bottom-2 duration-500"
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
          <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none opacity-50"></div>
        </div>

        
          {error && (
            <div className="overflow-hidden mb-6 animate-in fade-in duration-300">
              <div className="flex items-center space-x-2 bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl glass">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            </div>
          )}
        

        <div 
          className="flex flex-col lg:flex-row gap-6 items-start animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100 fill-mode-both"
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
                  return <div key={`empty-${idx}`} className="aspect-square"></div>
                }

                const dayTodos = getTodosForDate(date)
                const hasTodos = dayTodos.length > 0
                const isSelected = isSameDay(date, selectedDate)
                const isToday = isSameDay(date, new Date())

                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => setSelectedDate(date)}
                    className={cn(
                      "aspect-square p-1 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative overflow-hidden",
                      "hover:scale-105 active:scale-95",
                      isSelected
                        ? "border-primary bg-primary/10 shadow-glow ring-2 ring-primary/50"
                        : isToday
                        ? "border-primary/50 bg-primary/5"
                        : "border-glass-border glass hover:bg-white/5"
                    )}
                  >
                    <div
                      className={cn(
                        "text-xs sm:text-sm z-10 relative font-medium",
                        isToday ? "font-bold text-primary" : "text-foreground",
                        isSelected ? "text-primary" : ""
                      )}
                    >
                      {date.getDate()}
                    </div>
                    {hasTodos && (
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary mt-0.5 sm:mt-1 z-10 shadow-sm" />
                    )}
                    {isSelected && (
                      <div className="absolute inset-0 bg-primary/5 z-0" />
                    )}
                  </button>
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
              <div className="flex flex-col gap-6">
                
                  {(() => {
                    const pendingTodos = selectedDateTodos.filter(t => !t.completed);
                    const completedTodos = selectedDateTodos.filter(t => t.completed);
                    
                    return (
                      <>
                        {pendingTodos.length > 0 && (
                          <div>
                            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center space-x-2">
                              <span className="w-2 h-2 rounded-full bg-primary"></span>
                              <span>Pending Tasks</span>
                            </h4>
                            <div className="flex flex-col gap-3">
                              {pendingTodos.map((todo) => (
                                <div key={todo.id}
                                  className="p-3.5 sm:p-4 rounded-[1.25rem] border relative overflow-hidden transition-all duration-300 hover:shadow-glow bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 shadow-sm group flex items-start gap-3"
                                >
                                  <div className="mt-0.5 shrink-0 w-4 h-4 rounded-full border-2 border-primary/40" />
                                  <div>
                                    <div className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                                      {todo.title}
                                    </div>
                                    {todo.description && (
                                      <div className="text-xs font-medium text-muted-foreground/80 mt-1 line-clamp-2">
                                        {todo.description}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {completedTodos.length > 0 && (
                          <div className={pendingTodos.length > 0 ? "pt-4 border-t border-black/5 dark:border-white/5" : ""}>
                            <h4 className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest mb-3 flex items-center space-x-2">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Completed</span>
                            </h4>
                            <div className="flex flex-col gap-3">
                              {completedTodos.map((todo) => (
                                <div key={todo.id}
                                  className="p-3.5 sm:p-4 rounded-[1.25rem] border relative overflow-hidden transition-all duration-300 bg-foreground/5 dark:bg-white/5 border-transparent flex items-start gap-3"
                                >
                                  <div className="mt-0.5 shrink-0 text-muted-foreground/40">
                                    <CheckCircle2 className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <div className="font-semibold text-sm text-muted-foreground line-through">
                                      {todo.title}
                                    </div>
                                    {todo.description && (
                                      <div className="text-xs font-medium text-muted-foreground/50 mt-1 line-clamp-1 line-through">
                                        {todo.description}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )
                  })()}                
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
