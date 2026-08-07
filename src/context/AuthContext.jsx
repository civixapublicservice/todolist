import { createContext, useContext, useState, useEffect } from 'react'
import {
  registerUser,
  loginUser,
  fetchCurrentUser,
  logoutUser,
} from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function initializeAuth() {
      try {
        const currentUser = await fetchCurrentUser()
        setUser(currentUser)
      } catch {
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }
    initializeAuth()

    const handleUnauthorized = () => {
      logoutUser()
      setUser(null)
    }
    
    window.addEventListener('auth:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized)
  }, [])

  const register = async (name, email, password) => {
    const data = await registerUser(name, email, password)
    setUser(data.user)
    return data
  }

  const login = async (email, password) => {
    const data = await loginUser(email, password)
    setUser(data.user)
    return data
  }

  const logout = () => {
    logoutUser()
    setUser(null)
  }

  const updateUser = (updatedUser) => {
    setUser(prev => ({ ...prev, ...updatedUser }))
  }

  const value = {
    user,
    isLoading,
    register,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
