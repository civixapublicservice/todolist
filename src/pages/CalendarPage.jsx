import { useState, useEffect, useCallback } from 'react'
import MainLayout from '../layouts/MainLayout'
import { getTodos } from '../services/todoService'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle2, Clock, AlertCircle } from 'lucide-react'

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
        <div className="bg-primary text-primary-foreground rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden mb-8 shadow-sm">
          <div className="relative z-10">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-primary-foreground/20 text-primary-foreground text-xs font-medium mb-3">
              <CalendarIcon className="h-3.5 w-3.5" />
              <span>Schedule Planning</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Task Calendar</h1>
            <p className="text-primary-foreground/80 text-sm max-w-md">
              View deadlines and manage your scheduled workload month by month.
            </p>
          </div>
          <div className="absolute right-0 top-0 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        </div>

        {error && (
          <div className="flex items-center space-x-2 bg-destructive/10 text-destructive px-4 py-3 rounded-lg mb-6">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Calendar View Card */}
          <div className="bg-card border border-border rounded-xl p-4 sm:p-6 shadow-sm flex-1 w-full">
            {/* Header controls */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                {monthNames[month]} {year}
              </h2>
              <div className="flex gap-2">
                <button
                  className="p-2 bg-secondary text-secondary-foreground hover:bg-muted rounded-md transition-colors border border-border"
                  onClick={prevMonth}
                  title="Previous Month"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  className="p-2 bg-secondary text-secondary-foreground hover:bg-muted rounded-md transition-colors border border-border"
                  onClick={nextMonth}
                  title="Next Month"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 text-center font-semibold text-xs sm:text-sm text-muted-foreground mb-2">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {calendarGrid.map((date, idx) => {
                if (!date) {
                  return <div key={`empty-${idx}`} className="min-h-[60px] sm:min-h-[80px]"></div>
                }

                const dayTodos = getTodosForDate(date)
                const hasTodos = dayTodos.length > 0
                const isSelected = isSameDay(date, selectedDate)
                const isToday = isSameDay(date, new Date())

                return (
                  <div
                    key={date.toISOString()}
                    onClick={() => setSelectedDate(date)}
                    className={`min-h-[60px] sm:min-h-[80px] p-1.5 sm:p-2 rounded-lg border flex flex-col justify-between cursor-pointer transition-all duration-150 ${
                      isSelected
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : isToday
                        ? 'border-primary/30 bg-primary/5'
                        : 'border-border bg-card hover:bg-muted/50'
                    }`}
                  >
                    <div
                      className={`text-xs sm:text-sm ${
                        isToday ? 'font-bold text-primary' : 'font-medium text-foreground'
                      }`}
                    >
                      {date.getDate()}
                    </div>
                    {hasTodos && (
                      <div className="flex items-center gap-1 text-[10px] sm:text-xs text-primary font-semibold mt-1">
                        <Clock className="h-3 w-3 shrink-0" />
                        <span className="hidden sm:inline">
                          {dayTodos.length} task{dayTodos.length > 1 ? 's' : ''}
                        </span>
                        <span className="sm:hidden">{dayTodos.length}</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Day Task Details Side Card */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm w-full lg:w-80 shrink-0">
            <h3 className="text-lg font-bold text-foreground mb-1">
              Tasks for {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </h3>
            <p className="text-sm text-muted-foreground mb-5">
              {selectedDateTodos.length} scheduled item{selectedDateTodos.length !== 1 ? 's' : ''}
            </p>

            {isLoading ? (
              <div className="py-8 text-center flex flex-col items-center">
                <div className="animate-spin rounded-full border-2 border-primary border-t-transparent h-6 w-6 mb-3"></div>
                <span className="text-sm text-muted-foreground">Loading tasks...</span>
              </div>
            ) : selectedDateTodos.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground flex flex-col items-center">
                <CheckCircle2 className="h-10 w-10 text-muted-foreground/50 mb-3" />
                <p className="text-sm">No tasks scheduled for this date.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {selectedDateTodos.map((todo) => (
                  <div
                    key={todo.id}
                    className={`p-3.5 rounded-lg bg-secondary border-l-4 ${
                      todo.completed ? 'border-l-success' : 'border-l-primary'
                    }`}
                  >
                    <div
                      className={`font-medium text-sm text-foreground ${
                        todo.completed ? 'line-through opacity-70' : ''
                      }`}
                    >
                      {todo.title}
                    </div>
                    {todo.description && (
                      <div className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
                        {todo.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
