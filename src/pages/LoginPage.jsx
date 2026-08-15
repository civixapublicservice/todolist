import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { validateEmail } from '../utils/validators'
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
    <div className="w-full flex-1 flex flex-col justify-center">
      <div className="flex flex-col space-y-2 sm:space-y-3 mb-8 sm:mb-10 w-full mt-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Welcome back</h1>
        <p className="text-sm sm:text-base font-medium text-muted-foreground leading-relaxed">
          Please enter your credentials to log in to your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 w-full">
        <div className="space-y-1.5 sm:space-y-2 w-full">
          <label htmlFor="login-email" className="text-sm font-semibold text-foreground tracking-wide ml-1">Email address</label>
          <Input
            id="login-email"
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
          <div className="flex items-center justify-between ml-1">
            <label htmlFor="login-password" className="text-sm font-semibold text-foreground tracking-wide">Password</label>
            <Link to="/forgot-password" className="text-sm font-bold text-primary hover:text-primary/80 transition-colors">
              Forgot Password?
            </Link>
          </div>
          <Input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
            error={fieldErrors.password}
            placeholder="Enter your password"
            className="h-12 sm:h-14 text-base px-4 sm:px-5 rounded-xl sm:rounded-2xl"
          />
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
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>
      <div className="mt-10 text-center text-sm w-full">
        <span className="text-muted-foreground font-medium">Don't have an account? </span>
        <Link 
          to="/register" 
          className="font-bold text-primary hover:text-primary/80 transition-colors"
        >
          Create account
        </Link>
      </div>
    </div>
  )
}
