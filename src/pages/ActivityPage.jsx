import { useActivities } from '../context/ActivityContext'
import { Activity, Clock, CheckCircle2, UserPlus, LogIn, Edit, Trash2, PlusCircle, AlertCircle, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../utils/cn'
import { useEffect } from 'react'

export default function ActivityPage() {
  const { activities, isLoading, error, fetchActivities } = useActivities()

  useEffect(() => {
    fetchActivities()
  }, [fetchActivities])

  const getActivityIcon = (action) => {
    switch (action) {
      case 'USER_REGISTERED':
        return <UserPlus size={18} className="text-emerald-500" />
      case 'USER_LOGGED_IN':
        return <LogIn size={18} className="text-blue-500" />
      case 'TASK_CREATED':
        return <PlusCircle size={18} className="text-primary" />
      case 'TASK_UPDATED':
        return <Edit size={18} className="text-amber-500" />
      case 'TASK_COMPLETED':
        return <CheckCircle2 size={18} className="text-emerald-500" />
      case 'TASK_DELETED':
        return <Trash2 size={18} className="text-destructive" />
      default:
        return <Activity size={18} className="text-accent" />
    }
  }

  const getActivityColor = (action) => {
    switch (action) {
      case 'USER_REGISTERED':
      case 'TASK_COMPLETED':
        return 'bg-emerald-500/10 border-emerald-500/20'
      case 'USER_LOGGED_IN':
        return 'bg-blue-500/10 border-blue-500/20'
      case 'TASK_CREATED':
        return 'bg-primary/10 border-primary/20'
      case 'TASK_UPDATED':
        return 'bg-amber-500/10 border-amber-500/20'
      case 'TASK_DELETED':
        return 'bg-destructive/10 border-destructive/20'
      default:
        return 'bg-accent/10 border-accent/20'
    }
  }

  return (
    <>
      <div className="max-w-4xl mx-auto w-full">
        {/* Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="bg-gradient-to-r from-primary to-accent text-white rounded-[var(--radius-lg)] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden mb-8 shadow-glow"
        >
          <div className="relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold tracking-wide uppercase mb-3 border border-white/20">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Audit Trail</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2 text-white">Activity Log</h1>
            <p className="text-white/80 text-sm max-w-md font-medium">
              Chronological log of all security events and task operations for your account.
            </p>
          </div>
          <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none mix-blend-overlay"></div>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="flex items-center space-x-2 bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl glass">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut', delay: 0.05 }}
        >
          {isLoading ? (
            <div className="glass-panel border border-glass-border p-12 text-center shadow-sm flex flex-col items-center justify-center space-y-4 min-h-[300px]">
              <div className="animate-spin rounded-full border-4 border-primary border-t-transparent h-10 w-10"></div>
              <p className="text-sm font-medium tracking-wide text-muted-foreground">Loading activity records...</p>
            </div>
          ) : activities.length === 0 ? (
            <div className="glass-panel border border-glass-border p-12 text-center shadow-sm flex flex-col items-center justify-center min-h-[300px]">
              <div className="h-16 w-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center mb-5 shadow-inner">
                <Activity className="h-7 w-7 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No Activity Recorded</h3>
              <p className="text-sm text-muted-foreground max-w-sm">Events will appear here as you create, update, and manage tasks.</p>
            </div>
          ) : (
            <div className="relative pl-2 sm:pl-4 py-2">
              <div className="flex flex-col relative z-10">
                {activities.map((item, index) => {
                  const detailsParts = item.details.split(/"([^"]+)"/g);
                  
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: 'easeOut', delay: index * 0.02 }}
                      key={item.id}
                      className="relative flex items-start gap-4 sm:gap-5 group pb-8 last:pb-2"
                    >
                      {/* Delicate Timeline Icon */}
                      <div className={cn(
                        "relative flex items-center justify-center w-8 h-8 rounded-full border shadow-sm shrink-0 z-10 transition-transform duration-300 group-hover:scale-110",
                        getActivityColor(item.action)
                      )}>
                        {getActivityIcon(item.action)}
                      </div>
                      
                      {/* Content - Borderless & Clean */}
                      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between flex-1 pt-1.5">
                        <div className="text-[14px] sm:text-[15px] leading-snug text-muted-foreground">
                          {detailsParts.map((part, i) => (
                            i % 2 === 1 
                              ? <span key={i} className="font-semibold text-foreground tracking-tight">"{part}"</span> 
                              : <span key={i}>{part}</span>
                          ))}
                        </div>
                        
                        <div className="text-[11.5px] sm:text-xs text-muted-foreground/50 font-medium tracking-wide shrink-0 mt-1.5 sm:mt-0">
                          {new Date(item.createdAt).toLocaleString(undefined, {
                            month: 'short', day: 'numeric', year: 'numeric',
                            hour: 'numeric', minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </>
  )
}
