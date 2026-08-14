import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import MainLayout from '../layouts/MainLayout'
import { TaskProvider } from '../context/TaskContext'
import { ActivityProvider } from '../context/ActivityContext'

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="spinner"></div>
        <p>Loading application...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <TaskProvider>
      <ActivityProvider>
        <MainLayout />
      </ActivityProvider>
    </TaskProvider>
  )
}
