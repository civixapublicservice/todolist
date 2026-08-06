import { Calendar as CalendarIcon, Clock, CheckCircle2, Plus, CalendarDays, Flag, ListTodo, Target, Activity } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function RightWidget({ todos = [] }) {
  // Sort todos by most recently updated for activity
  const recentActivity = [...todos]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 4)

  const today = new Date()
  const dateString = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  // Find upcoming deadlines
  const upcomingDeadlines = todos
    .filter(t => !t.completed && t.dueDate)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 2)

  return (
    <div className="flex flex-col gap-6">
      
      {/* Calendar Preview */}
      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="bg-muted/50 p-5 border-b border-border flex items-center space-x-3">
          <div className="p-2 bg-primary/10 text-primary-foreground rounded-lg">
            <CalendarIcon className="h-5 w-5" strokeWidth={2} />
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">Today</div>
            <div className="text-xs text-muted-foreground">{dateString}</div>
          </div>
        </div>
        <div className="p-4 space-y-4">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Upcoming Deadlines</div>
          {upcomingDeadlines.length === 0 ? (
            <p className="text-sm text-muted-foreground">No upcoming deadlines.</p>
          ) : (
            <div className="space-y-3">
              {upcomingDeadlines.map(todo => (
                <div key={`deadline-${todo.id}`} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground line-clamp-1">{todo.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Due: {new Date(todo.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <Link to="/calendar" className="group flex flex-col items-center justify-center p-3 rounded-lg border border-border bg-muted/30 hover:bg-muted hover:shadow-sm transition-all hover:-translate-y-0.5 gap-2 text-muted-foreground hover:text-foreground">
            <div className="p-2 bg-primary/10 text-primary-foreground rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <CalendarDays className="h-5 w-5" strokeWidth={2} />
            </div>
            <span className="text-xs font-medium">Calendar</span>
          </Link>
          <Link to="/my-tasks" className="group flex flex-col items-center justify-center p-3 rounded-lg border border-border bg-muted/30 hover:bg-muted hover:shadow-sm transition-all hover:-translate-y-0.5 gap-2 text-muted-foreground hover:text-foreground">
            <div className="p-2 bg-primary/10 text-primary-foreground rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <ListTodo className="h-5 w-5" strokeWidth={2} />
            </div>
            <span className="text-xs font-medium">My Tasks</span>
          </Link>
          <div className="group flex flex-col items-center justify-center p-3 rounded-lg border border-border bg-muted/30 hover:bg-muted hover:shadow-sm transition-all hover:-translate-y-0.5 gap-2 text-muted-foreground hover:text-foreground cursor-pointer">
            <div className="p-2 bg-primary/10 text-primary-foreground rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Flag className="h-5 w-5" strokeWidth={2} />
            </div>
            <span className="text-xs font-medium">Priority</span>
          </div>
          <div className="group flex flex-col items-center justify-center p-3 rounded-lg border border-border bg-muted/30 hover:bg-muted hover:shadow-sm transition-all hover:-translate-y-0.5 gap-2 text-muted-foreground hover:text-foreground cursor-pointer">
            <div className="p-2 bg-primary/10 text-primary-foreground rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <CheckCircle2 className="h-5 w-5" strokeWidth={2} />
            </div>
            <span className="text-xs font-medium">Completed</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-foreground mb-4">Recent Activity</h3>
        {recentActivity.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent activity.</p>
        ) : (
          <div className="relative pl-4 space-y-7 before:absolute before:inset-y-0 before:left-1.5 before:w-px before:bg-border">
            {recentActivity.map((todo) => {
              const isCompleted = todo.completed
              
              return (
                <div key={`activity-${todo.id}`} className="relative">
                  <div className={`absolute -left-[27.5px] top-0 p-1 rounded-full border-2 ${isCompleted ? 'bg-primary border-primary text-primary-foreground' : 'bg-background border-border text-muted-foreground ring-2 ring-background'}`}>
                    {isCompleted ? (
                      <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2} />
                    ) : (
                      <Activity className="h-3.5 w-3.5" strokeWidth={2} />
                    )}
                  </div>
                  <p className="text-sm text-foreground">
                    Task <span className="font-medium">{todo.title}</span> was {isCompleted ? 'completed' : 'updated'}.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(todo.updatedAt || todo.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}
