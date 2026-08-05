import { useState } from 'react'
import { Trash2, Edit2, Check, X } from 'lucide-react'
import '../styles/todoitem.css'

export default function TodoItem({
  todo,
  onToggle,
  onDelete,
  onUpdate,
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [editDescription, setEditDescription] = useState(todo.description)

  const handleSaveEdit = () => {
    if (!editTitle.trim()) {
      alert('Todo title cannot be empty')
      return
    }

    onUpdate(todo.id, {
      title: editTitle.trim(),
      description: editDescription.trim(),
    })
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditTitle(todo.title)
    setEditDescription(todo.description)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="todo-item card todo-edit-mode">
        <div className="edit-form">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="edit-input"
            autoFocus
            maxLength={100}
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="edit-textarea"
            rows={2}
            maxLength={500}
          />
          <div className="edit-actions">
            <button
              className="btn btn-success btn-small"
              onClick={handleSaveEdit}
              title="Save changes"
            >
              <Check size={16} />
              Save
            </button>
            <button
              className="btn btn-secondary btn-small"
              onClick={handleCancelEdit}
              title="Cancel editing"
            >
              <X size={16} />
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`todo-item card ${todo.completed ? 'todo-completed' : ''}`}>
      <div className="todo-checkbox">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className="checkbox-input"
          title={todo.completed ? 'Mark incomplete' : 'Mark complete'}
        />
        <div className="checkbox-visual"></div>
      </div>

      <div className="todo-content">
        <h3 className="todo-title">{todo.title}</h3>
        {todo.description && (
          <p className="todo-description">{todo.description}</p>
        )}
        <div className="todo-meta">
          <small className="todo-date">
            {new Date(todo.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: new Date(todo.createdAt).getFullYear() !==
              new Date().getFullYear()
                ? 'numeric'
                : undefined,
            })}
          </small>
        </div>
      </div>

      <div className="todo-actions">
        <button
          className="btn btn-secondary btn-small todo-action-btn"
          onClick={() => setIsEditing(true)}
          title="Edit this todo"
        >
          <Edit2 size={16} />
        </button>
        <button
          className="btn btn-danger btn-small todo-action-btn"
          onClick={() => {
            if (window.confirm('Are you sure you want to delete this todo?')) {
              onDelete(todo.id)
            }
          }}
          title="Delete this todo"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  )
}