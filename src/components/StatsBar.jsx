import { ListTodo, CheckCircle2, AlertTriangle, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'

export default function StatsBar({ todos = [] }) {
  const total = todos.length
  const completed = todos.filter((t) => t.completed).length
  const pending = total - completed
  const highPriority = todos.filter((t) => !t.completed && t.priority === 'HIGH').length
  
  const today = new Date().toISOString().split('T')[0]
  const dueToday = todos.filter((t) => !t.completed && t.dueDate && t.dueDate.startsWith(today)).length

  const stats = [
    { label: 'Total Tasks', value: total, subtext: `${pending} active`, icon: ListTodo, color: 'text-primary' },
    { label: 'Completed', value: completed, subtext: 'Successfully finished', icon: CheckCircle2, color: 'text-secondary' },
    { label: 'High Priority', value: highPriority, subtext: 'Requires attention', icon: AlertTriangle, color: 'text-destructive' },
    { label: 'Due Today', value: dueToday, subtext: 'Deadlines approaching', icon: Calendar, color: 'text-accent' }
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8"
    >
      {stats.map((stat, idx) => {
        const Icon = stat.icon
        return (
          <motion.div 
            key={idx} 
            variants={item}
            className="glass-card group cursor-default relative overflow-hidden"
          >
            {/* Subtle background glow effect */}
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity bg-gradient-to-br from-primary to-accent`} />
            
            <div className="flex items-center justify-between relative z-10">
              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{stat.label}</span>
              <div className="p-2.5 bg-foreground/5 rounded-xl group-hover:bg-primary group-hover:shadow-glow transition-all duration-300">
                <Icon className={`h-5 w-5 ${stat.color} group-hover:text-white transition-colors`} strokeWidth={2} />
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground mt-4 relative z-10">
              {stat.value}
            </div>
            <div className="text-xs text-muted-foreground mt-1 relative z-10 group-hover:text-foreground/70 transition-colors">
              {stat.subtext}
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
