import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
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
        <Toaster 
          position="top-right" 
          theme="system" 
          closeButton
          toastOptions={{
            className: 'font-sans !bg-card/80 !backdrop-blur-xl !border !border-glass-border !shadow-2xl !rounded-2xl !text-foreground group',
            classNames: {
              title: 'text-[14px] font-bold tracking-tight',
              description: 'text-[13px] !text-muted-foreground',
              success: '!text-emerald-500 [&>svg]:!text-emerald-500',
              error: '!text-rose-500 [&>svg]:!text-rose-500',
              warning: '!text-amber-500 [&>svg]:!text-amber-500',
              info: '!text-blue-500 [&>svg]:!text-blue-500',
              closeButton: '!w-7 !h-7 flex items-center justify-center [&>svg]:!w-4 [&>svg]:!h-4 rounded-full !bg-foreground/5 !border-none !text-foreground/70 hover:!text-foreground hover:!bg-destructive/10 hover:!text-destructive transition-all !left-auto !right-4 !top-[calc(50%-14px)] !transform-none',
            }
          }}
        />
        <BrowserRouter>
        <Routes>
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
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}