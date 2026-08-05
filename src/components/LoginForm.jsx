import { useState } from 'react'
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react'
import { authenticateUser, saveUser } from '../services/authService'
import '../styles/login.css'

export default function LoginForm({ onLoginSuccess }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    setTimeout(() => {
      const result = authenticateUser(username, password)

      if (result.success) {
        saveUser(result.user)
        onLoginSuccess(result.user)
      } else {
        setError(result.error)
      }

      setIsLoading(false)
    }, 500)
  }

  const handleDemoLogin = () => {
    setUsername('demo')
    setPassword('demo123')
    setError('')
  }

  return (
    <div className="login-container">
      <div className="login-card card">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p className="login-subtitle">Enter your credentials to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-alert">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                id="username"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                autoFocus
                autoComplete="username"
              />
            </div>
            <small>Try: demo, ramesh, or user</small>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="current-password"
              />
            </div>
            <small>Try: demo123, password123, or user123</small>
          </div>

          <button
            type="submit"
            className="btn btn-primary login-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                <span>Logging in...</span>
              </>
            ) : (
              <>
                <LogIn size={18} />
                <span>Login</span>
              </>
            )}
          </button>
        </form>

        <div className="demo-section">
          <p className="demo-title">Quick Demo</p>
          <button
            type="button"
            className="btn btn-secondary demo-button"
            onClick={handleDemoLogin}
            disabled={isLoading}
          >
            Use Demo Account
          </button>
        </div>

        <div className="login-footer">
          <p>This is a demo application with dummy authentication</p>
        </div>
      </div>
    </div>
  )
}