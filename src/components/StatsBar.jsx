import { ListTodo, Clock, CheckCircle2, AlertTriangle, Calendar } from 'lucide-react'

export default function StatsBar({ todos = [] }) {
  const total = todos.length
  const completed = todos.filter((t) => t.completed).length
  const pending = total - completed
  const highPriority = todos.filter((t) => !t.completed && t.priority === 'HIGH').length
  
  const today = new Date().toISOString().split('T')[0]
  const dueToday = todos.filter((t) => !t.completed && t.dueDate && t.dueDate.startsWith(today)).length

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Total Tasks</span>
          <div className="p-2 bg-primary/10 text-primary-foreground rounded-lg">
            <ListTodo className="h-5 w-5" strokeWidth={2} />
          </div>
        </div>
        <div className="text-2xl font-bold text-foreground mt-3">{total}</div>
        <div className="text-xs text-muted-foreground mt-1">{pending} active</div>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Completed</span>
          <div className="p-2 bg-primary/10 text-primary-foreground rounded-lg">
            <CheckCircle2 className="h-5 w-5" strokeWidth={2} />
          </div>
        </div>
        <div className="text-2xl font-bold text-foreground mt-3">{completed}</div>
        <div className="text-xs text-muted-foreground mt-1">Successfully finished</div>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">High Priority</span>
          <div className="p-2 bg-primary/10 text-primary-foreground rounded-lg">
            <AlertTriangle className="h-5 w-5" strokeWidth={2} />
          </div>
        </div>
        <div className="text-2xl font-bold text-foreground mt-3">{highPriority}</div>
        <div className="text-xs text-muted-foreground mt-1">Requires attention</div>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Due Today</span>
          <div className="p-2 bg-primary/10 text-primary-foreground rounded-lg">
            <Calendar className="h-5 w-5" strokeWidth={2} />
          </div>
        </div>
        <div className="text-2xl font-bold text-foreground mt-3">{dueToday}</div>
        <div className="text-xs text-muted-foreground mt-1">Deadlines approaching</div>
      </div>
    </div>
  )
}
