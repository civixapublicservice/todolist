import { CheckCircle2, Inbox } from 'lucide-react'
import TodoItem from './TodoItem'


export default function TodoList({
  todos,
  onToggle,
  onDelete,
  onUpdate,
  isLoading,
}) {
  const completedCount = todos.filter((t) => t.completed).length

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground space-y-4">
        <div className="animate-spin rounded-full border-4 border-primary border-t-transparent h-8 w-8"></div>
        <p className="text-sm font-medium">Loading task records...</p>
      </div>
    )
  }

  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-card border border-border rounded-xl shadow-sm">
        <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mb-4">
          <Inbox className="h-5 w-5 text-muted-foreground" />
        </div>
        <h3 className="text-base font-semibold text-foreground mb-1">No tasks found</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          You're all caught up! Create a new task or adjust your filters.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground">All Tasks</h2>
        <div className="text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
          {todos.length} {todos.length === 1 ? 'task' : 'tasks'}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        ))}
      </div>

      {completedCount > 0 && (
        <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground py-4">
          <CheckCircle2 className="h-4 w-4 text-success" />
          <span>
            {completedCount} task{completedCount !== 1 ? 's' : ''} marked completed in this view.
          </span>
        </div>
      )}
    </div>
  )
}