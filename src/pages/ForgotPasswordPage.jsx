import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, Loader2, Mail, CheckCircle2 } from 'lucide-react'
import { forgotPassword } from '../services/authService'
import { validateEmail } from '../utils/validators'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [resetLink, setResetLink] = useState('') // Just for dev purposes as requested

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')
    setResetLink('')
    setFieldErrors({})

    const emailErr = validateEmail(email)
    if (emailErr) {
      setFieldErrors({ email: emailErr })
      return
    }

    setIsSubmitting(true)

    try {
      const data = await forgotPassword(email)
      setSuccessMsg(data.message)
      if (data.resetLink) {
        setResetLink(data.resetLink)
      }
    } catch (err) {
      setError(err.message || 'Failed to send reset link.')
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
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">Reset Password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email to receive a password reset link
        </p>
      </div>

      {error && (
        <div className="flex items-start space-x-3 bg-destructive/10 text-destructive p-3 rounded-md text-sm font-medium mb-6">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="flex flex-col space-y-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-4 rounded-md text-sm font-medium mb-6">
          <div className="flex items-start space-x-3">
            <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
          {resetLink && (
            <div className="mt-2 pl-7 pt-2 border-t border-emerald-500/20 break-all text-xs">
              <strong>Dev Link:</strong> <a href={resetLink} className="underline hover:text-emerald-500">{resetLink}</a>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-5">
        <div className="grid gap-1.5">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
              <Mail className="h-5 w-5" />
            </div>
            <input
              id="forgot-email"
              type="email"
              placeholder="awesome@user.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex h-12 w-full rounded-full border border-input bg-transparent pl-14 pr-4 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isSubmitting || !!successMsg}
            />
          </div>
          {fieldErrors.email && (
            <p className="text-xs text-destructive pl-4">{fieldErrors.email}</p>
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
            'Send Reset Link'
          )}
        </button>
      </form>

      <div className="flex items-center justify-center space-x-1 mt-10 text-sm">
        <span className="text-muted-foreground">Remembered your password?</span>
        <Link to="/login" className="text-muted-foreground hover:text-primary transition-colors underline underline-offset-4 decoration-muted-foreground/50 hover:decoration-primary">
          Log in
        </Link>
      </div>
    </div>
  )
}
