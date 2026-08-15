import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AlertCircle, Loader2, CheckCircle2, Edit2 } from 'lucide-react'
import { verifyRegistration, resendRegistrationOtp, changeRegistrationEmail } from '../services/authService'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'

export default function VerifyEmailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  
  const initialEmail = location.state?.email

  // State
  const [email, setEmail] = useState(initialEmail || '')
  const [otp, setOtp] = useState('')
  
  // UI State
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [isEditingEmail, setIsEditingEmail] = useState(false)
  const [newEmail, setNewEmail] = useState('')

  useEffect(() => {
    if (!initialEmail) {
      navigate('/login', { replace: true })
    }
  }, [initialEmail, navigate])

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setFieldErrors({})

    if (!otp.trim()) {
      setFieldErrors({ otp: 'Verification code is required' })
      return
    }

    if (otp.length < 6) {
      setFieldErrors({ otp: 'Code must be 6 digits' })
      return
    }

    setIsSubmitting(true)

    try {
      await verifyRegistration(email, otp)
      setIsSuccess(true)
      setTimeout(() => navigate('/login', { replace: true }), 3000)
    } catch (err) {
      setError(err.message || 'Failed to verify email.')
      if (err.field) {
        setFieldErrors((prev) => ({ ...prev, [err.field]: err.message }))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResend = async () => {
    if (countdown > 0) return
    
    setError('')
    try {
      await resendRegistrationOtp(email)
      setCountdown(60) // Start 60s countdown
      // Optional: show a small toast or success message here if desired
    } catch (err) {
      setError(err.message || 'Failed to resend code.')
    }
  }

  const handleChangeEmail = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!newEmail.trim() || !/^\S+@\S+\.\S+$/.test(newEmail)) {
      setFieldErrors({ newEmail: 'Valid email address is required' })
      return
    }

    setIsSubmitting(true)
    try {
      await changeRegistrationEmail(email, newEmail)
      setEmail(newEmail)
      setIsEditingEmail(false)
      setCountdown(60)
    } catch (err) {
      setError(err.message || 'Failed to change email.')
      if (err.field) {
        setFieldErrors((prev) => ({ ...prev, [err.field]: err.message }))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!initialEmail) return null

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-col space-y-2 mb-8 w-full mt-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {isSuccess ? 'Email Verified!' : 'Check your email'}
        </h1>
        <p className="text-sm font-medium text-muted-foreground leading-relaxed px-4">
          {isSuccess 
            ? 'Your account is ready. Redirecting to login...' 
            : `We've sent a 6-digit verification code to ${email}`}
        </p>
      </div>

      {error && !isSuccess && (
        <div className="flex items-start space-x-3 bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl text-sm font-medium mb-6 w-full text-left">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <AnimatePresence mode="wait">
        {!isSuccess && !isEditingEmail ? (
          <motion.form 
            key="verify-form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onSubmit={handleSubmit} 
            className="w-full grid gap-5"
          >
            <div className="grid gap-2 text-left">
              <label htmlFor="verify-otp" className="text-sm font-semibold text-foreground ml-0.5">Verification Code</label>
              <Input
                id="verify-otp"
                type="text"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value.replace(/[^0-9]/g, ''))
                  if (fieldErrors.otp) setFieldErrors({ ...fieldErrors, otp: '' })
                }}
                disabled={isSubmitting}
                error={fieldErrors.otp}
                maxLength={6}
                className="text-center text-xl tracking-widest"
                placeholder="••••••"
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={isSubmitting || otp.length !== 6} 
              className="w-full mt-2 h-11 text-base"
              variant="primary"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Email'
              )}
            </Button>

            <div className="mt-4 flex flex-col items-center gap-3 text-sm">
              <div className="text-muted-foreground font-medium">
                Didn't receive the code?{' '}
                <button 
                  type="button" 
                  onClick={handleResend}
                  disabled={countdown > 0}
                  className="text-primary hover:text-primary/80 font-semibold disabled:opacity-50 transition-colors"
                >
                  {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
                </button>
              </div>
              
              <button
                type="button"
                onClick={() => {
                  setNewEmail(email)
                  setIsEditingEmail(true)
                }}
                className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors font-medium"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Change email address
              </button>
            </div>
          </motion.form>
        ) : isEditingEmail ? (
          <motion.form
            key="edit-email-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleChangeEmail}
            className="w-full grid gap-5"
          >
            <div className="grid gap-2 text-left">
              <label htmlFor="new-email" className="text-sm font-semibold text-foreground ml-0.5">New Email Address</label>
              <Input
                id="new-email"
                type="email"
                value={newEmail}
                onChange={(e) => {
                  setNewEmail(e.target.value)
                  if (fieldErrors.newEmail) setFieldErrors({ ...fieldErrors, newEmail: '' })
                }}
                disabled={isSubmitting}
                error={fieldErrors.newEmail}
                placeholder="name@company.com"
              />
            </div>

            <div className="flex gap-3 mt-2">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setIsEditingEmail(false)}
                disabled={isSubmitting}
                className="w-full h-11"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="primary"
                disabled={isSubmitting || !newEmail.trim()} 
                className="w-full h-11"
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  'Update Email'
                )}
              </Button>
            </div>
          </motion.form>
        ) : (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full flex flex-col items-center justify-center py-6"
          >
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>
      
      {!isSuccess && (
        <div className="mt-8 text-center text-sm w-full">
          <Link to="/login" className="font-semibold text-muted-foreground hover:text-foreground transition-colors">
            Back to login
          </Link>
        </div>
      )}
    </div>
  )
}
