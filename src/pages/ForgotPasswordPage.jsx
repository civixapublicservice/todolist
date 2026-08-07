import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertCircle, Loader2, CheckCircle2, Sparkles, KeyRound } from 'lucide-react'
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
            {step === 'email' ? <Sparkles className="h-6 w-6" /> : <KeyRound className="h-6 w-6" />}
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
            {step === 'email' ? 'Reset Password' : 'Verify OTP'}
          </h1>
          <p className="text-sm text-white/50 leading-relaxed px-4">
            {step === 'email' 
              ? 'Enter your email to receive a secure 6-digit OTP.' 
              : 'Enter the 6-digit code sent to your email.'}
          </p>
        </div>

        {error && (
          <div className="flex flex-col space-y-3 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm font-medium mb-6 w-full">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
            {error === 'No account found with this email address.' && (
              <Button
                variant="outline"
                className="w-full border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300 mt-2"
                onClick={() => navigate('/register')}
              >
                Register Now
              </Button>
            )}
          </div>
        )}

        {successMsg && step === 'otp' && (
          <div className="flex flex-col space-y-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-sm font-medium mb-6 w-full">
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
              className="w-full grid gap-4"
            >
              <div className="grid gap-1.5">
                <Input
                  id="forgot-email"
                  type="email"
                  variant="auth"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  error={fieldErrors.email}
                />
              </div>

              <Button
                type="submit"
                variant="gradient"
                className="w-full mt-4"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  'SEND OTP'
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
              className="w-full grid gap-4"
            >
              <div className="grid gap-1.5">
                <Input
                  id="otp"
                  type="text"
                  variant="auth"
                  placeholder="123456"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  disabled={isSubmitting}
                  error={fieldErrors.otp}
                  className="text-center text-xl tracking-[0.5em] font-mono"
                />
              </div>

              <Button
                type="submit"
                variant="gradient"
                className="w-full mt-4"
                disabled={isSubmitting || otp.length !== 6}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'VERIFY OTP'
                )}
              </Button>

              <div className="flex flex-col items-center mt-2 space-y-3">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={timer > 0 || isSubmitting}
                  className="text-sm font-medium text-[#d8b4fe] hover:text-white disabled:text-white/30 transition-colors"
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
                  className="text-sm text-white/40 hover:text-white transition-colors"
                >
                  Wrong email? Go back
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="mt-8 text-center text-sm w-full border-t border-white/10 pt-6">
          <span className="text-white/40">Remembered your password? </span>
          <Link 
            to="/login" 
            className="font-medium text-[#d8b4fe] hover:text-white transition-colors"
          >
            Log in
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
