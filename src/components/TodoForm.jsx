import { useState } from 'react'
import { Plus, AlertCircle } from 'lucide-react'
import '../styles/todoform.css'

export default function TodoForm({ onAddTodo }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!title.trim()) {
      setError('Todo title is required')
      return
    }

    if (title.trim().length < 3) {
      setError('Todo title must be at least 3 characters')
      return
    }

    onAddTodo({
      title: title.trim(),
      description: description.trim(),
    })

    setTitle('')
    setDescription('')
  }

  return (
    <form onSubmit={handleSubmit} className="todo-form card">
      <h3 className="form-title">Create New Todo</h3>

      {error && (
        <div className="form-error">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <div className="form-group">
        <input
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="form-input-title"
          maxLength={100}
        />
        <div className="char-count">{title.length}/100</div>
      </div>

      <div className="form-group">
        <textarea
          placeholder="Add a description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="form-textarea"
          rows={3}
          maxLength={500}
        />
        <div className="char-count">{description.length}/500</div>
      </div>

      <button type="submit" className="btn btn-primary btn-add-todo">
        <Plus size={18} />
        <span>Add Todo</span>
      </button>
    </form>
  )
}