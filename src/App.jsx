import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { AudioProvider } from './context/AudioContext'
import { AnimatePresence } from 'framer-motion'
import AuthLayout from './layouts/AuthLayout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import Dashboard from './pages/Dashboard'
import MyTasksPage from './pages/MyTasksPage'
import ActivityPage from './pages/ActivityPage'
import CalendarPage from './pages/CalendarPage'
import SettingsPage from './pages/SettingsPage'
import ProtectedRoute from './components/ProtectedRoute'
import { Toaster } from 'sonner'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AudioProvider>
          <Toaster richColors position="top-right" theme="system" />
          <BrowserRouter>
            <PageRoutes />
          </BrowserRouter>
        </AudioProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

import { useLocation } from 'react-router-dom'

function PageRoutes() {
  const location = useLocation()
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* Protected Application Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<MyTasksPage />} />
          <Route path="/activity" element={<ActivityPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}