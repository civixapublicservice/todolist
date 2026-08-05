import { CheckCircle2, Inbox } from 'lucide-react'
import TodoItem from './TodoItem'
import '../styles/todolist.css'

export default function TodoList({
  todos,
  onToggle,
  onDelete,
  onUpdate,
  isLoading,
}) {
  const completedCount = todos.filter(t => t.completed).length

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading todos...</p>
      </div>
    )
  }

  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <Inbox size={48} />
        </div>
        <h3>No todos yet</h3>
        <p>Create your first todo to get started! 🚀</p>
      </div>
    )
  }

  return (
    <div className="todo-list-container">
      <div className="list-header">
        <h2>Your Todos</h2>
        <div className="list-stats">
          <div className="stat">
            <span className="stat-value">{todos.length}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat stat-completed">
            <span className="stat-value">{completedCount}</span>
            <span className="stat-label">Completed</span>
          </div>
          {todos.length > 0 && (
            <div className="stat">
              <span className="stat-value">
                {Math.round((completedCount / todos.length) * 100)}%
              </span>
              <span className="stat-label">Progress</span>
            </div>
          )}
        </div>
      </div>

      <div className="todo-list">
        {todos.map(todo => (
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
        <div className="completion-message">
          <CheckCircle2 size={20} />
          <span>
            You've completed {completedCount} todo{completedCount !== 1 ? 's' : ''}! Great work!
          </span>
        </div>
      )}
    </div>
  )
}