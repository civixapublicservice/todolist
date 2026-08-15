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
    <div className="w-full flex flex-col">
      <div className="flex flex-col space-y-2 mb-8 w-full mt-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back</h1>
        <p className="text-sm font-medium text-muted-foreground leading-relaxed">
          Please enter your credentials to log in to your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full grid gap-5">
        <div className="grid gap-2 text-left">
          <label htmlFor="login-email" className="text-sm font-semibold text-foreground ml-0.5">Email address</label>
          <Input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            error={fieldErrors.email}
            placeholder="name@company.com"
          />
        </div>

        <div className="grid gap-2 text-left">
          <div className="flex items-center justify-between ml-0.5">
            <label htmlFor="login-password" className="text-sm font-semibold text-foreground">Password</label>
            <Link to="/forgot-password" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
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
            placeholder="••••••••"
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
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>

      <div className="mt-8 text-center text-sm w-full">
        <span className="text-muted-foreground font-medium">Don't have an account? </span>
        <Link 
          to="/register" 
          className="font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          Create account
        </Link>
      </div>
    </div>
  )
}
