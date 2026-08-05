import { useState, useEffect } from 'react'
import { useAuth } from './hooks/useAuth'
import { useTheme } from './hooks/useTheme'
import { saveUser } from './services/authService'
import LoginForm from './components/LoginForm'
import MainLayout from './layouts/MainLayout'
import Dashboard from './pages/Dashboard'
import './styles/index.css'

export default function App() {
  const { user, login, logout, isLoading: isAuthLoading } = useAuth()
  const { isDark, toggleTheme } = useTheme()

  const handleLogin = (userData) => {
    saveUser(userData)
    login(userData)
  }

  const handleLogout = () => {
    logout()
  }

  if (isAuthLoading) {
    return (
      <div className="app-loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return <LoginForm onLoginSuccess={handleLogin} />
  }

  return (
    <MainLayout
      user={user}
      onLogout={handleLogout}
      isDark={isDark}
      onThemeToggle={toggleTheme}
    >
      <Dashboard user={user} />
    </MainLayout>
  )
}