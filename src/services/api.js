const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://todolist-18mk.onrender.com/api'

export const fetchApi = async (endpoint, options = {}) => {
  const token = localStorage.getItem('auth_token')

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const config = {
    ...options,
    headers,
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
    const data = await response.json()

    if (!response.ok) {
      if (response.status === 401) {
        window.dispatchEvent(new Event('auth:unauthorized'))
      }
      const error = new Error(data.error || 'An unexpected error occurred')
      error.status = response.status
      error.field = data.field
      throw error
    }

    return data
  } catch (error) {
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to server. Please check your network connection.')
    }
    throw error
  }
}
