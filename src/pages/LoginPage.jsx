import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertCircle, Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { validateEmail, validatePassword } from '../utils/validators'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setFieldErrors({})

    const emailErr = validateEmail(email)
    const passwordErr = validatePassword(password)

    if (emailErr || passwordErr) {
      setFieldErrors({
        email: emailErr,
        password: passwordErr,
      })
      return
    }

    setIsSubmitting(true)

    try {
      await login(email, password)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message || 'Failed to login. Please check your credentials.')
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
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">Welcome</h1>
        <p className="text-sm text-muted-foreground">
          Log in to your account to continue
        </p>
      </div>

      {error && (
        <div className="flex items-start space-x-3 bg-destructive/10 text-destructive p-3 rounded-md text-sm font-medium mb-6">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-5">
        <div className="grid gap-1.5">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
              <Mail className="h-5 w-5" />
            </div>
            <input
              id="login-email"
              type="email"
              placeholder="awesome@user.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex h-12 w-full rounded-full border border-input bg-transparent pl-14 pr-4 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isSubmitting}
            />
          </div>
          {fieldErrors.email && (
            <p className="text-xs text-destructive pl-4">{fieldErrors.email}</p>
          )}
        </div>

        <div className="grid gap-1.5">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
              <Lock className="h-5 w-5" />
            </div>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex h-12 w-full rounded-full border border-input bg-transparent pl-14 pr-12 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isSubmitting}
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

        <div className="flex justify-end pr-2">
          <a href="#forgot" className="text-xs text-muted-foreground hover:text-primary transition-colors hover:underline underline-offset-4">
            Forgot your password?
          </a>
        </div>

        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full text-base font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:bg-primary/90 h-12 px-8 mt-4 mx-auto min-w-[200px]"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            'Log In'
          )}
        </button>
      </form>

      <div className="flex items-center justify-center space-x-1 mt-10 text-sm">
        <span className="text-muted-foreground">Don't have an account?</span>
        <Link to="/register" className="text-muted-foreground hover:text-primary transition-colors underline underline-offset-4 decoration-muted-foreground/50 hover:decoration-primary">
          Sign up!
        </Link>
      </div>
    </div>
  )
}
