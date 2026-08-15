import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertCircle, Loader2, CheckCircle2 } from 'lucide-react'
import { forgotPassword, verifyOtp } from '../services/authService'
import { validateEmail } from '../utils/validators'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  
  // Steps: 'email' | 'otp'
  const [step, setStep] = useState('email')
  
  // Timer State
  const [timer, setTimer] = useState(0)

  useEffect(() => {
    let interval
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000)
    }
    return () => clearInterval(interval)
  }, [timer])
  
  // Form State
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  
  // UI State
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')
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
      setTimer(60) // Start countdown
      setStep('otp') // Transition to OTP step
    } catch (err) {
      setError(err.message || 'Failed to send OTP.')
      if (err.field) {
        setFieldErrors((prev) => ({ ...prev, [err.field]: err.message }))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendOtp = async () => {
    if (timer > 0 || isSubmitting) return
    setError('')
    setSuccessMsg('')
    setFieldErrors({})
    setIsSubmitting(true)

    try {
      const data = await forgotPassword(email)
      setSuccessMsg(data.message)
      setTimer(60)
    } catch (err) {
      setError(err.message || 'Failed to resend OTP.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOtpSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')
    setFieldErrors({})

    if (!otp || otp.length < 6) {
      setFieldErrors({ otp: 'Please enter the 6-digit OTP' })
      return
    }

    setIsSubmitting(true)

    try {
      const data = await verifyOtp(email, otp)
      // Navigate to Reset Password page, passing the token securely in memory
      navigate('/reset-password', { state: { resetToken: data.resetToken } })
    } catch (err) {
      setError(err.message || 'Invalid OTP.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full flex flex-col items-center sm:items-start text-center sm:text-left">
      <div className="flex flex-col space-y-2 mb-8 w-full mt-4">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          {step === 'email' ? 'Reset Password' : 'Verify OTP'}
        </h1>
        <p className="text-sm font-medium text-muted-foreground leading-relaxed">
          {step === 'email' 
            ? 'Enter your email to receive a secure 6-digit OTP.' 
            : 'Enter the 6-digit code sent to your email.'}
        </p>
      </div>

      {error && (
        <div className="flex flex-col space-y-3 bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm font-medium mb-6 w-full text-left">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
          {error === 'No account found with this email address.' && (
            <Button
              variant="outline"
              className="w-full mt-2"
              onClick={() => navigate('/register')}
            >
              Register Now
            </Button>
          )}
        </div>
      )}

      {successMsg && step === 'otp' && (
        <div className="flex flex-col space-y-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-4 rounded-xl text-sm font-medium mb-6 w-full text-left">
          <div className="flex items-start space-x-3">
            <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 'email' ? (
          <motion.form 
            key="email-form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onSubmit={handleEmailSubmit} 
            className="w-full grid gap-5"
          >
            <div className="grid gap-2 text-left">
              <label htmlFor="forgot-email" className="text-sm font-semibold text-foreground ml-0.5">Email address</label>
              <Input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                error={fieldErrors.email}
                placeholder="name@company.com"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2 h-11 text-base"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                'Send OTP'
              )}
            </Button>
          </motion.form>
        ) : (
          <motion.form 
            key="otp-form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onSubmit={handleOtpSubmit} 
            className="w-full grid gap-5"
          >
            <div className="grid gap-2 text-left">
              <label htmlFor="otp" className="text-sm font-semibold text-foreground ml-0.5">6-Digit OTP</label>
              <Input
                id="otp"
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                disabled={isSubmitting}
                error={fieldErrors.otp}
                className="text-center text-xl tracking-[0.5em] font-mono"
                placeholder="••••••"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2 h-11 text-base"
              disabled={isSubmitting || otp.length !== 6}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify OTP'
              )}
            </Button>

            <div className="flex flex-col items-center mt-2 space-y-3">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={timer > 0 || isSubmitting}
                className="text-sm font-medium text-primary hover:text-primary/80 disabled:opacity-50 transition-colors"
              >
                {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
              </button>

              <button 
                type="button" 
                onClick={() => {
                  setStep('email')
                  setOtp('')
                  setError('')
                  setSuccessMsg('')
                }}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Wrong email? Go back
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="mt-8 text-center text-sm w-full">
        <span className="text-muted-foreground font-medium">Remembered your password? </span>
        <Link 
          to="/login" 
          className="font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          Sign in
        </Link>
      </div>
    </div>
  )
}
