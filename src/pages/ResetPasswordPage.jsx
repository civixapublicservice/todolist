import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AlertCircle, Loader2 } from 'lucide-react'
import { resetPassword } from '../services/authService'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const location = useLocation()
  
  const resetToken = location.state?.resetToken

  // Form State
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  
  // UI State
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    if (!resetToken) {
      // If someone tries to access this page directly without verifying OTP, kick them out
      navigate('/forgot-password', { replace: true })
    }
  }, [resetToken, navigate])

  const validatePasswordStrength = (password) => {
    const rules = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(password),
    }
    const isValid = Object.values(rules).every(Boolean)
    if (!isValid) {
      if (!rules.length) return 'Must be at least 8 characters'
      if (!rules.uppercase) return 'Must contain an uppercase letter'
      if (!rules.lowercase) return 'Must contain a lowercase letter'
      if (!rules.number) return 'Must contain a number'
      if (!rules.special) return 'Must contain a special character'
    }
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setFieldErrors({})

    const pwError = validatePasswordStrength(newPassword)
    if (pwError) {
      setFieldErrors({ newPassword: pwError })
      return
    }

    if (newPassword !== confirmPassword) {
      setFieldErrors({ confirmPassword: 'Passwords do not match' })
      return
    }

    setIsSubmitting(true)

    try {
      await resetPassword(resetToken, newPassword)
      setIsSuccess(true)
      // Redirect to login after a brief delay
      setTimeout(() => navigate('/login', { replace: true }), 3000)
    } catch (err) {
      setError(err.message || 'Failed to reset password.')
      if (err.field) {
        setFieldErrors((prev) => ({ ...prev, [err.field]: err.message }))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!resetToken) return null

  return (
    <div className="w-full flex flex-col items-center text-center">
      <div className="flex flex-col space-y-2 mb-8 w-full mt-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {isSuccess ? 'Password Reset!' : 'Set new password'}
        </h1>
        <p className="text-sm font-medium text-muted-foreground leading-relaxed px-4">
          {isSuccess 
            ? 'Your password has been changed successfully. Redirecting to login...' 
            : 'Create a strong, new password for your account.'}
        </p>
      </div>

      {error && !isSuccess && (
        <div className="flex items-start space-x-3 bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl text-sm font-medium mb-6 w-full text-left">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.form 
            key="reset-form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onSubmit={handleSubmit} 
            className="w-full grid gap-5"
          >
            <div className="grid gap-2 text-left">
              <label htmlFor="new-password" className="text-sm font-semibold text-foreground ml-0.5">New Password</label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value)
                  if (fieldErrors.newPassword) setFieldErrors(p => ({...p, newPassword: null}))
                }}
                disabled={isSubmitting}
                error={fieldErrors.newPassword}
                placeholder="••••••••"
              />
            </div>

            <div className="grid gap-2 text-left">
              <label htmlFor="confirm-password" className="text-sm font-semibold text-foreground ml-0.5">Confirm New Password</label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  if (fieldErrors.confirmPassword) setFieldErrors(p => ({...p, confirmPassword: null}))
                }}
                disabled={isSubmitting}
                error={fieldErrors.confirmPassword}
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2 h-11 text-base"
              disabled={isSubmitting || !newPassword || !confirmPassword}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Resetting...
                </>
              ) : (
                'Reset Password'
              )}
            </Button>
          </motion.form>
        ) : (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full flex flex-col items-center justify-center py-6"
            >
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground text-sm font-medium">Logging you in...</p>
            </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8 text-center text-sm w-full">
        <Link 
          to="/login" 
          className="font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          Cancel and return to log in
        </Link>
      </div>
    </div>
  )
}
