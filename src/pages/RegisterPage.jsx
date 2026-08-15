import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2, Check, X } from 'lucide-react'
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
    <div className="w-full flex flex-col">
      <div className="flex flex-col space-y-2 sm:space-y-3 mb-8 sm:mb-10 w-full mt-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Create an account</h1>
        <p className="text-sm sm:text-base font-medium text-muted-foreground leading-relaxed">
          Join us today to start managing your tasks efficiently.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 w-full">
        <div className="space-y-1.5 sm:space-y-2 w-full">
          <label htmlFor="register-name" className="text-sm font-semibold text-foreground tracking-wide ml-1">Full Name</label>
          <Input
            id="register-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
            error={fieldErrors.name}
            placeholder="Enter your full name"
            className="h-12 sm:h-14 text-base px-4 sm:px-5 rounded-xl sm:rounded-2xl"
          />
        </div>

        <div className="space-y-1.5 sm:space-y-2 w-full">
          <label htmlFor="register-email" className="text-sm font-semibold text-foreground tracking-wide ml-1">Email address</label>
          <Input
            id="register-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            error={fieldErrors.email}
            placeholder="Enter your email address"
            className="h-12 sm:h-14 text-base px-4 sm:px-5 rounded-xl sm:rounded-2xl"
          />
        </div>

        <div className="space-y-1.5 sm:space-y-2 w-full">
          <label htmlFor="register-password" className="text-sm font-semibold text-foreground tracking-wide ml-1">Password</label>
          <Input
            id="register-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
            placeholder="Create a password"
            className="h-12 sm:h-14 text-base px-4 sm:px-5 rounded-xl sm:rounded-2xl"
          />
          
          <AnimatePresence>
            {password.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mt-1 px-1"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-muted-foreground">Strength</span>
                  <span className={cn("text-xs font-semibold transition-colors", 
                    passwordAnalysis.strength === 'Very Weak' ? 'text-red-500' :
                    passwordAnalysis.strength === 'Weak' ? 'text-orange-500' :
                    passwordAnalysis.strength === 'Fair' ? 'text-yellow-500' :
                    passwordAnalysis.strength === 'Good' ? 'text-primary' :
                    passwordAnalysis.strength === 'Strong' ? 'text-emerald-500' : 'text-primary'
                  )}>
                    {passwordAnalysis.strength}
                  </span>
                </div>
                
                <div className="flex gap-1 h-1.5 w-full bg-border rounded-full overflow-hidden mb-3">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div 
                      key={level} 
                      className={cn("h-full flex-1 transition-all duration-300", 
                        level <= passwordAnalysis.score ? (
                          passwordAnalysis.score <= 2 ? 'bg-orange-500' :
                          passwordAnalysis.score <= 3 ? 'bg-yellow-500' :
                          passwordAnalysis.score <= 4 ? 'bg-primary' : 'bg-emerald-500'
                        ) : 'bg-transparent'
                      )}
                    />
                  ))}
                </div>

                <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                  {checklistItems.map((item, i) => (
                    <div key={i} className="flex items-center space-x-1.5 text-xs">
                      <div className={cn("flex items-center justify-center transition-colors", 
                        item.met ? "text-primary" : "text-muted-foreground/40"
                      )}>
                        {item.met ? <Check size={14} strokeWidth={3} /> : <X size={14} strokeWidth={3} />}
                      </div>
                      <span className={item.met ? "text-foreground font-medium" : "text-muted-foreground"}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-1.5 sm:space-y-2 w-full">
          <label htmlFor="register-confirm-password" className="text-sm font-semibold text-foreground tracking-wide ml-1">Confirm Password</label>
          <Input
            id="register-confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isSubmitting}
            placeholder="Confirm your password"
            className="h-12 sm:h-14 text-base px-4 sm:px-5 rounded-xl sm:rounded-2xl"
          />
          
          <AnimatePresence>
            {confirmPassword.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={cn("text-xs font-medium pl-1", passwordsMatch ? "text-emerald-500" : "text-destructive")}
              >
                {passwordsMatch ? "Passwords match" : "Passwords do not match"}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-6 sm:mt-8 h-12 sm:h-14 text-base sm:text-lg font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all rounded-xl sm:rounded-2xl"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </Button>
      </form>

      <div className="mt-8 text-center text-sm w-full">
        <span className="text-muted-foreground font-medium">Already have an account? </span>
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
