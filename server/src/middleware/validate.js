import { sendError } from '../utils/errors.js'

export const validatePasswordStrength = (password) => {
  if (!password || typeof password !== 'string') return 'Password is required'
  const rules = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(password),
  }
  const isValid = Object.values(rules).every(Boolean)
  if (!isValid) {
    if (!rules.length) return 'Password must be at least 8 characters'
    if (!rules.uppercase) return 'Password must contain at least one uppercase letter'
    if (!rules.lowercase) return 'Password must contain at least one lowercase letter'
    if (!rules.number) return 'Password must contain at least one number'
    if (!rules.special) return 'Password must contain at least one special character'
  }
  return null
}

export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body

  if (!name || typeof name !== 'string' || !name.trim()) {
    return sendError(res, 400, 'Full name is required', 'name')
  }

  if (name.trim().length < 2) {
    return sendError(res, 400, 'Name must be at least 2 characters', 'name')
  }

  if (!email || typeof email !== 'string' || !email.trim()) {
    return sendError(res, 400, 'Email address is required', 'email')
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.trim())) {
    return sendError(res, 400, 'Please enter a valid email address', 'email')
  }

  const passwordError = validatePasswordStrength(password)
  if (passwordError) {
    return sendError(res, 400, passwordError, 'password')
  }

  next()
}

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body

  if (!email || typeof email !== 'string' || !email.trim()) {
    return sendError(res, 400, 'Email address is required', 'email')
  }

  if (!password || typeof password !== 'string' || !password.trim()) {
    return sendError(res, 400, 'Password is required', 'password')
  }

  next()
}

export const validateTodo = (req, res, next) => {
  const { title } = req.body

  if (!title || typeof title !== 'string' || !title.trim()) {
    return sendError(res, 400, 'Todo title is required', 'title')
  }

  if (title.trim().length < 2) {
    return sendError(res, 400, 'Todo title must be at least 2 characters', 'title')
  }

  next()
}

export const validateTodoUpdate = (req, res, next) => {
  const { title, description } = req.body

  if (title !== undefined) {
    if (typeof title !== 'string' || !title.trim()) {
      return sendError(res, 400, 'Todo title cannot be empty', 'title')
    }
    if (title.trim().length < 2) {
      return sendError(res, 400, 'Todo title must be at least 2 characters', 'title')
    }
  }

  if (description !== undefined && typeof description !== 'string') {
    return sendError(res, 400, 'Description must be text', 'description')
  }

  next()
}

export const validateForgotPassword = (req, res, next) => {
  const { email } = req.body

  if (!email || typeof email !== 'string' || !email.trim()) {
    return sendError(res, 400, 'Email address is required', 'email')
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.trim())) {
    return sendError(res, 400, 'Please enter a valid email address', 'email')
  }

  next()
}

export const validateVerifyOtp = (req, res, next) => {
  const { email, otp } = req.body

  if (!email || typeof email !== 'string' || !email.trim()) {
    return sendError(res, 400, 'Email address is required', 'email')
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.trim())) {
    return sendError(res, 400, 'Please enter a valid email address', 'email')
  }

  if (!otp || typeof otp !== 'string' || !otp.trim()) {
    return sendError(res, 400, 'OTP is required', 'otp')
  }

  next()
}

export const validateResetPassword = (req, res, next) => {
  const { newPassword } = req.body

  const passwordError = validatePasswordStrength(newPassword)
  if (passwordError) {
    return sendError(res, 400, passwordError, 'newPassword')
  }

  next()
}
