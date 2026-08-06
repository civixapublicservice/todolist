import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2, Mail, Lock, Sparkles } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { validateEmail } from '../utils/validators'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFieldErrors({})

    const emailErr = validateEmail(email)
    
    if (emailErr || !password) {
      setFieldErrors({
        email: emailErr,
        password: !password ? 'Password is required' : null,
      })
      if (emailErr) toast.error(emailErr)
      else toast.error('Please enter your password')
      return
    }

    setIsSubmitting(true)

    try {
      await login(email, password)
      toast.success('Successfully logged in')
      navigate('/', { replace: true })
    } catch (err) {
      toast.error(err.message || 'Failed to login. Please check your credentials.')
      if (err.field) {
        setFieldErrors((prev) => ({ ...prev, [err.field]: err.message }))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

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
          <h1 className="text-[28px] font-bold tracking-tight text-white flex items-center gap-2">Welcome to TaskFlow <Sparkles className="h-6 w-6 text-white/80" /></h1>
          <p className="text-sm text-white/50 leading-relaxed px-4">
            Credentials are only used to authenticate in TaskFlow. All saved data will be stored securely.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full grid gap-4">
          <div className="grid gap-1.5">
            <Input
              id="login-email"
              type="email"
              variant="auth"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              error={fieldErrors.email}
            />
          </div>

          <div className="grid gap-1.5">
            <Input
              id="login-password"
              type="password"
              variant="auth"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              error={fieldErrors.password}
            />
          </div>

          <div className="flex items-center justify-between mt-2 mb-4 px-1">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="remember" className="rounded border-white/20 bg-black/50 accent-[#a855f7]" />
              <label htmlFor="remember" className="text-xs text-white/60">I agree to the Terms of service</label>
            </div>
            <Link to="/forgot-password" className="text-xs font-medium text-white/60 hover:text-white transition-colors">
              Forgot?
            </Link>
          </div>

          <Button
            type="submit"
            variant="gradient"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Signing in...
              </>
            ) : (
              'SIGN IN'
            )}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm w-full border-t border-white/10 pt-6">
          <span className="text-white/40">Don't have an account? </span>
          <Link 
            to="/register" 
            className="font-medium text-[#d8b4fe] hover:text-white transition-colors"
          >
            Sign up
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
