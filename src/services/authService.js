import { fetchApi } from './api'

export const registerUser = async (name, email, password) => {
  const data = await fetchApi('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  })
  if (data.token) {
    localStorage.setItem('auth_token', data.token)
  }
  return data
}

export const loginUser = async (email, password) => {
  const data = await fetchApi('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  if (data.token) {
    localStorage.setItem('auth_token', data.token)
  }
  return data
}

export const fetchCurrentUser = async () => {
  const token = localStorage.getItem('auth_token')
  if (!token) return null
  try {
    const data = await fetchApi('/auth/me')
    return data.user
  } catch (error) {
    localStorage.removeItem('auth_token')
    return null
  }
}

export const logoutUser = () => {
  localStorage.removeItem('auth_token')
}