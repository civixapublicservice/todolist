import { Clock, CheckCircle2, Bell, BellRing, CalendarDays, ListTodo } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { formatFriendlyDate } from '../utils/dateUtils'

// ── Floating 3D Target icon for empty deadlines ──────────────────────────────
function EmptyDeadlineIcon() {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      className="mb-3"
    >
      <svg viewBox="0 0 80 80" width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="tgt-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6090ff" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#6090ff" stopOpacity="0" />
          </radialGradient>
          <filter id="tgt-blur">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
        </defs>
        {/* Outer glow bloom */}
        <circle cx="40" cy="40" r="36" fill="url(#tgt-glow)" />
        {/* Ring 3 */}
        <circle cx="40" cy="40" r="30" stroke="#cbd5e1" strokeWidth="2.5" fill="none" />
        {/* Ring 2 */}
        <circle cx="40" cy="40" r="20" stroke="#94a3b8" strokeWidth="2.5" fill="none" />
        {/* Ring 1 */}
        <circle cx="40" cy="40" r="10" stroke="#6366f1" strokeWidth="2.5" fill="#6366f1" fillOpacity="0.15" />
        {/* Centre dot */}
        <circle cx="40" cy="40" r="4" fill="#6366f1" />
        {/* Crosshair lines */}
        <line x1="40" y1="6"  x2="40" y2="26" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
        <line x1="40" y1="54" x2="40" y2="74" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
        <line x1="6"  y1="40" x2="26" y2="40" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
        <line x1="54" y1="40" x2="74" y2="40" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </motion.div>
  )
}

// ── Floating 3D Pulse-wave icon for empty activity ───────────────────────────
function EmptyActivityIcon() {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
      className="mb-3"
    >
      <svg viewBox="0 0 80 80" width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="pulse-glow">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <linearGradient id="pulse-line" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#6090ff" stopOpacity="0.2" />
            <stop offset="50%"  stopColor="#60c0ff" />
            <stop offset="100%" stopColor="#6090ff" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        {/* Baseline */}
        <line x1="8" y1="40" x2="72" y2="40" stroke="#e2e8f0" strokeWidth="1.5" strokeLinecap="round" />
        {/* Pulse wave */}
        <path
          d="M 8 40 L 20 40 L 26 24 L 32 52 L 38 30 L 44 48 L 50 36 L 56 40 L 72 40"
          stroke="url(#pulse-line)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          filter="url(#pulse-glow)"
        />
        {/* Glow dot at peak */}
        <circle cx="38" cy="30" r="4" fill="#60c0ff" filter="url(#pulse-glow)" opacity="0.9" />
        <circle cx="38" cy="30" r="2" fill="#ffffff" />
      </svg>
    </motion.div>
  )
}

// ── Lift card wrapper ─────────────────────────────────────────────────────────
function LiftCard({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      initial={{ y: 16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ delay, type: 'spring', stiffness: 400, damping: 26, mass: 0.7 }}
      className={`bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-glass-border shadow-sm hover:shadow-xl transition-shadow duration-300 rounded-3xl overflow-hidden cursor-default ${className}`}
    >
      {children}
    </motion.div>
  )
}

export default function RightWidget({ todos = [] }) {
  const navigate = useNavigate()

  const today = new Date()
  const dateString = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  const dateNum = today.getDate()
  const monthStr = today.toLocaleString('default', { month: 'short' }).toUpperCase()

  const { recentActivity, upcomingDeadlines, upcomingReminders } = useMemo(() => {
    const recentActivity = [...todos]
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 4)

    const upcomingDeadlines = todos
      .filter(t => !t.completed && t.dueDate)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 2)

    const upcomingReminders = todos
      .filter(t => !t.completed && t.dueDate && t.reminderEnabled)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 2)

    return { recentActivity, upcomingDeadlines, upcomingReminders }
  }, [todos])

  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="flex flex-col gap-5"
    >

      {/* ── TODAY CARD ── */}
      <LiftCard delay={0.05}>
        <div className="p-5 flex items-center space-x-4">
          {/* Calendar chip */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: -4 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="flex flex-col items-center justify-center bg-gradient-to-b from-primary to-indigo-500 text-white rounded-2xl shadow-[0_8px_20px_rgba(99,102,241,0.3)] min-w-[56px] py-2 px-1 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
            <span className="text-[10px] font-black uppercase tracking-widest opacity-90 relative z-10">{monthStr}</span>
            <span className="text-2xl font-black leading-none mt-0.5 relative z-10">{dateNum}</span>
          </motion.div>
          <div>
            <div className="text-xl font-black text-foreground tracking-tight">Today</div>
            <div className="text-sm font-semibold text-muted-foreground mt-0.5">{dateString}</div>
          </div>
        </div>

        {/* Upcoming Deadlines sub-section */}
        <div className="border-t border-border px-5 pb-5 pt-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Upcoming Deadlines</span>
            <Link
              to="/calendar"
              className="text-[11px] font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider"
            >
              View all
            </Link>
          </div>

          {upcomingDeadlines.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-5 text-center">
              <EmptyDeadlineIcon />
              <p className="text-sm font-bold text-muted-foreground">No upcoming deadlines</p>
              <p className="text-xs text-muted-foreground/60 mt-1">You're all caught up.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingDeadlines.map(todo => (
                <motion.div
                  whileHover={{ x: 5, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 24 }}
                  key={`deadline-${todo.id}`}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted transition-colors cursor-pointer border border-transparent hover:border-border"
                >
                  <div className="mt-1.5 w-2 h-2 rounded-full shrink-0 bg-primary shadow-sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground break-words">{todo.title}</p>
                    <p className="text-xs font-semibold text-muted-foreground mt-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Due: {formatFriendlyDate(todo.dueDate)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </LiftCard>

      {/* ── ACTIVE REMINDERS ── */}
      <LiftCard delay={0.08} className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-foreground flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            Active Reminders
          </h3>
        </div>

        {upcomingReminders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-5 text-center bg-foreground/5 rounded-xl border border-glass-border">
            <div className="bg-primary/10 p-3 rounded-full mb-3 shadow-inner">
              <Bell className="h-6 w-6 text-primary opacity-50" />
            </div>
            <p className="text-sm font-bold text-muted-foreground">No active reminders</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Set a reminder to stay on top.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingReminders.map(todo => (
              <motion.div
                whileHover={{ x: 5, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400, damping: 24 }}
                key={`reminder-${todo.id}`}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors cursor-pointer border border-transparent hover:border-border group"
              >
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 border border-primary/20 text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                  <BellRing className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground break-words">{todo.title}</p>
                  <p className="text-xs font-semibold text-primary mt-1">
                    {todo.reminderTime} before
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </LiftCard>

      {/* ── QUICK ACTIONS ── */}
      <LiftCard delay={0.1} className="p-6">
        <h3 className="text-[13px] font-black uppercase tracking-widest text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/calendar')}
            className="group flex flex-col items-center justify-center p-5 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/20 border border-primary/10 hover:border-primary/30 transition-all duration-300 cursor-pointer shadow-sm relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="bg-white dark:bg-black p-3 rounded-xl shadow-sm mb-3 group-hover:scale-110 transition-transform duration-300 relative z-10 border border-border">
              <CalendarDays className="w-6 h-6 text-primary" strokeWidth={2.5} />
            </div>
            <span className="text-[14px] font-bold tracking-tight text-foreground relative z-10">Calendar</span>
          </motion.div>
          
          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/tasks')}
            className="group flex flex-col items-center justify-center p-5 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-indigo-500/10 hover:from-indigo-500/10 hover:to-indigo-500/20 border border-indigo-500/10 hover:border-indigo-500/30 transition-all duration-300 cursor-pointer shadow-sm relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="bg-white dark:bg-black p-3 rounded-xl shadow-sm mb-3 group-hover:scale-110 transition-transform duration-300 relative z-10 border border-border">
              <ListTodo className="w-6 h-6 text-indigo-500" strokeWidth={2.5} />
            </div>
            <span className="text-[14px] font-bold tracking-tight text-foreground relative z-10">My Tasks</span>
          </motion.div>
        </div>
      </LiftCard>

      {/* ── RECENT ACTIVITY ── */}
      <LiftCard delay={0.15} className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Recent Activity</h3>
          <Link to="/activity" className="text-[11px] font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider">
            See all
          </Link>
        </div>

        {recentActivity.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-5 text-center">
            <EmptyActivityIcon />
            <p className="text-sm font-bold text-muted-foreground">No recent activity</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Start adding tasks to see activity</p>
          </div>
        ) : (
          <div className="relative pl-5 space-y-6">
            {recentActivity.map((todo, idx) => {
              const isCompleted = todo.completed
              const isNewlyCreated = Math.abs(new Date(todo.updatedAt) - new Date(todo.createdAt)) < 5000 // If updated within 5 seconds of creation, treat as newly created
              
              let actionText = 'updated'
              if (isCompleted) actionText = 'completed'
              else if (isNewlyCreated) actionText = 'added'

              return (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ x: 4 }}
                  transition={{ delay: idx * 0.08, type: 'spring', stiffness: 400, damping: 24 }}
                  key={`activity-${todo.id}`}
                  className="relative group cursor-default"
                >
                  <div className={`absolute -left-[29px] top-0 p-1.5 rounded-full border-2 transition-all duration-300 ${isCompleted ? 'bg-emerald-500 border-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'bg-background border-border text-muted-foreground ring-4 ring-background group-hover:border-primary group-hover:text-primary group-hover:shadow-[0_0_10px_rgba(99,102,241,0.2)]'}`}>
                    <CheckCircle2 className="h-3 w-3" strokeWidth={3} />
                  </div>
                  <div className="bg-white/40 dark:bg-black/20 backdrop-blur-sm rounded-xl p-3 border border-border group-hover:border-primary/30 transition-all duration-300 group-hover:bg-primary/5 shadow-sm">
                    <p className="text-[14px] font-semibold text-foreground leading-snug break-words">
                      Task <span className="font-black text-primary">{todo.title}</span> was {actionText}.
                    </p>
                    <p className="text-xs font-semibold text-muted-foreground mt-1.5 flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <Clock className="h-3 w-3" />
                      {new Date(todo.updatedAt || todo.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </LiftCard>

    </motion.div>
  )
}
