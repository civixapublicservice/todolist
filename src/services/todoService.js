// todoService.js - Copy content from todoStorage.js file I provided

const STORAGE_KEY = 'user_todos'

export const getTodos = (userId) => {
  const allTodos = localStorage.getItem(STORAGE_KEY)
  if (!allTodos) return []
  
  const todosData = JSON.parse(allTodos)
  return todosData[userId] || []
}

export const saveTodos = (userId, todos) => {
  const allTodos = localStorage.getItem(STORAGE_KEY)
  const todosData = allTodos ? JSON.parse(allTodos) : {}
  
  todosData[userId] = todos
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todosData))
}

export const createTodo = (userId, title, description = '') => {
  const todos = getTodos(userId)
  const newTodo = {
    id: Date.now().toString(),
    title: title.trim(),
    description: description.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  
  saveTodos(userId, [newTodo, ...todos])
  return newTodo
}

export const updateTodo = (userId, id, updates) => {
  const todos = getTodos(userId)
  const updatedTodos = todos.map(todo =>
    todo.id === id
      ? { ...todo, ...updates, updatedAt: new Date().toISOString() }
      : todo
  )
  
  saveTodos(userId, updatedTodos)
  return updatedTodos.find(t => t.id === id)
}

export const deleteTodo = (userId, id) => {
  const todos = getTodos(userId)
  const filteredTodos = todos.filter(todo => todo.id !== id)
  saveTodos(userId, filteredTodos)
}

export const toggleTodo = (userId, id) => {
  const todos = getTodos(userId)
  const todo = todos.find(t => t.id === id)
  if (todo) {
    return updateTodo(userId, id, { completed: !todo.completed })
  }
}

export const searchTodos = (userId, query) => {
  const todos = getTodos(userId)
  const lowerQuery = query.toLowerCase().trim()
  
  if (!lowerQuery) return todos
  
  return todos.filter(todo =>
    todo.title.toLowerCase().includes(lowerQuery) ||
    todo.description.toLowerCase().includes(lowerQuery)
  )
}

export const getTodoStats = (userId) => {
  const todos = getTodos(userId)
  const completed = todos.filter(t => t.completed).length
  
  return {
    total: todos.length,
    completed,
    pending: todos.length - completed,
    completionRate: todos.length > 0 ? Math.round((completed / todos.length) * 100) : 0,
  }
}