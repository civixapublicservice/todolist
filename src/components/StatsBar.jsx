import { ListTodo, CheckCircle2, AlertTriangle, CalendarClock } from 'lucide-react'
import { isTodayLocal } from '../utils/dateUtils'
import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../utils/cn'

const CARD_CONFIGS = [
  {
    id: 'total',
    label: 'Total Tasks',
    icon: ListTodo,
    link: '/tasks',
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20 hover:border-indigo-500/40',
    gradient: 'from-indigo-500/10 to-transparent'
  },
  {
    id: 'completed',
    label: 'Completed',
    icon: CheckCircle2,
    link: '/tasks?status=completed',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20 hover:border-emerald-500/40',
    gradient: 'from-emerald-500/10 to-transparent'
  },
  {
    id: 'highPriority',
    label: 'High Priority',
    icon: AlertTriangle,
    link: '/tasks?priority=HIGH',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20 hover:border-amber-500/40',
    gradient: 'from-amber-500/10 to-transparent'
  },
  {
    id: 'dueToday',
    label: 'Due Today',
    icon: CalendarClock,
    link: '/tasks',
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20 hover:border-rose-500/40',
    gradient: 'from-rose-500/10 to-transparent'
  },
]

export default function StatsBar({ todos = [] }) {
  const stats = useMemo(() => {
    const total        = todos.length
    const completed    = todos.filter(t => t.completed).length
    const highPriority = todos.filter(t => !t.completed && t.priority === 'HIGH').length
    const dueToday     = todos.filter(t => !t.completed && isTodayLocal(t.dueDate)).length
    const pending      = total - completed

    return {
      total:        { value: total,        sub: `${pending} active` },
      completed:    { value: completed,    sub: 'Successfully finished' },
      highPriority: { value: highPriority, sub: 'Needs attention' },
      dueToday:     { value: dueToday,     sub: 'Deadlines today' },
    }
  }, [todos])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {CARD_CONFIGS.map((cfg, idx) => {
        const Icon = cfg.icon
        const { value, sub } = stats[cfg.id]

        return (
          <motion.div
            key={cfg.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.07, type: 'spring', stiffness: 380, damping: 28 }}
            whileHover={{ y: -5, scale: 1.02, transition: { type: 'spring', stiffness: 420, damping: 24, mass: 0.7 } }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to={cfg.link}
              className={cn(
                "group relative flex flex-col h-full overflow-hidden rounded-2xl transition-all duration-300",
                "bg-white/60 dark:bg-black/40 backdrop-blur-xl border shadow-sm hover:shadow-xl",
                cfg.border
              )}
            >
              {/* Background Gradient */}
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-40 transition-opacity duration-300 group-hover:opacity-100", cfg.gradient)} />
              
              <div className="relative flex flex-col flex-1 p-5 z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-muted-foreground tracking-tight group-hover:text-foreground transition-colors">
                    {cfg.label}
                  </span>
                  <div className={cn("flex items-center justify-center w-10 h-10 rounded-xl transition-transform group-hover:scale-110 shadow-sm", cfg.bg)}>
                    <Icon className={cn("w-5 h-5", cfg.color)} strokeWidth={2.5} />
                  </div>
                </div>

                {/* Number */}
                <div className={cn("text-4xl font-black leading-none tracking-tighter mb-1", value > 0 ? cfg.color : "text-foreground")}>
                  {value}
                </div>

                {/* Sub label */}
                <p className="text-xs text-muted-foreground font-semibold mt-1">{sub}</p>
              </div>
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}
