import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AlertCircle, Loader2, CheckCircle2, MailOpen, Edit2 } from 'lucide-react'
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
            {isSuccess ? <CheckCircle2 className="h-6 w-6 text-emerald-400" /> : <MailOpen className="h-6 w-6" />}
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="glass-auth flex flex-col items-center overflow-hidden w-full"
      >
        <div className="flex flex-col space-y-2 text-center mb-8 relative z-10 w-full mt-4">
          <h1 className="text-[28px] font-bold tracking-tight text-white flex flex-wrap items-center justify-center gap-2 text-center">
            {isSuccess ? 'Email Verified!' : 'Check your email'}
          </h1>
          <p className="text-sm text-white/50 leading-relaxed px-4">
            {isSuccess 
              ? 'Your account is ready. Redirecting to login...' 
              : `We've sent a 6-digit verification code to ${email}`}
          </p>
        </div>

        {error && !isSuccess && (
          <div className="flex items-start space-x-3 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm font-medium mb-6 w-full">
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
              className="w-full grid gap-4"
            >
              <div className="grid gap-1.5">
                <label htmlFor="verify-otp" className="text-sm font-medium text-white/70 ml-1">Verification Code</label>
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
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={isSubmitting || otp.length !== 6} 
                className="w-full mt-2"
                isLoading={isSubmitting}
              >
                Verify Email
              </Button>

              <div className="mt-4 flex flex-col items-center gap-3 text-sm">
                <div className="text-white/50">
                  Didn't receive the code?{' '}
                  <button 
                    type="button" 
                    onClick={handleResend}
                    disabled={countdown > 0}
                    className="text-white hover:text-white/80 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                  className="text-white/50 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <Edit2 className="w-3 h-3" />
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
              className="w-full grid gap-4"
            >
              <div className="grid gap-1.5">
                <label htmlFor="new-email" className="text-sm font-medium text-white/70 ml-1">New Email Address</label>
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
                />
              </div>

              <div className="flex gap-3 mt-2">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setIsEditingEmail(false)}
                  disabled={isSubmitting}
                  className="w-full"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !newEmail.trim()} 
                  className="w-full"
                  isLoading={isSubmitting}
                >
                  Update Email
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
              <Loader2 className="h-8 w-8 text-white/50 animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {!isSuccess && (
        <p className="mt-8 text-center text-sm text-white/40">
          <Link to="/login" className="hover:text-white transition-colors duration-200">
            Back to login
          </Link>
        </p>
      )}
    </div>
  )
}
