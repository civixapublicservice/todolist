import { useState, useEffect } from 'react'
import TodoForm from '../components/TodoForm'
import TodoList from '../components/TodoList'
import SearchBar from '../components/SearchBar'
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodo,
  searchTodos,
} from '../services/todoService'
import '../styles/app.css'

export default function Dashboard({ user }) {
  const [todos, setTodos] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoadingTodos, setIsLoadingTodos] = useState(false)

  useEffect(() => {
    if (user) {
      setIsLoadingTodos(true)
      setTimeout(() => {
        const userTodos = getTodos(user.id)
        setTodos(userTodos)
        setIsLoadingTodos(false)
      }, 300)
    }
  }, [user])

  const handleAddTodo = ({ title, description }) => {
    const newTodo = createTodo(user.id, title, description)
    setTodos([newTodo, ...todos])
  }

  const handleUpdateTodo = (id, updates) => {
    const updatedTodo = updateTodo(user.id, id, updates)
    setTodos(
      todos.map(todo =>
        todo.id === id ? updatedTodo : todo
      )
    )
  }

  const handleDeleteTodo = (id) => {
    deleteTodo(user.id, id)
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const handleToggleTodo = (id) => {
    const updatedTodo = toggleTodo(user.id, id)
    setTodos(
      todos.map(todo =>
        todo.id === id ? updatedTodo : todo
      )
    )
  }

  const filteredTodos = searchQuery
    ? searchTodos(user.id, searchQuery)
    : todos

  return (
    <>
      <div className="app-header">
        <h1>Task Manager</h1>
        <p>Stay organized and productive</p>
      </div>

      <section className="form-section">
        <TodoForm onAddTodo={handleAddTodo} />
      </section>

      <section className="search-section">
        <SearchBar
          query={searchQuery}
          onQueryChange={setSearchQuery}
          totalTodos={todos.length}
        />
      </section>

      <section className="list-section">
        <TodoList
          todos={filteredTodos}
          onToggle={handleToggleTodo}
          onDelete={handleDeleteTodo}
          onUpdate={handleUpdateTodo}
          isLoading={isLoadingTodos}
        />
      </section>
    </>
  )
}