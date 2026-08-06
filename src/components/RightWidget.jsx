import { Calendar as CalendarIcon, Clock, CheckCircle2, Plus, CalendarDays, Flag, ListTodo, Target, Activity } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useMemo } from 'react'

export default function RightWidget({ todos = [] }) {
  const navigate = useNavigate()

  const today = new Date()
  const dateString = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  const dateNum = today.getDate()

  const { recentActivity, upcomingDeadlines } = useMemo(() => {
    const recentActivity = [...todos]
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 4)

    const upcomingDeadlines = todos
      .filter(t => !t.completed && t.dueDate)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 2)

    return { recentActivity, upcomingDeadlines }
  }, [todos])

  return (
    <motion.div 
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="flex flex-col gap-6"
    >
      
      {/* Calendar Preview */}
      <div className="bg-card border border-border shadow-sm rounded-2xl overflow-hidden">
        <div className="bg-muted/50 p-5 border-b border-border flex items-center space-x-4 relative overflow-hidden">
          <div className="p-3 bg-primary text-primary-foreground rounded-2xl shadow-sm relative z-10 flex flex-col items-center justify-center min-w-[50px]">
            <span className="text-xs font-medium uppercase opacity-90">{today.toLocaleString('default', { month: 'short' })}</span>
            <span className="text-xl font-bold leading-none mt-0.5">{dateNum}</span>
          </div>
          <div className="relative z-10">
            <div className="text-lg font-bold text-foreground">Today</div>
            <div className="text-sm text-muted-foreground">{dateString}</div>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
            Upcoming Deadlines
            <Link to="/calendar" className="text-primary hover:text-primary/80 transition-colors">View all</Link>
          </div>
          {upcomingDeadlines.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-4 text-center">
              <div className="p-3 bg-muted rounded-full mb-2">
                <Target className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No upcoming deadlines.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingDeadlines.map(todo => (
                <motion.div 
                  whileHover={{ x: 4 }}
                  key={`deadline-${todo.id}`} 
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted transition-colors cursor-pointer border border-transparent hover:border-border"
                >
                  <div className="mt-1.5 w-2 h-2 rounded-full shrink-0 bg-primary shadow-sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground line-clamp-1">{todo.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Due: {new Date(todo.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border shadow-sm rounded-2xl p-6 relative overflow-hidden">
        <h3 className="text-sm font-semibold text-foreground mb-4 relative z-10">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3 relative z-10">
          <Link to="/calendar" className="group flex flex-col items-center justify-center p-4 rounded-xl bg-muted hover:bg-primary/5 hover:border-primary/20 border border-transparent transition-all gap-3">
            <div className="p-2.5 bg-background text-muted-foreground rounded-lg group-hover:bg-primary group-hover:text-primary-foreground shadow-sm transition-all">
              <CalendarDays className="h-5 w-5" strokeWidth={2} />
            </div>
            <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">Calendar</span>
          </Link>
          <Link to="/tasks" className="group flex flex-col items-center justify-center p-4 rounded-xl bg-muted hover:bg-primary/5 hover:border-primary/20 border border-transparent transition-all gap-3">
            <div className="p-2.5 bg-background text-muted-foreground rounded-lg group-hover:bg-primary group-hover:text-primary-foreground shadow-sm transition-all">
              <ListTodo className="h-5 w-5" strokeWidth={2} />
            </div>
            <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">My Tasks</span>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card border border-border shadow-sm rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-foreground mb-5 flex items-center justify-between">
          Recent Activity
          <Link to="/activity" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">See all</Link>
        </h3>
        {recentActivity.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Activity className="h-8 w-8 text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">No recent activity.</p>
          </div>
        ) : (
          <div className="relative pl-5 space-y-6 before:absolute before:inset-y-0 before:left-2 before:w-px before:bg-border">
            {recentActivity.map((todo, idx) => {
              const isCompleted = todo.completed
              
              return (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={`activity-${todo.id}`} 
                  className="relative group cursor-default"
                >
                  <div className={`absolute -left-[29px] top-0 p-1 rounded-full border-2 transition-colors ${isCompleted ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm' : 'bg-background border-border text-muted-foreground ring-4 ring-background group-hover:border-primary group-hover:text-primary'}`}>
                    {isCompleted ? (
                      <CheckCircle2 className="h-3 w-3" strokeWidth={2.5} />
                    ) : (
                      <Activity className="h-3 w-3" strokeWidth={2} />
                    )}
                  </div>
                  <div className="bg-muted/50 rounded-xl p-3 border border-transparent group-hover:border-border transition-colors group-hover:bg-muted">
                    <p className="text-sm text-foreground leading-snug">
                      Task <span className="font-semibold text-primary">{todo.title}</span> was {isCompleted ? 'completed' : 'updated'}.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(todo.updatedAt || todo.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

    </motion.div>
  )
}
