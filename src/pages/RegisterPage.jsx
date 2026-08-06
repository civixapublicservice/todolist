import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertCircle, Loader2, User, Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { validateEmail, validatePassword, validateName } from '../utils/validators'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../utils/cn'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setFieldErrors({})

    const nameErr = validateName(name)
    const emailErr = validateEmail(email)
    const passwordErr = validatePassword(password)
    let confirmErr = ''

    if (password !== confirmPassword) {
      confirmErr = 'Passwords do not match'
    }

    if (nameErr || emailErr || passwordErr || confirmErr) {
      setFieldErrors({
        name: nameErr,
        email: emailErr,
        password: passwordErr,
        confirmPassword: confirmErr,
      })
      return
    }

    setIsSubmitting(true)

    try {
      await register(name, email, password)
      navigate('/login', { replace: true })
    } catch (err) {
      setError(err.message || 'Failed to create account. Please try again.')
      if (err.field) {
        setFieldErrors((prev) => ({ ...prev, [err.field]: err.message }))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: 'spring', damping: 25 }}
      className="w-full max-w-[420px] mx-auto relative z-30"
    >
      <div className="glass-card border border-glass-border rounded-3xl p-8 shadow-xl relative overflow-hidden">
        {/* Decorative gradient blob */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col space-y-3 text-center mb-8 relative z-10">
          <div className="mx-auto bg-gradient-to-br from-accent/20 to-primary/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-2 shadow-inner border border-accent/20">
            <Sparkles className="h-8 w-8 text-accent" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-accent to-primary">Create Account</h1>
          <p className="text-sm font-medium text-muted-foreground">
            Sign up to get started with TaskFlow
          </p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="flex items-center space-x-3 bg-destructive/10 border border-destructive/20 text-destructive p-3.5 rounded-xl text-sm font-medium">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="grid gap-4 relative z-10">
          <div className="grid gap-1">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                <User className="h-5 w-5" />
              </div>
              <input
                id="register-name"
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex w-full pl-12 pr-4 py-3 text-sm glass-input font-medium transition-all focus:border-primary focus:ring-1 focus:ring-primary/50 disabled:opacity-50"
                disabled={isSubmitting}
              />
            </div>
            {fieldErrors.name && (
              <p className="text-xs text-destructive pl-4 font-medium">{fieldErrors.name}</p>
            )}
          </div>

          <div className="grid gap-1">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </div>
              <input
                id="register-email"
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex w-full pl-12 pr-4 py-3 text-sm glass-input font-medium transition-all focus:border-primary focus:ring-1 focus:ring-primary/50 disabled:opacity-50"
                disabled={isSubmitting}
              />
            </div>
            {fieldErrors.email && (
              <p className="text-xs text-destructive pl-4 font-medium">{fieldErrors.email}</p>
            )}
          </div>

          <div className="grid gap-1">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                <Lock className="h-5 w-5" />
              </div>
              <input
                id="register-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex w-full pl-12 pr-12 py-3 text-sm glass-input font-medium transition-all focus:border-primary focus:ring-1 focus:ring-primary/50 disabled:opacity-50"
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="absolute right-3 top-2 h-8 w-8 text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center rounded-lg hover:bg-white/10"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="text-xs text-destructive pl-4 font-medium">{fieldErrors.password}</p>
            )}
          </div>

          <div className="grid gap-1">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                <Lock className="h-5 w-5" />
              </div>
              <input
                id="register-confirm-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="flex w-full pl-12 pr-12 py-3 text-sm glass-input font-medium transition-all focus:border-primary focus:ring-1 focus:ring-primary/50 disabled:opacity-50"
                disabled={isSubmitting}
              />
            </div>
            {fieldErrors.confirmPassword && (
              <p className="text-xs text-destructive pl-4 font-medium">{fieldErrors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full shadow-lg hover:shadow-xl hover:shadow-primary/20 py-3.5 text-base mt-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        <div className="flex items-center justify-center space-x-1.5 mt-8 text-sm font-medium relative z-10">
          <span className="text-muted-foreground">Already have an account?</span>
          <Link to="/login" className="text-primary hover:text-accent transition-colors">
            Log In
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
