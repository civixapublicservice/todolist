import { fetchApi } from './api'

export const getTodos = async (filters = {}) => {
  const { search, status, priority, sort } = filters
  const params = new URLSearchParams()

  if (search) params.append('search', search)
  if (status && status !== 'all') params.append('status', status)
  if (priority && priority !== 'all') params.append('priority', priority)
  if (sort) params.append('sort', sort)

  const queryString = params.toString() ? `?${params.toString()}` : ''
  const data = await fetchApi(`/api/todos${queryString}`)
  return data.todos || []
}

export const createTodo = async (todoData) => {
  const data = await fetchApi('/api/todos', {
    method: 'POST',
    body: JSON.stringify(todoData),
  })
  return data.todo
}

export const updateTodo = async (id, updates) => {
  const data = await fetchApi(`/api/todos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  })
  return data.todo
}

export const toggleTodo = async (id) => {
  const data = await fetchApi(`/api/todos/${id}/toggle`, {
    method: 'PATCH',
  })
  return data.todo
}

export const deleteTodo = async (id) => {
  const data = await fetchApi(`/api/todos/${id}`, {
    method: 'DELETE',
  })
  return data
}