import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AlertCircle, Loader2, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { resetPassword } from '../services/authService'
import { validatePassword } from '../utils/validators'

export default function ResetPasswordPage() {
  const { token } = useParams()
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setFieldErrors({})

    let hasError = false
    const newFieldErrors = {}

    if (!password || password.length < 8) {
      newFieldErrors.password = 'Password must be at least 8 characters long'
      hasError = true
    }

    if (password !== confirmPassword) {
      newFieldErrors.confirmPassword = 'Passwords do not match'
      hasError = true
    }

    if (hasError) {
      setFieldErrors(newFieldErrors)
      return
    }

    setIsSubmitting(true)

    try {
      const data = await resetPassword(token, password)
      setSuccessMsg(data.message || 'Password has been reset successfully.')
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login', { replace: true })
      }, 2000)
    } catch (err) {
      setError(err.message || 'Failed to reset password. Token might be invalid or expired.')
      if (err.field) {
        setFieldErrors((prev) => ({ ...prev, [err.field]: err.message }))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-[420px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-30">
      <div className="flex flex-col space-y-3 text-center mb-10">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">New Password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your new password below
        </p>
      </div>

      {error && (
        <div className="flex items-start space-x-3 bg-destructive/10 text-destructive p-3 rounded-md text-sm font-medium mb-6">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="flex items-start space-x-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-4 rounded-md text-sm font-medium mb-6">
          <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span>{successMsg}</span>
            <span className="text-xs mt-1 opacity-80">Redirecting to login...</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-5">
        <div className="grid gap-1.5">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
              <Lock className="h-5 w-5" />
            </div>
            <input
              id="reset-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex h-12 w-full rounded-full border border-input bg-transparent pl-14 pr-12 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isSubmitting || !!successMsg}
            />
            <button
              type="button"
              className="absolute right-4 top-3.5 h-5 w-5 text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {fieldErrors.password && (
            <p className="text-xs text-destructive pl-4">{fieldErrors.password}</p>
          )}
        </div>

        <div className="grid gap-1.5">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
              <Lock className="h-5 w-5" />
            </div>
            <input
              id="reset-confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="flex h-12 w-full rounded-full border border-input bg-transparent pl-14 pr-12 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isSubmitting || !!successMsg}
            />
            <button
              type="button"
              className="absolute right-4 top-3.5 h-5 w-5 text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              title={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {fieldErrors.confirmPassword && (
            <p className="text-xs text-destructive pl-4">{fieldErrors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full text-base font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:bg-primary/90 h-12 px-8 mt-4 mx-auto min-w-[200px]"
          disabled={isSubmitting || !!successMsg}
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            'Reset Password'
          )}
        </button>
      </form>

      <div className="flex items-center justify-center space-x-1 mt-10 text-sm">
        <Link to="/login" className="text-muted-foreground hover:text-primary transition-colors underline underline-offset-4 decoration-muted-foreground/50 hover:decoration-primary">
          Back to Login
        </Link>
      </div>
    </div>
  )
}
