import { CheckCircle2, Inbox } from 'lucide-react'
import TodoItem from './TodoItem'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useMemo } from 'react'


export default function TodoList({
  todos,
  onToggle,
  onDelete,
  onUpdate,
  isLoading,
}) {
  const completedCount = todos.filter((t) => t.completed).length


  // Sort todos so uncompleted ones stay at the top and completed ones move to the bottom
  const sortedTodos = useMemo(() => {
    return [...todos].sort((a, b) => {
      if (a.completed === b.completed) return 0;
      return a.completed ? 1 : -1;
    });
  }, [todos]);



  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground space-y-4 glass-panel border border-glass-border shadow-sm min-h-[300px]">
        <div className="animate-spin rounded-full border-4 border-primary border-t-transparent h-10 w-10"></div>
        <p className="text-sm font-medium tracking-wide">Loading task records...</p>
      </div>
    )
  }

  if (todos.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-20 px-4 text-center glass-panel border border-glass-border shadow-sm min-h-[300px]"
      >
        <div className="h-16 w-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center mb-5 shadow-inner">
          <Inbox className="h-7 w-7 text-primary" strokeWidth={1.5} />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No tasks found</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          You're all caught up! Create a new task or adjust your filters to see more.
        </p>
      </motion.div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground">All Tasks</h2>
        <div className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20 shadow-sm">
          {todos.length} {todos.length === 1 ? 'task' : 'tasks'}
        </div>
      </div>

      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {sortedTodos.map((todo) => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <TodoItem
                todo={todo}
                onToggle={onToggle}
                onDelete={onDelete}
                onUpdate={onUpdate}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {completedCount > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center justify-center space-x-2 text-sm text-muted-foreground py-6"
          >
            <div className="bg-primary/10 p-1.5 rounded-full">
              <CheckCircle2 className="h-4 w-4 text-primary" strokeWidth={2.5} />
            </div>
            <span className="font-medium text-foreground/80">
              {completedCount} task{completedCount !== 1 ? 's' : ''} marked completed in this view.
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}