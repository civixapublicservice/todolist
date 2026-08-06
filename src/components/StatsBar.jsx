import { ListTodo, CheckCircle2, AlertTriangle, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'

export default function StatsBar({ todos = [] }) {
  const { total, completed, pending, highPriority, dueToday } = useMemo(() => {
    const total = todos.length
    const completed = todos.filter((t) => t.completed).length
    const pending = total - completed
    const highPriority = todos.filter((t) => !t.completed && t.priority === 'HIGH').length
    
    const today = new Date().toISOString().split('T')[0]
    const dueToday = todos.filter((t) => !t.completed && t.dueDate && t.dueDate.startsWith(today)).length
    
    return { total, completed, pending, highPriority, dueToday }
  }, [todos])

  const stats = [
    { label: 'Total Tasks', value: total, subtext: `${pending} active`, icon: ListTodo, color: 'text-primary', link: '/tasks' },
    { label: 'Completed', value: completed, subtext: 'Successfully finished', icon: CheckCircle2, color: 'text-emerald-500', link: '/tasks?status=completed' },
    { label: 'High Priority', value: highPriority, subtext: 'Requires attention', icon: AlertTriangle, color: 'text-destructive', link: '/tasks?priority=HIGH' },
    { label: 'Due Today', value: dueToday, subtext: 'Deadlines approaching', icon: Calendar, color: 'text-accent', link: '/tasks' }
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      {stats.map((stat, idx) => {
        const Icon = stat.icon
        return (
          <motion.div 
            key={idx} 
            variants={item}
          >
            <Link 
              to={stat.link}
              className="group flex flex-col bg-card border border-border shadow-sm hover:shadow-md rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1 block h-full"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{stat.label}</span>
                <div className="p-2 bg-muted rounded-xl group-hover:bg-primary/10 transition-colors">
                  <Icon className={`h-5 w-5 ${stat.color} group-hover:text-primary transition-colors`} strokeWidth={2} />
                </div>
              </div>
              <div className="text-3xl font-bold text-foreground">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground mt-2 group-hover:text-foreground/70 transition-colors">
                {stat.subtext}
              </div>
            </Link>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
