import { useActivities } from '../context/ActivityContext'
import { Activity, Clock, CheckCircle2, UserPlus, LogIn, Edit, Trash2, PlusCircle, AlertCircle, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../utils/cn'
import { useEffect, useMemo } from 'react'

export default function ActivityPage() {
  const { activities, isLoading, error, fetchActivities } = useActivities()

  useEffect(() => {
    fetchActivities()
  }, [fetchActivities])

  const groupedActivities = useMemo(() => {
    if (!activities || !Array.isArray(activities)) return [];
    const groups = {};
    
    activities.forEach(item => {
      if (!item || !item.createdAt) return;
      const date = new Date(item.createdAt);
      if (isNaN(date.getTime())) return;
      
      // Group by midnight of that date
      const dateKey = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(item);
    });
    
    // Sort keys descending (newest dates first)
    return Object.keys(groups)
      .sort((a, b) => Number(b) - Number(a))
      .map(key => ({
        date: new Date(Number(key)),
        items: groups[key]
      }));
  }, [activities]);

  const getRelativeDateLabel = (date) => {
    if (!date || isNaN(date.getTime())) return 'Unknown Date';
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  const getActivityIcon = (action) => {
    switch (action) {
      case 'TASK_CREATED': return <PlusCircle className="w-4 h-4" />;
      case 'TASK_UPDATED': return <Edit className="w-4 h-4" />;
      case 'TASK_COMPLETED': return <CheckCircle2 className="w-4 h-4" />;
      case 'TASK_DELETED': return <Trash2 className="w-4 h-4" />;
      case 'USER_REGISTERED': return <UserPlus className="w-4 h-4" />;
      case 'USER_LOGIN': return <LogIn className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (action) => {
    switch (action) {
      case 'TASK_CREATED': return 'text-blue-500 border-blue-500/30 bg-blue-500/10 dark:bg-blue-500/20';
      case 'TASK_UPDATED': return 'text-purple-500 border-purple-500/30 bg-purple-500/10 dark:bg-purple-500/20';
      case 'TASK_COMPLETED': return 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-500/20';
      case 'TASK_DELETED': return 'text-red-500 border-red-500/30 bg-red-500/10 dark:bg-red-500/20';
      case 'USER_REGISTERED': return 'text-indigo-500 border-indigo-500/30 bg-indigo-500/10 dark:bg-indigo-500/20';
      case 'USER_LOGIN': return 'text-cyan-500 border-cyan-500/30 bg-cyan-500/10 dark:bg-cyan-500/20';
      default: return 'text-gray-500 border-gray-500/30 bg-gray-500/10 dark:bg-gray-500/20';
    }
  };

  const formatActionText = (action, details) => {
    if (!details || typeof details !== 'string') {
      return <span className="text-muted-foreground">{action}</span>;
    }

    // Try to extract the task name in quotes
    const match = details.match(/"([^"]+)"/);
    const targetName = match ? match[1] : null;
    
    if (!targetName) {
      // Fallback for non-quoted details (like "User logged in")
      return <span className="text-muted-foreground">{details}</span>;
    }

    switch (action) {
      case 'TASK_CREATED': 
        return <><span className="text-muted-foreground">Created task </span><span className="font-bold text-foreground">"{targetName}"</span></>;
      case 'TASK_UPDATED': 
        return <><span className="text-muted-foreground">Updated task </span><span className="font-bold text-foreground">"{targetName}"</span></>;
      case 'TASK_COMPLETED': 
        return <><span className="font-semibold text-foreground">Completed task </span><span className="font-bold text-emerald-500">"{targetName}"</span></>;
      case 'TASK_DELETED': 
        return <><span className="text-muted-foreground">Deleted task </span><span className="font-bold text-foreground line-through opacity-70">"{targetName}"</span></>;
      case 'TASK_REOPENED': 
        return <><span className="text-muted-foreground">Reopened task </span><span className="font-bold text-amber-500">"{targetName}"</span></>;
      default: {
        // Generic fallback for any other quoted text
        const parts = details.split(/"([^"]+)"/g);
        return (
          <span className="text-muted-foreground">
            {parts.map((part, i) => i % 2 === 1 ? <span key={i} className="font-bold text-foreground">"{part}"</span> : <span key={i}>{part}</span>)}
          </span>
        );
      }
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto w-full pb-10">
        {/* Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="bg-gradient-to-r from-primary to-accent text-white rounded-[var(--radius-lg)] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden mb-10 shadow-glow"
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
            <div className="space-y-10">
              {groupedActivities.map((group, groupIdx) => (
                <div key={group.date.getTime()} className="relative">
                  {/* Date Header */}
                  <div className="flex items-center gap-4 mb-6 z-20">
                    <div className="bg-background/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-border shadow-sm">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">
                        {getRelativeDateLabel(group.date)}
                      </h3>
                    </div>
                    <div className="h-px bg-border/60 flex-1"></div>
                  </div>

                  {/* Timeline Container */}
                  <div className="relative pl-6 sm:pl-8 ml-6 border-l-2 border-border/60 space-y-6">
                    {group.items.map((item, idx) => (
                      <motion.div
                        initial={{ opacity: 0, y: 10, x: -10 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        transition={{ duration: 0.3, ease: 'easeOut', delay: (groupIdx * 0.1) + (idx * 0.03) }}
                        key={item.id}
                        className="relative group cursor-default"
                      >
                        {/* Timeline Node Icon */}
                        <div className={cn(
                          "absolute -left-[43px] sm:-left-[51px] top-1.5 flex items-center justify-center w-9 h-9 rounded-full border-2 bg-background z-10 transition-transform duration-300 group-hover:scale-110 shadow-sm",
                          getActivityColor(item.action)
                        )}>
                          {getActivityIcon(item.action)}
                        </div>
                        
                        {/* Activity Card */}
                        <div className="bg-white/40 dark:bg-black/20 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-border group-hover:border-primary/30 transition-all duration-300 shadow-sm group-hover:shadow-md hover:bg-white/60 dark:hover:bg-white/5">
                          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 sm:gap-4">
                            <div className="text-[14px] sm:text-[15px] leading-relaxed">
                              {formatActionText(item.action, item.details)}
                            </div>
                            <div className="text-[11.5px] font-semibold text-muted-foreground/60 flex items-center gap-1.5 shrink-0 bg-background/50 px-2.5 py-1 rounded-md border border-border/50">
                              <Clock className="w-3.5 h-3.5" />
                              {new Date(item.createdAt).toLocaleTimeString(undefined, {
                                hour: 'numeric', minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </>
  )
}
