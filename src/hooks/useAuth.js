import { useState, useEffect } from 'react'
import { getCurrentUser, logoutUser } from '../services/authService'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedUser = getCurrentUser()
    setUser(savedUser)
    setIsLoading(false)
  }, [])

  const login = (userData) => {
    setUser(userData)
  }

  const logout = () => {
    logoutUser()
    setUser(null)
  }

  return { user, login, logout, isLoading }
}