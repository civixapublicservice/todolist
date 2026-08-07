import { ListTodo, CheckCircle2, AlertTriangle, CalendarClock } from 'lucide-react'
import { isTodayLocal } from '../utils/dateUtils'
import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'

const CARD_CONFIGS = [
  {
    id: 'total',
    label: 'Total Tasks',
    icon: ListTodo,
    link: '/tasks',
    accent: '#4F46E5',
    chipBg: 'rgba(79,70,229,0.10)',
  },
  {
    id: 'completed',
    label: 'Completed',
    icon: CheckCircle2,
    link: '/tasks?status=completed',
    accent: '#10B981',
    chipBg: 'rgba(16,185,129,0.10)',
  },
  {
    id: 'highPriority',
    label: 'High Priority',
    icon: AlertTriangle,
    link: '/tasks?priority=HIGH',
    accent: '#F59E0B',
    chipBg: 'rgba(245,158,11,0.10)',
  },
  {
    id: 'dueToday',
    label: 'Due Today',
    icon: CalendarClock,
    link: '/tasks',
    accent: '#F43F5E',
    chipBg: 'rgba(244,63,94,0.10)',
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
      total:        { value: total,        sub: `${pending} active`,        pct: 100 },
      completed:    { value: completed,    sub: 'Successfully finished',    pct: total > 0 ? (completed / total) * 100 : 0 },
      highPriority: { value: highPriority, sub: 'Needs attention',          pct: total > 0 ? (highPriority / total) * 100 : 0 },
      dueToday:     { value: dueToday,     sub: 'Deadlines today',          pct: total > 0 ? (dueToday / total) * 100 : 0 },
    }
  }, [todos])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {CARD_CONFIGS.map((cfg, idx) => {
        const Icon = cfg.icon
        const { value, sub } = stats[cfg.id]

        return (
          <motion.div
            key={cfg.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.07, type: 'spring', stiffness: 380, damping: 28 }}
            whileHover={{ y: -5, scale: 1.025, transition: { type: 'spring', stiffness: 420, damping: 24, mass: 0.7 } }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to={cfg.link}
              className="flex flex-col bg-card border border-border rounded-2xl overflow-hidden h-full"
              style={{
                boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)',
                borderLeft: `3px solid ${cfg.accent}`,
              }}
            >
              <div className="flex flex-col flex-1 p-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-muted-foreground tracking-tight">
                    {cfg.label}
                  </span>
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-lg"
                    style={{ background: cfg.chipBg }}
                  >
                    <Icon className="w-4 h-4" style={{ color: cfg.accent }} strokeWidth={2} />
                  </div>
                </div>

                {/* Number */}
                <div
                  className="text-4xl font-black leading-none tracking-tighter mb-1"
                  style={{ color: value > 0 ? cfg.accent : 'var(--foreground)' }}
                >
                  {value}
                </div>

                {/* Sub label */}
                <p className="text-xs text-muted-foreground font-medium mt-1">{sub}</p>
              </div>
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}
