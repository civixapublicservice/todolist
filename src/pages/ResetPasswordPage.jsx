import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AlertCircle, Loader2, CheckCircle2, LockKeyhole, Eye, EyeOff } from 'lucide-react'
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
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password),
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
    <div className="w-full max-w-[400px] mx-auto relative z-20 flex flex-col items-center">
      
      {/* Floating Glowing Icon */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: 'spring', damping: 20 }}
        className="relative z-30 -mb-10"
      >
        <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full" />
        <div className="relative h-20 w-20 rounded-[28px] bg-white/10 backdrop-blur-3xl border border-white/30 flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.1)]">
          <div className="h-8 w-8 text-white flex items-center justify-center">
            {isSuccess ? <CheckCircle2 className="h-6 w-6 text-emerald-400" /> : <LockKeyhole className="h-6 w-6" />}
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="glass-auth flex flex-col items-center overflow-hidden"
      >
        <div className="flex flex-col space-y-2 text-center mb-8 relative z-10 w-full mt-4">
          <h1 className="text-[28px] font-bold tracking-tight text-white flex items-center justify-center gap-2">
            {isSuccess ? 'Password Reset!' : 'New Password'}
          </h1>
          <p className="text-sm text-white/50 leading-relaxed px-4">
            {isSuccess 
              ? 'Your password has been changed successfully. Redirecting to login...' 
              : 'Create a strong, new password for your account.'}
          </p>
        </div>

        {error && !isSuccess && (
          <div className="flex items-start space-x-3 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm font-medium mb-6 w-full">
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
              className="w-full grid gap-4"
            >
              <div className="grid gap-4">
                <div className="grid gap-1.5">
                  <label htmlFor="new-password" className="text-sm font-medium text-white/70 ml-1">New Password</label>
                  <Input
                    id="new-password"
                    type="password"
                    variant="auth"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value)
                      if (fieldErrors.newPassword) setFieldErrors(p => ({...p, newPassword: null}))
                    }}
                    disabled={isSubmitting}
                    error={fieldErrors.newPassword}
                  />
                </div>

                <div className="grid gap-1.5">
                  <label htmlFor="confirm-password" className="text-sm font-medium text-white/70 ml-1">Confirm New Password</label>
                  <Input
                    id="confirm-password"
                    type="password"
                    variant="auth"
                    value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    if (fieldErrors.confirmPassword) setFieldErrors(p => ({...p, confirmPassword: null}))
                  }}
                  disabled={isSubmitting}
                  error={fieldErrors.confirmPassword}
                />
              </div>

              <Button
                type="submit"
                variant="gradient"
                className="w-full mt-4"
                disabled={isSubmitting || !newPassword || !confirmPassword}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  'RESET PASSWORD'
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
                <p className="text-white/60 text-sm">Logging you in...</p>
             </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 text-center text-sm w-full border-t border-white/10 pt-6">
          <Link 
            to="/login" 
            className="font-medium text-[#d8b4fe] hover:text-white transition-colors"
          >
            Cancel and return to log in
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
