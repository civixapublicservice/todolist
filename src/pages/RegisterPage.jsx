import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2, Check, X, Sparkles } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { validateEmail, validateName, analyzePassword } from '../utils/validators'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { cn } from '../utils/cn'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const [fieldErrors, setFieldErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Real-time password analysis
  const passwordAnalysis = useMemo(() => analyzePassword(password), [password])
  
  // Validation states for the button
  const isNameValid = !validateName(name)
  const isEmailValid = !validateEmail(email)
  const isPasswordValid = passwordAnalysis.isValid
  const passwordsMatch = password.length > 0 && password === confirmPassword
  
  const isFormValid = isNameValid && isEmailValid && isPasswordValid && passwordsMatch

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFieldErrors({})

    const nameErr = validateName(name)
    const emailErr = validateEmail(email)
    
    if (nameErr || emailErr || !isPasswordValid || !passwordsMatch) {
      setFieldErrors({
        name: nameErr,
        email: emailErr,
      })
      if (nameErr) toast.error(nameErr)
      else if (emailErr) toast.error(emailErr)
      else if (!isPasswordValid) toast.error('Password does not meet all requirements')
      else if (!passwordsMatch) toast.error('Passwords do not match')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await register(name, email, password)
      if (response.requireVerification) {
        toast.success(response.message || 'OTP sent to your email')
        navigate('/verify-email', { state: { email } })
      } else {
        toast.success('Account created successfully')
        navigate('/login', { replace: true })
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create account. Please try again.')
      if (err.field) {
        setFieldErrors((prev) => ({ ...prev, [err.field]: err.message }))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const checklistItems = [
    { label: '8+ characters', met: passwordAnalysis.rules.length },
    { label: 'Uppercase', met: passwordAnalysis.rules.uppercase },
    { label: 'Lowercase', met: passwordAnalysis.rules.lowercase },
    { label: 'Number', met: passwordAnalysis.rules.number },
    { label: 'Special char', met: passwordAnalysis.rules.special },
  ]

  return (
    <div className="w-full max-w-[400px] mx-auto relative z-20 flex flex-col items-center">
      
      {/* Floating Glowing Icon from Image 2 */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: 'spring', damping: 20 }}
        className="relative z-30 -mb-10"
      >
        <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full" />
        <div className="relative h-20 w-20 rounded-[28px] bg-white/10 backdrop-blur-3xl border border-white/30 flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.1)]">
          <div className="h-8 w-8 text-white flex items-center justify-center">
            <Sparkles className="h-6 w-6" />
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="glass-auth flex flex-col items-center"
      >
        <div className="flex flex-col space-y-2 text-center mb-8 relative z-10 w-full mt-4">
          <h1 className="text-[28px] font-bold tracking-tight text-white flex flex-wrap justify-center items-center gap-2">Join TaskFlow <Sparkles className="h-6 w-6 text-white/80" /></h1>
          <p className="text-sm text-white/50 leading-relaxed px-4">
            Create an account to get started with the premium workspace for teams.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full grid gap-4">
          <div className="grid gap-1.5">
            <label htmlFor="register-name" className="text-sm font-medium text-white/70 ml-1">Full Name</label>
            <Input
              id="register-name"
              type="text"
              variant="auth"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              error={fieldErrors.name}
            />
          </div>

          <div className="grid gap-1.5">
            <label htmlFor="register-email" className="text-sm font-medium text-white/70 ml-1">Email</label>
            <Input
              id="register-email"
              type="email"
              variant="auth"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              error={fieldErrors.email}
            />
          </div>

          <div className="grid gap-1.5">
            <label htmlFor="register-password" className="text-sm font-medium text-white/70 ml-1">Password</label>
            <Input
              id="register-password"
              type="password"
              variant="auth"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
            />
            
            {/* Password Strength and Rules Checklist */}
            <AnimatePresence>
              {password.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mt-1 px-1"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-white/60">Strength</span>
                    <span className={cn("text-xs font-semibold transition-colors", 
                      passwordAnalysis.strength === 'Very Weak' ? 'text-red-400' :
                      passwordAnalysis.strength === 'Weak' ? 'text-orange-400' :
                      passwordAnalysis.strength === 'Fair' ? 'text-yellow-400' :
                      passwordAnalysis.strength === 'Good' ? 'text-[#d8b4fe]' :
                      passwordAnalysis.strength === 'Strong' ? 'text-[#a855f7]' : 'text-purple-400'
                    )}>
                      {passwordAnalysis.strength}
                    </span>
                  </div>
                  
                  <div className="flex gap-1 h-1 w-full bg-white/10 rounded-full overflow-hidden mb-3">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div 
                        key={level} 
                        className={cn("h-full flex-1 transition-all duration-300", 
                          level <= passwordAnalysis.score ? (
                            passwordAnalysis.score <= 2 ? 'bg-orange-400' :
                            passwordAnalysis.score <= 3 ? 'bg-yellow-400' :
                            passwordAnalysis.score <= 4 ? 'bg-[#d8b4fe]' : 'bg-[#a855f7]'
                          ) : 'bg-transparent'
                        )}
                      />
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                    {checklistItems.map((item, i) => (
                      <div key={i} className="flex items-center space-x-1.5 text-xs">
                        <div className={cn("flex items-center justify-center transition-colors", 
                          item.met ? "text-[#a855f7]" : "text-white/30"
                        )}>
                          {item.met ? <Check size={12} strokeWidth={3} /> : <X size={12} strokeWidth={3} />}
                        </div>
                        <span className={item.met ? "text-white font-medium" : "text-white/50"}>
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="grid gap-1.5">
            <label htmlFor="register-confirm-password" className="text-sm font-medium text-white/70 ml-1">Confirm Password</label>
            <Input
              id="register-confirm-password"
              type="password"
              variant="auth"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isSubmitting}
            />
            
            <AnimatePresence>
              {confirmPassword.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mt-1 px-1"
                >
                  <p className={cn("text-xs font-medium pl-1", passwordsMatch ? "text-[#a855f7]" : "text-red-400")}>
                    {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>


          <Button
            type="submit"
            variant="gradient"
            className="w-full mt-2"
            disabled={isSubmitting || !isFormValid}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating account...
              </>
            ) : (
              'SIGN UP'
            )}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm w-full border-t border-white/10 pt-6">
          <span className="text-white/40">Already have an account? </span>
          <Link 
            to="/login" 
            className="font-medium text-[#d8b4fe] hover:text-white transition-colors"
          >
            Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
